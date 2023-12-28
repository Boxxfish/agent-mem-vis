<script lang="ts">
	import { onMount } from 'svelte';

	let gameWidth = 32;
	let gameHeight = 32;

	let on = false;
	let frame = 0;
	let playHandle: undefined | number;
	let episodeData: undefined | EpisodeData;
	let canvas: undefined | HTMLCanvasElement;
	$: ctx = canvas?.getContext('2d');
	$: imgDatas = episodeData?.visuals.map((frameData) => {
		let pixels = new Uint8ClampedArray(frameData);
		return new ImageData(pixels, gameWidth, gameHeight);
	});
	$: numFrames = episodeData ? episodeData.visuals.length : 0;
	$: {
		if (imgDatas) {
			ctx?.putImageData(imgDatas[frame], 0, 0);
		}
	}

	interface EpisodeData {
		visuals: number[];
	}

	const playPressed = () => {
		on = !on;
		if (on) {
			if (frame == numFrames - 1) {
				frame = 0;
			}

			playHandle = setInterval(() => {
				frame += 1;

				if (frame == numFrames - 1) {
					on = false;
					clearInterval(playHandle);
					playHandle = undefined;
				}
			}, 100);
		} else {
			clearInterval(playHandle);
			playHandle = undefined;
		}
	};

	onMount(() => {
		fetch('./data/mf_base/episodes/0.json')
			.then((data) => data.json())
			.then((data) => (episodeData = data));
	});
</script>

<svelte:head>
	<title>Agent Memory Visualizer</title>
</svelte:head>

<div class="game-viewer">
	<canvas class="game-canvas" bind:this={canvas} width="{gameWidth}px" height="{gameHeight}px">
		Javascript must be enabled.
	</canvas>
	<input type="range" min="0" max={numFrames - 1} bind:value={frame} />
</div>
<button on:click={playPressed}>{on ? 'Pause' : 'Play'}</button>

<style>
	:global(html) {
		font-size: 62.5%;
	}

	.game-viewer {
		display: flex;
		flex-direction: column;
		width: 40rem;
	}
	.game-canvas {
		background-color: gray;
		image-rendering: pixelated;
	}
</style>
