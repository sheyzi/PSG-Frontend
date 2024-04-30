<script lang="ts">
	import { goto } from '$app/navigation';
	import snarkdown from 'snarkdown';
	import { page } from '$app/stores';
	import { axiosClient } from '$lib/axios';
	import AnimatedBalls from '$lib/components/AnimatedBalls.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { fireStoreDb } from '$lib/firebase';
	import type { RawTopicContent, Resource, Topic } from '$lib/types/types';
	import { showToast } from '$lib/utils';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';

	let topic_id = $page.params.topic_id;
	let course_slug = $page.params.slug;
	let pageDataLoaded = false;
	let loadingContent = false;

	const getTopic = async (topic_id: string): Promise<Topic | null> => {
		const topicRef = doc(fireStoreDb, 'topics', topic_id);
		const topicSnap = await getDoc(topicRef);

		if (!topicSnap.exists()) {
			return null;
		} else {
			return {
				...(topicSnap.data() as Topic),
				id: topicSnap.id
			};
		}
	};

	const getCourseContent = async (topic_name: string): Promise<RawTopicContent | null> => {
		try {
			const response = await axiosClient.get('/generate-topic-content', {
				params: {
					topic_name
				}
			});
			return response.data as RawTopicContent;
		} catch (e) {
			console.log(e);
			showToast('Error generating topic content', 'error');
			return null;
		}
	};

	let topic: Topic | null;

	onMount(async () => {
		topic = await getTopic(topic_id);

		if (!topic) {
			showToast(`This topic doesn't exist!`, 'error');
			goto(`/app/course/${course_slug}`);
		}

		pageDataLoaded = true;

		if (!topic?.note) {
			loadingContent = true;
			try {
				let topicContent = await getCourseContent(topic?.name || '');
				const updateTopicRef = doc(fireStoreDb, 'topics', topic_id);
				let resources: Resource[] = [];

				topicContent?.resources.forEach((resource) => {
					const newResource = {
						...resource,
						url: resource.url.replace(/'/g, '')
					};
					resources.push(newResource);
				});
				await updateDoc(updateTopicRef, {
					note: topicContent?.note,
					resources: topicContent?.resources
				});

				if (topic) {
					topic.note = topicContent?.note;
					topic.resources = resources as Resource[];
				}
			} catch (e) {
				showToast('Error generating topic content', 'error');
			} finally {
				loadingContent = false;
			}
		}
	});

	function extractVideoIdFromYouTubeUrl(url: string): string | null {
		let sanitizedUrl = url.replace(/'/g, '');
		const urlSearchParams = new URL(sanitizedUrl);
		const videoIdFromParams = urlSearchParams.searchParams.get('v');

		// If 'v' parameter is present, return it
		if (videoIdFromParams) {
			return videoIdFromParams;
		}
		return null;
	}

	const getYoutubeEmbedUrl = (url: string) => {
		const videoId = extractVideoIdFromYouTubeUrl(url);
		const thumbnailUrl = `https://www.youtube.com/embed/${videoId}`;
		return thumbnailUrl;
	};
</script>

<div class="p-5">
	{#if !pageDataLoaded}
		<Loader />
	{:else if loadingContent}
		<div class=" flex flex-col space-y-5 px-4 py-10 lg:flex-row lg:space-x-5 lg:space-y-0 lg:px-10">
			<div class="flex items-center gap-2 lg:flex-col">
				<!-- <AnimatedBalls /> -->

				<iconify-icon
					width="50"
					icon="line-md:loading-twotone-loop"
					class=" text-primary-main-yellow/30"
				></iconify-icon>
				<h6 class="font-lato text-xl font-semibold text-primary-main-green/30 lg:hidden">
					Generating topic content...
				</h6>
			</div>
			<div class="w-full space-y-2">
				<Skeleton
					class="h-6 w-[95] bg-gradient-to-r from-primary-main-yellow/30 to-primary-main-green/30 lg:h-4 lg:w-[90%]"
				/>
				<Skeleton
					class="h-6 w-[92] bg-gradient-to-r from-primary-main-yellow/30 to-primary-main-green/30 lg:h-4 lg:w-[90%]"
				/>
				<Skeleton
					class="h-6 w-[88] bg-gradient-to-r from-primary-main-yellow/30 to-primary-main-green/30 lg:h-4 lg:w-[85%]"
				/>
				<Skeleton
					class="h-6 w-[85] bg-gradient-to-r from-primary-main-yellow/30 to-primary-main-green/30 lg:h-4 lg:w-[80%]"
				/>
				<Skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	{:else}
		<div class="grid gap-5 lg:grid-cols-12">
			<section
				class="no-scrollbar relative h-full max-h-screen overflow-y-scroll rounded bg-white lg:col-span-8"
			>
				<div class="sticky top-0 border-b-2 bg-white p-5">
					<h2 class="font-lato text-2xl font-bold text-primary-main_text-grey">
						{topic?.name}
					</h2>
				</div>
				<div class="prose max-w-none p-7 text-primary-main_text-grey">
					{@html snarkdown(topic?.note || '')}
				</div>
			</section>
			<aside
				class="no-scrollbar relative h-full max-h-screen overflow-y-scroll rounded bg-white lg:col-span-4"
			>
				<div class="sticky top-0 border-b-2 bg-white p-5">
					<h2 class="font-lato text-2xl font-bold text-primary-main_text-grey">Resources</h2>
				</div>
				<div class="space-y-5 p-5">
					{#if topic}
						{#if topic.resources}
							{#each topic.resources.reverse() as resource}
								<Card.Root
									class="flex  flex-col gap-5 rounded-lg bg-white px-2.5 py-4 shadow md:border-0 md:border-r-4 md:border-r-secondary-supporting-light-blue"
								>
									<Card.Content
										class="flex flex-col gap-2 rounded-lg  px-2.5 py-3 font-lato text-primary-main_text-grey shadow-none"
									>
										<!-- <span class="text-xs font-semibold">Description</span> -->

										{#if resource.url.includes('youtube.com')}
											<iframe
												class="w-full rounded"
												src={getYoutubeEmbedUrl(resource.url)}
												title="YouTube video player"
												frameborder="0"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowfullscreen
											>
											</iframe>
										{:else}
											<a
												href={resource.url}
												class="line-clamp-4 text-sm underline hover:font-semibold"
												>{resource.content}</a
											>
										{/if}
									</Card.Content>
									<!-- {/if} -->
								</Card.Root>
							{/each}
						{/if}
					{/if}
				</div>
			</aside>
		</div>
	{/if}
</div>
