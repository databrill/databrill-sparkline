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

| Property        | Type                                                  |  Default    | Optional | Description                                                                                |
| --------------- | ----------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------ |
| annotationColor | string                                                | blue        | `true`   | Set color on chart annotations                                                             |
| barColor        | string                                                | black       | `true`   | Set color on chart bars                                                                    |
| barGap          | number                                                | `undefined` | `true`   | Set space between chart bars                                                               |
| barWidth        | number                                                | 20          | `true`   | Set chart bars width                                                                       |
| className       | string                                                | `undefined` | `true`   | Applies to container                                                                       |
| highlightColor  | string                                                | red         | `true`   | Set highlight color on hover chart bar                                                     |
| layers          | { type: "bars" \| "annotations", values: number[] }[] | `undefined` | `false`  | An array with layers that will generate chart bars and annotations based on type and order |
| min             | number                                                | `undefined` | `true`   | Force min value allowed                                                                    |
| size            | number                                                | `undefined` | `false`  | Set height to chart (width will be auto-calculated based on `barWidth`, `gap` and `size`)  |
| zeroColor       | string                                                | black       | `true`   | Set color on chart values equal to zero                                                    |

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
