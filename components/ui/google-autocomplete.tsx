"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, X, Loader2 } from "lucide-react"

interface GoogleAutocompleteProps {
    onPlaceSelect: (place: {
        address: string
        lat: number
        lng: number
        pincode: string
    }) => void
    placeholder?: string
}

interface SearchResult {
    display_name: string
    lat: string
    lon: string
    address: {
        postcode?: string
        road?: string
        suburb?: string
        city?: string
        state?: string
        country?: string
    }
}

export function GoogleAutocomplete({ onPlaceSelect, placeholder }: GoogleAutocompleteProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        if (searchQuery.trim().length < 3) {
            setSearchResults([])
            setShowDropdown(false)
            setIsSearching(false)
            return
        }

        setIsSearching(true)

        // Debounce search - wait 500ms after user stops typing
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(searchQuery)}&` +
                    `countrycodes=in&` +
                    `format=json&` +
                    `addressdetails=1&` +
                    `limit=8`,
                    {
                        headers: {
                            'Accept': 'application/json',
                        }
                    }
                )

                if (response.ok) {
                    const data: SearchResult[] = await response.json()
                    setSearchResults(data)
                    setShowDropdown(true)
                } else {
                    setSearchResults([])
                }
            } catch (error) {
                console.error('Search error:', error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }, 500)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchQuery])

    const handleSelect = (result: SearchResult) => {
        const pincode = result.address.postcode || '000000'
        
        onPlaceSelect({
            address: result.display_name,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            pincode: pincode
        })
        
        setSearchQuery("")
        setShowDropdown(false)
        setSearchResults([])
    }

    const handleClear = () => {
        setSearchQuery("")
        setShowDropdown(false)
        setSearchResults([])
        inputRef.current?.focus()
    }

    const formatAddress = (result: SearchResult) => {
        const parts = []
        if (result.address.road) parts.push(result.address.road)
        if (result.address.suburb) parts.push(result.address.suburb)
        if (result.address.city) parts.push(result.address.city)
        return parts.join(', ') || result.display_name
    }

    return (
        <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600 pointer-events-none" />
            <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder || "Type your street name or area..."}
                className="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium bg-white"
                autoComplete="off"
            />
            
            {/* Loading or Clear button */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isSearching ? (
                    <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                ) : searchQuery ? (
                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                ) : null}
            </div>

            {/* Search results dropdown */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-emerald-100 shadow-xl max-h-96 overflow-y-auto z-[10000]">
                    {searchResults.map((result, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(result)}
                            className="w-full p-4 text-left hover:bg-emerald-50 transition-colors flex items-start gap-3 border-b border-emerald-50 last:border-b-0"
                        >
                            <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">
                                    {formatAddress(result)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {result.display_name}
                                </p>
                                {result.address.postcode && (
                                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                                        Pincode: {result.address.postcode}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {showDropdown && !isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-emerald-100 shadow-xl p-6 text-center z-[10000]">
                    <p className="text-gray-600 text-sm font-medium">No locations found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different street name or area</p>
                </div>
            )}

            {/* Hint text */}
            {searchQuery.length > 0 && searchQuery.length < 3 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-emerald-100 shadow-xl p-4 text-center z-[10000]">
                    <p className="text-xs text-gray-500">Type at least 3 characters to search</p>
                </div>
            )}
        </div>
    )
}
