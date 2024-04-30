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
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import CourseForm from '$lib/components/CourseForm.svelte';
	import { addCourseModalState, currentUser } from '$lib/stores/store';

	let loading = false;
	let open = false;

	$: open = $addCourseModalState;

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
			currentUser.set(firebaseAuth.currentUser);
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
			<SideNavbar bind:open={sideNavState} />
			<MobileNav />
			<div
				class="no-scrollbar {sideNavState
					? 'md:ml-60'
					: 'md:ml-28'} min-h-screen w-full overflow-y-scroll bg-secondary-background pb-28 transition-all md:pb-0"
			>
				<section class=""></section>
				<slot />
			</div>
		</section>
	</div>
	<Dialog.Root onOpenChange={(e) => addCourseModalState.set(e)} bind:open>
		<Dialog.Trigger asChild let:builder>
			<!-- <Button variant="outline" builders={[builder]}>Add Course</Button> -->
		</Dialog.Trigger>
		<div class="">
			<Dialog.Content
				class="no-scrollbar  max-h-[500px] overflow-y-scroll border-0 border-t-4 border-primary-main-yellow bg-white px-0 py-0 pb-5 sm:max-w-[425px] "
			>
				<Dialog.Header class="sticky top-0 z-10  bg-white p-3 shadow lg:p-5">
					<Dialog.Title>Add Course</Dialog.Title>
					<Dialog.Description>
						Enter your course details. Click save when you're done.
					</Dialog.Description>
				</Dialog.Header>
				<CourseForm
					on:loading={() => (loading = true)}
					on:stopped={() => (loading = false)}
					className="grid items-start gap-5 px-6"
				/>
			</Dialog.Content>
		</div>
	</Dialog.Root>
{:else}
	<div class="flex h-screen w-screen items-center justify-center">
		<iconify-icon icon="line-md:loading-twotone-loop" class="text-primary-main-yellow" width="35"
		></iconify-icon>
	</div>
{/if}

{#if loading}
	<Loader />
{/if}
