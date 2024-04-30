export type RawTopic = {
	name: string;
	subtopics: RawTopic[];
};

export type Topic = {
	courseId: string;
	name: string;
	parentTopicId?: string;
};

export type Course = {
	course_title: string;
	course_code?: string;
	course_desc?: string;
	userId: string;
	slug: string;
	topics: Topic[];
};
