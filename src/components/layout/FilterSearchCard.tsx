"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Filter, Search } from "lucide-react"

interface FilterOption {
    value: string
    label: string
}

interface FilterSearchCardProps {
    title?: string
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void

    filterLabel?: string
    filterValue: string
    onFilterChange: (value: string) => void
    filterOptions: FilterOption[]
}

const FilterSearchCard: React.FC<FilterSearchCardProps> = ({
    title = "Filtros e Busca",
    searchPlaceholder = "Buscar...",
    searchValue,
    onSearchChange,

    filterLabel = "Filtro",
    filterValue,
    onFilterChange,
    filterOptions,
}) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Campo de busca */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Select de filtro */}
                    <div className="md:w-48">
                        <Select value={filterValue} onValueChange={onFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder={filterLabel} />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FilterSearchCard
