export interface EpisodeData {
	visuals: number[];
	matches: Match[][];
}

export interface Match {
	episode: string;
	score: number;
	start: number;
}