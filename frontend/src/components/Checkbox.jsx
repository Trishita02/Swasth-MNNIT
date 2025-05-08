import * as React from "react"
const Checkbox = React.forwardRef(({ className = "", checked, onChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-black focus:ring-black ${className}`}
      ref={ref}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }