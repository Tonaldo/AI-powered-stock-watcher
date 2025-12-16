import { useState, useEffect } from 'react'
import StockSearch from '../components/StockSearch'
import StockDetails from '../components/StockDetails'
import { Stock } from '../types/stock'

const STORAGE_KEY = 'watchedStocks'

export default function Dashboard() {
  const [watchedStocks, setWatchedStocks] = useState<Stock[]>([])
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const stocks = JSON.parse(stored)
        setWatchedStocks(stocks)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const saveStocks = (stocks: Stock[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks))
    setWatchedStocks(stocks)
  }

  const handleSelectStock = (stock: Stock) => {
    if (!watchedStocks.find((s) => s.symbol === stock.symbol)) {
      const updated = [...watchedStocks, stock]
      saveStocks(updated)
    }
    setOpenAccordion(stock.symbol)
  }

  const handleRemoveStock = (symbol: string) => {
    const updated = watchedStocks.filter((s) => s.symbol !== symbol)
    saveStocks(updated)
    if (openAccordion === symbol) {
      setOpenAccordion(null)
    }
  }

  const toggleAccordion = (symbol: string) => {
    setOpenAccordion(openAccordion === symbol ? null : symbol)
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
            <h3 className="text-xl font-bold mb-4">Watched Stocks</h3>
            <div className="join join-vertical w-full">
              {watchedStocks.map((stock) => (
                <div key={stock.symbol} className="collapse collapse-arrow join-item border border-base-300">
                  <input
                    type="radio"
                    name="stock-accordion"
                    checked={openAccordion === stock.symbol}
                    onChange={() => toggleAccordion(stock.symbol)}
                  />
                  <div className="collapse-title text-xl font-medium">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span>{stock.symbol}</span>
                        <span className="text-sm opacity-70">{stock.name}</span>
                      </div>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveStock(stock.symbol)
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="collapse-content">
                    <div className="pt-4">
                      <StockDetails
                        stock={stock}
                        onClose={() => handleRemoveStock(stock.symbol)}
                        showCloseButton={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

