import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import z from 'zod'
import { outlineClient } from '../outline/outlineClient.js'
import toolRegistry from '../utils/toolRegistry.js'

// Register this tool
toolRegistry.register('get_collection', {
  name: 'get_collection',
  description: 'Get details about a specific collection',
  inputSchema: {
    id: z.string().describe('ID of the collection to retrieve'),
  },
  async callback(args) {
    try {
      const response = await outlineClient.post(`/collections.info`, {
        id: args.id,
      })
      return {
        content: [{ type: 'text', text: JSON.stringify(response.data.data) }],
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error getting collection:', message)
      throw new McpError(ErrorCode.InvalidRequest, message)
    }
  },
})
