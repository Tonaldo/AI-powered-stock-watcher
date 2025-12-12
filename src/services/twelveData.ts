import axios from 'axios'
import { Stock, StockQuote, TimeSeriesData } from '../types/stock'

const API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY || ''
const BASE_URL = 'https://api.twelvedata.com'

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        apikey: API_KEY,
    },
})

export async function searchStocks(query: string): Promise<Stock[]> {
    if (!query.trim()) {
        return []
    }

    try {
        const response = await api.get('/stocks', {
            params: {
                symbol: query,
                source: 'docs',
            },
        })

        if (response.data.status === 'error') {
            throw new Error(response.data.message)
        }

        const data = response.data.data || []
        return Array.isArray(data) ? data : [data]
    } catch (error) {
        console.error('Error searching stocks:', error)
        return []
    }
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
        const response = await api.get('/quote', {
            params: {
                symbol: symbol.toUpperCase(),
            },
        })

        if (response.data.status === 'error') {
            throw new Error(response.data.message)
        }

        return response.data
    } catch (error) {
        console.error('Error fetching stock quote:', error)
        return null
    }
}

export async function getTimeSeries(
    symbol: string,
    interval: string = '1day',
    outputsize: number = 30
): Promise<TimeSeriesData[]> {
    try {
        const response = await api.get('/time_series', {
            params: {
                symbol: symbol.toUpperCase(),
                interval,
                outputsize,
            },
        })

        if (response.data.status === 'error') {
            throw new Error(response.data.message)
        }

        const values = response.data.values || []
        return Array.isArray(values) ? values.reverse() : []
    } catch (error) {
        console.error('Error fetching time series:', error)
        return []
    }
}

