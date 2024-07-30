import { html } from "htm/preact";

import {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "preact/hooks";

import { joinGame } from "../api";
import { appContext } from "../app-context";
import { useCustomEventEffect, useFrontState } from "../hooks";
import { gameSchema } from "../types";
import { sanitizeInputValue } from "../utils";

export function Lobby() {
	const context = useContext(appContext);
	const { signature, game } = useFrontState();
	const joinInput = useRef(null);
	const [sentJoinGame, setSentJoinGame] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [messages, setMessages] = useState(generateWaitingMessages());
	const [waitingText, setText] = useState("Attente de l'autre joueur...");
	const [errorText, setErrorText] = useState("");

	function setGame(value) {
		const game = sanitizeInputValue(
			new RegExp(gameSchema.pattern, "u"),
			gameSchema.maxLength,
			value,
		);

		context.frontStateStorage.save({ game });
		joinInput.current.setAttribute("passvalue", game);
	}

	useEffect(() => {
		if (sentJoinGame) {
			const interval = setInterval(() => {
				setCurrentIndex((prevIndex) => prevIndex + 1);

				if (currentIndex >= messages.length - 1) {
					setCurrentIndex(0);
					setMessages(generateWaitingMessages());
				}

				setText(messages[currentIndex]);
			}, 6000);

			return () => clearInterval(interval);
		}
	}, [currentIndex, sentJoinGame, messages]);

	const handleClickJoinGame = useCallback(async () => {
		setSentJoinGame(true);
		const response = await joinGame(context, game);

		if (response.success) {
			const { signature, role } = response.success;
			context.frontStateStorage.save({ signature, role });
		} else if (response.error?.gameFull) {
			setErrorText("La partie est pleine.");
		}
	}, [context, game]);

	useCustomEventEffect("polynamesinput", joinInput, setGame);
	useCustomEventEffect("polynamesclickbutton", joinInput, handleClickJoinGame);

	if (signature) {
		return html`<span></span>`;
	}

	if (errorText) {
		return html`
			<polynames-instruction key=${errorText}> <span>${errorText}</span> </polynames-instruction>
		`;
	}

	if (sentJoinGame) {
		return html`
			<polynames-instruction>
				<span>${waitingText}</span>
			</polynames-instruction>

			<div style="display: grid; place-content: center;">
				<svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
					<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
						<circle cx="22" cy="22" r="6" stroke-opacity="0">
							<animate attributeName="r"
								begin="1.5s" dur="3s"
								values="6;22"
								calcMode="linear"
								repeatCount="indefinite" />
							<animate attributeName="stroke-opacity"
								begin="1.5s" dur="3s"
								values="1;0" calcMode="linear"
								repeatCount="indefinite" />
							<animate attributeName="stroke-width"
								begin="1.5s" dur="3s"
								values="2;0" calcMode="linear"
								repeatCount="indefinite" />
						</circle>
						<circle cx="22" cy="22" r="6" stroke-opacity="0">
							<animate attributeName="r"
								begin="3s" dur="3s"
								values="6;22"
								calcMode="linear"
								repeatCount="indefinite" />
							<animate attributeName="stroke-opacity"
								begin="3s" dur="3s"
								values="1;0" calcMode="linear"
								repeatCount="indefinite" />
							<animate attributeName="stroke-width"
								begin="3s" dur="3s"
								values="2;0" calcMode="linear"
								repeatCount="indefinite" />
						</circle>
						<circle cx="22" cy="22" r="8">
							<animate attributeName="r"
								begin="0s" dur="1.5s"
								values="6;1;2;3;4;5;6"
								calcMode="linear"
								repeatCount="indefinite" />
						</circle>
					</g>
				</svg>
			</div>
		`;
	}

	return html`
        <div style="display: none;">
            <input
                type="text"
                value=${game}
				placeholder="Game ID"
                onInput=${(event) => setGame(event.target.value)}
            />

            <button onClick=${handleClickJoinGame}>Join</button>
        </div>

		<div style="display: grid; place-content: center;">
			<polynames-join-input ref=${joinInput}></polynames-join-input>
		</div>
    `;
}

function generateWaitingMessages(): string[] {
	return [
		"Attente de l'autre joueur...",
		"Il arrivera certainement bientôt...",
		...[
			[
				"Peut-être qu'il est coincé dans un ascenseur...",
				"Ou alors il a perdu son téléphone...",
				"Ou bien il a perdu son téléphone dans un ascenseur...",
			],
			[
				"C'est cool Polynames non ?",
				"Rien a voir avec l'autre jeu...",
				"Toute ressemblance avec un jeu existant serait purement fortuite.",
				"(͡ ° ͜ʖ ͡ °)",
			],
		]
			.sort(() => Math.random() - 0.5)
			.flat(),
		...[
			[
				"Vous aimez les jeux de mots ?",
				"Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ?",
				"Parce que sinon ils tombent dans le bateau !",
				"Vous avez compris ?",
			],
			[
				"Pfiou, Je suis à court d'idées...",
				"Je vais vous laisser réfléchir à votre propre blague.",
				"Je suis sûr que vous êtes très drôle.",
				"Je vous fais confiance.",
			],
		]
			.sort(() => Math.random() - 0.5)
			.flat(),
		...[
			[
				"Vous êtes toujours là ?",
				"Vous êtes vraiment patient...",
				"Ou alors c'est juste que vous aimez m'entendre parler...",
				"Je vous comprends.",
			],
			[
				"Vous êtes une belle personne.",
				"Pardon, c'était un peu direct...",
				"*Silence gênant*",
			],
		]
			.sort(() => Math.random() - 0.5)
			.flat(),
		"On risque de se répéter au bout d'un moment...",
	];
}
