export interface RawTopic {
	name: string;
	subtopics: RawTopic[];
}

export interface Resource {
	url: string;
	content?: string;
}

export interface Topic {
	id?: string;
	courseId: string;
	name: string;
	parentTopicId?: string;
	subtopics?: Topic[];
	note?: string;
	resources: Resource[];
}

export interface RawTopicContent {
	note: string;
	resources: Resource[];
}

export interface RawCourse {
	course_title: string;
	course_code?: string;
	course_desc?: string;
	userId: string;
	slug: string;
}

export interface Course extends RawCourse {
	id?: string;
	topics?: Topic[];
}

export type QuizRequestParam = {
	text: string;
	topic: string;
};

export type Quiz = {
	question: string;
	options: Record<'a' | 'b' | 'c' | 'd', string>;
	answer: 'a' | 'b' | 'c' | 'd';
	hint: string;
	'answer-explanation': string;
};

export type QuizResponse =
	| { status: 'success'; quizzes: Quiz[] }
	| { status: 'error'; message: string };
