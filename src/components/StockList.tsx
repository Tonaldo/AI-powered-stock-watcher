import { Stock } from '../types/stock'

interface StockListProps {
    stocks: Stock[]
    onSelectStock: (stock: Stock) => void
    filterQuery: string
}

export default function StockList({ stocks, onSelectStock, filterQuery }: StockListProps) {
    const filteredStocks = stocks.filter((stock) => {
        const query = filterQuery.toLowerCase()
        return (
            stock.symbol.toLowerCase().includes(query) ||
            stock.name.toLowerCase().includes(query)
        )
    })

    if (filteredStocks.length === 0) {
        return (
            <div className="alert">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info shrink-0 w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <span>No stocks found</span>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStocks.map((stock) => (
                <div
                    key={stock.symbol}
                    className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                    onClick={() => onSelectStock(stock)}
                >
                    <div className="card-body">
                        <div className="flex items-center gap-2">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-12">
                                    <span className="text-lg font-bold">{stock.symbol.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="card-title text-lg">{stock.symbol}</h2>
                                <p className="text-sm opacity-70 truncate">{stock.name}</p>
                            </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <div className="badge badge-outline badge-sm">{stock.exchange}</div>
                            <div className="badge badge-outline badge-sm">{stock.currency}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

