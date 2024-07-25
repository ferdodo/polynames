import { within } from "@testing-library/preact";
import { withWordMasterTurn } from ".";
import { asWordMasterGiveHint } from "../automations";
import type { TestContext } from "../types";
import { generateLetters } from "../utils";

export async function withIntuitionMasterTurn(
	hint = generateLetters(),
	count = Math.ceil(Math.random() * 10),
): Promise<TestContext> {
	const context = await withWordMasterTurn();
	const { intuitionMasterApp } = context;
	await asWordMasterGiveHint(context, hint, count);

	await within(intuitionMasterApp).findByText(
		`Devinez les cartes ! Indice: ${hint}.`,
	);

	return context;
}
