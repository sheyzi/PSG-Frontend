import type { RawCourse } from '$lib/types/types';
import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const addCourseModalState = writable<boolean>(false);
export const currentUser = writable<User | null>(null);
export const courses = writable<RawCourse[]>([]);
