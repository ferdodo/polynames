export function generateLetters() {
	return [...Array(10)]
		.map(() => String.fromCharCode(97 + Math.random() * 26))
		.join("");
}
