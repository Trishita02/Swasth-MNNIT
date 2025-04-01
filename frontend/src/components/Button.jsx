import React from "react";
import PropTypes from "prop-types";

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 bg-white hover:bg-gray-100",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  ghost: "hover:bg-gray-100 text-gray-800",
  link: "text-blue-600 underline hover:text-blue-700",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-6 text-lg",
  icon: "h-10 w-10 flex items-center justify-center",
};

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${buttonVariants[variant]} ${sizeVariants[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "secondary", "ghost", "link"]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
};

export { Button };
