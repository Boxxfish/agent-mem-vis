<script lang="ts">
	import { onMount } from 'svelte';
	import type { EpisodeData } from './Episode';

	let gameWidth = 32;
	let gameHeight = 32;

	let on = false;
	export let frame = 0;
	let playHandle: undefined | number;
	export let episodeData: undefined | EpisodeData;
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
</script>

<div class="game-viewer">
	<canvas class="game-canvas" bind:this={canvas} width="{gameWidth}px" height="{gameHeight}px">
		Javascript must be enabled.
	</canvas>
	<input type="range" min="0" max={numFrames - 1} bind:value={frame} />
	<button on:click={playPressed} disabled={episodeData === undefined}>{on ? 'Pause' : 'Play'}</button>
</div>

<style>
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
