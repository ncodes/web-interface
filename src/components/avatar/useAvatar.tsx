import Avatar from './Avatar';
import React from 'react';

export enum AvatarSize {
  Small,
  Medium,
  Large,
}

export function useAvatar() {
  function generate(randomStr: string, size = AvatarSize.Small) {
    return React.cloneElement(<Avatar randomStr={randomStr} size={size} />);
  }

  return { generate };
}
