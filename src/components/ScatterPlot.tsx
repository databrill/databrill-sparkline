import { useDebounceCallback } from "hooks/useDebounceCallback";
import { calculateScatterPlotItems } from "lib/calcs";
import { clear, drawCircle, drawLine, setup } from "lib/canvas";
import { ScatterPlotItem } from "models/ScatterPlotItem";
import { ScatterPlotLayer } from "models/ScatterPlotLayer";
import { memo, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";

/* eslint-disable jsx-a11y/mouse-events-have-key-events */

export interface ScatterPlotProps {
	readonly className?: string;
	readonly layers: readonly ScatterPlotLayer[];
	readonly min?: number;
	readonly max?: number;
	readonly size: number;
}

export const ScatterPlot = memo(
	({
		className,
		layers,
		max: forceMax,
		min: forceMin,
		size: canvasSize,
	}: ScatterPlotProps): JSX.Element => {
		const ref = useRef<HTMLCanvasElement>(null);
		const [items, setItems] = useState<readonly ScatterPlotItem[]>(
			calculateScatterPlotItems({ canvasSize, forceMax, forceMin, layers })
		);
		const [showTooltip, setShowTooltip] = useState<boolean>(false);
		const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null);

		const handleMouseMove = useDebounceCallback(
			(event: MouseEvent<HTMLCanvasElement>): void => {
				const canvasPosition = ref.current?.getBoundingClientRect();
				const canvasLeft = canvasPosition?.left ?? 0;
				const canvasTop = canvasPosition?.top ?? 0;
				const x = event.clientX;
				const y = event.clientY;
				const current = items.find(
					(item) =>
						item.type === "plot" &&
						x >= item.x - item.size / 2 + canvasLeft &&
						x <= item.x + item.size / 2 + canvasLeft &&
						canvasSize + canvasTop - y >= item.y - item.size / 2 &&
						canvasSize + canvasTop - y <= item.y + item.size / 2
				);

				if (current && current.type === "plot") {
					setTooltipProps({ left: x + 8, top: y - 16, value: current?.value });
					setShowTooltip(true);
				} else {
					setShowTooltip(false);
				}

				setItems((prev) =>
					current?.type === "plot"
						? prev.map((item) =>
								item.type === "plot"
									? {
											...item,
											color:
												current.x === item.x
													? item.highlightColor
													: item.defaultColor,
									  }
									: item
						  )
						: prev
				);
			},
			[canvasSize, items]
		);

		const handleMouseOut = useCallback(() => {
			handleMouseMove.cancel();
			setItems((prev) =>
				prev.map((item) =>
					item.type === "plot" ? { ...item, color: item.defaultColor } : item
				)
			);
			setShowTooltip(false);
		}, [handleMouseMove]);

		useEffect(() => {
			setup({ canvas: ref.current, height: canvasSize, width: canvasSize });
		}, [canvasSize]);

		useEffect(() => {
			clear({ canvas: ref.current });
			items.forEach((item) => {
				if (item.type === "line") drawLine({ ...item, canvas: ref.current });
				else if (item.type === "plot") drawCircle({ ...item, canvas: ref.current });
			});
		}, [items]);

		return (
			<div className={className} style={{ display: "inline-flex", position: "relative" }}>
				<canvas onMouseMove={handleMouseMove} onMouseOut={handleMouseOut} ref={ref} />
				{showTooltip ? (
					<Tooltip
						left={tooltipProps?.left}
						top={tooltipProps?.top}
						value={tooltipProps?.value}
					/>
				) : null}
			</div>
		);
	}
);
