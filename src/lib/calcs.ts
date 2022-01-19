import { BarChartItem } from "models/BarChartItem";

interface CalculateBarChartItemsProps {
	readonly barGap: number;
	readonly barWidth: number;
	readonly canvasHeight: number;
	readonly color: string;
	readonly forceMin?: number;
	readonly values: readonly number[];
	readonly zeroColor: string;
}

export const calculateBarChartItems = ({
	barGap,
	barWidth,
	canvasHeight,
	color,
	forceMin,
	values,
	zeroColor,
}: CalculateBarChartItemsProps): readonly BarChartItem[] => {
	if (!values.length) return [];

	let items: BarChartItem[] = [];
	const max = Math.max(...values);
	const min = forceMin ?? Math.min(...values);
	const minBarHeight = 1;
	const range = max - min;

	if (range === 0) {
		items = values.map((value, index) => ({
			color: zeroColor,
			height: minBarHeight,
			value,
			width: barWidth,
			x: index * (barGap + barWidth),
			y: 0,
		}));
	} else {
		const zero = Math.round(((0 - min) * canvasHeight) / range);

		items = values.map((value, index) => {
			const y = Math.round(((value - min) * canvasHeight) / range);
			const height = Math.max(y > zero ? y - zero : zero - y, minBarHeight);

			return {
				...(y > zero ? { height, y: zero } : { height, y }),
				color: value === 0 ? zeroColor : color,
				value,
				width: barWidth,
				x: index * (barGap + barWidth),
			};
		});
	}

	return items;
};
