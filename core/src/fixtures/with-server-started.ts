import { ConnectionMockFactory, createBackContextMock } from "../mocks";
import type { BackContext, TestContext } from "../types";
import { startServer } from "../utils";

export async function withServerStarted(): Promise<TestContext> {
	const connectionFactory = new ConnectionMockFactory();
	const serverConnections$ = connectionFactory.createServer();
	const backendContext: BackContext = createBackContextMock(serverConnections$);
	const stopServer = startServer(backendContext);

	return {
		apps: [],
		stopServer,
		cards: [],
		disconnectApps: [],
		backendContext,
		connectionFactory,
	};
}
