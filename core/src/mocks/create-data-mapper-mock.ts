import { Subject, mergeMap } from "rxjs";
import type { DataMapper } from "../types";

interface DbRecord {
	id: string;
}

export function createDataMapperMock<T extends DbRecord, U extends DbRecord>(
	relation: Record<string, DataMapper<U>>,
): DataMapper<T> {
	let records: T[] = [];
	const records$ = new Subject<T[]>();

	async function read(query: Partial<T>): Promise<T[]> {
		let result = records.filter((record) =>
			Object.entries(query).every(([key, value]) => record[key] === value),
		);

		for (const [prop, dataMapper] of Object.entries(relation)) {
			result = await Promise.all(
				result.map(async (record) => {
					return {
						...record,
						...(record[prop] && {
							[prop]: (
								await Promise.all(
									record[prop].map((o) =>
										dataMapper.read({ id: o.id } as Partial<U>),
									),
								)
							).flat(),
						}),
					};
				}),
			);
		}

		return result;
	}

	return {
		read,
		observe(query: Partial<T>) {
			return records$.pipe(mergeMap(() => read(query)));
		},
		destroy(query: Partial<T>) {
			records = records.filter((record) =>
				Object.entries(query).every(([key, value]) => record[key] === value),
			);

			return Promise.resolve();
		},
		create(items: T | T[]) {
			records.push(...(Array.isArray(items) ? (items as T[]) : [items as T]));
			records$.next(records);
			return Promise.resolve();
		},
		update(query: Partial<T>, item: Partial<T>) {
			const index = records.findIndex((record) =>
				Object.entries(query).every(([key, value]) => record[key] === value),
			);

			records[index] = { ...records[index], ...item };
			records$.next(records);
			return Promise.resolve();
		},
	};
}
