<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import { fireStoreDb } from '$lib/firebase';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import type { Course, RawCourse, Topic } from '$lib/types/types';
	import { showToast } from '$lib/utils';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { getTopics } from '$lib/services';
	import snarkdown from 'snarkdown';

	const slug = $page.params.slug;

	let course: Course | null;

	const getCourse = async (): Promise<Course | null> => {
		const courseRef = collection(fireStoreDb, 'courses');
		const q = query(courseRef, where('slug', '==', slug));
		const courseSnapShot = await getDocs(q);

		if (courseSnapShot.empty) {
			return null;
		} else {
			let course = courseSnapShot.docs[0];
			let topics = await getTopics(course.id);
			return {
				...(course.data() as RawCourse),
				id: course.id,
				topics
			};
		}
	};

	let pageDataLoaded = false;

	onMount(async () => {
		try {
			course = await getCourse();

			if (!course) {
				showToast(`Course with slug ${slug} doesn't exist`, 'error');
				return await goto('/app');
			}
		} finally {
			pageDataLoaded = true;
		}
	});
</script>

{#if !pageDataLoaded}
	<Loader />
{:else if !course?.topics?.length}
	<div class="h-full w-full">There are no topics</div>
{:else}
	<div class="h-full w-full px-8 py-10">
		<section class="mb-8 flex w-full items-center justify-between">
			<h1 class="font-lato text-4xl font-bold text-primary-main_text-grey">
				{course.course_title}
			</h1>
			<!-- <button
				class="flex items-center gap-1 rounded-lg bg-primary-main-blue px-4 py-1.5 text-sm text-white"
			>
				<iconify-icon width="20" icon="material-symbols-light:add"></iconify-icon>
				<span>Add topic</span>
			</button> -->
		</section>

		<section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each course.topics as topic}
				<div>
					<Card.Root
						class="flex  flex-col gap-5 rounded-lg bg-white px-2.5 py-4 shadow md:border-0 md:border-l-4 md:border-l-primary-main-blue"
					>
						<Card.Header
							class="flex w-full flex-row items-center justify-between rounded-lg bg-secondary-supporting-pale-blue p-3 font-lato text-primary-main_text-grey shadow-secondary"
						>
							<section class="flex flex-col gap-1">
								<!-- <Card.Description class="text-xs text-primary-main_text-grey"
									>Topic</Card.Description
								> -->
								<Card.Title class="font-semibold">
									<a href="/app/course/{course.slug}/{topic.id}">
										{topic.name}
									</a>
								</Card.Title>
							</section>
							<button>
								<iconify-icon icon="entypo:dots-three-vertical" style="color: #989898"
								></iconify-icon>
							</button>
						</Card.Header>
					</Card.Root>
				</div>
			{/each}
		</section>
	</div>
{/if}
