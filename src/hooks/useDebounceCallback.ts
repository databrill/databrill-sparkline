import { debounce, DebouncedFunc } from "lodash";
import { DependencyList, useCallback } from "react";

/* eslint-disable react-hooks/exhaustive-deps */

const useDebounceCallback = <T extends (...args: any[]) => any>(
	fn: T,
	deps: DependencyList
): DebouncedFunc<T> => useCallback(debounce(fn, 100), deps);

export default useDebounceCallback;
