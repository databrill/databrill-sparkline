export interface BarChartItem {
	readonly color: string;
	readonly height: number;
	readonly type: "bar" | "annotation";
	readonly value: string;
	readonly width: number;
	readonly x: number;
	readonly y: number;
}
