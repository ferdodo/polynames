export function createTemplate(html: Element | Element[]): HTMLTemplateElement {
	const htmlElements = Array.isArray(html) ? html : [html];
	const template = document.createElement("template");
	template.innerHTML = htmlElements.map((o) => o.outerHTML).join("");
	return template;
}
