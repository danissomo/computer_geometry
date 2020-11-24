// 04.js

"use strict";
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
// Vertex shader program
const VSHADER_SOURCE =
    '#version 100\n' +
  'attribute vec4 a_Position;\n' +
  'attribute float  a_Size;\n'+
  'uniform mat4 u_Mat;'+
  'void main() {\n' +
  '  gl_Position = u_Mat * a_Position;\n' +
  '  gl_PointSize = a_Size;\n' +
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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
  const u_Mat = gl.getUniformLocation(gl.program, 'u_Mat');
  let rotationmatrix = mat4.create();
  mat4.fromZRotation(rotationmatrix, 0 );
  gl.uniformMatrix4fv(u_Mat, 0, rotationmatrix);
  // Draw three points
  gl.drawArrays(gl.TRIANGLES, 0, n);
  mat4.fromZRotation(rotationmatrix, -30*Math.PI/180.0 );
  gl.uniformMatrix4fv(u_Mat, 0, rotationmatrix);
  gl.drawArrays(gl.TRIANGLES, 0, n);
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
    const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*9 , gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  gl.bufferSubData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*6, size);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const a_Size = gl.getAttribLocation(gl.program, 'a_Size');
  
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  var FSIZE = vertices.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 0, FSIZE*6);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Size);
  return n;
}
