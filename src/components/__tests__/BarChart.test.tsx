import { render } from '@testing-library/react';
import { BarChart } from '..';

describe('BarChart', () => {
  it('must accept custom classes', () => {
    const { container } = render(<BarChart className="jest" />);
    const component = container.getElementsByClassName('jest');

    expect(component[0]?.classList).toContain('jest');
  });
});
