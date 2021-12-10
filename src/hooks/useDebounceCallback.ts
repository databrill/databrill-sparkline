import { DependencyList, useCallback } from "react";
import debounce, { DebounceFunction } from "lib/debounce";

/* eslint-disable react-hooks/exhaustive-deps */

const useDebounceCallback = <T extends (...args: any[]) => any>(
	fn: T,
	deps: DependencyList
): DebounceFunction<T> => useCallback(debounce(fn, 100), deps);

export default useDebounceCallback;
