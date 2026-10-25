# ai_agency_mcp

An MCP (Model Context Protocol) server written in TypeScript on the official
[`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk),
served over stdio.

## Requirements

- Node.js 20+

## Getting started

```bash
npm install
npm run build
npm start          # runs dist/index.js over stdio
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Run from source with reload (`tsx watch`)     |
| `npm run build`     | Compile `src/` to `dist/`                     |
| `npm run typecheck` | Type-check sources and tests                  |
| `npm test`          | Run the test suite (vitest, in-memory client) |
| `npm run inspect`   | Open the built server in the MCP Inspector    |

## Layout

```
src/
  index.ts            entry point — connects the server to stdio
  server.ts           createServer(): builds the server, registers everything
  tools/              tools (example: echo)
  resources/          resources (example: info://server)
  prompts/            prompts (example: summarize)
test/
  server.test.ts      end-to-end tests through an in-memory client
```

Add a tool by creating a file in `src/tools/` that exports a
`register…(server)` function, then calling it from `src/tools/index.ts`.
Resources and prompts follow the same pattern.

## Connecting a client

Point any MCP client at the built entry point, for example:

```json
{
  "mcpServers": {
    "ai-agency-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/ai_agency_mcp/dist/index.js"]
    }
  }
}
```

Logs go to stderr; stdout is reserved for the protocol.

## Testing with the MCP Inspector

```bash
npm run build
npm run inspect
```

Open the dashboard at:

```
http://127.0.0.1:6274?MCP_INSPECTOR_API_TOKEN=local123
```

then click **Connect**. The token defaults to `local123`; set your own with
`MCP_INSPECTOR_API_TOKEN=<token> npm run inspect` and put the same value at the
end of the link. Inspector secrets are kept in memory only.

The Inspector also has a CLI mode for quick checks:

```bash
npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list
npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/call --tool-name echo --tool-arg message=hello
```
