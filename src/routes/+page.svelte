<script lang="ts">
	import { onMount } from 'svelte';
	import GameViewer from './GameViewer.svelte';
	import type { EpisodeData } from './Episode';

	let episodeData: undefined | EpisodeData;

	onMount(() => {
		fetch('./data/mf_base/episodes/0.json')
			.then((data) => data.json())
			.then((data) => (episodeData = data));
	});
</script>

<svelte:head>
	<title>Agent Memory Visualizer</title>
</svelte:head>

<GameViewer episodeData={episodeData}/>

<style>
	@import "../global.css";
</style>
