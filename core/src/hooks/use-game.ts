import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { observeGame } from "../api";
import { appContext } from "../app-context";
import type { BroadcastGame } from "../types";

export function useGame() {
	const context = useContext(appContext);
	const game$ = useMemo(() => observeGame(context), [context]);

	const [game, setGame] = useState<BroadcastGame>({
		cards: [],
		rounds: [],
	});

	const subscription = game$.subscribe(setGame);

	useEffect(() => {
		return () => {
			subscription.unsubscribe();
		};
	}, [subscription]);

	return game;
}
