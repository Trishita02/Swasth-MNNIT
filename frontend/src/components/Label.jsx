import React, { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import clsx from "clsx"; // Install if needed: npm install clsx

const Label = forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={clsx("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
