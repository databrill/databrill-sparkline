# databrill-sparkline

## **Commands**

### `yarn build`

Removes `dist` directory and generates a new bundle.

### `yarn dev`

Runs the project in development mode.

### `yarn lint`

Checks code and types.

### `yarn setup`

Sets up development environment.

### `yarn test`

Executes tests.

<br/>

## **Components**

### BarChart

<br/>

| Property       | Type     |  Default    | Optional | Description                                                                               |
| -------------- | -------- | ----------- | -------- | ----------------------------------------------------------------------------------------- |
| barWidth       | number   | 20          | `true`   | Set chart bars width                                                                      |
| className      | string   | `undefined` | `true`   | Applies to container                                                                      |
| color          | string   | black       | `true`   | Set color on chart bars                                                                   |
| gap            | number   | `undefined` | `true`   | Set space between chart bars                                                              |
| highlightColor | string   | red         | `true`   | Set highlight color on hover chart bar                                                    |
| size           | number   | `undefined` | `false`  | Set height to chart (width will be auto-calculated based on `barWidth`, `gap` and `size`) |
| values         | number[] | `undefined` | `false`  | An array with values that will generate chart bars                                        |

### ScatterPlot

<br/>

| Property          | Type     |  Default    | Optional | Description                                                                         |
| ----------------- | -------- | ----------- | -------- | ----------------------------------------------------------------------------------- |
| className         | string   | `undefined` | `true`   | Applies to container                                                                |
| dotColor          | string   | black       | `true`   | Set color on dots                                                                   |
| dotHighlightColor | string   | red         | `true`   | Set highlight color on hover dot                                                    |
| dotSize           | number   | 8           | `true`   | Set dot size                                                                        |
| size              | number   | `undefined` | `false`  | Set height and width to plot                                                        |
| stepX             | number   | `undefined` | `true`   | Set steps by this value in X axis. If not, plot will split into 4                   |
| stepY             | number   | `undefined` | `true`   | Set steps by this value in Y axis. If not, plot will split into 4                   |
| x                 | number[] | `undefined` | `false`  | An array with values that will generate dots, it should have the same length as y[] |
| y                 | number[] | `undefined` | `false`  | An array with values that will generate dots, it should have the same length as x[] |
