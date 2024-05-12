import { writable } from 'svelte/store';

export type Quiz = {
	answer: string;
	'answer-explanation': string;
	hint: string;
	options: string[];
	question: string;
};

export const QuizModalState = writable<boolean>(false);

export const currQuiz = writable<Quiz | null>(null);
export const Quizzes = writable<Quiz[]>([]);
export const QuizTimer = writable('');
