// 04.js

"use strict";

// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
    'precision mediump float;\n'+
  'attribute mediump vec4 a_Position;\n' +
  'attribute mediump float  a_Size;\n'+
  'attribute mediump vec4 a_Color;\n'+
  'varying mediump vec4 v_Color;\n'+
  'void main() {\n' +
  '  v_Color = a_Color;\n'+
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_Size;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'varying mediump vec4 v_Color;\n'+
  'uniform mediump float u_Width;'+
  'uniform mediump float u_Height;'+
  'void main() {\n' +
  '  gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0,gl_FragCoord.y/u_Height, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    const n = 3; // The number of vertices

    const vertices = new Float32Array([
       0.0, 0.5, 
      -0.5, -0.5,
       0.5, -0.5]);
    const size = new Float32Array([
      10.0, 20.0, 30.0
    ])
    const color = new Float32Array([
      0.5, 0.6, 0.8,
      0.8, 0.5, 0.6,
      0.7, 0.5, 0.6
    ])
  // Create a buffer object
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*(size.length+vertices.length+ color.length) , gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, size);
  gl.bufferSubData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*size.length, vertices);
  gl.bufferSubData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*(vertices.length+size.length), color);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const a_Size = gl.getAttribLocation(gl.program, 'a_Size');
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  const u_Width =  gl.getUniformLocation(gl.program, 'u_Width');
  gl.uniform1f (u_Width, gl.drawingBufferWidth);
  gl.uniform1f (u_Height, gl.drawingBufferHeight);
  console.log(a_Color);
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.u
  var FSIZE = vertices.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, FSIZE*size.length);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, FSIZE*(vertices.length+size.length));
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Size);
  gl.enableVertexAttribArray(a_Color);
  return n;
}
