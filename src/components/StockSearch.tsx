import { useState, useCallback } from 'react'
import { searchStocks } from '../services/twelveData'
import { Stock } from '../types/stock'

interface StockSearchProps {
    onSelectStock: (stock: Stock) => void
}

export default function StockSearch({ onSelectStock }: StockSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Stock[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setLoading(true)
        const stocks = await searchStocks(searchQuery)
        setResults(stocks)
        setLoading(false)
    }, [])

    const handleInputChange = (e: { target: { value: string } }) => {
        const value = e.target.value
        setQuery(value)
        handleSearch(value)
    }

    const handleSelect = (stock: Stock) => {
        setQuery('')
        setResults([])
        onSelectStock(stock)
    }

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">Search stocks by symbol or name</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
                <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    placeholder="e.g., AAPL, Apple, TSLA"
                    className="grow"
                    value={query}
                    onChange={handleInputChange}
                />
                {loading && <span className="loading loading-spinner loading-sm"></span>}
            </label>
            {results.length > 0 && (
                <div className="mt-2 dropdown dropdown-open w-full">
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-lg border border-base-300">
                        {results.map((stock) => (
                            <li key={stock.symbol}>
                                <a onClick={() => handleSelect(stock)}>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{stock.symbol}</span>
                                        <span className="text-sm opacity-70">{stock.name}</span>
                                        <span className="text-xs opacity-50">{stock.exchange}</span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

