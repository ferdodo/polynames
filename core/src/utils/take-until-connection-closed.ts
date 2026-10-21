import type { Connection } from "../types/connection";
import { Observable, takeUntil } from "rxjs";
import type { Message } from "../types";

export function takeUntilConnectionClosed<T>(
	connection: Connection<Message>,
): (source: Observable<T>) => Observable<T> {
	return (source: Observable<T>): Observable<T> =>
		source.pipe(
			takeUntil(
				new Observable<void>((subscriber) => {
					connection.messages$.subscribe({
						complete: () => subscriber.next(),
					});
				}),
			),
		);
}
