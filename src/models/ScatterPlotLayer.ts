export type ScatterPlotLayer =
	| {
			readonly color?: string;
			readonly type: "line";
			readonly width?: number;
			readonly x: readonly number[];
			readonly y: readonly number[];
	  }
	| {
			readonly color?: string;
			readonly highlightColor?: string;
			readonly size?: number;
			readonly type: "plot";
			readonly x: readonly number[];
			readonly y: readonly number[];
	  };
