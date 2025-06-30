import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import z from 'zod'
import { outlineClient } from '../outline/outlineClient.js'
import toolRegistry from '../utils/toolRegistry.js'

// Register this tool
toolRegistry.register('list_documents', {
  name: 'list_documents',
  description: 'List documents in the Outline workspace with optional filters',
  inputSchema: {
    collectionId: z
      .string()
      .describe('Filter by collection ID (optional)')
      .optional(),
    query: z
      .string()
      .describe('Search query to filter documents (optional)')
      .optional(),
    limit: z
      .number()
      .describe('Maximum number of documents to return (optional)')
      .optional(),
    offset: z.number().describe('Pagination offset (optional)').optional(),
    sort: z
      .string()
      .describe('Field to sort by (e.g. "updatedAt") (optional)')
      .optional(),
    direction: z
      .enum(['ASC', 'DESC'])
      .describe('Sort direction, either "ASC" or "DESC" (optional)')
      .optional(),
    template: z
      .boolean()
      .describe('Optionally filter to only templates (optional)')
      .optional(),
    userId: z
      .string()
      .describe('Optionally filter by user ID (optional)')
      .optional(),
    parentDocumentId: z
      .string()
      .describe('Optionally filter by parent document ID (optional)')
      .optional(),
    backlinkDocumentId: z
      .string()
      .describe('Optionally filter by backlink document ID (optional)')
      .optional(),
  },
  async callback(args) {
    try {
      // Create the payload object
      const payload: Record<string, any> = {
        offset: args.offset || 1,
        limit: args.limit || 25,
        sort: args.sort || 'updatedAt',
        direction: args.direction || 'DESC',
        collectionId: args.collectionId || '',
        userId: args.userId || '',
        backlinkDocumentId: args.backlinkDocumentId || '',
        parentDocumentId: args.parentDocumentId || '',
      }

      // Only add template if it's explicitly defined
      if (args.template !== undefined) {
        payload.template = args.template
      }

      // Only add query if it's provided
      if (args.query) {
        payload.query = args.query
      }

      // Make the POST request to the documents.list endpoint
      const response = await outlineClient.post('/documents.list', payload)

      // Transform the response to a more usable format
      const documents = response.data.data

      // Return the documents with additional metadata
      return {
        content: [
          {
            type: 'text',
            text: `documents: ${JSON.stringify(documents)}`,
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
