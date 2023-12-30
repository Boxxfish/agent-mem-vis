<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import GameViewer from './GameViewer.svelte';
	import type { EpisodeData } from './Episode';

	interface Index {
		episodes: string[];
	}

	let index: undefined | Index;
	let frame = 0;
	let episodeName: undefined | string = undefined;
	let episodeDatas: Map<string, EpisodeData> = new Map();
	$: episodeData = episodeName !== undefined ? episodeDatas.get(episodeName) : undefined;
	let matchEpisodeData: undefined | EpisodeData;
	let matchFrame = 0;
	let matchIdx = 0;
	$: selectedMatch = episodeData?.matches[frame][matchIdx];
	$: matchEpisodeData = selectedMatch ? episodeDatas.get(selectedMatch.episode) : undefined;
	$: matchFrame = selectedMatch ? selectedMatch?.start : 0;

	onMount(async () => {
		index = await fetch('./data/mf_base/index.json').then((data) => data.json());
		if (index) {
			for (const episodeName of index.episodes) {
				const episodeData = await fetch(`./data/mf_base/episodes/${episodeName}.json`).then(
					(data) => data.json()
				);
				episodeDatas.set(episodeName, episodeData);
			}
			episodeName = index.episodes[0];
		}
	});
</script>

<svelte:head>
	<title>Agent Memory Visualizer</title>
</svelte:head>

<div class="main-wrapper">
	<div class="episode-selector">
		<label for="episodeSelect">Episode:</label>
		<select name="episodeSelect" bind:value={episodeName}>
			{#if index}
				{#each index.episodes as episodeName}
					<option value={episodeName}>{episodeName}</option>
				{/each}
			{/if}
		</select>
	</div>
	<div class="game-viewers">
		<div class="game-wrapper">
			<h3>Current Episode</h3>
			<GameViewer {episodeData} bind:frame />
		</div>
		<div class="game-wrapper">
			<h3>Retrieved Episode</h3>
			<GameViewer episodeData={matchEpisodeData} bind:frame={matchFrame} />
		</div>
	</div>
	<div class="divider" />
	<div class="matches">
		<h3>Best Matches</h3>
		{#if episodeData && episodeData.matches}
			<ol>
				{#each episodeData.matches[frame] as match, i}
					<li>
						<div class="match-listing {i == matchIdx ? 'selected' : ''}">
							<button
								on:click={() => {
									matchIdx = i;
								}}
								disabled={i == matchIdx}>View</button
							>
							<span/>
							<span>Score: {match.score.toFixed(2)}</span> <span>Episode {match.episode}</span>
							<span>Frame: {match.start}</span>
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '../global.scss';

	.main-wrapper {
		display: flex;
		flex-direction: row;
	}

	.game-viewers {
		display: flex;
		flex-direction: row;
		padding: 4rem;
		position: static;
	}

	.divider {
		background-color: black;
		width: 0.1rem;
	}

	.matches {
		display: flex;
		flex-direction: column;
		padding: 4rem;
		width: 100%;
	}

	.episode-selector {
		display: block;
	}

	.game-wrapper {
		margin: 0rem 1rem;
	}

	.match-listing {
		display: grid;
		width: 100%;
		background-color: #efefef;
		grid-template-columns: max-content 2rem 10rem 10rem 10rem;
		padding: 1rem;
		margin: 0.1rem;

		&.selected {
			background-color: #b7b7b7;
		}
	}
</style>
