import { useObservableState } from "preact-observable-hooks/dist/use-observable-state";
import { useContext } from "preact/hooks";
import { appContext } from "../app-context";
import type { FrontState } from "../types";

export function useFrontState(): FrontState {
	const context = useContext(appContext);

	return useObservableState(
		context.frontStateStorage.observe(),
		context.frontStateStorage.read,
	);
}
