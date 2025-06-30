import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import z from 'zod'
import { outlineClient } from '../outline/outlineClient.js'
import toolRegistry from '../utils/toolRegistry.js'

// Register this tool
toolRegistry.register('search_documents', {
  name: 'search_documents',
  description: 'Search for documents in the Outline workspace',
  inputSchema: {
    query: z.string().describe('Search query to filter documents'),
    collectionId: z
      .string()
      .describe('Filter by collection ID (optional)')
      .optional(),
    limit: z
      .number()
      .describe('Maximum number of documents to return (optional)')
      .optional(),
  },
  async callback(args) {
    try {
      const payload: Record<string, any> = {
        query: args.query,
      }

      if (args.collectionId) {
        payload.collectionId = args.collectionId
      }

      if (args.limit) {
        payload.limit = args.limit
      }

      const response = await outlineClient.post('/documents.search', payload)
      return {
        content: [
          {
            type: 'text',
            text: `documents: ${JSON.stringify(response.data.data)}`,
          },
          {
            type: 'text',
            text: `pagination: ${JSON.stringify(response.data.pagination)}`,
          },
        ],
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error getting collection:', message)
      throw new McpError(ErrorCode.InvalidRequest, message)
    }
  },
})
