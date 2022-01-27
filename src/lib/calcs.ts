import { BarChartItem } from "models/BarChartItem";
import { BarChartLayer } from "models/BarChartLayer";

const MIN_BAR_HEIGHT = 1;

interface CalculateBarChartItemsProps {
	readonly annotationColor: string;
	readonly barColor: string;
	readonly barGap: number;
	readonly barWidth: number;
	readonly canvasHeight: number;
	readonly forceMin?: number;
	readonly layers: readonly BarChartLayer[];
	readonly zeroColor: string;
}

export function calculateBarChartItems({
	annotationColor,
	barColor,
	barGap,
	barWidth,
	canvasHeight,
	forceMin,
	layers,
	zeroColor,
}: CalculateBarChartItemsProps): readonly BarChartItem[] {
	const hasLayers = !!layers.length;
	const hasValues = layers.every((layer) => !!layer.values.length);
	const items: BarChartItem[] = [];

	if (!(hasLayers && hasValues)) return items;

	const layersValues = layers.map((layer) => layer.values).flat(1);
	const max = Math.max(...layersValues);
	const min = forceMin ?? Math.min(...layersValues);
	const range = max - min;

	for (const layer of layers) {
		if (range === 0) {
			for (let i = 0; i < layer.values.length; i++) {
				const value = layer.values[i];
				const x = i * (barGap + barWidth);
				let color = value ? barColor : zeroColor;
				let type: BarChartItem["type"] = "bar";
				let y = 0;

				if (layer.type === "annotations") {
					color = annotationColor;
					type = "annotation";
					y = (value - min) * canvasHeight - MIN_BAR_HEIGHT;
				}

				items.push({ color, height: MIN_BAR_HEIGHT, type, value, width: barWidth, x, y });
			}
		} else {
			const zero = Math.round(((0 - min) * canvasHeight) / range);

			for (let i = 0; i < layer.values.length; i++) {
				const value = layer.values[i];
				const x = i * (barGap + barWidth);
				let color = value ? barColor : zeroColor;
				let type: BarChartItem["type"] = "bar";
				let y = Math.round(((value - min) * canvasHeight) / range);
				let height = Math.max(zero - y, MIN_BAR_HEIGHT);

				if (layer.type === "annotations") {
					color = annotationColor;
					height = MIN_BAR_HEIGHT;
					type = "annotation";
					if (y > zero) y = y - MIN_BAR_HEIGHT;
				} else {
					if (y > zero) {
						height = Math.max(y - zero, MIN_BAR_HEIGHT);
						y = zero;
					}
				}

				items.push({ color, height, type, value, width: barWidth, x, y });
			}
		}
	}

	return items;
}
