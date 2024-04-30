export type RawTopic = {
	name: string;
	subtopics: RawTopic[];
};

export type Topic = {
	courseId: string;
	name: string;
	parentTopicId?: string;
};

export interface RawCourse {
	course_title: string;
	course_code?: string;
	course_desc?: string;
	userId: string;
	slug: string;
}

export interface Course extends RawCourse {
	topics: Topic[];
}
