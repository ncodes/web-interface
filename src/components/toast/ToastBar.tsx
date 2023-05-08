import cn from "classnames";
import {ToastType} from "../../hooks/toast/toast.tsx";

/**
 * The toast content
 * @param props - The hook's properties
 */
export function ToastBar(props: {
    type?: number;
    label?: string;
    message: string;
    links?: { href: string; label: string }[];
}) {
    return (
        <div
            className={cn(`flex toast-modal `, {
                success: props.type == ToastType.Success,
                error: props.type == ToastType.Error,
                default: props.type == ToastType.Default
            })}
            style={{
                gap: '1em'
            }}
        >
            <div className="flex-shrink-0">
                <img
                    src={cn({
                        '/images/errormark.svg': props.type === ToastType.Error,
                        '/images/checkmark.svg': props.type === ToastType.Success,
                        '/images/noticemark.svg': props.type === ToastType.Default
                    })}
                    width="20px"
                    height="20px"
                    alt=""
                />
            </div>
            <div
                className="message flex flex-col"
                style={{position: 'relative', top: '-5px'}}
            >
        <span className="label">
          {props.type === ToastType.Error ? props.label || 'Failed' : ''}
            {props.type === ToastType.Success ? props.label || 'Success' : ''}
            {props.type === ToastType.Default ? props.label || 'Notice' : ''}
        </span>
                <span>{props.message}</span>
                <div
                    className={cn(
                        'links flex gap-2 text-gray-400 text-[16px] font-light',
                        {hidden: !props.links || !props.links.length}
                    )}
                >
                    {props.links &&
                        props.links.map((link) => {
                            return (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
