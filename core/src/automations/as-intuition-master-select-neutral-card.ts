import { fireEvent, within } from "@testing-library/preact";
import type { TestContext } from "../types";
import { CardKind } from "../types";

export async function asIntuitionMasterSelectNeutralCard(context: TestContext) {
	const { intuitionMasterApp, cards } = context;
	const targetCard = cards.find((card) => card.kind === CardKind.Neutral);
	const target = within(intuitionMasterApp).getByText(targetCard?.word);
	fireEvent.click(target);
}
