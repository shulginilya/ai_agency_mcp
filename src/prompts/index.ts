import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "summarize",
    {
      title: "Summarize",
      description: "Ask the model to summarize a piece of text",
      argsSchema: { text: z.string().describe("Text to summarize") },
    },
    ({ text }) => ({
      messages: [
        {
          role: "user",
          content: { type: "text", text: `Summarize the following text:\n\n${text}` },
        },
      ],
    }),
  );
}
