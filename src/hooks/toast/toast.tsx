import toast, {ToastPosition} from 'react-hot-toast';
import {ToastBar} from "../../components/toast/ToastBar.tsx";

export enum ToastType {
  Default,
  Success,
  Error,
}

export function useToast() {
  /**
   * Create an error toast
   * @param msg - The error message
   * @param options - The toast options
   */
  function notifyError(
    msg: string,
    options: {
      label?: string;
      position?: ToastPosition;
      duration?: number;
      links?: { href: string; label: string }[];
    } = {}
  ) {
    toast.custom(
      () => (
        <ToastBar
          key={msg}
          type={ToastType.Error}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || 'top-right',
        duration: options?.duration || 0,
      }
    );
  }

  /**
   * Create a success toast
   * @param msg - The success message
   * @param options - The toast options
   */
  function notifySuccess(
    msg: string,
    options: {
      label?: string;
      position?: ToastPosition;
      duration?: number;
      links?: { href: string; label: string }[];
    } = {}
  ) {
    toast.custom(
      () => (
        <ToastBar
          key={msg}
          type={ToastType.Success}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || 'top-right',
        duration: options.duration,
      }
    );
  }

  /**
   * Create a success toast
   * @param msg - The success message
   * @param options - The toast options
   */
  function notify(
    msg: string,
    options: {
      label?: string;
      position?: ToastPosition;
      duration?: number;
      links?: { href: string; label: string }[];
    } = {}
  ) {
    toast.custom(
      () => (
        <ToastBar
          key={msg}
          type={ToastType.Default}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || 'top-right',
        duration: options.duration,
      }
    );
  }

  return {
    notify,
    notifyError,
    notifySuccess,
  };
}
