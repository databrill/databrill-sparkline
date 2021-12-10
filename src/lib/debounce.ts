/* eslint-disable @typescript-eslint/ban-ts-comment */

export interface DebounceFunction<T> {
	(): T;
	cancel(): void;
}

const debounce = <T extends (...args: any[]) => any>(
	fn: T,
	timeout: number
): DebounceFunction<T> => {
	let timeoutId: number | undefined;

	// @ts-ignore
	const next = (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => fn(...args), timeout);
	};
	// @ts-ignore
	next.cancel = () => window.clearTimeout(timeoutId);

	return next as DebounceFunction<T>;
};

export default debounce;
