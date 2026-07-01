import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
// We'll use a simple custom implementation if cmdk causes issues, or just standard divs for now to match the premium aesthetic without complex dependencies if possible, 
// but sticking to standard patterns is safer. 
// Actually, let's build a custom one to ensure it matches the specific "Vora" style perfectly without fighting shadcn defaults.

interface Option {
    value: string
    label: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    className?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select...", className }: MultiSelectProps) {
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

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const handleRemove = (value: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(selected.filter((item) => item !== value))
    }

    return (
        <div className={cn("relative group", className)} ref={containerRef}>
            <div
                onClick={() => setOpen(!open)}
                className={cn(
                    "min-h-[50px] w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-[30px] text-sm font-medium text-gray-900 cursor-pointer flex flex-wrap items-center gap-2 transition-all hover:bg-gray-50/80",
                    open && "ring-2 ring-rose-500/10 border-rose-500"
                )}
            >
                {selected.length === 0 && (
                    <span className="text-gray-400">{placeholder}</span>
                )}

                {selected.map((value) => {
                    const option = options.find((o) => o.value === value)
                    return (
                        <span
                            key={value}
                            className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-sm"
                        >
                            {option?.label}
                            <X
                                className="h-3 w-3 text-gray-400 hover:text-rose-500 cursor-pointer transition-colors"
                                onClick={(e) => handleRemove(value, e)}
                            />
                        </span>
                    )
                })}

                <div className="ml-auto flex items-center shrink-0">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400 opacity-50" />
                </div>
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-[20px] border border-gray-100 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value)
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
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
