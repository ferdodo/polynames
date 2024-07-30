export function sanitizeInputValue(
	pattern: RegExp,
	maxLength: number,
	inputString: string,
): string {
	let filteredString = inputString;

	while (
		(filteredString.length > maxLength || !pattern.test(filteredString)) &&
		filteredString
	) {
		filteredString = filteredString.slice(0, -1);
	}

	return filteredString;
}
