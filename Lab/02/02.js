// 02.js

"use strict";
// Vertex shader program
const VSHADER_SOURCE =
'varying vec4 v_color;\n'+
'attribute vec4 a_FragColor;'+
'attribute vec4 a_Position;\n' + // attribute variable
 'void main() {\n' +
 '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
'  gl_Position = a_Position;\n' +
 '  gl_PointSize = 10.0;\n' +                    // Set the point size
 'v_color = a_FragColor;\n'+
 '}\n';

// Fragment shader program
const FSHADER_SOURCE =
' precision mediump float;\n'+
'varying vec4 v_color;\n'+
 'void main() {\n' +
 '  gl_FragColor = v_color;\n' + // Set the point color
 '}\n';

function main() {
  // Retrieve <canvas> element
    const canvas = document.getElementById('mycanvas');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Set clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
     console.log('Failed to intialize shaders.');
     return;
   }

   // Get the storage location of a_Position
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
     console.log('Failed to get the storage location of a_Position');
     return;
  }
  const a_FragColor = gl.getAttribLocation(gl.program, 'a_FragColor');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_FragColor');
    return;
  }
   // Pass vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.vertexAttrib3f(a_FragColor, 0.1, 1.0, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.vertexAttrib3f(a_Position, 0.1, 0.0, 0.0);
  gl.vertexAttrib3f(a_FragColor, 0.3, 0.1, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.vertexAttrib3f(a_Position, 0.0, 0.1, 0.0);
  gl.vertexAttrib3f(a_FragColor, 0.3, 0.5, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
}
