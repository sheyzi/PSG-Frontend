<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { firebaseAuth } from '$lib/firebase';
	import '../app.pcss';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	onMount(() => {
		firebaseAuth.onAuthStateChanged(async (user) => {
			if ($page.url.pathname.startsWith('/app') && !user) {
				return await goto('/');
			}

			if ($page.url.pathname == '/' && user) {
				return await goto('/app');
			}
		});
	});
</script>

<Toaster richColors />
<slot />
