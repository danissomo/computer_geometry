function setCube(width, height, length) {
  var x1 = -width / 2.0;
  var x2 = width / 2.0;
  var y1 = -height / 2.0;
  var y2 = height / 2.0;
  var z1 = -length / 2.0;
  var z2 = length / 2.0;
  var buf = new Float32Array([
    x1, y1, z1,
    x2, y1, z1,
    x2, y2, z1,
    x1, y2, z1,
    x1, y1, z2,
    x2, y1, z2,
    x2, y2, z2,
    x1, y2, z2,
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