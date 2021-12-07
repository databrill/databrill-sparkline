import isColor from '../isColor';

describe('isColor', () => {
  it('must validate colors', () => {
    expect(isColor('')).toBeFalsy();
    expect(isColor('unknown')).toBeFalsy();
    expect(isColor('#000')).toBeTruthy();
    expect(isColor('rgb(255, 255, 255)')).toBeTruthy();
  });
});
