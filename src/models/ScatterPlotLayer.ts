export type ScatterPlotLayer = {
	readonly color?: string;
	readonly x: readonly number[];
	readonly y: readonly number[];
} & (
	| {
			readonly type: "line";
			readonly width?: number;
	  }
	| {
			readonly highlightColor?: string;
			readonly size?: number;
			readonly type: "plot";
	  }
);
