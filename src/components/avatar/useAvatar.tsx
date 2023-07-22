import EmojiAvatar from "./EmojiAvatar.tsx";
import React from "react";

export enum AvatarSize {
  Small,
  Medium,
  Large,
}

export function useAvatar() {
  function generate(randomStr: string, size = AvatarSize.Small) {
    return React.cloneElement(
      <EmojiAvatar randomStr={randomStr} size={size} />
    );
  }

  return { generate };
}
