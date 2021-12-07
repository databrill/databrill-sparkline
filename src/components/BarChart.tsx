import createBarChart from 'lib/createBarChart';
import drawImage from 'lib/drawImage';
import { memo, useEffect, useRef } from 'react';

export type BarChartProps = {
  barWidth?: number;
  className?: string;
  color?: string;
  gap?: number;
  size: number;
  values: number[];
};

export const BarChart = memo(
  ({ barWidth = 20, className, color, gap = 0, size, values }: BarChartProps) => {
    const height = size;
    const width = (values.length - 1) * (barWidth + gap) + barWidth;
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const component = createBarChart({ barWidth, color, gap, height, values, width });
      const container = ref.current;
      const context = container?.getContext('2d');

      if (component && container && context) {
        context.clearRect(0, 0, container.width, container.height);
        drawImage({ component, container });
      }
    }, [barWidth, color, gap, height, size, values, width]);

    return <canvas className={className} height={height} ref={ref} width={width} />;
  }
);
