import { fireEvent, within } from "@testing-library/preact";
import type { TestContext } from "../types";

export async function asWordMasterGiveHint(
	context: TestContext,
	hint: string,
	count: number,
) {
	const { wordMasterApp } = context;

	const hintPrompt =
		await within(wordMasterApp).findByPlaceholderText("Entrez un indice");
	const hintCount =
		await within(wordMasterApp).findByPlaceholderText("Nombre de mots");
	const sendHint =
		await within(wordMasterApp).findByLabelText("Envoyer l'indice");

	fireEvent.input(hintPrompt, { target: { value: hint } });
	fireEvent.input(hintCount, { target: { value: `${count}` } });
	fireEvent.click(sendHint);
}
