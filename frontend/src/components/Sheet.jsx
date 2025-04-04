import React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx"; // Install with npm install clsx
import { X } from "lucide-react";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={clsx(
      "fixed inset-0 z-50 bg-black/80 transition-opacity",
      "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
      className
    )}
    {...props}
    ref={ref}
  />
));

const sheetVariants = {
  top: "inset-x-0 top-0 border-b animate-slideInTop",
  bottom: "inset-x-0 bottom-0 border-t animate-slideInBottom",
  left: "inset-y-0 left-0 w-3/4 border-r sm:max-w-sm animate-slideInLeft",
  right: "inset-y-0 right-0 w-3/4 border-l sm:max-w-sm animate-slideInRight",
};

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={clsx(
        "fixed z-50 gap-4 bg-white p-6 shadow-lg transition-all",
        sheetVariants[side],
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 p-2 rounded hover:bg-gray-200">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));

const SheetHeader = ({ className, ...props }) => (
  <div className={clsx("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const SheetFooter = ({ className, ...props }) => (
  <div className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={clsx("text-lg font-semibold", className)} {...props} />
));

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={clsx("text-sm text-gray-600", className)} {...props} />
));

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
