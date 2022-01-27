export interface BarChartLayer {
	readonly type: "bars" | "annotations";
	readonly values: readonly number[];
}
