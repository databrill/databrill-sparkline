import isColor from "./isColor";

interface Props {
	barWidth: number;
	color?: string;
	gap: number;
	height: number;
	values: number[];
	width: number;
}

const createBarChart = ({ barWidth, color = "black", gap, height, values, width }: Props) => {
	if (barWidth < 1) barWidth = 1;
	if (!isColor(color)) color = "black";
	if (gap < 0) gap = 0;
	if (!values.length) return null;

	const cartesian = document.createElementNS("http://www.w3.org/2000/svg", "g");
	cartesian.setAttribute("transform", `scale(1,-1) translate(0,-${height})`);

	const container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	container.appendChild(cartesian);
	container.setAttribute("fill", color);
	container.setAttribute("height", `${height}`);
	container.setAttribute("width", `${width}`);

	const max = Math.max(...values);
	const min = Math.min(...values);
	const total = Math.abs(max) + Math.abs(min);

	for (let i = 0; i < values.length; i++) {
		const value = values[i];
		const componentHeight = (Math.abs(value) * 100) / total;
		const componentWidth = barWidth;
		const x = i === 0 ? i * componentWidth : i * (componentWidth + gap);
		const y =
			value > 0
				? (Math.abs(min) * 100) / total
				: (Math.abs(min) * 100) / total - componentHeight;

		const component = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		component.setAttribute("height", `${componentHeight}%`);
		component.setAttribute("width", `${componentWidth}`);
		component.setAttribute("x", `${x}`);
		component.setAttribute("y", `${y}%`);
		cartesian.appendChild(component);
	}

	return container;
};

export default createBarChart;
