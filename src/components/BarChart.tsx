import { setup } from "lib/canvas";
import { memo, useEffect, useRef } from "react";

export interface BarChartProps {
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly gap?: number;
	readonly size: number;
	readonly values: readonly number[];
}

export const BarChart = memo(
	({
		barWidth = 20,
		className,
		color = "black",
		gap = 0,
		size,
		values,
	}: BarChartProps): JSX.Element => {
		const height = size;
		const width = (values.length - 1) * (barWidth + gap) + barWidth;
		const ref = useRef<HTMLCanvasElement>(null);

		useEffect(() => {
			if (ref.current) {
				setup({
					canvas: ref.current,
					gap,
					height,
					itemColor: color,
					items: values,
					itemWidth: barWidth,
					width,
				});
			}
		}, [barWidth, color, gap, height, size, values, width]);

		return <canvas className={className} ref={ref} />;
	}
);
