import type { Connection } from "connection-types";
import type { FrontStateStorage, Message } from ".";

export interface FrontContext {
	connection: Connection<Message>;
	frontStateStorage: FrontStateStorage;
}
