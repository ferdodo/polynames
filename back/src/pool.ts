import mariadb from "mariadb";
import { env } from "./env";

export const pool = mariadb.createPool({
	host: "db",
	user: env.MARIADB_USER,
	database: env.MARIADB_DATABASE,
	password: env.MARIADB_PASSWORD,
	connectionLimit: 5,
	connectTimeout: 10000,
	logger: {
		query: console.log,
	},
});
