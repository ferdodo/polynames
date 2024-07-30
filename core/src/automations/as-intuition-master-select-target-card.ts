import { fireEvent, within } from "@testing-library/preact";
import type { TestContext } from "../types";
import { CardKind } from "../types";

export async function asIntuitionMasterSelectTargetCard(
	context: TestContext,
	word?: string,
) {
	const { intuitionMasterApp, cards } = context;

	const targetCard = cards.find((card) => {
		if (word) {
			return card.word === word && card.kind === CardKind.Target;
		}
		return card.kind === CardKind.Target;
	});

	const target = within(intuitionMasterApp).getByText(targetCard?.word);
	fireEvent.click(target);
}
