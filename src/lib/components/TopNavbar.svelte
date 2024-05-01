<script lang="ts">
	import { addCourseModalState } from '$lib/stores/store';
</script>

<div class="fixed top-0 z-50 hidden h-20 w-screen bg-white shadow md:block">
	<nav class="relative flex h-full w-full items-center gap-16 px-3">
		<a
			href="/app"
			class="flex h-full w-[268px] items-center gap-2 border-r pr-2 text-xs xl:min-w-fit xl:text-sm"
		>
			<img src="/assets/PSG_LOGO.svg" alt="Personalized study guide logo" />
			<h5 class="font-lato font-bold text-primary-main_text-grey">Personalized Study Guide</h5>
		</a>
		<section class="flex h-full w-full items-center justify-between">
			<div class="flex items-center gap-1">
				<img
					src="/assets/Search Icon.svg"
					class="h-7"
					alt="a magnifying glass to illustrate searching"
				/>
				<input
					type="text"
					class="py-2 placeholder:font-lato placeholder:text-base placeholder:font-medium placeholder:text-[#656565] focus:outline-none lg:min-w-[25rem]
"
					placeholder="Start your search here..."
				/>
			</div>
			<div class="flex w-full max-w-fit gap-6">
				<button
					disabled
					class="flex items-center gap-2 font-lato text-sm font-bold text-primary-main_text-grey"
				>
					<img src="/assets/Play icon.svg" alt="play icon" />
					<span>Tutorial</span>
				</button>
				<button class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEEEEE]"
					><img class="" src="/assets/Bell icon.svg" alt="bell icon" /></button
				>
				<button
					on:click={() => addCourseModalState.set(true)}
					class="flex min-w-[150px] items-center gap-2 rounded-[25px] bg-primary-main-green px-4 font-lato text-sm font-bold text-primary-main_text-white"
				>
					<img src="/assets/Add course icon.svg" alt="add course" />
					<span>Add New Course</span>
				</button>
			</div>
		</section>
	</nav>
</div>
