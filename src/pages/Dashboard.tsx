import { useState } from 'react'
import StockSearch from '../components/StockSearch'
import StockList from '../components/StockList'
import { Stock } from '../types/stock'

export default function Dashboard() {
  const [watchedStocks, setWatchedStocks] = useState<Stock[]>([])
  const [filterQuery, setFilterQuery] = useState('')

  const handleSelectStock = (stock: Stock) => {
    if (!watchedStocks.find((s) => s.symbol === stock.symbol)) {
      setWatchedStocks([...watchedStocks, stock])
    }
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl">Stock Dashboard</h2>
          <p>Search and analyze stocks with AI-powered insights</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <StockSearch onSelectStock={handleSelectStock} />
        </div>
      </div>

      {watchedStocks.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Watched Stocks</h3>
              <label className="input input-bordered input-sm flex items-center gap-2">
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
                  placeholder="Filter by symbol or name..."
                  className="grow"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
              </label>
            </div>
            <StockList
              stocks={watchedStocks}
              onSelectStock={handleSelectStock}
              filterQuery={filterQuery}
            />
          </div>
        </div>
      )}
    </div>
  )
}

