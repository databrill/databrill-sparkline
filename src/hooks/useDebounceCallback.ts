import { DependencyList, useCallback } from "react";
import { debounce, DebounceFunction } from "lib/debounce";

/* eslint-disable react-hooks/exhaustive-deps */

export function useDebounceCallback<T extends (...args: any[]) => any>(
	fn: T,
	deps: DependencyList
): DebounceFunction<T> {
	return useCallback(debounce(fn, 100), deps);
}
