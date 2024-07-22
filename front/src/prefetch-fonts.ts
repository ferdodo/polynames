import "design-system";

export async function prefetchFonts() {
	const fontPrefetch = document.createElement("polynames-font-prefetch");

	const fontPrefetchContainer = document.querySelector(
		"#fonts-prefetch-container",
	);

	if (fontPrefetchContainer === null) {
		throw new Error("No font prefetch container found.");
	}

	fontPrefetchContainer.appendChild(fontPrefetch);
	await document.fonts.ready;
	fontPrefetchContainer.remove();
}
