<script lang="ts">
	import { firebaseAuth } from '$lib/firebase';
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	import { addCourseModalState } from '$lib/stores/store';
	import CourseForm from '$lib/components/CourseForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Loader from '$lib/components/Loader.svelte';

	let open = false;

	$: open = $addCourseModalState;

	const isDesktop = mediaQuery('(min-width: 768px)');

	let loading = false;
</script>

<svelte:head>
	<title>All Courses - PSG AI</title>
</svelte:head>
<div class="h-full w-full px-8 py-10">
	<section>
		<h1 class="mb-5 font-lato text-[32px] text-primary-main_text-grey">All Courses</h1>

		<div class=" flex items-center gap-5">
			<button
				class="min-w-24 rounded-[20px] bg-secondary-supporting-pale-blue px-3 py-1 shadow shadow-[#66666621]"
				>All</button
			>
			<button class="min-w-24 rounded-[20px] border-2 border-primary-grey px-3 py-1"
				>Archived</button
			>
		</div>
	</section>

	<section class="flex h-[80%] w-full items-center justify-center">
		<div class="flex flex-col items-center text-primary-main-blue">
			<iconify-icon width="70" icon="game-icons:bookshelf"></iconify-icon>
			<h3 class="text-center font-lato text-2xl font-bold text-primary-grey">
				Your course library is empty. <br /> Let's fill it up!
				<button
					on:click={() => addCourseModalState.set(true)}
					class="text-primary-main-green transition-all hover:underline"
				>
					Create a course
				</button> now.
			</h3>
		</div>
	</section>
</div>
<button on:click={() => firebaseAuth.signOut()}> Sign out </button>

{#if $isDesktop}
	<Dialog.Root onOpenChange={(e) => addCourseModalState.set(e)} bind:open>
		<Dialog.Trigger asChild let:builder>
			<!-- <Button variant="outline" builders={[builder]}>Add Course</Button> -->
		</Dialog.Trigger>
		<Dialog.Content
			class="no-scrollbar max-h-[500px] overflow-y-scroll border-0 border-t-4 border-primary-main-yellow bg-white px-0 py-0 pb-5 sm:max-w-[425px]"
		>
			<Dialog.Header class="sticky top-0 z-10 w-full bg-white p-5 shadow">
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
	</Dialog.Root>
{:else}
	<Drawer.Root onClose={() => addCourseModalState.set(false)} bind:open>
		<Drawer.Trigger asChild let:builder>
			<!-- <Button variant="outline" builders={[builder]}>Edit Profile</Button> -->
		</Drawer.Trigger>
		<Drawer.Content class="bg-white pb-2">
			<Drawer.Header class="py-5 text-left">
				<Drawer.Title>Add Course</Drawer.Title>
				<Drawer.Description>
					Enter your course details. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<section class="no-scrollbar h-full max-h-[80vh] overflow-y-scroll">
				<CourseForm
					on:loading={() => (loading = true)}
					on:stopped={() => (loading = false)}
					className="mb-3 grid items-start gap-5 px-4 py-5"
				/>
			</section>
		</Drawer.Content>
	</Drawer.Root>
{/if}

{#if loading}
	<Loader />
{/if}
