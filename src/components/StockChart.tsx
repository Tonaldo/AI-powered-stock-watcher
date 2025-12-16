import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TimeSeriesData } from '../types/stock'

interface StockChartProps {
    data: TimeSeriesData[]
    symbol: string
}

export default function StockChart({ data, symbol }: StockChartProps) {
    const chartData = data.map((item) => ({
        date: new Date(item.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
    }))

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h3 className="card-title">{symbol} Price Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

