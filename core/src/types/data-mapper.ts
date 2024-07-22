import type { Observable } from "rxjs";

/**
 * Generic data mapper adaptable for our specific needs.
 *
 * - no select / projection
 * - no pagination / offset / iterables
 * - no sorting / ordering
 * - no aggregations / group by
 * - no limits 😎
 */
export interface DataMapper<T> {
	read(query: Partial<T>): Promise<Partial<T>[]>;
	observe(query: Partial<T>): Observable<Partial<T>[]>;
	create(item: T | T[]): Promise<void>;
	update(query: Partial<T>, item: Partial<T>): Promise<void>;
	destroy(query: Partial<T>): Promise<void>;
}
