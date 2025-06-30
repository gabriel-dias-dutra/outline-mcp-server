import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import z from 'zod'
import { outlineClient } from '../outline/outlineClient.js'
import toolRegistry from '../utils/toolRegistry.js'

// Register this tool
toolRegistry.register('list_collections', {
  name: 'list_collections',
  description: 'List all collections in the Outline workspace',
  inputSchema: {
    limit: z
      .number()
      .describe('Maximum number of collections to return (optional)')
      .optional(),
  },
  async callback(args) {
    try {
      const payload: Record<string, any> = {}

      if (args.limit) {
        payload.limit = args.limit
      }

      const response = await outlineClient.post('/collections.list', payload)
      return {
        content: [
          {
            type: 'text',
            text: `collections: ${JSON.stringify(response.data.data)}`,
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
