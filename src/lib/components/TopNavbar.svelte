<script lang="ts">
	import { QuizModalState } from '$lib/stores/quiz.store';
	import { addCourseModalState } from '$lib/stores/store';
	import { page } from '$app/stores';
</script>

<div class="fixed top-0 z-50 hidden h-20 w-screen items-center bg-white shadow md:flex">
	<nav class="relative mx-auto flex h-full w-full max-w-7xl items-center gap-16 px-3">
		<a
			href="/app"
			class=" flex h-full min-w-fit items-center gap-2 pr-2 text-xs lg:w-[268px] xl:min-w-fit xl:text-sm"
		>
			<img src="/assets/PSG_LOGO.svg" alt="Personalized study guide logo" />
			<h5 class="font-lato font-bold text-primary-main_text-grey">Personalized Study Guide</h5>
		</a>
		<section class="flex h-full w-full items-center justify-between gap-5">
			<div class="mr-auto flex w-full items-center gap-1">
				<img
					src="/assets/Search Icon.svg"
					class="h-7"
					alt="a magnifying glass to illustrate searching"
				/>
				<input
					type="text"
					class="w-full py-2 placeholder:font-lato placeholder:text-base placeholder:font-medium placeholder:text-[#656565] focus:outline-none lg:min-w-[25rem]
"
					placeholder="Start your search here..."
				/>
			</div>
			<div class="flex w-full items-center justify-end gap-6 pr-3 xl:gap-8 xl:pr-0">
				{#if $page.params.topic_id}
					<button
						on:click={() => QuizModalState.set(true)}
						class="flex items-center gap-2 font-lato text-sm font-bold text-primary-main_text-grey"
					>
						<img src="/assets/Play icon.svg" alt="play icon" />
						<span>Quiz</span>
					</button>
				{/if}
				<button class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEEEEE]"
					><img class="" src="/assets/Bell icon.svg" alt="bell icon" /></button
				>
				<button
					on:click={() => addCourseModalState.set(true)}
					class="flex items-center gap-2 rounded-[25px] bg-primary-main-green px-4 py-3 font-lato text-sm font-bold text-primary-main_text-white lg:min-w-[150px]"
				>
					<img src="/assets/Add course icon.svg" alt="add course" />
					<span class="hidden lg:block">Add New Course</span>
				</button>
			</div>
		</section>
	</nav>
</div>
