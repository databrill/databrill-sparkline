#!/bin/bash

rimraf .husky

husky install && husky add .husky/pre-commit "yarn lint-staged"
husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"' 
husky add .husky/pre-push "yarn test"

echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><div id="root"></div><script type="module" src="/src/index.tsx"></script></body></html>' > index.html
echo 'import { BarChart } from "./components";import ReactDOM from "react-dom";ReactDOM.render(<BarChart gap={4} highlightColor="red" size={50} values={[-1, -2, -3, -4, -20]} />,document.querySelector("#root"));' > src/index.tsx