export interface BarChartItem {
	readonly color: string;
	readonly height: number;
	readonly type: "bar" | "annotation";
	readonly value: number;
	readonly width: number;
	readonly x: number;
	readonly y: number;
}
