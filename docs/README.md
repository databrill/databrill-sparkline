# databrill-sparkline

## **Commands**

<br/>

### `yarn build`

Removes `dist` directory and generates a new bundle.

<br/>

### `yarn dev`

Runs the project in development mode.

<br/>

### `yarn lint`

Checks code and types.

<br/>

### `yarn test`

Executes tests.

<br/>

## **Components**

<br/>

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
