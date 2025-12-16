# Stock Watcher with AI

A simple React app for tracking stocks and getting AI-powered analysis. Search for stocks, add them to your watchlist, and let Amazon Bedrock give you insights and predictions.

!! CLOUD DEPLOY COMING SOON !!

## What it does

You can search for stocks by symbol or company name, add them to your watchlist, and view price charts. The AI analysis feature uses Amazon Bedrock to analyze stock performance and provide short-term predictions.

Stocks you add are saved in your browser's local storage, so they'll still be there when you refresh the page.

## Setup

First, install the dependencies:

```bash
npm install
```

You'll need API keys for this to work. Create a `.env` file in the root directory:

```env
VITE_TWELVEDATA_API_KEY=your_twelvedata_key_here
VITE_AWS_REGION=eu-central-1
VITE_BEDROCK_MODEL_ID=eu.amazon.nova-2-lite-v1:0
```

For AWS Bedrock, you'll need to configure credentials. The app uses `@aws-sdk/client-bedrock-runtime` - make sure your AWS credentials are set up (either through environment variables, AWS credentials file, or IAM roles if running on AWS).

Then start the dev server:

```bash
npm run dev
```

## Tech stack

- React + TypeScript
- Vite for building
- DaisyUI + TailwindCSS for styling
- ReCharts for price charts
- TwelveData API for stock data
- Amazon Bedrock for AI analysis

## Building

```bash
npm run build
```

The output will be in the `dist` folder.

