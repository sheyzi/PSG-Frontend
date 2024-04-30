<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import { fireStoreDb, firebaseAuth } from '$lib/firebase';
	import type { Course, RawCourse, Topic } from '$lib/types/types';
	import { showToast } from '$lib/utils';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';

	const slug = $page.params.slug;

	let course: Course | null;
	let topics: Topic[];

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

		const topicsScap = await getDocs(q);

		if (topicsScap.empty) {
			return [];
		} else {
			const topics: Topic[] = [];

			topicsScap.forEach((topic) => {
				let topicData = topic.data() as Topic;
				if (!parentTopicId && topicData.parentTopicId) {
				} else {
					topics.push({
						...topicData,
						subtopics: []
					});
				}
			});

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

			console.log(course);
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
	There are topics
{/if}
