export const isValid = (value: string): boolean => {
	const style = new Option().style;
	style.color = value;

	return style.color !== "";
};
