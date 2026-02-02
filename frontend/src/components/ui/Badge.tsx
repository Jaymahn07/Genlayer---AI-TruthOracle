import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'yes' | 'no' | 'unknown' | 'default' | 'pending'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            yes: 'bg-green-600',
            no: 'bg-red-600',
            unknown: 'bg-yellow-600',
            pending: 'bg-blue-600',
            default: 'bg-primary',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)
Badge.displayName = "Badge"

export { Badge }
