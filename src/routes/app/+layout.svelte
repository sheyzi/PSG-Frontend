<script lang="ts">
	import { goto } from '$app/navigation';
	import MobileNav from '$lib/components/MobileNav.svelte';
	import SideNavbar from '$lib/components/SideNavbar.svelte';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import { firebaseAuth } from '$lib/firebase';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';

	let currentUser: User | null;
	let page_loaded = false;
	let sideNavState = true;

	const isLoggedIn = async () => {
		if (!firebaseAuth.currentUser) {
			await goto('/');
		}
	};

	onMount(async () => {
		isLoggedIn().then(() => {
			page_loaded = true;
			currentUser = firebaseAuth.currentUser;
		});
	});
</script>

{#if $navigating}
	<Loader />
{/if}

{#if page_loaded}
	<div class="relative flex flex-col bg-background">
		<TopNavbar />
		<section class="flex">
			<SideNavbar
				on:close={() => (sideNavState = false)}
				on:open={() => (sideNavState = true)}
				{currentUser}
			/>
			<MobileNav />
			<div
				class="no-scrollbar {sideNavState
					? 'lg:ml-64'
					: 'lg:ml-32'} max-h-screen w-screen overflow-y-scroll bg-secondary-background transition-all"
			>
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
