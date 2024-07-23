import { WebSocketServer } from "ws";
import { Observable, share } from "rxjs";
import type { Connection } from "connection-types";
import { validateMessage } from "core";
import { createServer } from "https";
import { readFileSync } from "fs";

export function startWebSocketServer<T>(): Observable<Connection<T>> {
	return new Observable<Connection<T>>((connexionSubscriber) => {
		const wss = createWebSocketServer();

		wss.on("connection", (ws) => {
			const messages$ = new Observable<T>((messageSubscriber) => {
				ws.on("message", function message(data) {
					if (data.toString() === "KEEP_ALIVE") {
						return;
					}

					let parsed;

					try {
						parsed = JSON.parse(data);
					} catch (parseErr) {
						ws.send(`ERROR: Failed to parse payload !`);
						return;
					}

					const [valid, errors] = validateMessage(parsed);

					if (valid) {
						messageSubscriber.next(parsed);
					} else {
						ws.send(`ERROR: ${errors}`);
					}
				});

				ws.on("close", () => {
					messageSubscriber.complete();
				});
			});

			const send = (payload: T) => {
				const serialized = JSON.stringify(payload);
				ws.send(serialized);
			};

			const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

			connexionSubscriber.next({
				messages$,
				send,
				id,
			});
		});
	}).pipe(share());
}

function createWebSocketServer() {
	let server;

	switch (process.env.VITE_WEBSOCKET_PROTOCOL) {
		case "ws":
			return new WebSocketServer({ port: 3000, path: "/ws" });
		case "wss":
			server = createServer({
				key: readFileSync("./certificates/privkey.pem"),
				cert: readFileSync("./certificates/fullchain.pem"),
			});

			server.listen(3000);

			return new WebSocketServer({ server, path: "/ws" });
		default:
			throw new Error("Invalid WS protocol !");
	}
}
