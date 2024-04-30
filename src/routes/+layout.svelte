<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { firebaseAuth } from '$lib/firebase';
	import { currentUser } from '$lib/stores/store';
	import '../app.pcss';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	let userLoaded = false;

	$: {
		if (browser && userLoaded) {
			if ($page.url.pathname.startsWith('/app') && $currentUser == null) {
				goto('/');
			}

			if ($page.url.pathname == '/' && $currentUser) {
				goto('/app');
			}
		}
	}

	onMount(async () => {
		await firebaseAuth.authStateReady();
		userLoaded = true;
		currentUser.set(firebaseAuth.currentUser);
	});
</script>

<Toaster richColors />
{#if userLoaded}
	<slot />
{:else}
	<div class="flex h-screen w-screen items-center justify-center">
		<iconify-icon icon="line-md:loading-twotone-loop" class="text-primary-main-yellow" width="35"
		></iconify-icon>
	</div>
{/if}
