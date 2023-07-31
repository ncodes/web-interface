import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../libs/utils.ts";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "justify-between space-x-2 inline-flex  w-full pr-0",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "bg-gray-900 inline-flex items-center justify-center whitespace-nowrap tracking-wider " +
        "px-5 py-0 text-[17px]  text-gray-300 ring-offset-background transition-all " +
        " font-normal " +
        "disabled:pointer-events-none disabled:opacity-50 " +
        "hover:scale-x-105 data-[state=active]:scale-x-105 " +
        "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-chinese-green data-[state=active]:text-chinese-green " +
        "data-[state=active]:shadow data-[state=active]:font-normal ",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background px-3 focus-visible:outline-none data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
