import { vi } from "vitest";

export function makeRequest(partial: any = {}) {
  return {
    path: "/test",
    method: "POST",
    ip: "127.0.0.1",
    get: (host: string) =>
      host.toLowerCase() === "user-agent" ? "vitest" : undefined,
    ...partial,
  } as any;
}

export function makeResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}
