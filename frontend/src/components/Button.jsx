import React from "react";

// Utility to join class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Basic button variant logic (replacement for class-variance-authority)
function buttonVariants({ variant = "default", size = "default", className = "" }) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-black",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-black",
    link: "text-blue-600 underline-offset-4 hover:underline bg-transparent",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return classNames(base, variantStyles[variant], sizeStyles[size], className);
}

// Button component
const Button = React.forwardRef(function Button(
  { className, variant, size, asChild, ...props },
  ref
) {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      {...(!asChild && {
        ref,
        className: buttonVariants({ variant, size, className }),
        ...props,
      })}
    >
      {props.children}
    </Comp>
  );
});

export { Button,buttonVariants };
