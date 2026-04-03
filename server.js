import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5005

app.use(cors())
app.use(express.json())

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working' })
})

app.post('/api/insights', async (req, res) => {
    try {
        const { expenses } = req.body

        if (!expenses || !Array.isArray(expenses)) {
            return res.status(400).json({ error: 'Expenses array is required' })
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Missing GEMINI_API_KEY in backend .env' })
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const prompt = `
You are a finance assistant.
Analyze the following expense data and return a JSON structure with spending insights.

Expense data:
${JSON.stringify(expenses, null, 2)}

Return only valid JSON in this EXACT format:
{
  "insights": {
    "topCategory": {
      "category": "String",
      "amount": 0,
      "percentage": 0
    },
    "pattern": {
      "title": "String",
      "summary": "String"
    },
    "recommendation": {
      "title": "String",
      "summary": "String"
    }
  }
}
`

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        })
        const text = result.text

        const cleaned = text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        res.json(parsed)
    } catch (error) {
        console.error('Insights API error:', error)
        res.status(500).json({
            error: 'Failed to generate insights',
            details: error.message,
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})