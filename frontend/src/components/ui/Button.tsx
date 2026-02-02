import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-gradient-to-r from-primary to-secondary hover:opacity-90',
            secondary: 'bg-gray-700 hover:bg-gray-600',
            outline: 'border-2 border-primary bg-transparent hover:bg-primary/10',
            ghost: 'hover:bg-gray-800',
            success: 'bg-green-600 hover:bg-green-700',
            danger: 'bg-red-600 hover:bg-red-700',
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
