import { DrawCircleProps, DrawLineProps } from "lib/canvas";

export type ScatterPlotItem =
	| (Omit<DrawLineProps, "canvas"> & {
			readonly type: "line";
	  })
	| (Omit<DrawCircleProps, "canvas"> & {
			readonly defaultColor: string;
			readonly highlightColor?: string;
			readonly type: "plot";
			readonly value: string;
	  });
