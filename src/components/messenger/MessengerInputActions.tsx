import { useMutation } from '@tanstack/react-query';
import {
	AttachmentCodec,
	EncryptedEncodedContent,
	RemoteAttachment,
	RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment';
import { Client, Conversation } from '@xmtp/xmtp-js';
import { AxiosProgressEvent } from 'axios';
import { File as FileIcon, ImagePlus, VideoIcon } from 'lucide-react';
import moment from 'moment';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import useMessenger from '../../hooks/messenger/useMessenger.ts';
import { useFileService } from '../../hooks/services/backend/useFileService.ts';
import useStore from '../../hooks/store/useStore.ts';
import { useToast } from '../../hooks/useToast.tsx';
import { humanizeBytes, logError } from '../../libs/helpers.ts';
import IconSpinner from '../icons/IconSpinner.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Progress } from '../ui/progress.tsx';
import { MessengerInputAction } from './MessengerInputAction.tsx';
import { SendChatButton } from './SendChatButton.tsx';

type PreparedFileInfo = {
	formData: FormData;
	encFile: EncryptedEncodedContent;
	size: number;
	name: string;
	type: string;
	dataB64: string;
};

export function MessengerInputActions({
	client,
	disabled,
	disableSendButton,
	swap,
	convos,
	onFileUpload,
	onSend,
}: {
	client: Client;
	disabled: boolean;
	disableSendButton?: boolean;
	swap: Swap;
	convos: Conversation[];
	onFileUpload?: () => void;
	onSend?: () => void;
}) {
	const [files, setFiles] = useState<File[] | null>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const docInputRef = useRef<HTMLInputElement>(null);
	const { send } = useMessenger();
	const [uploading, setUploading] = useState(false);
	const [curUploadName, setCurUploadName] = useState<string>('');
	const [curUploadingCount, setCurUploadingCount] = useState<number>(0);
	const curUploadedCount = useRef<number>(0);
	const [progress, setProgress] = useState<number>(0);
	const { notifyError } = useToast();
	const { uploadFile } = useFileService();
	const uploadMut = useMutation({ mutationFn: uploadFile });
	const user = useStore((state) => state.user);
	const toggleOpenState = useStore((state) => state.toggleOpenState);

	/**
	 * Prepare file for upload
	 * @param file File to prepare
	 * @returns [formData, encFile, contentLength]
	 */
	const prepareFile = useCallback(async (file: File): Promise<PreparedFileInfo> => {
		const { type, name } = file;
		const attachment = {
			filename: name,
			mimeType: type,
			data: new Uint8Array(await file.arrayBuffer()),
		};

		const encFile = await RemoteAttachmentCodec.encodeEncrypted(attachment, new AttachmentCodec());

		const blob = new Blob([encFile.payload], { type: type });
		const formData = new FormData();
		formData.append('file', new File([blob], name, { type }), name);

		return {
			formData,
			encFile,
			size: attachment.data.byteLength,
			name: file.name,
			type: file.type,
			dataB64: Buffer.from(await file.arrayBuffer()).toString('base64'),
		};
	}, []);

	/**
	 * Upload file to server
	 * @param formData FormData to upload
	 * @param onUploadProgress Callback to track upload progress
	 * @returns IPFS hash of uploaded file
	 */
	const uploader = useCallback(
		async (formData: FormData, onUploadProgress: (progress: AxiosProgressEvent) => void): Promise<string> => {
			const hash = await uploadMut.mutateAsync({
				net: swap.network,
				orderId: swap.orderId,
				data: formData,
				onUploadProgress,
			});
			return hash;
		},
		[swap],
	);

	useEffect(() => {
		if (!files) return;
		if (uploading) return;

		const uploadFiles = async () => {
			try {
				setUploading(true);
				setCurUploadingCount(files.length);

				const preparedFiles: PreparedFileInfo[] = [];
				for (const file of files) {
					const prepFile = await prepareFile(file);
					preparedFiles.push(prepFile);
				}

				setFiles(null);

				for (const prepFile of preparedFiles) {
					curUploadedCount.current += 1;

					const hash = await uploader(prepFile.formData, (progressEvent) => {
						const { loaded, total } = progressEvent;
						const totalLength = total || prepFile.size;
						const percent = Math.floor((loaded * 100) / totalLength);
						setProgress(percent);
					});

					const remoteAttachment: RemoteAttachment = {
						url: `${import.meta.env.VITE_IPFS_GATEWAY}/${hash}`,
						contentDigest: prepFile.encFile.digest,
						salt: prepFile.encFile.salt,
						nonce: prepFile.encFile.nonce,
						secret: prepFile.encFile.secret,
						scheme: 'https://',
						filename: prepFile.name,
						contentLength: prepFile.size,
					};

					const now = moment();
					for (const convo of convos) {
						await send(client, convo, remoteAttachment, now.toDate(), true, {
							type: prepFile.type,
							data: prepFile.dataB64,
							filename: prepFile.name,
						});
					}

					onFileUpload?.();
				}
			} catch (e) {
				logError('uploadFiles:', e);
				notifyError(`Upload Error: ${(e as Error).message}`);
			} finally {
				setUploading(false);
				setCurUploadingCount(0);
				setCurUploadName('');
				curUploadedCount.current = 0;
			}
		};

		void uploadFiles();
	}, [files]);

	const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!imageInputRef.current) return;
		if (!e.target.files) return;
		if (e.target.files.length > 4) {
			notifyError('You can only upload 4 images at a time');
			imageInputRef.current.value = '';
			return;
		}

		// Each files cannot be more that 10MB in size
		for (const file of e.target.files) {
			const max = import.meta.env.VITE_FILE_UPLOAD_MAX_IMAGE_SIZE;
			if (file.size > parseInt(max)) {
				notifyError(`File too large (max: ${humanizeBytes(max)})`);
				imageInputRef.current.value = '';
				return;
			}
		}

		setFiles(Array.from(e.target.files));
		imageInputRef.current.value = '';
	};

	const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!videoInputRef.current) return;
		if (!e.target.files) return;

		// Each files cannot be more that 10MB in size
		for (const file of e.target.files) {
			const { size } = file;
			const max = import.meta.env.VITE_FILE_UPLOAD_MAX_VIDEO_SIZE;
			if (size > parseInt(max)) {
				notifyError(`File too large (max: ${humanizeBytes(max)})`);
				videoInputRef.current.value = '';
				return;
			}
		}

		setFiles(Array.from(e.target.files));
		videoInputRef.current.value = '';
	};

	const handleDocFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!docInputRef.current) return;
		if (!e.target.files) return;
		if (e.target.files.length > 4) {
			notifyError('You can only upload 4 documents at a time');
			docInputRef.current.value = '';
			return;
		}

		// Each files cannot be more that 10MB in size
		for (const file of e.target.files) {
			const { size } = file;
			const max = import.meta.env.VITE_FILE_UPLOAD_MAX_DOC_SIZE;
			if (size > parseInt(max)) {
				notifyError(`File too large (max: ${humanizeBytes(max)})`);
				docInputRef.current.value = '';
				return;
			}
		}

		setFiles(Array.from(e.target.files));
		docInputRef.current.value = '';
	};

	if (!user)
		return (
			<div className='flex justify-between p-3 py-1 pb-1 text-xs font-light text-gray-500 border-t border-gray-700 tracking-wide'>
				<span>Log in to upload attachment</span>
				<span>
					<Button
						variant='link'
						className='p-0 font-normal rounded-none text-xs h-auto'
						onClick={() => {
							toggleOpenState('settingsSheet', 'account');
						}}
					>
						Login
					</Button>
				</span>
			</div>
		);

	return (
		<div className='pb-2'>
			{uploading && (
				<div className='animate-in slide-in-from-bottom'>
					<div className='flex border-y text-xs font-light tracking-wider justify-between border-gray-800 px-3 py-2'>
						<div className='flex gap-1 text-gray-300'>
							<span>Uploading</span>
							<span className='text-chinese-green'>{curUploadName}</span>
						</div>
						<div className='flex gap-2 text-gray-400'>
							<span>
								{curUploadedCount.current}/{curUploadingCount}
							</span>
							<span>
								<IconSpinner width='15' className='animate-spin' fill='fill-gray-400' />
							</span>
						</div>
					</div>
					<div>
						<Progress value={progress} className='h-[1px] rounded-l-none' />
					</div>
				</div>
			)}

			<div className='flex items-center justify-between'>
				<div className='flex gap-2 px-3 items-center mt-3'>
					<MessengerInputAction
						disabled={disabled || uploading}
						onClick={() => {
							imageInputRef.current?.click();
						}}
					>
						<ImagePlus width='20' />
					</MessengerInputAction>
					<MessengerInputAction
						disabled={disabled || uploading}
						onClick={() => {
							videoInputRef.current?.click();
						}}
					>
						<VideoIcon width='30' />
					</MessengerInputAction>
					<MessengerInputAction
						disabled={disabled || uploading}
						onClick={() => {
							docInputRef.current?.click();
						}}
					>
						<FileIcon width='20' />
					</MessengerInputAction>
					<Input
						ref={imageInputRef}
						type='file'
						multiple
						accept='image/png, image/jpeg, image/jpg'
						style={{ display: 'none' }}
						onChange={handleImageFileChange}
					/>
					<Input
						ref={videoInputRef}
						type='file'
						accept='video/mp4, video/quicktime, video/wmv'
						style={{ display: 'none' }}
						onChange={handleVideoFileChange}
					/>
					<Input
						ref={docInputRef}
						type='file'
						accept='application/pdf'
						multiple
						style={{ display: 'none' }}
						onChange={handleDocFileChange}
					/>
				</div>
				<div className='pr-4'>
					<SendChatButton disabled={disableSendButton} onSend={onSend} />
				</div>
			</div>
		</div>
	);
}
