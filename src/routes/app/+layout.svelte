<script lang="ts">
	import { goto } from '$app/navigation';
	import SideNavbar from '$lib/components/SideNavbar.svelte';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';

	let page_loaded = false;

	const isLoggedIn = async () => {
		if (!firebaseAuth.currentUser) {
			await goto('/');
		}
	};
	let currentUser: User | null;

	onMount(async () => {
		isLoggedIn().then(() => {
			page_loaded = true;
			currentUser = firebaseAuth.currentUser;
		});
	});
</script>

{#if page_loaded}
	<div class="flex flex-col bg-background">
		<TopNavbar />
		<section class="flex">
			<SideNavbar {currentUser} />
			<div class="bg-secondary-background ml-9 w-screen">
				<slot />
			</div>
		</section>
	</div>
{:else}
	<div class="flex h-screen w-screen items-center justify-center">
		<iconify-icon icon="line-md:loading-twotone-loop" class="text-primary-main-yellow" width="35"
		></iconify-icon>
	</div>
{/if}
