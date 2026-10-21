import type { Connection } from "../types/connection";
import { Subject } from "rxjs";
import type { Observable } from "rxjs";
import { filter } from "rxjs";
import type { Message } from "../types";
import { validateMessage } from "../utils";

export class ConnectionMockFactory {
	serverConnections = new Subject<Connection<Message>>();

	createServer(): Observable<Connection<Message>> {
		return this.serverConnections.asObservable();
	}

	createClient(): [Connection<Message>, () => void] {
		const _clientMessage$: Subject<Message> = new Subject();
		const _serverMessage$: Subject<Message> = new Subject();

		this.serverConnections.next({
			id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
			messages$: _serverMessage$.pipe(
				filter((message) => {
					const [valid, errors] = validateMessage(message);
					if (!valid) {
						console.error(errors);
					}
					return valid;
				}),
			),
			send(message: Message): void {
				_clientMessage$.next(message);
			},
		});

		return [
			{
				id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
				messages$: _clientMessage$.asObservable(),
				send(message: Message): void {
					_serverMessage$.next(message);
				},
			},
			(): void => _serverMessage$.complete(),
		];
	}
}
