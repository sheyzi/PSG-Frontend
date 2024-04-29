<script lang="ts">
	import { firebaseAuth } from '$lib/firebase';
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
			<button class="border-primary-grey min-w-24 rounded-[20px] border-2 px-3 py-1"
				>Archived</button
			>
		</div>
	</section>

	<section class="flex h-[80%] w-full items-center justify-center">
		<div class="flex flex-col items-center text-primary-main-blue">
			<iconify-icon width="70" icon="game-icons:bookshelf"></iconify-icon>
			<h3 class="text-primary-grey text-center font-lato text-2xl font-bold">
				Your course library is empty. <br /> Let's fill it up!
				<button class="text-primary-main-green transition-all hover:underline">
					Create a course
				</button> now.
			</h3>
		</div>
	</section>
</div>
<!-- <button on:click={() => firebaseAuth.signOut()}> Sign out </button> -->
