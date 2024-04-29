<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase';
	import { showToast } from '$lib/utils';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	let loading = false;

	const handleGoogleAuth = async () => {
		loading = true;
		const provider = new GoogleAuthProvider();
		console.log(firebaseAuth);

		try {
			await signInWithPopup(firebaseAuth, provider);
		} catch (error) {
			console.log(error);
			showToast('Ooops... Something went wrong!', 'error');
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Home - PSG AI</title>
</svelte:head>
<div class="grid h-screen w-full grid-cols-5">
	<div class="col-span-2 h-full w-full p-6">
		<section class="flex max-w-fit items-center gap-2.5 border-r-2 px-2 py-3.5">
			<img src="/assets/PSG_LOGO.svg" alt="Personalized study guide logo" />
			<h5 class="font-lato font-bold text-primary-main_text-grey">Personalized Study Guide</h5>
		</section>
		<section class="flex h-full w-full flex-col items-center justify-center gap-11">
			<!-- <h3 class="font-lato text-3xl font-bold text-primary-main_text-grey">Let’s get started...</h3> -->
			<div class="flex w-full max-w-xs flex-col items-center gap-8">
				<!-- <section class="flex w-full flex-col items-center space-y-3">
					<button
						type="button"
						class="w-full rounded-[20px] bg-primary-main-green py-3 font-lato font-medium text-primary-main_text-white"
						>Create an account</button
					>
					<sub class="flex gap-2 font-lato text-base font-medium text-primary-main_text-grey"
						>Don't have an account? <span class="text-primary-main-blue underline">Sign up</span
						></sub
					>
				</section>
				<section class="flex items-center gap-2">
					<img src="/assets/Line.svg" class="h-1" alt="A line, it's used for aesthetics" />
					<span class="font-poppins text-base font-medium">or</span>
					<img class=" h-1 rotate-180" src="/assets/Line.svg" alt="" />
				</section> -->

				<button
					disabled={loading}
					on:click={handleGoogleAuth}
					class="bg-[rgba(255, 255, 255, 1)] google-button flex w-full max-w-fit items-center justify-center gap-2 rounded-[20px] px-6 py-3"
				>
					{#if !loading}
						<img src="/assets/Google icon.svg" alt="Google's logo" />
						<span class="font-lato font-bold text-primary-main_text-grey">Continue with Google</span
						>
					{:else}
						<iconify-icon
							width="25"
							class="text-primary-main-yellow"
							icon="line-md:loading-twotone-loop"
						></iconify-icon>
					{/if}
				</button>
			</div>
		</section>
	</div>
	<div
		class="relative col-span-3 flex h-full w-full items-center justify-center bg-primary-main-blue"
	>
		<section id="illustrations-container">
			<img
				class="absolute right-0 top-0"
				src="/assets/Illustration(top-right).svg"
				alt="A simple illustration with no practical function, used for aesthetics"
			/>
			<img
				class="absolute bottom-0 left-0"
				src="/assets/Illustration(bottom-left).svg"
				alt="A simple illustration with no practical function, used for aesthetics"
			/>
		</section>
		<section class="flex h-full flex-col items-start justify-center gap-5">
			<!-- <div class="flex w-full items-center justify-center"> -->
			<h1 class="font-montserrat text-[64px] font-bold text-primary-main_text-white">
				Need <span class="relative z-10 max-w-fit text-secondary-supporting-light-blue">
					resources <img src="/assets/Vector 1.svg" class="absolute right-32 top-0 -z-[3]" alt="" />
				</span>
				to <br />
				kickstart your <br /> learning journey?
			</h1>
			<!-- </div> -->
			<p class="font-montserrat text-xl font-medium text-primary-main_text-white">
				Learn better with AI.
			</p>
		</section>
	</div>
</div>

<style>
	.google-button {
		box-shadow: 0px 0px 18.9px 0px rgba(82, 82, 82, 0.14);
	}
</style>
