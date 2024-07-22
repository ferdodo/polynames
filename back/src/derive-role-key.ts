import crypto from "crypto";
import { promisify } from "util";
import { env } from "./env";

const pbkdf2 = promisify(crypto.pbkdf2);

let key = null;

export async function deriveRoleKey(): Promise<string> {
	if (key) {
		return key;
	}

	if (env.ROLE_SIGN_SALT.length < 16) {
		throw new Error("ROLE_SIGN_SALT is too short !");
	}

	key = (
		await pbkdf2(
			env.ROLE_SIGN_PASSPHRASE,
			env.ROLE_SIGN_SALT,
			100000,
			64,
			"sha256",
		)
	).toString("hex");

	return key;
}
