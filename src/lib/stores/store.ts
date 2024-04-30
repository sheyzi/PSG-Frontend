import type { RawCourse } from '$lib/types/types';
import { writable } from 'svelte/store';

export const addCourseModalState = writable<boolean>(true);

export const Courses = writable<RawCourse[]>([]);
