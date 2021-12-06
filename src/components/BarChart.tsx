import { memo } from 'react';

export type Props = {
  className?: string;
};

export const BarChart = memo(({ className }: Props) => <div className={className} />);

export type BarChartProps = Props;
