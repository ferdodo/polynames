import { uid } from "uid";
import type { Card } from "../types";
import { CardKind } from "../types/card-kind";

const frenchWordList = [
	"âne",
	"appartement",
	"arbre",
	"autoroute",
	"avion",
	"avocat",
	"banane",
	"bateau",
	"bureau",
	"bus",
	"camion",
	"canard",
	"chat",
	"château",
	"cheval",
	"chien",
	"cochon",
	"continent",
	"drapeau",
	"école",
	"éléphant",
	"étoile",
	"fleur",
	"forêt",
	"girafe",
	"hélicoptère",
	"hôtel",
	"île",
	"immeuble",
	"infirmier",
	"jardin",
	"juge",
	"koala",
	"lac",
	"lampe",
	"lapin",
	"magasin",
	"maison",
	"marché",
	"médecin",
	"mer",
	"montagne",
	"moto",
	"mouton",
	"nuage",
	"océan",
	"œil",
	"œuf",
	"oie",
	"oiseau",
	"orange",
	"palais",
	"parc",
	"pays",
	"plage",
	"poire",
	"poisson",
	"policier",
	"pomme",
	"pompier",
	"poule",
	"président",
	"prince",
	"princesse",
	"professeur",
	"quai",
	"reine",
	"renard",
	"restaurant",
	"rivière",
	"roi",
	"route",
	"rue",
	"soleil",
	"souris",
	"supermarché",
	"téléphérique",
	"tortue",
	"train",
	"tramway",
	"trottinette",
	"uniforme",
	"université",
	"usine",
	"vache",
	"vélo",
	"village",
	"ville",
	"voiture",
	"volcan",
	"wagon",
	"xylophone",
	"yaourt",
	"zèbre",
];

export class CardFactory {
	game: string;

	constructor(game: string) {
		this.game = game;
	}

	*[Symbol.iterator](): Iterator<Card> {
		const pickedWords = new Set<string>();

		while (pickedWords.size < 25) {
			const index = Math.floor(Math.random() * frenchWordList.length);
			const word = frenchWordList[index];
			pickedWords.add(word);
		}

		for (const [i, word] of [...pickedWords].entries()) {
			const kind =
				i < 8
					? CardKind.Target
					: i === 24
						? CardKind.Eliminatory
						: CardKind.Neutral;

			yield { id: uid(), game: this.game, word, kind };
		}
	}
}
