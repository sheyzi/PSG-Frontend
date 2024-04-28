import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { toast } from 'svelte-sonner';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom' | 'promise';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showToast = (message: string, type: ToastType, promise?: any) => {
	if (message) {
		if (type === 'success') {
			toast.success(message, {
				position: 'top-right',
				dismissable: true
				// class: 'h-[80px] md:w-[468px] w-[200px]  text-white',
				// classes: {
				// 	title: 'text-white',
				// 	success: 'bg-green-main text-white'
				// }
			});
		} else if (type === 'error') {
			toast.error(message, {
				position: 'top-right',
				dismissable: true
			});
		} else if (type === 'warning') {
			toast.warning(message, {
				position: 'top-right',
				dismissable: true
			});
		} else if (type === 'info') {
			// Blue background with white text
			toast.info(message, {
				position: 'top-right',
				dismissable: true
			});
		} else if (type === 'promise') {
			toast.promise(promise, {
				loading: 'Loading...',
				success: () => {
					return message;
				}
			});
		} else {
			toast(message, {
				position: 'top-right',
				dismissable: true
			});
		}
	}
};
