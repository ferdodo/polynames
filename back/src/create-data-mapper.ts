import type { DataMapper } from "core";
import type { DatabaseSync } from "node:sqlite";
import { createSql } from "./sql";
import { validateId } from "./parse-row";
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
	db: DatabaseSync,
	table: string,
	props: (keyof T & string)[],
	joined: [keyof T & string, string[]][],
	parse: (row: Record<string, unknown>) => T,
): DataMapper<T> {
	const sql = createSql(db);
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

			ORDER BY ${raw(`${table}.id`)}
		`;

		const deduped = result.reduce<Record<string, Record<string, unknown>>>(
			(acc, record) => {
				const id = validateId(record.id);
				acc[id] ||= record;

				const row = acc[id];

				for (const [childTable, childProps] of joined) {
					const children = Array.isArray(row[childTable])
						? row[childTable]
						: [];
					row[childTable] = children;

					const child = childProps.reduce<Record<string, unknown>>(
						(childAcc, prop) => {
							childAcc[prop] = record[`${childTable}_${prop}`];
							return childAcc;
						},
						{},
					);

					if (Object.values(child).some((o) => o !== null)) {
						children.push(child);
					}

					for (const prop of childProps) {
						delete row[`${childTable}_${prop}`];
					}
				}

				return acc;
			},
			{},
		);

		return Object.values(deduped).map(parse);
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
						(Array.isArray(item[ftable]) ? item[ftable] : []).map((fItem) => [item.id, fItem.id])
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
			const toUpdate = (
				await sql`
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
				`
			).map(parse);

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
						(Array.isArray(item[ftable]) ? item[ftable] : []).map((fItem) => [o.id, fItem.id])
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

			cardsSubject.next(toUpdate.map((i) => ({ ...i, ...item })));
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
				)}			`;
		},
	};
}
