import { ButtonHTMLAttributes } from "react"
import { cva } from 'class-variance-authority'
import { cn } from "../../utils/cn"
import { ArrowBigLeft } from "lucide-react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "icon" | "ghost" ,
    Icon?: React.ElementType,
    iconType?: "icon" | "leading" | "trailing",
}

export const Button = ({ variant, children, className, Icon, iconType, ...props }: ButtonProps) => {
    if (!children) {
        return
    }
    return (
        <>
            <button {...props} className={cn(buttonVariants({ variant }), className)}>
                {
                    Icon && iconType === "leading" && (
                        <div className="transition-all">
                            <Icon size={16} />
                        </div>
                    )
                }
                {
                    Icon && iconType === "icon" ? <Icon size={20} /> : children                  // Only for Text
                }
                {
                    Icon && iconType === "trailing" && (
                        <div className="transition-all">
                            <Icon size={16} />
                        </div>
                    )
                }
            </button>
        </>

    )
}


export const buttonVariants = cva("flex items-center justify-center rounded-md text-white text-md hover:bg-opacity-85 gap-2", {
    variants: {
        variant: {
            primary: "bg-black px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-500",
            secondary: "border border-border text-reddish bg-[#F7F8F8] px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-500",
            icon: " bg-black px-4 py-2 disabled:bg-neutral-200 disabled:text-neutral-500",
            ghost: "bg-none px-4 py-2 hover:bg-subTextGrey transition-colors hover:bg-opacity-10",
        },

    },
    defaultVariants: {
        variant: "primary"
    }
});