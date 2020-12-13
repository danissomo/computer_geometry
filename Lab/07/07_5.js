function setCube(width, height, length) {
  var x1 = -width / 2.0;
  var x2 = width / 2.0;
  var y1 = -height / 2.0;
  var y2 = height / 2.0;
  var z1 = -length / 2.0;
  var z2 = length / 2.0;
  var buf = new Float32Array([
    x1, y1, z1, // 0
    x2, y1, z1, // 1
    x2, y2, z1, // 2
    x1, y2, z1, // 3
    x1, y1, z2, // 4
    x2, y1, z2, // 5
    x2, y2, z2, // 6
    x1, y2, z2, // 7
  ])



  return buf;
}
const edges = [
  0, 1,
  1, 2,
  2, 3,
  3, 0,
  3, 7,
  0, 4,
  1, 5,
  2, 6,
  4, 5,
  5, 6,
  6, 7,
  7, 4
];
const facets = [
  0, 1, 2, 3,
  0, 1, 5, 4,
  1, 2, 6, 5,
  4, 5, 6, 7,
  0, 3, 7, 4,
  2, 3, 7, 6
];