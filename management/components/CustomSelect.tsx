import * as React from "react"
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
    value: string
    label: string
}

interface CustomSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function CustomSelect({ options, value, onChange, placeholder = "Select...", className }: CustomSelectProps) {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const selectedOption = options.find((o) => o.value === value)

    return (
        <div className={cn("relative group", className)} ref={containerRef}>
            <div
                onClick={() => setOpen(!open)}
                className={cn(
                    "min-h-[50px] w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-[30px] text-sm font-medium text-gray-900 cursor-pointer flex items-center justify-between transition-all hover:bg-gray-50/80",
                    open && "ring-2 ring-rose-500/10 border-rose-500"
                )}
            >
                <span className={cn(!selectedOption && "text-gray-400")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")} />
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-[20px] border border-gray-100 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {options.map((option) => {
                            const isSelected = option.value === value
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-[15px] cursor-pointer text-sm font-medium transition-colors",
                                        isSelected ? "bg-rose-50 text-rose-900" : "hover:bg-gray-50 text-gray-700"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                                        isSelected ? "border-rose-500 bg-rose-500 text-white" : "border-gray-300 bg-transparent"
                                    )}>
                                        {isSelected && <Check className="h-3.5 w-3.5" />}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
