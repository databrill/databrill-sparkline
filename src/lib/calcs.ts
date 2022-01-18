import { BarChartItem } from "../models/BarChartItem";

interface CalculateBarChartItemsProps {
	readonly barGap: number;
	readonly barWidth: number;
	readonly color: string;
	readonly height: number;
	readonly forceMin?: number;
	readonly values: readonly number[];
	readonly zeroColor: string;
}

export const calculateBarChartItems = ({
	barGap,
	barWidth,
	color,
	forceMin,
	height,
	values,
	zeroColor,
}: CalculateBarChartItemsProps): readonly BarChartItem[] => {
	let items: BarChartItem[] = [];
	const max = Math.max(...values);
	const min = forceMin ?? Math.min(...values);
	const minBarHeight = 1;
	const range = max - min;

	if (max === 0 && min === 0) {
		items = values.map((value, index) => ({
			color: zeroColor,
			height: minBarHeight,
			value,
			width: barWidth,
			x: index * (barGap + barWidth),
			y: 0,
		}));
	} else if (max <= 0 && min < 0) {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round(((value - max) * height) / range));

			return {
				color: value === 0 ? zeroColor : color,
				height: itemHeight + minBarHeight,
				value,
				width: barWidth,
				x: index * (barGap + barWidth),
				y: height - itemHeight - minBarHeight,
			};
		});
	} else if (min >= 0) {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round(((value - min) * height) / range));

			return {
				color: value === 0 ? zeroColor : color,
				height: itemHeight + minBarHeight,
				value,
				width: barWidth,
				x: index * (barGap + barWidth),
				y: 0,
			};
		});
	} else {
		items = values.map((value, index) => {
			const itemHeight = Math.abs(Math.round((value * height) / range));
			const zero = Math.round(((range - Math.abs(max)) * height) / range);

			return {
				color: value === 0 ? zeroColor : color,
				height: value >= 0 ? itemHeight + minBarHeight : itemHeight,
				value,
				width: barWidth,
				x: index * (barGap + barWidth),
				y: value < 0 ? zero - itemHeight : zero,
			};
		});
	}

	return items;
};
