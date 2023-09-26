//create your forceUpdate hook
import { useState } from "react";

export default function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return {
    forceUpdate: () => setValue((value) => value + 1),
    forceValue: value,
  };
}
