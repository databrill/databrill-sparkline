import { memo } from "react";

export interface TooltipProps {
	hidden?: boolean;
	left?: number;
	top?: number;
	value?: number;
}

export const Tooltip = memo(
	({ hidden = true, left, top, value }: TooltipProps): JSX.Element | null => {
		if (hidden) return null;

		return (
			<div
				aria-label={value ? `${value}` : undefined}
				role="tooltip"
				style={{
					backgroundColor: "rgba(60, 60, 60, 0.75)",
					borderRadius: "4px",
					color: "white",
					fontSize: "12px",
					left,
					padding: "2px 8px",
					position: "absolute",
					textAlign: "center",
					top,
				}}
			>
				{value}
			</div>
		);
	}
);
