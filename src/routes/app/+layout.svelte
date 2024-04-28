<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase';
	import { onMount } from 'svelte';

	let page_loaded = false;

	const isLoggedIn = async () => {
		if (!firebaseAuth.currentUser) {
			await goto('/');
		}
	};

	onMount(async () => {
		isLoggedIn().then(() => {
			page_loaded = true;
		});
	});
</script>

{#if page_loaded}
	<button on:click={() => firebaseAuth.signOut()}> Sign out </button>
{:else}
	<div class="flex h-screen w-screen items-center justify-center">
		<iconify-icon icon="line-md:loading-twotone-loop" class="text-primary-main-yellow" width="35"
		></iconify-icon>
	</div>
{/if}
