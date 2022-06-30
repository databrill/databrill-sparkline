import { BarChartItem } from "models/BarChartItem";
import { BarChartLayer } from "models/BarChartLayer";
import { ScatterPlotItem } from "models/ScatterPlotItem";
import { ScatterPlotLayer } from "models/ScatterPlotLayer";

const DEFAULT_POINT_COLOR = "black";
const MIN_BAR_HEIGHT = 1;
const MIN_LINE_WIDTH = 1;
const MIN_POINT_SIZE = 1;

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

interface CalculateScatterPlotItemsProps {
	readonly canvasSize: number;
	readonly forceMin?: [x?: number, y?: number];
	readonly forceMax?: [x?: number, y?: number];
	readonly layers: readonly ScatterPlotLayer[];
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

export function calculateScatterPlotItems({
	canvasSize,
	forceMax,
	forceMin,
	layers,
}: CalculateScatterPlotItemsProps): readonly ScatterPlotItem[] {
	const items: ScatterPlotItem[] = [];
	const valuesX = layers.flatMap((lr) => [...lr.x]);
	const valuesY = layers.flatMap((lr) => [...lr.y]);
	const maxX = forceMax?.[0] ?? Math.max(...valuesX);
	const minX = forceMin?.[0] ?? Math.min(...valuesX);
	const maxY = forceMax?.[1] ?? Math.max(...valuesY);
	const minY = forceMin?.[1] ?? Math.min(...valuesY);
	const rangeX = maxX - minX;
	const rangeY = maxY - minY;

	for (const layer of layers) {
		if (layer.type === "line") {
			const width = layer.width ?? MIN_LINE_WIDTH;

			for (let i = 0; i < layer.x.length - 1; i++) {
				items.push({
					color: layer.color,
					fromX: Math.round(((layer.x[i] - minX) * canvasSize) / rangeX - width / 2),
					fromY: Math.round(((layer.y[i] - minY) * canvasSize) / rangeY - width / 2),
					strokeWidth: layer.width,
					toX: Math.round(((layer.x[i + 1] - minX) * canvasSize) / rangeX - width / 2),
					toY: Math.round(((layer.y[i + 1] - minY) * canvasSize) / rangeY - width / 2),
					type: layer.type,
				});
			}
		} else {
			for (let i = 0; i < layer.x.length; i++) {
				const color = layer.color ?? DEFAULT_POINT_COLOR;
				const size = layer.size ?? MIN_POINT_SIZE;
				const xValue = layer.x[i] ?? 0;
				const xPosition = Math.round(((xValue - minX) * canvasSize) / rangeX - size / 2);
				const yValue = layer.y[i] ?? 0;
				const yPosition = Math.round(((yValue - minY) * canvasSize) / rangeY - size / 2);
				const textValue = `${xValue},${yValue}`;

				items.push({
					defaultColor: color,
					color,
					highlightColor: layer.highlightColor,
					size,
					type: layer.type,
					value: textValue,
					x: rangeX === 0 ? 0 : Math.abs(xPosition),
					y: rangeY === 0 ? 0 : Math.abs(yPosition),
				});
			}
		}
	}

	return items;
}
