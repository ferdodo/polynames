import { deriveRoleKey } from "./derive-role-key";
import type { PlayerRole } from "core";
import crypto from "crypto";

export async function signRole(
	game: string,
	role: PlayerRole,
): Promise<string> {
	const key = await deriveRoleKey();

	const signature = crypto
		.createHmac("sha256", key)
		.update(`${game}:${role}`)
		.digest("hex");

	return signature;
}
