import createBarChart from "lib/createBarChart";
import drawImage from "lib/drawImage";
import React, { useRef, useEffect } from "react";

export interface BarChartProps {
	readonly barWidth?: number;
	readonly className?: string;
	readonly color?: string;
	readonly gap?: number;
	readonly size: number;
	readonly values: number[];
}

export function BarChart({
	barWidth = 20,
	className,
	color,
	gap = 0,
	size,
	values,
}: BarChartProps): JSX.Element {
	const height = size;
	const width = (values.length - 1) * (barWidth + gap) + barWidth;
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const component = createBarChart({ barWidth, color, gap, height, values, width });
		const container = ref.current;
		const context = container?.getContext("2d");

		if (component && container && context) {
			context.clearRect(0, 0, container.width, container.height);
			drawImage({ component, container });
		}
	}, [barWidth, color, gap, height, size, values, width]);

	return <canvas className={className} height={height} ref={ref} width={width} />;
}
