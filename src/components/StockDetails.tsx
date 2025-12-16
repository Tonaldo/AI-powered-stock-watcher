import { useState, useEffect } from 'react'
import { Stock, StockQuote, TimeSeriesData } from '../types/stock'
import { getStockQuote, getTimeSeries } from '../services/twelveData'
import { analyzeStock } from '../services/bedrock'
import StockChart from './StockChart'

interface StockDetailsProps {
    stock: Stock
    onClose: () => void
    showCloseButton?: boolean
}

interface AnalysisResult {
    analysis: string
    prediction: string
    confidence: number
    reasoning: string
}

export default function StockDetails({ stock, onClose, showCloseButton = true }: StockDetailsProps) {
    const [quote, setQuote] = useState<StockQuote | null>(null)
    const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([])
    const [loading, setLoading] = useState(true)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [analyzing, setAnalyzing] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const [quoteData, seriesData] = await Promise.all([
                getStockQuote(stock.symbol),
                getTimeSeries(stock.symbol),
            ])
            setQuote(quoteData)
            setTimeSeries(seriesData)
            setLoading(false)
        }

        fetchData()
    }, [stock.symbol])

    const handleAnalyze = async () => {
        if (!quote || timeSeries.length === 0) return

        setAnalyzing(true)
        const result = await analyzeStock(stock.symbol, quote, timeSeries)
        setAnalysis(result)
        setAnalyzing(false)
    }

    if (loading) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        )
    }

    if (!quote) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Failed to load stock data</span>
                    </div>
                    <button className="btn btn-sm mt-4" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        )
    }

    const changeColor = parseFloat(quote.change) >= 0 ? 'text-success' : 'text-error'
    const changeIcon = parseFloat(quote.change) >= 0 ? '↑' : '↓'

    return (
        <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="card-title text-3xl">{quote.symbol}</h2>
                            <p className="text-lg opacity-70">{quote.name}</p>
                            <p className="text-sm opacity-50">{quote.exchange}</p>
                        </div>
                        {showCloseButton && (
                            <button className="btn btn-sm btn-circle" onClick={onClose}>
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-sm opacity-70">Current Price</div>
                            <div className="text-2xl font-bold">${parseFloat(quote.close).toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">Change</div>
                            <div className={`text-xl font-bold ${changeColor}`}>
                                {changeIcon} ${Math.abs(parseFloat(quote.change)).toFixed(2)} ({quote.percent_change}%)
                            </div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">High</div>
                            <div className="text-xl">${parseFloat(quote.high).toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-70">Low</div>
                            <div className="text-xl">${parseFloat(quote.low).toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze with AI'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {timeSeries.length > 0 && <StockChart data={timeSeries} symbol={stock.symbol} />}

            {analysis && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">AI Analysis</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold">Analysis</h4>
                                <p>{analysis.analysis}</p>
                            </div>
                            <div>
                                <h4 className="font-bold">Prediction</h4>
                                <p>{analysis.prediction}</p>
                            </div>
                            <div>
                                <h4 className="font-bold">Confidence</h4>
                                <progress
                                    className="progress progress-primary w-full"
                                    value={analysis.confidence * 10}
                                    max="100"
                                ></progress>
                                <span className="text-sm">{analysis.confidence}/10</span>
                            </div>
                            <div>
                                <h4 className="font-bold">Reasoning</h4>
                                <p>{analysis.reasoning}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

