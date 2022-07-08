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
	readonly valueFormatter?: (value: number, index: number) => string;
	readonly zeroColor: string;
}

interface CalculateScatterPlotItemsProps {
	readonly forceMin?: [x?: number, y?: number];
	readonly forceMax?: [x?: number, y?: number];
	readonly height: number;
	readonly layers: readonly ScatterPlotLayer[];
	readonly width: number;
	readonly xLogBase?: number;
	readonly yLogBase?: number;
	readonly valueFormatter?: (value: [x: number, y: number], index: number) => string;
}

export function calculateBarChartItems({
	annotationColor,
	barColor,
	barGap,
	barWidth,
	canvasHeight,
	forceMin,
	layers,
	valueFormatter,
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

				items.push({
					color,
					height: MIN_BAR_HEIGHT,
					type,
					value: valueFormatter?.(value, i) ?? `${value}`,
					width: barWidth,
					x,
					y,
				});
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

				items.push({
					color,
					height,
					type,
					value: valueFormatter?.(value, i) ?? `${value}`,
					width: barWidth,
					x,
					y,
				});
			}
		}
	}

	return items;
}

export function calculateScatterPlotItems({
	forceMax,
	forceMin,
	height,
	layers,
	valueFormatter,
	width,
	xLogBase,
	yLogBase,
}: CalculateScatterPlotItemsProps): readonly ScatterPlotItem[] {
	const items: ScatterPlotItem[] = [];
	let xMinScaled: number = Number.MAX_VALUE;
	let xMaxScaled: number = Number.MIN_VALUE;
	let yMinScaled: number = Number.MAX_VALUE;
	let yMaxScaled: number = Number.MIN_VALUE;
	const layerDatas = layers.map((layer) => {
		const points: {
			readonly x: number;
			readonly y: number;
			readonly xScaled: number;
			readonly yScaled: number;
		}[] = [];
		for (let i = 0; i < layer.x.length; i++) {
			let ok = true;
			const x = layer.x[i];
			const y = layer.y[i];
			let xScaled = x;
			let yScaled = y;
			if (xLogBase && xLogBase > 1) {
				if (layer.x[i] <= 0) {
					ok = false;
				} else {
					xScaled = Math.log(x) / Math.log(xLogBase);
				}
			}
			if (yLogBase && yLogBase > 1) {
				if (layer.y[i] <= 0) {
					ok = false;
				} else {
					yScaled = Math.log(y) / Math.log(yLogBase);
				}
			}
			if (ok) {
				points.push({ x, y, xScaled, yScaled });
				// Update the min and max values
				if (x < xMinScaled) {
					xMinScaled = xScaled;
				}
				if (x > xMaxScaled) {
					xMaxScaled = xScaled;
				}
				if (y < yMinScaled) {
					yMinScaled = yScaled;
				}
				if (y > yMaxScaled) {
					yMaxScaled = yScaled;
				}
			}
		}
		return {
			layer,
			points,
		};
	});
	xMinScaled = forceMin?.[0] ?? (xMinScaled !== Number.MAX_VALUE ? xMinScaled : 0);
	xMaxScaled = forceMax?.[0] ?? (xMaxScaled !== Number.MIN_VALUE ? xMaxScaled : 0);
	yMinScaled = forceMin?.[1] ?? (yMinScaled !== Number.MAX_VALUE ? yMinScaled : 0);
	yMaxScaled = forceMax?.[1] ?? (yMaxScaled !== Number.MIN_VALUE ? yMaxScaled : 0);
	const rangeX = xMaxScaled - xMinScaled;
	const rangeY = yMaxScaled - yMinScaled;

	for (const layerData of layerDatas) {
		const { layer, points } = layerData;
		if (layer.type === "line") {
			const width = layer.width ?? MIN_LINE_WIDTH;

			for (let i = 0; i < points.length - 1; i++) {
				const { xScaled: x0, yScaled: y0 } = points[i];
				const { xScaled: x1, yScaled: y1 } = points[i + 1];
				items.push({
					color: layer.color,
					fromX: Math.round(((x0 - xMinScaled) * width) / rangeX - width / 2),
					fromY: Math.round(((y0 - yMinScaled) * height) / rangeY - width / 2),
					strokeWidth: layer.width,
					toX: Math.round(((x1 - xMinScaled) * width) / rangeX - width / 2),
					toY: Math.round(((y1 - yMinScaled) * height) / rangeY - width / 2),
					type: layer.type,
				});
			}
		} else {
			for (let i = 0; i < points.length; i++) {
				const color = layer.color ?? DEFAULT_POINT_COLOR;
				const size = layer.size ?? MIN_POINT_SIZE;
				const point = points[i];
				const xValue = point.x;
				const xScaled = point.xScaled;
				const xCanvas = Math.round(((xScaled - xMinScaled) * width) / rangeX - size / 2);
				const yValue = point.y;
				const yScaled = point.yScaled;
				const yCanvas = Math.round(((yScaled - yMinScaled) * height) / rangeY - size / 2);
				const textValue = valueFormatter?.([xValue, yValue], i) ?? `${xValue}, ${yValue}`;

				items.push({
					defaultColor: color,
					color,
					highlightColor: layer.highlightColor,
					size,
					type: layer.type,
					value: textValue,
					x: rangeX === 0 ? 0 : Math.abs(xCanvas),
					y: rangeY === 0 ? 0 : Math.abs(yCanvas),
				});
			}
		}
	}

	return items;
}
