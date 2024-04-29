<script lang="ts">
	import { firebaseAuth } from '$lib/firebase';
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');
</script>

<svelte:head>
	<title>All Courses - PSG AI</title>
</svelte:head>
<div class="h-full w-full px-8 py-10">
	<section>
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

	<section class="flex h-[80%] w-full items-center justify-center">
		<div class="flex flex-col items-center text-primary-main-blue">
			<iconify-icon width="70" icon="game-icons:bookshelf"></iconify-icon>
			<h3 class="text-center font-lato text-2xl font-bold text-primary-grey">
				Your course library is empty. <br /> Let's fill it up!
				<button
					on:click={() => (open = !open)}
					class="text-primary-main-green transition-all hover:underline"
				>
					Create a course
				</button> now.
			</h3>
		</div>
	</section>
</div>
<button on:click={() => firebaseAuth.signOut()}> Sign out </button>

{#if $isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Trigger asChild let:builder>
			<!-- <Button variant="outline" builders={[builder]}>Add Course</Button> -->
		</Dialog.Trigger>
		<Dialog.Content
			class="border-0 border-t-4 border-primary-main-yellow bg-white sm:max-w-[425px]"
		>
			<Dialog.Header>
				<Dialog.Title>Add Course</Dialog.Title>
				<Dialog.Description>
					Enter your course details. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<form class="grid items-start gap-5">
				<div class="grid gap-1">
					<Label for="course-name" class="font-lato text-xs text-primary-main_text-grey"
						>Course Name <span class="text-primary-main-red">*</span></Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-name"
						id="course-name"
						placeholder="Enter course title"
					/>
				</div>
				<div class="grid gap-1">
					<Label for="course-code" class="font-lato text-xs text-primary-main_text-grey"
						>Course Code</Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-code"
						id="course-code"
						placeholder="Enter course code"
					/>
				</div>

				<div class="grid gap-1">
					<Label for="course-desc" class="font-lato text-xs text-primary-main_text-grey"
						>Course Description</Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-desc"
						id="course-desc"
						placeholder="Enter course description"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="course-syllabus" class="font-lato text-xs text-primary-main_text-grey"
						>Upload Course Syllabus <span class="text-primary-main-red">*</span></Label
					>
					<div
						class="relative flex h-full min-h-[90px] w-full flex-col items-center rounded-lg bg-secondary-supporting-pale-blue py-3"
					>
						<input
							accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
							type="file"
							class="absolute top-0 z-10 h-full w-full cursor-pointer opacity-0"
							name="course-syllabus"
							id="course-syllabus"
						/>
						<img src="assets/File Icon.svg" alt="file icon" />
						<h6 class="mt-1 font-lato text-sm">Browse files</h6>
						<span class="text-xs text-[#666666]">Max size 1MB</span>
						<span class="text-xs text-[#666666]">File format supported (DOC, PDF, JPG, PNG)</span>
					</div>
				</div>

				<div class="flex items-center gap-1.5">
					<img src="assets/Info Icon.svg" alt="information icon" />
					<span class="font-lato text-xs text-[#656565] underline"
						>Click for more info about uploading files</span
					>
				</div>
				<Button class=" rounded-[20px] bg-primary-main-green" type="submit">
					<div class="flex items-center justify-start gap-1">
						<p>Save changes</p>
						<iconify-icon width="15" icon="basil:arrow-right-outline"></iconify-icon>
					</div>
				</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger asChild let:builder>
			<!-- <Button variant="outline" builders={[builder]}>Edit Profile</Button> -->
		</Drawer.Trigger>
		<Drawer.Content class="bg-white">
			<Drawer.Header class="text-left">
				<Drawer.Title>Add Course</Drawer.Title>
				<Drawer.Description>
					Enter your course details. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<form class="mb-3 grid items-start gap-5 px-4">
				<div class="grid gap-1">
					<Label for="course-name" class="font-lato text-xs text-primary-main_text-grey"
						>Course Name <span class="text-primary-main-red">*</span></Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-name"
						id="course-name"
						placeholder="Enter course title"
					/>
				</div>
				<div class="grid gap-1">
					<Label for="course-code" class="font-lato text-xs text-primary-main_text-grey"
						>Course Code</Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-code"
						id="course-code"
						placeholder="Enter course code"
					/>
				</div>

				<div class="grid gap-1">
					<Label for="course-desc" class="font-lato text-xs text-primary-main_text-grey"
						>Course Description</Label
					>

					<Input
						class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
						type="course-desc"
						id="course-desc"
						placeholder="Enter course description"
					/>
				</div>

				<div class="grid gap-3">
					<Label for="course-syllabus" class="font-lato text-xs text-primary-main_text-grey"
						>Upload Course Syllabus <span class="text-primary-main-red">*</span></Label
					>
					<div
						class="relative flex h-full min-h-[90px] w-full flex-col items-center rounded-lg bg-secondary-supporting-pale-blue py-3"
					>
						<input
							accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
							type="file"
							class="absolute top-0 z-10 h-full w-full cursor-pointer opacity-0"
							name="course-syllabus"
							id="course-syllabus"
						/>
						<img src="assets/File Icon.svg" alt="file icon" />
						<h6 class="mt-1 font-lato text-sm">Browse files</h6>
						<span class="text-xs text-[#666666]">Max size 1MB</span>
						<span class="text-xs text-[#666666]">File format supported (DOC, PDF, JPG, PNG)</span>
					</div>
				</div>

				<div class="flex items-center gap-1.5">
					<img src="assets/Info Icon.svg" alt="information icon" />
					<span class="font-lato text-xs text-[#656565] underline"
						>Click for more info about uploading files</span
					>
				</div>
			</form>
			<Drawer.Footer class="space-y-3 pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Cancel</Button>
				</Drawer.Close>
				<Button class=" rounded-[20px] bg-primary-main-green" type="submit">
					<div class="flex items-center justify-start gap-1">
						<p>Save changes</p>
						<iconify-icon width="15" icon="basil:arrow-right-outline"></iconify-icon>
					</div>
				</Button>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
