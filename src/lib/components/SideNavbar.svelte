<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { firebaseAuth } from '$lib/firebase';
	import { currentUser } from '$lib/stores/store';

	export let open: boolean;

	const dispatch = createEventDispatcher();
</script>

<div
	transition:slide={{ duration: 300 }}
	class="fixed left-0 hidden flex-col {open ? 'w-[222px] ' : 'w-[97px]'} h-[90vh] {!open &&
		'hidden'}] items-center gap-16 border-r bg-[#FFFFFF] py-10 transition-all duration-500 md:flex"
>
	<div class="absolute flex h-full w-full items-center justify-center">
		<button
			on:click={() => {
				if (open) {
					dispatch('close');
				} else {
					dispatch('open');
				}
				open = !open;
			}}
			class=" absolute -right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#EFF0FF] bg-white shadow"
		>
			<!-- <img src="/assets/Left vector.svg" class="" alt="Left facing arrowhead" /> -->

			<iconify-icon icon="ep:arrow-left-bold" rotate={!open && '90'} color="#000371"></iconify-icon>
		</button>
	</div>
	<div class="relative left-0 flex h-full w-full flex-col items-center gap-16 overflow-hidden">
		<section class="flex items-center gap-2">
			<div class="flex h-12 w-12 items-center justify-center">
				{#if $currentUser?.photoURL}
					<img class="h-full w-full rounded-full" src={$currentUser?.photoURL} alt="User profile" />
				{:else}
					<span>{$currentUser?.displayName?.charAt(0)}</span>
				{/if}
			</div>
			<p class="{!open && 'hidden'} font-lato font-semibold text-text-headings">
				{$currentUser?.displayName}
			</p>
		</section>

		<section class="flex w-full flex-col {open ? 'items-start' : 'items-center'} gap-5 px-5">
			<h5
				class="text-start font-lato text-sm uppercase text-primary-main-blue transition-all delay-200 duration-700 {open
					? 'text-start'
					: 'text-center'}"
			>
				Home
			</h5>

			<ul class="flex w-full flex-col gap-4">
				<li class="w-full text-sm">
					<a
						class="flex {($page.url.pathname === '/app' ||
							$page.url.pathname.startsWith('/app/course')) &&
							'bg-secondary-supporting-light-blue'} w-full items-center {!open &&
							'justify-center'} gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
						href="/"
					>
						<img src="/assets/Notes Icon.svg" alt="notes icon" />
						<span class="{!open && 'hidden'} text-sm transition-all delay-200 duration-700"
							>All Courses</span
						>
					</a>
				</li>
				<li class="w-full text-sm">
					<a
						class="flex w-full items-center {!open &&
							'justify-center'} gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
						href="/"
					>
						<img src="/assets/Calendar With Clock Icon.svg" alt="Calendar With Clock Icon" />
						<span class=" text-sm {!open && 'hidden'} transition-all duration-700"
							>My Learning Cale..</span
						>
					</a>
				</li>
			</ul>
		</section>
		<section class="flex w-full flex-col {open ? 'items-start' : 'items-center'} gap-5 px-5">
			<h5
				class="{open
					? 'text-start'
					: 'text-center'} font-lato text-sm uppercase text-primary-main-blue transition-all delay-200 duration-700"
			>
				ME
			</h5>

			<ul class="flex w-full flex-col gap-4">
				<li class="w-full">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="w-full">
							<div
								class="flex w-full items-center {!open &&
									'justify-center'} gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
							>
								<img src="/assets/Person Icon.svg" alt="Person Icon" />
								<span class=" text-sm {!open && 'hidden'} transition-all delay-200 duration-700"
									>Profile</span
								>
							</div>
						</DropdownMenu.Trigger>

						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<button
										on:click={() => {
											firebaseAuth.signOut();
											currentUser.set(null);
										}}
										class="flex items-center gap-1 text-primary-main_text-grey"
									>
										<iconify-icon icon="fluent:sign-out-20-filled" width="20" style="color: #989898"
										></iconify-icon>
										<span class="text-sm">Logout</span>
									</button>
								</DropdownMenu.Item>
								<!-- <DropdownMenu.Separator /> -->
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>
				<li class="w-full text-sm">
					<a
						class="flex w-full items-center {!open &&
							'justify-center'} gap-2 rounded-lg px-2 py-2 font-lato text-base hover:bg-secondary-supporting-light-blue"
						href="/app"
					>
						<img src="/assets/Settings Icon.svg" alt="Settings Icon" />
						<span class=" {!open && 'hidden'} text-sm transition-all delay-200 duration-700"
							>Settings</span
						>
					</a>
				</li>
			</ul>
		</section>
	</div>
</div>
