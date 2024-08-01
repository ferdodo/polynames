import type { Emote, PlayerRole } from ".";

export interface EmitEmote {
	role: PlayerRole;
	game: string;
	signature: string;
	emote: Emote;
}
