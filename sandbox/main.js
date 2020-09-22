var getSourceSynch = function(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
  };
/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  //генерируем шейдеры из файла
  var vertexShaderSource = getSourceSynch("/sandbox/vertex.vert");
  var fragmentShaderSource = getSourceSynch("/sandbox/frag.frag");
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  
  // Create a buffer to put colors in
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
 
  
  matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  // Bind the position buffer.



  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCube(gl, 200, 200, 200);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  var size = 3;                 // 3 components per iteration
  var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
  var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;               // start at the beginning of the buffer
  gl.vertexAttribPointer(
      colorLocation, size, type, normalize, stride, offset);
  // draw
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  
    // задаём произвольный прямоугольник
    // Запись будет происходить в positionBuffer,
    // так как он был привязан последник к
    // точке связи ARRAY_BUFFER
  setInterval(redrawCube, 32, gl , 'y');
  setInterval(redrawCube, 32, gl, 'x' );

}
anglex=0;
angley=0;
agelez=0;
function redrawCube(gl, axis){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  switch (axis) {
    case 'y':
      updateCube(
        gl, gl.canvas.width/2, gl.canvas.height/2, 3,  anglex, angley);
        angley++;
      break;
    case 'x':
      updateCube(
        gl, gl.canvas.width/2, gl.canvas.height/2, 3, anglex , angley);
        anglex++;
    default:
      break;
  }
  
  

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // отрисовка прямоугольника
  gl.drawArrays(gl.TRIANGLES, 0, 6*6);
  if(angley == 360) angley =0;
 
  if(anglex == 360) anglex =0;
  
}


function randomInt(range) {
  return Math.floor(Math.random() * range);
}



function updateCube(gl, x, y, z,  xrot, yrot, zrot =0 ){
  
  var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight,4000);
    matrix = m4.translate(matrix, x, y, z);
    matrix = m4.xRotate(matrix, xrot * Math.PI / 180);
    matrix = m4.yRotate(matrix, yrot * Math.PI / 180);
    matrix = m4.zRotate(matrix, zrot* Math.PI / 180);
    matrix = m4.scale(matrix, 1, 1, 1);
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
}
function setCube(gl,  width, height, length){
  var x1 = -width/2.0;
  var x2 = -width/2.0+  width;
  var y1= -height/2.0;
  var y2 = height- height/2.0;
  var z1 = -length/2.0;
  var z2 = length - length/2.0;
  var buf =new Float32Array([
    x2, y1, z1,
    x1, y1, z1,
    x1, y2, z1,
    x2, y1, z1,
    x1, y2, z1,
    x2, y2, z1,
    //2
    x2, y1, z2,
    x1, y2, z2,
    x1, y1, z2,
    x2, y1, z2,
    x2, y2, z2,
    x1, y2, z2,
    //3, 
    x1, y1, z1,
    x2, y1, z1,
    x1, y1, z2,
    x2, y1, z2,
    x1, y1, z2,
    x2, y1, z1,
    //4
    x2, y2, z1,
    x1, y2, z1,
    x1, y2, z2,
    x1, y2, z2,
    x2, y2, z2,
    x2, y2, z1,
    //5
    x1, y2, z1,
    x1, y1, z1,
    x1, y1, z2,
    x1, y2, z2,
    x1, y2, x1,
    x1, y1, z2,
    //6
    x2, y1, z1,
    x2, y2, z1,
    x2, y1, z2,
    x2, y2, x1,
    x2, y2, z2,
    x2, y1, z2,
  ])
  
    
  gl.bufferData(gl.ARRAY_BUFFER, buf , gl.STATIC_DRAW);
  return buf.length;
}
function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
          250,  0, 120,
          50,  0, 120,
          200,  0, 120,
          200,  0, 120,
          200,  0, 120,
          50,  0, 120,

          // top rung front
        50,  0, 120,
        50,  0, 120,
        200,  0, 120,
        200,  0, 120,
        200,  0, 120,
        50,  0, 120,

          // middle rung front
          0, 183, 226,
          0, 183, 226,
          0, 183, 226,
          0, 183, 226,
          0, 183, 226,
          0, 183, 226,

          50,  0, 120,
          50,  0, 120,
          200,  0, 120,
          200,  0, 120,
          200,  0, 120,
          50,  0, 120,

          250,  0, 120,
          50,  0, 120,
          200,  0, 120,
          200,  0, 120,
          200,  0, 120,
          50,  0, 120,

          50,  0, 120,
          50,  0, 120,
          200,  0, 120,
          200,  0, 120,
          200,  0, 120,
          50,  0, 120,
        ]),
      gl.STATIC_DRAW);
}
var m4 = {

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};
main();