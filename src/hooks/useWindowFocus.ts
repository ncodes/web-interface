import { useState, useEffect } from "react";
import { useVisibilityChange } from "@uidotdev/usehooks";

export default function useWindowFocus() {
  const documentVisible = useVisibilityChange();
  const [focus, setFocus] = useState(document.hasFocus());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return documentVisible && focus;
}
