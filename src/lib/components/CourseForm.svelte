<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { mediaQuery, slide } from 'svelte-legos';
	import { fireStoreDb, firebaseAuth } from '$lib/firebase';
	import { addDoc, collection } from 'firebase/firestore';
	import { axiosClient } from '$lib/axios';
	import { showToast, slugify } from '$lib/utils';
	import { ZodError, z } from 'zod';
	import { addCourseModalState, courses } from '$lib/stores/store';
	import { createEventDispatcher } from 'svelte';
	import type { RawTopic } from '$lib/types/types';
	import { AxiosError } from 'axios';

	export let className: string = '';

	let files;
	let validationErrors = {};
	let loading = false;
	let data: { [key: string]: string | any } = {
		course_title: '',
		course_code: '',
		course_desc: '',
		syllabus: {}
	};
	let loadingFile = false;

	const isDesktop = mediaQuery('(min-width: 768px)');
	const dispatch = createEventDispatcher();

	const courseSchema = z.object({
		course_title: z
			.string({ required_error: 'Course title is required' })
			.min(3, { message: 'Course title is too short' })
			.trim(),
		course_code: z.string().trim().optional(),
		course_desc: z.string().optional() // Description can be optional
	});

	const addTopics = async (topics: RawTopic[], courseId: string, parentTopicId?: string) => {
		for (const topic of topics) {
			const topicDocRef = await addDoc(collection(fireStoreDb, 'topics'), {
				name: topic.name,
				courseId: courseId,
				...(parentTopicId && { parentTopicId })
			});
			if (topic.subtopics?.length > 0) {
				const subtopics = topic.subtopics;
				addTopics(subtopics, courseId, topicDocRef.id);
			}
		}
	};

	const handleSubmit = async () => {
		loading = true;
		dispatch('loading');
		try {
			courseSchema.parse(data);
			if (data.syllabus === undefined) {
				showToast('No syllabus was added', 'error');
				return;
			}
			let courseData = {
				course_title: data.course_title,
				course_code: data.course_code,
				course_desc: data.course_desc,
				userId: firebaseAuth.currentUser?.uid || '',
				slug: slugify(data.course_title)
			};
			const courseDocRef = await addDoc(collection(fireStoreDb, 'courses'), courseData);
			await addTopics(data.syllabus, courseDocRef.id);
			courses.update((old_courses) => {
				return [
					...old_courses,
					{
						...courseData,
						id: courseDocRef.id
					}
				];
			});
			showToast('Course added successfully', 'success');
			addCourseModalState.set(false);
		} catch (e) {
			if (e instanceof ZodError) {
				validationErrors = e.flatten().fieldErrors;
				showToast('Validation error', 'error');
			} else {
				console.error('Error adding document: ', e);
			}
		} finally {
			dispatch('stopped');
			loading = false;
		}
	};

	const uploadFile = async (files) => {
		// console.log('hi');
		loadingFile = true;
		const formData = new FormData();

		if (files.length < 1) {
			// console.log('no files');
			showToast('Please select an image or file containing your syllabus', 'info');
			return;
		}
		try {
			const fileToUpload = files[0];

			if (fileToUpload.type === 'application/pdf' || fileToUpload.type === 'application/doc') {
				formData.append('file', fileToUpload);

				const pdfRes = await axiosClient.post('/get-topic-from-syllabus-pdf', formData);
				data.syllabus = pdfRes.data;
				showToast('File processing complete', 'success');
			} else if (
				fileToUpload.type === 'image/jpg' ||
				fileToUpload.type === 'image/png' ||
				fileToUpload.type === 'image/jpeg'
			) {
				formData.append('image', fileToUpload);

				const imageRes = await axiosClient.post('get-topic-from-syllabus-image', formData);
				data.syllabus = imageRes.data;

				showToast('Image processing complete', 'success');
			}
		} catch (error) {
			console.log('err', error);

			if (error instanceof AxiosError) {
				showToast('Ooops something went wrong while processing your syllabus', 'error');
				console.log('Axios error', error);
			}
		} finally {
			loadingFile = false;
		}
	};
</script>

