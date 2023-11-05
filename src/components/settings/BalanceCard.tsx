import { ReactElement } from "react";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";

export function BalanceCard(props: {
  symbol?: string;
  balance: string;
  hideHelp?: boolean;
  children?: ReactElement;
}) {
  return (
    <Card className="w-full shrink-0 border border-card-border/70 border-b-gray-700 bg-card-background shadow-gray-900 shadow-lg">
      <CardHeader className="p-0">
        <CardTitle className="text-center p-0 tracking-wider font-normal h-0 pt-3 float-right">
          {!props.hideHelp && (
            <IconInfoCircle className="float-right relative -top-1 -left-2 z-10 cursor-pointer text-card-icon/80 hover:text-card-icon transition-all duration-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-3 flex flex-col relative  text-[18px] text-center text-chinese-green tracking-wider">
        <span className="relative text-gray-100 text-[15px]">
          {props.symbol}
        </span>
        <p>{props.balance}</p>
      </CardContent>
      {props.children && (
        <CardFooter className="border-t border-card-border/50 py-0 px-0 font-light text-sm text-center">
          {props.children}
        </CardFooter>
      )}
    </Card>
  );
}

export function BalanceCardLink(props: { title: string }) {
  return (
    <Button
      variant="ghost"
      className="w-full text-center rounded-none rounded-b-xl transition-all duration-300 hover:bg-gray-800 hover:text-gray-100 md:block text-gray-300 border-gray-600"
      asChild
    >
      <a href="#" className="hover:text-[15px]">
        {props.title}
      </a>
    </Button>
  );
}
