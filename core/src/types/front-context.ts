import type { Connection } from "./connection";
import type { FrontStateStorage, Message } from ".";

export interface FrontContext {
	connection: Connection<Message>;
	frontStateStorage: FrontStateStorage;
}
