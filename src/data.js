const colors = [
  "#1b9e77",
  "#d95f02",
  "#7570b3",
  "#e7298a",
  "#66a61e",
  "#e6ab02",
];

const data1 = {
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 13 },
    { x: 4, y: 17 },
  ],
  color: "#1b9e77",
};

const data2 = {
  data: [
    { x: 1, y: 16 },
    { x: 2, y: 5 },
    { x: 3, y: 11 },
    { x: 4, y: 9 },
    { x: 5, y: 10 },
    { x: 6, y: 4 },
  ],
  color: "#7570b3",
};

const data3 = {
  data: [
    { x: 1, y: 2 },
    { x: 2, y: 7 },
    { x: 3, y: 3 },
    { x: 4, y: 18 },
    { x: 5, y: 10 },
  ],
  color: "#e7298a",
};

export const linesGenerator = (linesAmount, dotsAmount, min, max) =>
  [...Array(linesAmount).keys()].map(() => ({
    data: [...Array(dotsAmount).keys()].map((dot, i) => ({
      x: i + 1,
      y: Math.floor(Math.random() * max) + min,
    })),
    color: colors[colors.length * Math.random() | 0],
  }));

export const data = [data1, data2, data3];

// const generatedData = linesGenerator(5, 10, 1, 100);
// export const data = generatedData;
