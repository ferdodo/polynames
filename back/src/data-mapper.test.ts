import { describe, expect, it } from "vitest";
import { CardKind } from "core";
import { createTransaction } from "./create-transaction";
import { createSql } from "./sql";
import { createCard } from "./factories/create-card";
import { createRound } from "./factories/create-round";
import { withTestingDataMappers } from "./fixtures/with-testing-data-mappers";

describe("data mappers on sqlite", () => {
	it("creates and reads a card", async () => {
		const { cardDataMapper } = await withTestingDataMappers();
		const card = createCard();

		await cardDataMapper.create(card);

		expect(await cardDataMapper.read({ game: card.game })).toEqual([card]);
	});

	it("updates a card", async () => {
		const { cardDataMapper } = await withTestingDataMappers();
		const card = createCard();

		await cardDataMapper.create(card);
		await cardDataMapper.update({ id: card.id }, { kind: CardKind.Neutral });

		expect(await cardDataMapper.read({ id: card.id })).toEqual([
			{ ...card, kind: CardKind.Neutral },
		]);
	});

	it("destroys a card", async () => {
		const { cardDataMapper } = await withTestingDataMappers();
		const card = createCard();

		await cardDataMapper.create(card);
		await cardDataMapper.destroy({ id: card.id });

		expect(await cardDataMapper.read({ game: card.game })).toEqual([]);
	});

	it("creates a round with its cards and reads them back", async () => {
		const { cardDataMapper, roundDataMapper } = await withTestingDataMappers();
		const card = createCard();
		const round = createRound();

		await cardDataMapper.create(card);
		await roundDataMapper.create({ ...round, cards: [card] });

		expect(await roundDataMapper.read({ game: round.game })).toEqual([
			{ ...round, cards: [card] },
		]);
	});

	it("stores the skip flag as a boolean", async () => {
		const { roundDataMapper } = await withTestingDataMappers();
		const round = createRound();

		await roundDataMapper.create(round);
		await roundDataMapper.update({ id: round.id }, { skip: true });

		const [stored] = await roundDataMapper.read({ id: round.id });

		expect(stored.skip).toBe(true);
	});

	it("keeps a committed transaction", async () => {
		const { db } = await withTestingDataMappers();
		const card = createCard();
		const { sql, commit } = await createTransaction(db);

		await sql`INSERT INTO cards (id, game, word, kind) VALUES (${card.id}, ${card.game}, ${card.word}, ${card.kind})`;
		await commit();

		expect(await createSql(db)`SELECT id FROM cards`).toEqual([{ id: card.id }]);
	});

	it("rolls back a transaction", async () => {
		const { db } = await withTestingDataMappers();
		const card = createCard();
		const { sql, rollback } = await createTransaction(db);

		await sql`INSERT INTO cards (id, game, word, kind) VALUES (${card.id}, ${card.game}, ${card.word}, ${card.kind})`;
		await rollback();

		expect(await createSql(db)`SELECT id FROM cards`).toEqual([]);
	});
});
