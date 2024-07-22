import type { Connection } from "connection-types";
import type { Observable } from "rxjs";
import { createDataMapperMock } from ".";
import type { BackContext, Card, Message, Round } from "../types";

export function createBackContextMock(
	connections$: Observable<Connection<Message>>,
): BackContext {
	const cardDataMapper = createDataMapperMock<Card, Card>({});
	const roundDataMapper = createDataMapperMock<Round, Card>({
		cards: cardDataMapper,
	});

	return {
		connections$,
		signRole() {
			const fakeSignature = "66616b65207324696746e643214374757265";
			return Promise.resolve(fakeSignature);
		},
		hasInvalidRole() {
			return Promise.resolve(false);
		},
		cardDataMapper,
		roundDataMapper,
	};
}
