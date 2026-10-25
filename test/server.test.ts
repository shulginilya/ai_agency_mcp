import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

describe("ai-agency-mcp", () => {
  let client: Client;

  beforeEach(async () => {
    const server = createServer();
    client = new Client({ name: "test-client", version: "0.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  });

  afterEach(async () => {
    await client.close();
  });

  it("lists the echo tool", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name)).toContain("echo");
  });

  it("echoes a message", async () => {
    const result = await client.callTool({ name: "echo", arguments: { message: "hi", uppercase: true } });
    expect(result.content).toEqual([{ type: "text", text: "HI" }]);
  });

  it("rejects invalid input", async () => {
    const result = await client.callTool({ name: "echo", arguments: { message: "" } });
    expect(result.isError).toBe(true);
  });

  it("reads the server-info resource", async () => {
    const { contents } = await client.readResource({ uri: "info://server" });
    const [first] = contents;
    expect("text" in first).toBe(true);
    expect(JSON.parse("text" in first ? first.text : "")).toMatchObject({ name: "ai-agency-mcp" });
  });

  it("renders the summarize prompt", async () => {
    const { messages } = await client.getPrompt({ name: "summarize", arguments: { text: "abc" } });
    expect(messages[0].content).toMatchObject({ type: "text" });
  });
});
