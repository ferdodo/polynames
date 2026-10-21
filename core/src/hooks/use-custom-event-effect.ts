import { useEffect } from "preact/hooks";

export function useCustomEventEffect(
	eventName: string,
	ref: { current: HTMLElement | null },
	handler: (value: string) => void,
): void {
	useEffect(() => {
		const element = ref?.current;
		if (element) {
			const handleEvent = (event: CustomEvent): void => handler(event.detail);
			element.addEventListener(eventName, handleEvent);
			return () => element.removeEventListener(eventName, handleEvent);
		}
	}, [eventName, handler, ref]);
}
