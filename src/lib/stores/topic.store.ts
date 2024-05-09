import { writable } from 'svelte/store';

export type TopicToSend = {
	topic: string;
	text: string;
};
export const currTopic = writable<TopicToSend>({} as TopicToSend);
