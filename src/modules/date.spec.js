import { sortByDate, formatTime } from './date'

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

describe(`sortByDate`, () => {
  it(`Should sort by date ASC`, () => {
    const baseData = [
      { id: 1, creationTime: 1548318531104 },
      { id: 2, creationTime: 1558318531104 },
      { id: 3, creationTime: 1548318531104 },
      { id: 4, creationTime: 1548378531104 },
    ]
    const sortedData = sortByDate(`creationTime`, baseData)

    expect(sortedData[0].id).toEqual(1)
    expect(sortedData[1].id).toEqual(3)
    expect(sortedData[2].id).toEqual(4)
    expect(sortedData[3].id).toEqual(2)
  });
});
