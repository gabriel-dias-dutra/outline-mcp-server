import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ZodRawShape } from 'zod'

export type ToolDefinition<
  Args extends ZodRawShape,
  Output extends ZodRawShape,
> = {
  name: string
  description: string
  inputSchema?: Args
  outputSchema?: Output
  callback: ToolCallback<Args>
}

class ToolRegistry {
  private registry: Map<string, ToolDefinition<any, any>> = new Map()

  constructor() {
    this.registry = new Map()
  }

  get tools(): ToolDefinition<any, any>[] {
    return Array.from(this.registry.values())
  }

  has(name: string): boolean {
    return this.registry.has(name)
  }

  get<Args extends ZodRawShape, Output extends ZodRawShape>(
    name: string,
  ): ToolDefinition<Args, Output> | undefined {
    return this.registry.get(name)
  }

  /**
   * Registers a tool with the global registry
   */
  public register<Args extends ZodRawShape, Output extends ZodRawShape>(
    name: string,
    definition: ToolDefinition<Args, Output>,
  ): void {
    if (this.has(name)) {
      throw new Error(`Attempted to register duplicate tool: "${name}"`)
    }
    this.registry.set(name, definition)
  }
}

// We'll collect all tool definitions here, keyed by name
const toolRegistry = new ToolRegistry()
export default toolRegistry
