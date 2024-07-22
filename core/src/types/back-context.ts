import type { Connection } from "connection-types";
import type { Observable } from "rxjs";
import type { Card, DataMapper, Message, PlayerRole, Round } from ".";

export interface BackContext {
	connections$: Observable<Connection<Message>>;
	signRole: (game: string, role: PlayerRole) => Promise<string>;
	hasInvalidRole: (
		game: string,
		role: PlayerRole,
		signature: string,
	) => Promise<boolean>;
	cardDataMapper: DataMapper<Card>;
	roundDataMapper: DataMapper<Round>;
}
