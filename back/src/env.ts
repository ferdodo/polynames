const variables = [
	"ROLE_SIGN_PASSPHRASE",
	"ROLE_SIGN_SALT",
	"WEB_ORIGIN",
];

for (const variable of variables) {
	get(process.env, variable);
}

function get(target, name: string): string {
	if (!variables.includes(name)) {
		throw new Error(`Unknown env variable ${name} !`);
	}

	if (!target[name]) {
		throw new Error(`Missing env variable ${name} !`);
	}

	return target[name];
}

export const env = new Proxy(process.env, { get });
