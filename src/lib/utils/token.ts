import { randomBytes } from "crypto";

export function generateDiscoveryToken(): string {
  const bytes = randomBytes(12);
  return bytes.toString("hex").match(/.{1,3}/g)?.join("-") || "";
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}
