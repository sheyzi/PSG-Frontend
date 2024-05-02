<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { showToast } from '$lib/utils';
	import type { Quiz } from '$lib/types/types';
	import { goto } from '$app/navigation';
	import Loader from '$lib/components/Loader.svelte';
	import { getQuizzes, getTopics } from '$lib/services';

	const topic = $page.params.topic;

	let quizzes: Quiz[] | null;

	let pageDataLoaded = false;

	onMount(async () => {
		try {
			quizzes = await getQuizzes(topic);

			if (!quizzes) {
				showToast(`problem occurred while trying to generate quiz`, 'error');
				return await goto('/app');
			}
		} finally {
			pageDataLoaded = true;
		}
	});
</script>
