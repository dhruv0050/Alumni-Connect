
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface ButtonCustomProps {
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  className?: string
  children: ReactNode
  [key: string]: any
}

export function ButtonCustom({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonCustomProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        variant === "default" && "bg-indigo-600 hover:bg-indigo-700 text-white",
        variant === "secondary" && "bg-purple-600 hover:bg-purple-700 text-white",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
