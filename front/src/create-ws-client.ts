import { Observable, share } from "rxjs";
import { Connection } from "connection-types";

export async function createWsClient<T>(
	wsProtocol: string,
	wsPort: number,
	webDomain: string,
): Connection<T> {
	const showPort =
		(wsProtocol === "ws" && wsPort != 80) ||
		(wsProtocol === "wss" && wsPort != 443);

	const wsUrl = `${wsProtocol}://${webDomain}${showPort ? ":" + wsPort : ""}/ws`;
	const socket: WebSocket = new WebSocket(wsUrl);

	const waitDisconnected = new Promise((resolve) => {
		socket.onclose = () => resolve(undefined);
	});

	const waitConnected = new Promise((resolve, reject) => {
		socket.onopen = () => resolve(undefined);

		waitDisconnected.finally(reject);
	});

	const messages$ = new Observable<T>((subscriber) => {
		socket.onmessage = (event) => {
			if (event.data.startsWith("ERROR")) {
				console.error(`SERVER ${event.data}`);
				return;
			}

			const deserialized: T = JSON.parse(event.data);
			subscriber.next(deserialized);
		};

		waitDisconnected.finally(() => subscriber.complete());
	}).pipe(share());

	let keepAliveInteval;

	/**
	 * Prevent web servers or reverse proxy automatically close
	 * inactive sockets by keeping it active.
	 */
	waitConnected
		.then(() => {
			keepAliveInteval = setInterval(() => socket.send("KEEP_ALIVE"), 25000);
			return waitDisconnected;
		})
		.finally(() => clearInterval(keepAliveInteval));

	await waitConnected;

	return {
		id: Math.floor(Math.random() * Math.MAX_SAFE_INTEGER),
		messages$,
		async send(message: T) {
			await waitConnected;
			const serialized = JSON.stringify(message);
			socket.send(serialized);
		},
	};
}
