<script lang="ts">
	import { page } from '$app/stores';
	import { axiosClient } from '$lib/axios';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { QuizModalState, Quizzes, currQuiz, type Quiz } from '$lib/stores/quiz.store';
	import { currTopic } from '$lib/stores/topic.store';
	import { showToast } from '$lib/utils';
	import { slide } from 'svelte/transition';

	const data = [
		{
			id: 1,
			goal: 400
		},
		{
			id: 2,
			goal: 300
		},
		{
			id: 3,
			goal: 200
		},
		{
			id: 4,
			goal: 300
		},
		{
			id: 5,
			goal: 200
		},
		{
			id: 6,
			goal: 278
		},
		{
			id: 7,
			goal: 189
		},
		{
			id: 8,
			goal: 239
		},
		{
			id: 9,
			goal: 300
		},
		{
			id: 10,
			goal: 200
		},
		{
			id: 11,
			goal: 278
		},
		{
			id: 12,
			goal: 189
		},
		{
			id: 13,
			goal: 349
		}
	];
	const x = (d: { goal: number; id: number }) => d.id;
	const y = (d: { goal: number; id: number }) => d.goal;

	let goal = 350;
	let generating = false;
	let currentQuestionIndex = 0;
	let score = 0;
	let timeLeft = 120;
	let timerInterval;
	$: formattedTime = '';

	function handleClick(adjustment: number) {
		goal = Math.max(200, Math.min(400, goal + adjustment));
	}

	function displayQuestion() {
		answerStatus = null;
		currQuiz.set($Quizzes[currentQuestionIndex]);
		timer();
	}

	function updateFormattedTime() {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;

		const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

		formattedTime = `${minutes}:${paddedSeconds}`;
		// console.log(formattedTime);
	}

	function timer() {
		timeLeft = 2 * 60;
		updateFormattedTime();
		timerInterval = setInterval(() => {
			timeLeft--;
			updateFormattedTime();
			if (timeLeft === 0) {
				clearInterval(timerInterval);
				nextQuestion();
			}
		}, 1000);
	}

	function nextQuestion(direction?: string) {
		answerStatus = null;
		selectedAnswer = '';
		if (direction) {
			if (direction === 'next') {
				currentQuestionIndex++;
			} else {
				currentQuestionIndex--;
			}
		} else {
			currentQuestionIndex++;
		}
		if (currentQuestionIndex < $Quizzes.length) {
			displayQuestion();
		} else {
			endQuiz();
		}
	}

	function endQuiz() {
		currQuiz.set(null);
	}

	let answerStatus: null | 'correct' | 'wrong';
	let selectedAnswer: string = '';
	function selectAnswer(currAnswer: string) {
		selectedAnswer = currAnswer;

		console.log('answer', currAnswer);
		console.log($currQuiz);

		if (currAnswer === $currQuiz?.answer) {
			answerStatus = 'correct';
		} else {
			answerStatus = 'wrong';
		}
		nextQuestion();
	}
	$: console.log(answerStatus);

	$: currTopicId = $page.params.topic_id;

	const generateQuiz = async () => {
		generating = true;
		if (!currTopicId) {
			QuizModalState.set(false);
			showToast('Please select a topic', 'error');
			return;
		}
		try {
			// console.log($currTopic);
			let topicToSend = $currTopic;
			const res = await axiosClient.post('/generate-quiz', topicToSend);
			// console.log(res.data.quizzes);

			Quizzes.set(res.data.quizzes as Quiz[]);
			displayQuestion();
			showToast('Quiz generated successfully', 'success');

			// console.log(res.data);
		} catch (e) {
			showToast('Ooops something went wrong', 'error');
			console.log('error generating quiz', e);
		} finally {
			generating = false;
		}
	};
</script>

<Drawer.Root onOpenChange={(e) => QuizModalState.set(e)} bind:open={$QuizModalState}>
	<Drawer.Content class=" h-[450px] bg-white">
		<div class="relative h-full w-full bg-inherit">
			{#if $Quizzes.length < 1}
				<div
					transition:slide={{ delay: 250, duration: 300 }}
					class="absolute left-0 top-0 flex h-full w-full bg-white"
				>
					<section
						class="mx-auto my-3 flex w-full max-w-sm flex-col items-center justify-center rounded-md border-2 border-black"
					>
						<h4 class="mb-10 font-lato text-3xl font-semibold">
							Test yourself with <span class="text-primary-main-yellow"> Quiz AI</span>
						</h4>
						<button
							disabled={generating}
							on:click={async () => await generateQuiz()}
							class="flex w-full max-w-60 items-center justify-center rounded-full bg-black px-6 py-2 font-lato text-sm text-white"
						>
							{#if generating}
								<iconify-icon
									icon="line-md:loading-twotone-loop"
									class="text-primary-main-yellow"
									width="25"
								></iconify-icon>
							{:else}
								<span>Proceed</span>
								<iconify-icon icon="material-symbols-light:arrow-forward-rounded"></iconify-icon>
							{/if}
						</button>
					</section>
				</div>
			{/if}

			<div class=" mx-auto h-full w-full max-w-xl py-3">
				<!-- <Drawer.Header>
					<Drawer.Title>Quiz</Drawer.Title>
					<Drawer.Description>Select your answer before time runs out.</Drawer.Description>
				</Drawer.Header> -->
				<div class=" no-scrollbar h-full max-h-[450px] overflow-y-scroll p-4">
					{#if $currQuiz}
						<Drawer.Header>
							<Drawer.Title>
								{formattedTime}
							</Drawer.Title>
						</Drawer.Header>
						<div class=" flex flex-col items-start justify-center space-y-5">
							<h5 class="flex flex-col items-start gap-2 font-lato text-xl font-semibold">
								<span class="text-base">Question:</span>
								<span>
									{$currQuiz.question}
								</span>
							</h5>
							<section class="w-full">
								<ul class="flex w-full flex-col items-start space-y-5 px-4">
									{#each Object.entries($currQuiz.options) as option}
										<!-- {console.log(option)} -->
										<button
											on:click={() => selectAnswer(option[0])}
											class="flex w-full items-center justify-start gap-2 rounded-full px-6 py-3.5 transition-all {selectedAnswer !==
												option[0] &&
												' bg-secondary-supporting-pale-blue  text-primary-main_text-grey hover:bg-primary-main-yellow hover:text-white'} {(selectedAnswer ==
												option[0] &&
												answerStatus === 'correct' &&
												'  bg-primary-main-green text-white') ||
												(selectedAnswer == option[0] &&
													answerStatus === 'wrong' &&
													'bg-primary-main-red text-white')}"
										>
											<iconify-icon icon="ri:radio-button-fill"></iconify-icon>
											<span class="text-start font-lato">{option[1]}</span>
										</button>
									{/each}
								</ul>
							</section>
						</div>
					{/if}
				</div>
				<Drawer.Footer>
					<Button>Submit</Button>
				</Drawer.Footer>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
