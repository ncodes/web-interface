import { XORShift } from "random-seedable";
import forge from "node-forge";
import { RandomBgColors } from "./EmojiAvatar.tsx";

export function useRandomColor() {
  /**
   * Generate a random color from a seed
   * @param seed The seed to generate the color from
   */
  function getBgColor(seed: string) {
    if (!seed) return "";
    const sha1 = forge.md.sha1.create();
    const random = new XORShift(
      sha1.update(seed.toLowerCase()).digest().getInt32()
    );
    return random.choice(RandomBgColors);
  }

  return {
    getBgColor,
  };
}
