<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from 'firebase/auth';

	export let currentUser: User | null;
</script>

<div
	class="max-h-auto relative flex h-[90vh] w-[283px] flex-col items-center gap-16 border-r bg-[#FFFFFF] py-10 xl:w-[285px]"
>
	<div class="absolute flex h-full w-full items-center justify-center">
		<button
			class=" absolute -right-5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#EFF0FF] bg-white shadow"
		>
			<img src="assets/Left vector.svg" class="" alt="Left facing arrowhead" />
		</button>
	</div>
	<section class="flex items-center gap-2">
		<div class="flex h-12 w-12 items-center justify-center">
			<img class="h-full w-full rounded-full" src={currentUser?.photoURL} alt="bell icon" />
		</div>
		<p class="font-lato font-bold text-text-headings">{currentUser?.displayName}</p>
	</section>

	<section class="flex w-full flex-col items-start gap-5 px-5">
		<h5 class="text-start font-lato text-sm uppercase text-primary-main-blue">Home</h5>

		<ul class="flex w-full flex-col gap-4">
			<li class="w-full">
				<a
					class="flex {$page.url.pathname === '/app' &&
						'bg-secondary-supporting-light-blue'} w-full items-center gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
					href="/"
				>
					<img src="assets/Notes Icon.svg" alt="notes icon" />
					<span>All Courses</span>
				</a>
			</li>
			<li class="w-full">
				<a
					class="flex w-full items-center gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
					href="/"
				>
					<img src="assets/Calendar With Clock Icon.svg" alt="Calendar With Clock Icon" />
					<span>My Learning Cale..</span>
				</a>
			</li>
		</ul>
	</section>
	<section class="flex w-full flex-col items-start gap-5 px-5">
		<h5 class="text-start font-lato text-sm uppercase text-primary-main-blue">ME</h5>

		<ul class="flex w-full flex-col gap-4">
			<li class="w-full">
				<a
					class="flex w-full items-center gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
					href="/app"
				>
					<img src="assets/Person Icon.svg" alt="Person Icon" />
					<span>Profile</span>
				</a>
			</li>
			<li class="w-full">
				<a
					class="flex w-full items-center gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
					href="/app"
				>
					<img src="assets/Settings Icon.svg" alt="Settings Icon" />
					<span>Settings</span>
				</a>
			</li>
		</ul>
	</section>
</div>
