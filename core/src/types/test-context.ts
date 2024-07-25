import type { Card } from "../types";

export interface TestContext {
	wordMasterApp: HTMLElement;
	intuitionMasterApp: HTMLElement;
	cards: Partial<Card>[];
	stopServer: () => void;
}
