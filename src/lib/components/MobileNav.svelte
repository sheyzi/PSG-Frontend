<script lang="ts">
	import { page } from '$app/stores';
	import { addCourseModalState } from '$lib/stores/store';

	const updateModalState = () => {
		addCourseModalState.set(true);
	};
</script>

<nav class="fixed bottom-0 z-50 h-24 w-full bg-white shadow shadow-[#00000040] md:hidden">
	<ul class="mx-auto flex h-full w-full max-w-xs items-center justify-between bg-white px-5">
		<li>
			<a href="/app" class="flex flex-col items-center justify-center space-y-1">
				<img
					src="/assets/{$page.url.pathname === '/app' ||
					$page.url.pathname.startsWith('/app/course')
						? 'Menu stroked(active)'
						: 'Menu stroked'}.svg"
					alt="menu icon"
				/>
				<span
					class="text-sm {($page.url.pathname === '/app' ||
						$page.url.pathname.startsWith('/app/course')) &&
						'text-primary-main-blue'} ">Courses</span
				>
			</a>
		</li>
		<button
			class="flex h-[73px] w-[73px] items-center justify-center rounded-full border-4 border-white bg-primary-main-green shadow-md"
			on:click={updateModalState}
		>
			<img src="/assets/ic_round-add.svg" alt="add icon" />
			<span class="sr-only">Add course</span>
		</button>
		<li>
			<a href="/" class="flex flex-col items-center justify-center space-y-1">
				<img src="/assets/profiled stroked.svg" alt="menu icon" />
				<span class="font-lato text-sm">Profile</span>
			</a>
		</li>
	</ul>
</nav>
