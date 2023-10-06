import { Message } from "./db.ts";

export function MessageItemSwapStatus(props: { msg: Message }) {
  return (
    <div className="flex justify-center">
      <span className="text-xs font-light bg-gray-800 px-2 rounded-xl text-gray-400">
        {props.msg.content["status"]}
      </span>
    </div>
  );
}
