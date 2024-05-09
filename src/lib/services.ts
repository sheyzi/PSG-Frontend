import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireStoreDb } from './firebase';
import type { Course, Quiz, RawCourse, Topic } from './types/types';

export const structureTopics = (topics: Topic[]): Topic[] => {
	const topicMap = new Map<string, Topic>();

	function buildStructure(parentId?: string): Topic[] {
		let topicsToRestructure = [];
		if (parentId) {
			topicsToRestructure = topics.filter((topic) => topic.parentTopicId === parentId);
		} else {
			topicsToRestructure = topics.filter((topic) => !topic.parentTopicId);
		}

		return topicsToRestructure.map((topic) => {
			const structuredTopic = { ...topic, subtopics: buildStructure(topic.id) };
			topicMap.set(topic.id, structuredTopic);
			return structuredTopic;
		});
	}

	// Find root topics (no parentTopicId)
	const structuredTopics = buildStructure(); // Build the hierarchy
	return structuredTopics;
};
export const getTopics = async (courseId: string, parentTopicId?: string) => {
	const topicsRef = collection(fireStoreDb, 'topics');

	let q = query(topicsRef, where('courseId', '==', courseId));

	if (parentTopicId) {
		q = query(
			topicsRef,
			where('courseId', '==', courseId),
			where('parentTopicId', '==', parentTopicId)
		);
	}

	const topicsSnap = await getDocs(q);

	if (topicsSnap.empty) {
		return [];
	} else {
		let topics: Topic[] = [];

		topicsSnap.forEach((topic) => {
			let topicData = topic.data() as Topic;

			topics.push({
				id: topic.id,
				...topicData,
				subtopics: []
			});
		});

		topics = structureTopics(topics);

		return topics;
	}
};

export const getCourse = async (slug: string): Promise<Course | null> => {
	const courseRef = collection(fireStoreDb, 'courses');
	const q = query(courseRef, where('slug', '==', slug));
	const courseSnapShot = await getDocs(q);

	if (courseSnapShot.empty) {
		return null;
	} else {
		const course = courseSnapShot.docs[0];
		const topics = await getTopics(course.id);
		return {
			...(course.data() as RawCourse),
			id: course.id,
			topics
		};
	}
};

export const getQuizzes = async (topic: string, text: string): Quiz[] => {
	return;
};
