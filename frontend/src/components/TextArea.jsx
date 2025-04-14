import React from "react";

// Optional utility to merge class names like `cn`
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={classNames(
        "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
