<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import GameViewer from './GameViewer.svelte';
	import type { EpisodeData } from './Episode';

	interface Index {
		episodes: string[];
	}

	let index: undefined | Index;
	let episodeName: undefined | string = undefined;
	let episodeDatas: Map<string, EpisodeData> = new Map();
	$: episodeData = episodeName !== undefined ? episodeDatas.get(episodeName) : undefined;

	onMount(async () => {
		index = await fetch('./data/mf_base/index.json').then((data) => data.json());
		if (index) {
			for (const episodeName of index.episodes) {
				const episodeData = await fetch(
					`./data/mf_base/episodes/${episodeName}.json`
				).then((data) => data.json());
				episodeDatas.set(episodeName, episodeData);
			}
			episodeName = index.episodes[0];
		}
	});
</script>

<svelte:head>
	<title>Agent Memory Visualizer</title>
</svelte:head>

<label for="episodeSelect">Episode:</label>
<select name="episodeSelect" bind:value={episodeName}>
	{#if index}
		{#each index.episodes as episodeName}
			<option value={episodeName}>{episodeName}</option>
		{/each}
	{/if}
</select>
<GameViewer {episodeData} />

<style>
	@import '../global.scss';
</style>
