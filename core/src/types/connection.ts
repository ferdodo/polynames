import type { Observable } from "rxjs";

export interface Connection<T> {
	id: number;
	messages$: Observable<T>;
	send: (payload: T) => void;
}
