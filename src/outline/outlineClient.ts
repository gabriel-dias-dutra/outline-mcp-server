import axios from 'axios'
import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: [join(__dirname, '..', '.env'), join(__dirname, '.env')] })

const API_KEY = process.env.OUTLINE_API_KEY
const API_URL = process.env.OUTLINE_API_URL || 'https://app.getoutline.com/api'

if (!API_KEY) {
  throw new Error('OUTLINE_API_KEY environment variable is required')
}

// Create axios client with authentication
export const outlineClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
