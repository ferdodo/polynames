import type { FrontContext } from "core";
import { mountApp, createFrontStateStorage, unmountApp } from "core";
import { lastValueFrom } from "rxjs";
import { createWsClient } from "./create-ws-client";
import { prefetchFonts } from "./prefetch-fonts";
import "design-system";

async function main() {
	const createConnection = (timeout?: number) =>
		createWsClient(
			import.meta.env.VITE_WEBSOCKET_PROTOCOL,
			7822,
			import.meta.env.VITE_BACK_DOMAIN,
			timeout,
		);

	const [connection] = await Promise.all([
		createConnection().catch(() => {
			return createConnection(5000); // retry once
		}),
		prefetchFonts(),
	]);

	const frontStateStorage = createFrontStateStorage();
	const frontContext: FrontContext = { connection, frontStateStorage };

	const appContainer = document.querySelector("#app-container");

	if (!appContainer) {
		throw new Error("No app container found !");
	}

	const loaderContainer =
		document.querySelector<HTMLElement>("#loader-container");

	if (!loaderContainer) {
		throw new Error("No loading container found !");
	}

	mountApp(appContainer, frontContext);

	loaderContainer.style.opacity = "0";

	setTimeout(() => {
		loaderContainer.remove();
	}, 600);

	await lastValueFrom(frontContext.connection.messages$, {
		defaultValue: undefined,
	});

	unmountApp(document.body);
	document.body.innerHTML = "<span>Connexion fermée.</span>";
}

main().catch((cause) => {
	document.body.innerHTML = "<span>Une erreur est survenue !</span>";
	console.error(new Error("Error occured !", { cause }));
});
