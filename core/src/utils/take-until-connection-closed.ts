import type { Connection } from "connection-types";
import { Observable, takeUntil } from "rxjs";
import type { Message } from "../types";

export function takeUntilConnectionClosed(connection: Connection<Message>) {
	return (source) =>
		source.pipe(
			takeUntil(
				new Observable((subscriber) => {
					connection.messages$.subscribe({
						complete: () => subscriber.next(),
					});
				}),
			),
		);
}
