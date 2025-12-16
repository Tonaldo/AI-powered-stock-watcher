import { StockQuote, TimeSeriesData } from '../types/stock'

const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1'
const MODEL_ID = import.meta.env.VITE_BEDROCK_MODEL_ID || 'eu.amazon.nova-2-lite-v1:0'
import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";
const bedrockruntime = new BedrockRuntime({
    region: AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
})

interface BedrockResponse {
    analysis: string
    prediction: string
    confidence: number
    reasoning: string
}

export async function analyzeStock(
    symbol: string,
    quote: StockQuote,
    timeSeries: TimeSeriesData[]
): Promise<BedrockResponse | null> {

    const recentPrices = timeSeries.slice(-10).map((ts) => ({
        date: ts.datetime,
        close: parseFloat(ts.close),
        volume: parseInt(ts.volume),
    }))

    const priceTrend = recentPrices.length > 1
        ? recentPrices[recentPrices.length - 1].close > recentPrices[0].close
            ? 'upward'
            : 'downward'
        : 'stable'

    const avgVolume = recentPrices.reduce((sum, p) => sum + p.volume, 0) / recentPrices.length
    const currentVolume = recentPrices[recentPrices.length - 1]?.volume || 0

    const prompt = `Analyze the following stock data and provide insights:

Stock Symbol: ${symbol}
Current Price: $${quote.close}
Change: ${quote.change} (${quote.percent_change}%)
Previous Close: $${quote.previous_close}
Volume: ${quote.volume}

Recent Price Trend: ${priceTrend}
Average Volume (last 10 days): ${avgVolume.toLocaleString()}
Current Volume: ${currentVolume.toLocaleString()}

Recent Price Data:
${recentPrices.map((p) => `Date: ${p.date}, Close: $${p.close.toFixed(2)}, Volume: ${p.volume.toLocaleString()}`).join('\n')}

Provide:
1. A brief analysis of the stock's current performance
2. A short-term prediction (next 1-3 days)
3. Confidence level (1-10)
4. Key reasoning factors

Format your response as JSON:
{
  "analysis": "brief analysis text",
  "prediction": "prediction text",
  "confidence": number between 1-10,
  "reasoning": "reasoning text"
}`

    try {
        const requestBody = {
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
        }

        const response = await bedrockruntime.invokeModel({
            modelId: MODEL_ID,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody),
        })

        if (!response.body) {
            throw new Error('Empty response from Bedrock')
        }

        const responseBody = JSON.parse(new TextDecoder().decode(response.body))
        // Traverse the correct path to get the content text
        const content = responseBody.output?.message?.content?.[0]?.text || ''

        console.log('Bedrock responseBody', responseBody)
        if (!content) {
            throw new Error('No content in response')
        }

        try {
            // Extract JSON block from a code block (handles cases like ```json\n{ ... }\n```)
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
        } catch {
            return {
                analysis: content.substring(0, 200),
                prediction: 'Unable to parse prediction',
                confidence: 5,
                reasoning: 'Response parsing failed',
            }
        }

        return {
            analysis: content.substring(0, 200),
            prediction: 'Analysis completed',
            confidence: 5,
            reasoning: 'Standard analysis',
        }
    } catch (error) {
        console.error('Error calling Bedrock:', error)
        return null
    }
}