<form on:submit|preventDefault={handleSubmit} class=" {className}">
	<div class="grid gap-1">
		<Label for="course-title" class="font-lato text-xs text-primary-main_text-grey"
			>Course Title <span class="text-primary-main-red">*</span></Label
		>

		<Input
			class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
			type="text"
			id="course-title"
			placeholder="Enter course title"
			bind:value={data.course_title}
		/>
		{#if validationErrors?.course_title}
			<sub
				transition:slide={{ delay: 250, duration: 300 }}
				class="text-xs tracking-[-0.0075rem] text-rose-500">{validationErrors.course_title}</sub
			>
		{/if}
	</div>
	<div class="grid gap-1">
		<Label for="course-code" class="font-lato text-xs text-primary-main_text-grey"
			>Course Code</Label
		>

		<Input
			class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
			type="text"
			id="course-code"
			placeholder="Enter course code"
			bind:value={data.course_code}
		/>
		{#if validationErrors?.course_code}
			<sub
				transition:slide={{ delay: 250, duration: 300 }}
				class="text-xs tracking-[-0.0075rem] text-rose-500">{validationErrors.course_code}</sub
			>
		{/if}
	</div>

	<div class="grid gap-1">
		<Label for="course-desc" class="font-lato text-xs text-primary-main_text-grey"
			>Course Description</Label
		>

		<Textarea
			rows={5}
			class="rounded-none border-0 border-b-2 transition-all focus:border-0 focus:border-b-2 focus:border-primary-main-blue focus:outline-none"
			id="course-desc"
			placeholder="Enter course description"
			bind:value={data.course_desc}
		/>{#if validationErrors?.desc}
			<sub
				transition:slide={{ delay: 250, duration: 300 }}
				class="text-xs tracking-[-0.0075rem] text-rose-500">{validationErrors.desc}</sub
			>
		{/if}
	</div>

	<div class="grid gap-3">
		<Label for="course-syllabus" class="font-lato text-xs text-primary-main_text-grey"
			>Upload Course Syllabus <span class="text-primary-main-red">*</span></Label
		>
		<div
			class="relative flex h-full min-h-[90px] w-full flex-col items-center justify-center rounded-lg bg-secondary-supporting-pale-blue py-3"
		>
			<input
				disabled={loadingFile}
				bind:files
				on:drop={(e) => {
					e.preventDefault();
					files = e.dataTransfer?.files;
					// uploadFile(e.dataTransfer?.files);
				}}
				on:change={(e) => uploadFile(files)}
				accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
				type="file"
				class="absolute top-0 z-10 h-full w-full cursor-pointer opacity-0"
				name="course-syllabus"
				id="course-syllabus"
			/>
			{#if loadingFile}
				<div class="flex items-center gap-2">
					<iconify-icon
						width="30"
						class="text-primary-main-yellow"
						icon="line-md:loading-twotone-loop"
					></iconify-icon>
					<span class="font-montserrat text-xs">Uploading file...</span>
				</div>
			{:else if files?.length > 0}
				<div class="flex w-full items-center justify-between px-6">
					<div class="grid gap-2 text-xs">
						<p>{files[0].name}</p>
						<span class="font-lato text-sm text-[#666666]"
							>{(files[0].size / (1024 * 1024)).toFixed(2)}MB
						</span>
					</div>
					<button
						class="rounded-[15px] border-2 border-primary-main-blue px-4 py-2 font-poppins text-xs font-medium text-primary-main-blue"
						>Change</button
					>
				</div>
			{:else}
				<img src="/assets/File Icon.svg" alt="file icon" />
				<h6 class="mt-1 font-lato text-sm">Browse files</h6>
				<span class="text-xs text-[#666666]">Max size 1MB</span>
				<span class="text-xs text-[#666666]">File format supported (DOC, PDF, JPG, PNG)</span>
			{/if}
		</div>
	</div>

	<div class="flex items-center gap-1.5">
		<img src="/assets/Info Icon.svg" alt="information icon" />
		<span class="font-lato text-xs text-[#656565] underline"
			>Click for more info about uploading files</span
		>
	</div>

	{#if isDesktop}
		<button
			disabled={loadingFile || loading}
			class=" flex items-center justify-center rounded-[20px] bg-primary-main-green px-5 py-2.5 text-white"
			type="submit"
		>
			{#if loading}
				<iconify-icon
					width="20"
					class="text-primary-main-yellow"
					icon="line-md:loading-twotone-loop"
				></iconify-icon>
			{:else}
				<div class="flex items-center justify-start gap-1">
					<p>Save changes</p>
					<iconify-icon width="15" icon="basil:arrow-right-outline"></iconify-icon>
				</div>
			{/if}
		</button>
	{:else}
		<Drawer.Footer class="space-y-3 pt-2">
			<Button
				disabled={loadingFile || loading}
				class=" rounded-[20px] bg-primary-main-green"
				type="submit"
			>
				<div class="flex items-center justify-start gap-1">
					<p>Save changes</p>
					<iconify-icon width="15" icon="basil:arrow-right-outline"></iconify-icon>
				</div>
			</Button>
		</Drawer.Footer>
	{/if}
</form>
