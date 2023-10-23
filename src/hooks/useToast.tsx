import { ReactNode } from "react";
import toast, { ToastPosition } from "react-hot-toast";
import { ToastBar } from "../components/toast/ToastBar.tsx";

export enum ToastType {
  Default,
  Success,
  Error,
}

export type Options = {
  label?: string;
  position?: ToastPosition;
  duration?: number;
  links?: { href: string; label: string }[];
};

export function useToast() {
  /**
   * Create an success toast (use native toast element)
   * @param msg - The error message
   * @param options - The toast options
   */
  function simpleSuccess(
    msg: string,
    options: {
      label?: string;
      position?: ToastPosition;
      duration?: number;
      className?: string;
      links?: { href: string; label: string }[];
    } = {}
  ) {
    toast.success(msg, {
      position: options.position || "top-right",
      duration: options?.duration || 0,
      className: options.className || "bg-gray-900 text-gray-200",
    });
  }

  /**
   * Create an error toast (use native toast element)
   * @param msg - The error message
   * @param options - The toast options
   */
  function simpleError(
    msg: string,
    options: {
      label?: string;
      position?: ToastPosition;
      duration?: number;
      className?: string;
      links?: { href: string; label: string }[];
    } = {}
  ) {
    toast.error(msg, {
      position: options.position || "top-right",
      duration: options?.duration || 0,
      className: options.className || "bg-gray-900 text-gray-200",
    });
  }

  /**
   * Create an error toast
   * @param msg - The error message
   * @param options - The toast options
   */
  function notifyError(msg: ReactNode, options: Options = {}) {
    toast.custom(
      () => (
        <ToastBar
          type={ToastType.Error}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || "top-right",
        duration: options?.duration || 0,
      }
    );
  }

  /**
   * Create a success toast
   * @param msg - The success message
   * @param options - The toast options
   */
  function notifySuccess(msg: ReactNode, options: Options = {}) {
    toast.custom(
      () => (
        <ToastBar
          type={ToastType.Success}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || "top-right",
        duration: options.duration,
      }
    );
  }

  /**
   * Create a success toast
   * @param msg - The success message
   * @param options - The toast options
   */
  function notify(msg: ReactNode, options: Options = {}) {
    toast.custom(
      () => (
        <ToastBar
          type={ToastType.Default}
          label={options.label}
          message={msg}
          links={options.links}
        />
      ),
      {
        position: options.position || "top-right",
        duration: options.duration,
      }
    );
  }

  return {
    notify,
    notifyError,
    notifySuccess,
    simpleSuccess,
    simpleError,
  };
}
