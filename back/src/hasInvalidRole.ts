import { deriveRoleKey } from "./derive-role-key";
import type { PlayerRole } from "core";
import crypto from "crypto";

export async function hasInvalidRole(
	game: string,
	role: PlayerRole,
	signature: string,
): Promise<boolean> {
	const key = await deriveRoleKey();

	const expectedSignature = crypto
		.createHmac("sha256", key)
		.update(`${game}:${role}`)
		.digest("hex");

	return signature !== expectedSignature;
}
