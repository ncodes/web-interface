import React, { useEffect, useState } from "react";
import { cn } from "../../libs/utils.ts";
import { AnimatePresence, motion } from "framer-motion";
import { SearchContent } from "./SearchContent.tsx";

export default function SearchBox(props: {
  children: React.ReactNode;
  open?: boolean;
  onOpen?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div className="hidden md:block z-[5] ">
      {open && (
        <div
          className="fixed w-full h-full top-0 left-0 right-0"
          onClick={() => {
            setOpen(!open);
            props.onOpen && props.onOpen(!open);
          }}
        />
      )}
      <div className="md:relative">
        <div>{props.children}</div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 1.05, opacity: 0, display: "hidden" }}
              animate={{
                opacity: 1,
                display: "block",
                scale: 1.05,
                transition: { delay: 0.1, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                display: "block",
                scale: 1,
                transition: { delay: 0, ease: "easeInOut" },
              }}
              className={cn(
                "overflow-hidden absolute bg-card-background md:w-[500px] xl:w-full min-h-[100px] border border-gray-700 ring-chinese-green rounded-xl mt-5  "
              )}
            >
              <SearchContent renderInput={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
