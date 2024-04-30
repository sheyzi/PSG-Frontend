<script lang="ts">
	import { addCourseModalState } from '$lib/stores/store';

	const updateModalState = () => {
		addCourseModalState.set(true);
	};
</script>

<nav class="absolute bottom-0 h-28 w-full bg-[#F3F4F9A] shadow shadow-[#00000040] md:hidden">
	<ul class="mx-auto flex h-full w-full max-w-xs items-center justify-between px-5">
		<li>
			<a href="/app" class="flex flex-col items-center justify-center space-y-2">
				<img src="assets/Menu stroked.svg" class="h-5 w-5" alt="menu icon" />
				<span class="text-sm">Courses</span>
			</a>
		</li>
		<button
			class="flex h-[73px] w-[73px] items-center justify-center rounded-full border-4 border-white bg-primary-main-green shadow"
			on:click={updateModalState}
		>
			<img src="assets/ic_round-add.svg" alt="add icon" />
			<span class="sr-only">Add course</span>
		</button>
		<li>
			<a href="/" class="flex flex-col items-center justify-center space-y-2">
				<img src="assets/profiled stroked.svg" class="h-5 w-5" alt="menu icon" />
				<span class="font-lato text-sm">Profile</span>
			</a>
		</li>
	</ul>
</nav>
