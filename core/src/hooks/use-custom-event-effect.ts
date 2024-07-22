import { useEffect } from "preact/hooks";

export function useCustomEventEffect(eventName, ref, handler) {
	useEffect(() => {
		const element = ref?.current;
		if (element) {
			const handleEvent = (event) => handler(event.detail);
			element.addEventListener(eventName, handleEvent);
			return () => element.removeEventListener(eventName, handleEvent);
		}
	}, [eventName, handler, ref]);
}
