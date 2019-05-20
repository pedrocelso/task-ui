import { formatTime } from './date'

describe(`formatTime`, () => {
  it(`Should format date properly`, () => {
    const formattedDate = formatTime(1556924666404)
    expect(formattedDate).toEqual(`2019/05/03, 4:04:26 pm`)
  });

  it(`Should retutn n/a for 0 millis`, () => {
    const formattedDate = formatTime(0)
    expect(formattedDate).toEqual(`n/a`)
  });
});