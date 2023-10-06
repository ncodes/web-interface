import { MessengerInputAction } from "./MessengerInputAction.tsx";
import { File as FileIcon, ImagePlus, VideoIcon } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import { useFileService } from "../../hooks/services/backend/useFileService.ts";
import { useMutation } from "@tanstack/react-query";
import IconSpinner from "../icons/IconSpinner.tsx";
import useMessenger from "../../hooks/messager/useMessenger.ts";
import { Client, Conversation } from "@xmtp/xmtp-js";
import {
  AttachmentCodec,
  EncryptedEncodedContent,
  RemoteAttachmentCodec,
  RemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import moment from "moment";

export function MessengerInputActions({
  client,
  disabled,
  swap,
  convos,
}: {
  client: Client;
  disabled: boolean;
  swap: Swap;
  convos: Conversation[];
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { send } = useMessenger();
  const [uploading, setUploading] = useState(false);
  const [curUploadName, setCurUploadName] = useState<string>("");
  const [curUploadingCount, setCurUploadingCount] = useState<number>(0);
  const [curUploadedCount, setCurUploadedCount] = useState<number>(0);
  const { notifyError } = useToast();
  const { uploadFile } = useFileService();
  const uploadMut = useMutation(uploadFile);

  const uploader = useCallback(
    async (file: File): Promise<[string, EncryptedEncodedContent, number]> => {
      const { type, name } = file;
      const attachment = {
        filename: name,
        mimeType: type,
        data: new Uint8Array(await file.arrayBuffer()),
      };

      const encFile = await RemoteAttachmentCodec.encodeEncrypted(
        attachment,
        new AttachmentCodec()
      );

      // Upload to server
      const blob = new Blob([encFile.payload], { type: type });
      const formData = new FormData();
      formData.append("file", new File([blob], name, { type }), name);

      const hash = await uploadMut.mutateAsync({
        net: swap.network,
        orderId: swap.orderId,
        data: formData,
      });

      return [hash, encFile, attachment.data.byteLength];
    },
    [swap]
  );

  useEffect(() => {
    if (!files) return;

    const uploadFiles = async () => {
      try {
        setUploading(true);
        setCurUploadingCount(files.length);

        let finishedCount = 0;
        const filesCopy = [...files];
        setFiles(null);

        for (const file of filesCopy) {
          const [hash, encFile, contentLength] = await uploader(file);
          const gateway = import.meta.env.VITE_IPFS_GATEWAY;
          const remoteAttachment: RemoteAttachment = {
            url: `${gateway}/${hash}`,
            contentDigest: encFile.digest,
            salt: encFile.salt,
            nonce: encFile.nonce,
            secret: encFile.secret,
            scheme: "https://",
            filename: file.name,
            contentLength: contentLength,
          };

          setCurUploadedCount(finishedCount + 1);
          finishedCount++;

          const now = moment();
          for (const convo of convos) {
            await send(client, convo, remoteAttachment, now.toDate(), true, {
              type: file.type,
              data: Buffer.from(await file.arrayBuffer()).toString("base64"),
            });
          }
        }
      } catch (e) {
        console.error(e);
        notifyError("Failed to complete upload");
      } finally {
        setUploading(false);
        setCurUploadingCount(0);
        setCurUploadName("");
        setCurUploadedCount(0);
      }
    };

    void uploadFiles();
  }, [files]);

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!imageInputRef.current) return;
    if (!e.target.files) return;
    if (e.target.files.length > 4) {
      notifyError("You can only upload 4 images at a time");
      imageInputRef.current.value = "";
      return;
    }

    // Each files cannot be more that 10MB in size
    for (const file of e.target.files) {
      if (file.size > 10 * 1024 * 1024) {
        notifyError("Each file cannot be more than 10MB in size");
        imageInputRef.current.value = "";
        return;
      }
    }

    setFiles(Array.from(e.target.files));
    imageInputRef.current.value = "";
  };

  return (
    <div>
      {uploading && (
        <div className="animate-in slide-in-from-bottom flex border-y text-xs font-light tracking-wider justify-between border-gray-800 px-3 py-2">
          <div className="flex gap-1">
            <span>Uploading</span>
            <span className="text-chinese-green">{curUploadName}</span>
          </div>
          <div className="flex gap-2 text-gray-400">
            <span>
              {curUploadedCount}/{curUploadingCount}
            </span>
            <span>
              <IconSpinner
                width="15"
                className="animate-spin"
                fill="fill-gray-400"
              />
            </span>
          </div>
        </div>
      )}
      <div className="flex gap-2 px-3 items-center mt-3">
        <MessengerInputAction
          disabled={disabled || uploading}
          onClick={() => {
            imageInputRef.current?.click();
          }}
        >
          <ImagePlus width="20" />
        </MessengerInputAction>
        <MessengerInputAction disabled={disabled}>
          <VideoIcon width="30" />
        </MessengerInputAction>
        <MessengerInputAction disabled={disabled}>
          <FileIcon width="20" />
        </MessengerInputAction>
        <Input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageFileChange}
        />
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          // onChange={handleFileChange}
        />
        <Input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          // onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
