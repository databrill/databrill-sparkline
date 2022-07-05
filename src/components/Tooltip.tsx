import { memo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
	left?: number;
	top?: number;
	value?: string;
}

export const Tooltip = memo(({ left, top, value }: TooltipProps): JSX.Element | null => {
	const mount = document.getElementById("portal-root");
	const element = document.createElement("div");

	useLayoutEffect(() => {
		mount?.appendChild(element);

		return () => {
			mount?.removeChild(element);
		};
	}, [element, mount]);

	return createPortal(
		<div
			aria-label={value ? `${value}` : undefined}
			dangerouslySetInnerHTML={{ __html: value ?? "" }}
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
				zIndex: 1,
			}}
		/>,
		element
	);
});
