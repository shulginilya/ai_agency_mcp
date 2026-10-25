import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Example tool: replace or extend with real ones.
export function registerEchoTool(server: McpServer): void {
  server.registerTool(
    "echo",
    {
      title: "Echo",
      description: "Returns the given message back, optionally upper-cased.",
      inputSchema: {
        message: z.string().min(1).describe("Text to echo back"),
        uppercase: z.boolean().optional().describe("Upper-case the reply"),
      },
    },
    async ({ message, uppercase }) => ({
      content: [{ type: "text", text: uppercase ? message.toUpperCase() : message }],
    }),
  );
}
