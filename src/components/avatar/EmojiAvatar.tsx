import { AvatarSize } from "./useAvatar";
import { XORShift } from "random-seedable";
import forge from "node-forge";
import { cn } from "../../libs/utils.ts";

interface AvatarParams {
  size: AvatarSize;
  randomStr: string;
}

export default function EmojiAvatar(props: AvatarParams) {
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "🫠",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "☺️",
    "😚",
    "😙",
    "🥲",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🫢",
    "🫣",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "🥴",
    "😵",
    "😵‍💫",
    "🤯",
    "🤠",
    "🥳",
    "🥸",
    "😎",
    "🤓",
    "😮",
    "🦄",
    "🐴",
  ];
  const bgs = [
    "bg-[#32B572]",
    "bg-[#76A0EE]",
    "bg-[#9AB532]",
    "bg-[#D92828]",
    "bg-[#E88EF4]",
    "bg-[#9CC328]",
  ];
  const cls = "flex justify-center items-center rounded-full pt-[2px]";
  const random = new XORShift(
    forge.md.sha1
      .create()
      .update(props?.randomStr?.toLowerCase() || "")
      .digest()
      .getInt32()
  );
  const sizes = {
    0: ["w-[30px] h-[30px]", "text-[20px]"],
    1: ["w-[35px] h-[35px]", "text-[25px]"],
    2: ["w-[40px] h-[40px]", "text-[30px]"],
  };

  return (
    <div className={cn(cls, sizes[props.size][0], random.choice(bgs), {})}>
      <span className={sizes[props.size][1]}>{random.choice(emojis)}</span>
    </div>
  );
}
