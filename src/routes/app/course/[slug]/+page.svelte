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

	const structureTopics = (topics: Topic[]): Topic[] => {
		const topicMap = new Map<string, Topic>();

		function buildStructure(parentId?: string): Topic[] {
			let topicsToRestructure = [];
			if (parentId) {
				topicsToRestructure = topics.filter((topic) => topic.parentTopicId === parentId);
			} else {
				topicsToRestructure = topics.filter((topic) => !topic.parentTopicId);
			}

			return topicsToRestructure.map((topic) => {
				const structuredTopic = { ...topic, subtopics: buildStructure(topic.id) };
				topicMap.set(topic.id, structuredTopic);
				return structuredTopic;
			});
		}

		// Find root topics (no parentTopicId)
		const structuredTopics = buildStructure(); // Build the hierarchy
		return structuredTopics;
	};

	const getTopics = async (courseId: string, parentTopicId?: string) => {
		const topicsRef = collection(fireStoreDb, 'topics');

		let q = query(topicsRef, where('courseId', '==', courseId));

		if (parentTopicId) {
			q = query(
				topicsRef,
				where('courseId', '==', courseId),
				where('parentTopicId', '==', parentTopicId)
			);
		}

		const topicsSnap = await getDocs(q);

		if (topicsSnap.empty) {
			return [];
		} else {
			let topics: Topic[] = [];

			topicsSnap.forEach((topic) => {
				let topicData = topic.data() as Topic;

				topics.push({
					id: topic.id,
					...topicData,
					subtopics: []
				});
			});

			topics = structureTopics(topics);

			return topics;
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

		<section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
	</div>
{/if}
