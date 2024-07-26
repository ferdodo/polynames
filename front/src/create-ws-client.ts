import { Observable, share } from "rxjs";
import { Connection } from "connection-types";

async function _createWsClient<T>(
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
		const timeout = setTimeout(() => {
			reject(new Error("Connection timeout !"));
			socket.close();
		}, 1000);

		socket.onopen = () => {
			clearTimeout(timeout);
			resolve(undefined);
		};
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

function retryStrategy(fn) {
	let count = 0;

	return async function retry(...args) {
		for (let i = 0; i < 30; i++) {
			try {
				return await fn(...args);
			} catch (error) {
				console.error(`Retry ${count++}: ${error.message}`);
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	};
}

export const createWsClient = retryStrategy(_createWsClient);
