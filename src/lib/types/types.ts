export interface RawTopic {
	name: string;
	subtopics: RawTopic[];
}

export interface Topic {
	courseId: string;
	name: string;
	parentTopicId?: string;
	subtopics?: Topic[];
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
