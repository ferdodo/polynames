import type { DataMapper } from "core";
import { sql } from "./sql";
import Sql, { join, bulk, raw } from "sql-template-tag";
import { Subject, mergeMap } from "rxjs";

// observe will only work when all data are
// handle on a single service. (1 game = 1 pod)
//
// with a different scaling strategy, we would need
// either an external pub/sub message broker,
// or database that let you observe data.

interface DbRecord {
	id: string;
}

export function createDataMapper<T extends DbRecord>(
	table: string,
	props: (keyof T & string)[],
	joined: [keyof T & string, string[]][] = [],
): DataMapper<T> {
	const cardsSubject = new Subject<T[]>();

	async function read(query: Partial<T>) {
		const result = await sql`
			SELECT
				${join([
					raw(`${table}.*`),
					...joined.flatMap(([p, pr]) =>
						pr.map((b) => raw(`${p}.${b} AS ${p}_${b}`)),
					),
				])}

			FROM ${raw(table)}

			${
				joined.length
					? join(
							joined.map(([tab]) => {
								const piv = [table, tab].sort().join("_");
								const fk1 = `${table}_id`;
								const fk2 = `${tab}_id`;

								return Sql`
									LEFT OUTER JOIN ${raw(piv)} ON ${raw(table)}.id = ${raw(piv)}.${raw(fk1)}
									LEFT OUTER JOIN ${raw(tab)} ON ${raw(piv)}.${raw(fk2)} = ${raw(tab)}.id
								`;
							}),
						)
					: raw("")
			}

			WHERE ${join(
				props.reduce((acc, prop) => {
					if (query[prop]) {
						acc.push(Sql`${raw(`${table}.${prop}`)} = ${query[prop]}`);
					}
					return acc;
				}, []),
				" AND ",
			)}
		`;

		const deduped: Record<string, T> = result.reduce((acc, record) => {
			acc[record.id] ||= record;

			for (const [table, props] of joined) {
				acc[record.id][table] ||= [];

				const fItem = props.reduce((acc, prop) => {
					acc[prop] = record[`${table}_${prop}`];
					return acc;
				}, {} as any);

				if (Object.values(fItem).some((o) => o !== null)) {
					acc[record.id][table].push(fItem);
				}

				for (const prop of props) {
					delete acc[record.id][`${table}_${prop}`];
				}
			}

			return acc;
		}, {});

		return Object.values(deduped) as T[];
	}

	return {
		read,
		observe(query: Partial<T>) {
			return cardsSubject.pipe(mergeMap(() => read(query)));
		},
		async create(item: T | T[]) {
			const items = Array.isArray(item) ? item : [item];

			await sql`
				INSERT INTO ${raw(table)} (${join(props.map((prop) => Sql`${raw(prop)}`))})
				VALUES ${bulk(items.map((item) => props.map((prop) => item[prop])))}
			`;

			for (const [ftable] of joined) {
				const pivot = [table, ftable].sort().join("_");
				const fk1 = `${table}_id`;
				const fk2 = `${ftable}_id`;

				const links = items.flatMap((item) => {
					return (
						(item[ftable] as any[])?.map((fItem) => [item.id, fItem.id]) ?? []
					);
				});

				if (links.length === 0) {
					continue;
				}

				await sql`
					INSERT INTO ${raw(pivot)} (${raw(fk1)}, ${raw(fk2)})
					VALUES ${bulk(links)}
				`;
			}

			cardsSubject.next(items);
		},
		async update(query: Partial<T>, item: Partial<T>) {
			const toUpdate = await sql`
				SELECT * FROM ${raw(table)}
				WHERE ${join(
					props.reduce((acc, prop) => {
						if (query[prop]) {
							acc.push(Sql`${raw(prop)} = ${query[prop]}`);
						}
						return acc;
					}, []),
					" AND ",
				)}
			`;

			const update = toUpdate.map((i) =>
				props.map((prop) => item[prop] ?? i[prop]),
			);

			await sql`
				REPLACE INTO ${raw(table)} (${join(props.map((prop) => Sql`${raw(prop)}`))})
				VALUES ${bulk(update)}
			`;

			for (const [ftable] of joined) {
				if (!item[ftable]) {
					continue;
				}

				const pivot = [table, ftable].sort().join("_");
				const fk1 = `${table}_id`;
				const fk2 = `${ftable}_id`;

				const links = toUpdate.flatMap((o) => {
					return (
						(item[ftable] as any[])?.map((fItem) => [o.id, fItem.id]) ?? []
					);
				});

				if (links.length === 0) {
					continue;
				}

				await sql`
					REPLACE INTO ${raw(pivot)} (${raw(fk1)}, ${raw(fk2)})
					VALUES ${bulk(links)}
				`;
			}

			cardsSubject.next(update);
		},
		async destroy(query: Partial<T>) {
			await sql`
				DELETE FROM ${raw(table)}
				WHERE ${join(
					props.reduce((acc, prop) => {
						if (query[prop]) {
							acc.push(Sql`${raw(prop)} = ${query[prop]}`);
						}
						return acc;
					}, []),
					" AND ",
				)}
			`;
		},
	};
}
