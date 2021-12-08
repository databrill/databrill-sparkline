const isColor = (value: string) => {
	const s = new Option().style;
	s.color = value;

	return s.color !== "";
};

export default isColor;
