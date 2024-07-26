import type { ConnectionMockFactory } from "../mocks";
import type { BackContext, Card } from "../types";

export interface TestContext {
	game?: string;
	apps: HTMLElement[];
	disconnectApps: (() => void)[];
	wordMasterApp?: HTMLElement;
	intuitionMasterApp?: HTMLElement;
	cards: Partial<Card>[];
	stopServer: () => void;
	backendContext: BackContext;
	connectionFactory: ConnectionMockFactory;
}
