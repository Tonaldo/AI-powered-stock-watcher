export interface Stock {
    symbol: string
    name: string
    currency: string
    exchange: string
    mic_code: string
    country: string
    type: string
}

export interface StockQuote {
    symbol: string
    name: string
    exchange: string
    currency: string
    datetime: string
    timestamp: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    previous_close: string
    change: string
    percent_change: string
}

export interface TimeSeriesData {
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
}

