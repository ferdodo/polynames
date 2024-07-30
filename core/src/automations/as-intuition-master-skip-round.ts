import { fireEvent, within } from "@testing-library/preact";
import type { TestContext } from "../types";

export async function asIntuitionMasterSkipRound(context: TestContext) {
	const { intuitionMasterApp } = context;
	const skipButton =
		await within(intuitionMasterApp).findByText("Passer le tour");
	fireEvent.click(skipButton);
}
