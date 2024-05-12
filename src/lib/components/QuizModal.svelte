<script lang="ts">
	import { page } from '$app/stores';
	import { axiosClient } from '$lib/axios';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import { QuizModalState, QuizTimer, Quizzes, currQuiz, type Quiz } from '$lib/stores/quiz.store';
	import { currTopic } from '$lib/stores/topic.store';
	import { showToast } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import ProgressBar from '@okrad/svelte-progressbar';
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	let generating = false;
	let currentQuestionIndex = 0;

	let timeLeft = 120;
	let timerInterval;
	let formattedTime = '0';

	function displayQuestion() {
		answerStatus = null;
		currQuiz.set($Quizzes[currentQuestionIndex]);
		timer();
	}

	function updateFormattedTime() {
		if (timeLeft === 0) {
			// console.log('formatted time', formattedTime);
			QuizTimer.set('0:00');
			return;
		}
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;

		const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;
		formattedTime = `${minutes}:${paddedSeconds}`;
		QuizTimer.set(formattedTime);
	}

	// $: console.log('time left', timeLeft);
	// $: console.log('Quiz', $Quizzes);

	function timer() {
		timeLeft = 120;

		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft === 0) {
				clearInterval(timerInterval);
				nextQuestion();
			}
			updateFormattedTime();
		}, 1000);
	}

	function nextQuestion() {
		selectedAnswer = '';
		answerStatus = null;
		currentQuestionIndex++;

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
	$: selectedAnswer = '';

	function selectAnswer(currAnswer: string, selectedOption) {
		selectedAnswer = currAnswer;

		if (selectedOption === $currQuiz?.answer) {
			score[0] = score[0] + 100 / $Quizzes.length;
		}
	}

	let score = [0];

	// $: console.log(score);

	const thresholds = [
		{
			till: 40,
			color: '#DD3428'
		},
		{
			till: 60,
			color: '#FBBF10'
		},
		{
			till: 80,
			color: '#1A73E8'
		},
		{
			till: 100,
			color: '#269745'
		}
	];
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

<Sheet.Root onOpenChange={(e) => QuizModalState.set(e)} bind:open={$QuizModalState}>
	<Sheet.Content class="w-[90vw] bg-white">
		<div class="relative h-full w-full bg-inherit">
			{#if $Quizzes.length < 1}
				<div
					transition:slide={{ delay: 250, duration: 300 }}
					class="absolute left-0 top-0 flex h-full w-full bg-white"
				>
					<section
						class="mx-auto my-3 flex w-full max-w-sm flex-col items-center justify-center rounded-md border-black"
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

			<div class=" mx-auto h-full w-full max-w-4xl py-3">
				<Sheet.Header class="flex-row items-center justify-between border-0 border-b-2 pb-3">
					<div class="flex flex-col space-y-2">
						<Sheet.Title class="font-lato text-xl font-semibold"
							>Quiz <span class="text-primary-main-yellow">AI</span></Sheet.Title
						>
						<Sheet.Description>Select your answer before time runs out.</Sheet.Description>
					</div>
					{#if $currQuiz}
						<span class="font-lato text-xl text-primary-main_text-grey">{$QuizTimer}</span>
					{/if}
				</Sheet.Header>
				<div class=" no-scrollbar h-fit max-h-[90vh] overflow-y-scroll p-6">
					{#if $Quizzes.length > 0}
						{#if $currQuiz}
							<div
								in:slide={{ axis: 'x' }}
								out:slide={{ axis: 'x' }}
								class=" flex flex-col items-start justify-center space-y-8 py-6 transition-all"
							>
								<div class="flex w-full items-center justify-between">
									<h5
										class="flex max-w-[80%] flex-col items-start gap-2 font-lato text-2xl font-semibold"
									>
										{$currQuiz.question}
									</h5>
									<Popover.Root>
										<Popover.Trigger>
											<iconify-icon icon="icons8:idea" class="text-primary-main-yellow" width="28"
											></iconify-icon>
											<span class="sr-only">Hint</span>
										</Popover.Trigger>
										<Popover.Content
											class="w-full min-w-fit max-w-lg rounded border-0 border-l-2 border-primary-main-yellow text-sm "
											>{$currQuiz.hint}</Popover.Content
										>
									</Popover.Root>
								</div>
								<section class="w-full max-w-xl">
									<ul class="flex w-full flex-col items-start space-y-5 px-4">
										{#each Object.entries($currQuiz.options) as option}
											<!-- {console.log(option)} -->
											<button
												disabled={$QuizTimer === '0:00'}
												on:click={() => selectAnswer(option[1], option[0])}
												class="flex w-full items-center justify-start gap-2 rounded-full px-6 py-3.5 text-primary-main_text-grey transition-all hover:text-white disabled:bg-muted disabled:hover:text-primary-grey {selectedAnswer ===
												option[1]
													? 'bg-primary-main-green text-white hover:bg-primary-main-green/80'
													: 'bg-secondary-supporting-pale-blue hover:bg-primary-main-yellow'} "
											>
												<iconify-icon icon="ri:radio-button-fill"></iconify-icon>
												<span class="text-start font-lato">{option[1]}</span>
											</button>
										{/each}
									</ul>
								</section>
							</div>
							<Sheet.Footer class={$Quizzes.length < 1 ? 'hidden' : 'flex max-w-xl'}>
								<button
									disabled={!selectedAnswer}
									on:click={() => nextQuestion()}
									class="flex items-center gap-1 rounded bg-black px-6 py-1.5 text-sm text-primary-main-yellow disabled:bg-muted disabled:text-black"
								>
									<span class="sr-only">Next question</span>
									<iconify-icon icon="mage:next-fill" width="20"></iconify-icon>
								</button>
							</Sheet.Footer>
						{:else}
							<div
								class=" flex flex-col items-center justify-center space-y-8 py-6 text-primary-main_text-grey transition-all"
							>
								<div class="w-full max-w-52">
									<p class="text-bold mb-3 text-center font-montserrat text-xl">Your score:</p>
									<ProgressBar
										bind:series={score}
										style="radial"
										{thresholds}
										thickness={3}
										textSize={200}
									/>
								</div>

								<Accordion.Root class="w-full space-y-2.5 sm:max-w-[70%]">
									{#each $Quizzes as quiz}
										<Accordion.Item value="item-{$Quizzes.indexOf(quiz) + 1}">
											<Accordion.Trigger class="text-wrap text-start"
												>{quiz.question}</Accordion.Trigger
											>
											<Accordion.Content class="flex flex-col space-y-5">
												<div class="flex items-center gap-2 font-lato">
													<span class="text-xs font-semibold">Answer:</span>
													<p class=" uppercase">{quiz.answer}</p>
												</div>
												<!-- <div class="flex items-start gap-2 font-lato">
														<span class="text-xs font-semibold text-primary-main-blue"
															>Explanation:</span
														>
														<p>{quiz['answer-explanation']}</p>
													</div> -->
											</Accordion.Content>
											<Accordion.Content class="flex flex-col ">
												<!-- <div class="flex items-baseline gap-2 font-lato">
														<span class="text-xs font-semibold">Answer:</span>
														<p class="p-0 text-xl">{quiz.answer}</p>
													</div> -->
												<div class="flex items-start gap-2 font-lato">
													<span class="text-xs font-semibold">Explanation:</span>
													<p>{quiz['answer-explanation']}</p>
												</div>
											</Accordion.Content>
										</Accordion.Item>
									{/each}
								</Accordion.Root>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
