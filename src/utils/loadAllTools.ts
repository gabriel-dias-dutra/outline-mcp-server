import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import toolRegistry, { type ToolDefinition } from './toolRegistry.js'

/**
 * Dynamically imports all tool files from the tools directory
 */
export async function loadAllTools(
  onToolLoaded?: (tool: ToolDefinition<any, any>) => unknown,
) {
  // Get the directory path
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const toolsDir = path.join(__dirname, '..', 'tools')

  // List tool files
  const toolFiles = fs
    .readdirSync(toolsDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

  // Import all tool files, causing them to be restered via `registerTool`
  for (const file of toolFiles) {
    const resolved = path.resolve(toolsDir, file)
    await import(resolved)
  }

  // configure McpServer with all definitions
  for (const tool of toolRegistry.tools) {
    await onToolLoaded?.(tool)
  }
}
