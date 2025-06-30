import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import z from 'zod'
import { outlineClient } from '../outline/outlineClient.js'
import toolRegistry from '../utils/toolRegistry.js'

// Register this tool
toolRegistry.register('get_document', {
  name: 'get_document',
  description:
    'Get details about a specific document. At least id XOR shareId are required.',
  inputSchema: {
    id: z
      .string()
      .describe(
        'Unique identifier for the document. Either the UUID or the urlId is acceptable',
      ),
  },
  async callback(args) {
    try {
      const response = await outlineClient.post('/documents.info', {
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
