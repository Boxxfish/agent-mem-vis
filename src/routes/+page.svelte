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
	<div class="game-viewers">
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
		<GameViewer {episodeData} bind:frame />
		<GameViewer episodeData={matchEpisodeData} />
	</div>
	<div class="divider" />
	<div class="matches">
		{#if episodeData && episodeData.matches}
			<ol>
				{#each episodeData.matches[frame] as match, i}
					<li>
						{match.score.toFixed(2)}
						<button on:click={() => (matchEpisodeData = episodeDatas.get(match.episode))}
							>Play</button
						>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</div>

<style>
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
</style>
