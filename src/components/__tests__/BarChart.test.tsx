import { render } from '@testing-library/react';
import { BarChart } from '..';

describe('BarChart', () => {
  it('must accept custom classes', () => {
    const { container } = render(<BarChart className="jest" size={200} values={[0, 1, 2, 3]} />);
    const component = container.getElementsByClassName('jest')[0];

    expect(component?.classList).toContain('jest');
  });
});
