import type { RawCourse } from '$lib/types/types';
import { writable } from 'svelte/store';

export const addCourseModalState = writable<boolean>(false);

export const courses = writable<RawCourse[]>([]);
