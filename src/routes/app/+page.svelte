<script lang="ts">
	import { fireStoreDb, firebaseAuth } from '$lib/firebase';
	import { mediaQuery } from 'svelte-legos';
	import * as Card from '$lib/components/ui/card';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { courses, addCourseModalState } from '$lib/stores/store';
	import Loader from '$lib/components/Loader.svelte';
	import type { RawCourse } from '$lib/types/types';

	const isDesktop = mediaQuery('(min-width: 768px)');

	const getAllCourses = async () => {
		const course_query = query(
			collection(fireStoreDb, 'courses'),
			where('userId', '==', firebaseAuth.currentUser?.uid)
		);
		let courseSnapShot = await getDocs(course_query);
		let allCourses: RawCourse[] = [];
		courseSnapShot.forEach((course) => {
			// console.log(`${course.id} => `, course.data());
			let currCourse = course.data() as RawCourse;

			allCourses = [...allCourses, currCourse];
		});

		courses.set(allCourses);
	};
	getAllCourses();
</script>

<svelte:head>
	<title>All Courses - PSG AI</title>
</svelte:head>
<div class="h-full w-full">
	<section class=" px-8">
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

	{#if $courses.length > 0}
		<section
			class="no-scrollbar mt-5 flex min-h-full w-full flex-col gap-6 overflow-scroll bg-white px-8 py-10 md:w-3/5 md:bg-inherit"
		>
			{#each $courses as course}
				<div>
					<Card.Root
						class="flex  flex-col gap-5 rounded-lg bg-white px-2.5 py-4 shadow md:border-0 md:border-l-4 md:border-l-primary-main-yellow"
					>
						<Card.Header
							class="flex w-full flex-row items-center justify-between rounded-lg bg-secondary-supporting-pale-blue p-3 font-lato text-primary-main_text-grey shadow-secondary"
						>
							<section class="flex flex-col gap-1">
								<Card.Description class="text-xs text-primary-main_text-grey"
									>Course</Card.Description
								>
								<Card.Title class="font-semibold">
									<a href="/app/course/{course.slug}">
										{course.course_title}
									</a>
								</Card.Title>
							</section>
							<button>
								<iconify-icon icon="entypo:dots-three-vertical" style="color: #989898"
								></iconify-icon>
							</button>
						</Card.Header>
						{#if course.course_desc && course.course_desc.length > 0}
							<Card.Content
								class="flex flex-col gap-2 rounded-lg border-2 border-primary-grey/5 px-2.5 py-3 font-lato text-primary-main_text-grey shadow-none"
							>
								<span class="text-xs font-semibold">Description</span>
								<p class="line-clamp-4 text-sm">{course.course_desc}</p>
							</Card.Content>
						{/if}
					</Card.Root>
				</div>
			{/each}
		</section>
	{:else}
		<section class="flex h-[80%] w-full items-center justify-center px-8">
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
	{/if}
</div>
<!-- <button
	on:click={() => {
		firebaseAuth.signOut();
		Courses.set([]);
	}}
>
	Sign out
</button> -->

<!-- {#if $isDesktop} -->

<!-- {:else}
	<Drawer.Root onClose={() => addCourseModalState.set(false)} bind:open>
		<Drawer.Trigger asChild let:builder>
		</Drawer.Trigger>
		<Drawer.Content class="max-h-[80vh] bg-white pb-2">
			<Drawer.Header class="py-5 text-left">
				<Drawer.Title>Add Course</Drawer.Title>
				<Drawer.Description>
					Enter your course details. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<section class="no-scrollbar h-full overflow-y-scroll">
				<CourseForm
					on:loading={() => (loading = true)}
					on:stopped={() => (loading = false)}
					className="mb-3 grid items-start gap-5 px-4 py-5"
				/>
			</section>
		</Drawer.Content>
	</Drawer.Root>
{/if} -->
