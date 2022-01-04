#!/bin/bash

rimraf .husky

husky install && husky add .husky/pre-commit "yarn lint-staged"
husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"' 
husky add .husky/pre-push "yarn test"

echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><div id="react-root"></div><div id="portal-root"></div><script type="module" src="/src/index.tsx"></script></body></html>' > index.html
echo 'import { BarChart,ScatterPlot } from "./components";import ReactDOM from "react-dom";ReactDOM.render(<div style={{ display: "flex", flexDirection: "column" }}><BarChart size={250} values={[-10, -5, 0, 10, 15, 20]} /><ScatterPlot dotSize={8}size={250}x={[-1, 12, 7, 5, 1, 10, 9, 15]}y={[0, 3, 12, 4, 14, 5, 10, 15]}/></div>,document.querySelector("#react-root"));' > src/index.tsx