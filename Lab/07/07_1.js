// 04.js

"use strict";
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;
function setCube(width, height, length){
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
  
    
 
  return buf;
}
function setColors() {
  return new Uint8Array([
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
        ]);
}
// Vertex shader program
const VSHADER_SOURCE =
  'attribute vec4 a_Position, a_Color;\n' +
  'uniform mat4 u_Mat;'+
  'varying mediump vec4 v_Color;\n'+
  'void main() {\n' +
  '  gl_Position = u_Mat * a_Position;\n' + 
  'v_Color = a_Color;'+
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
'varying mediump vec4 v_Color;\n'+
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
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
  gl.clearColor(0, 0, 0, 0);

  // Clear <canvas>
  const u_Mat = gl.getUniformLocation(gl.program, 'u_Mat');
  let rotationmatrix = mat4.create();
  rotationmatrix = mat4.create();
  gl.uniformMatrix4fv(u_Mat, 0, rotationmatrix);
  mat4.fromZRotation(rotationmatrix, rotationmatrix, Math.PI/180);
  // Draw three points

  gl.drawArrays(gl.TRIANGLES, 0, n);
 
  let i = 0;
  setInterval(function(){
    mat4.fromTranslation(rotationmatrix,  vec3.fromValues(0, 0, 0)  );
    mat4.rotateZ(rotationmatrix, rotationmatrix ,i*Math.PI/180 );
    mat4.rotateX(rotationmatrix, rotationmatrix ,i*Math.PI/180 );
    gl.uniformMatrix4fv(u_Mat, 0, rotationmatrix);
    // Draw three points
   
    i++;
    }, 22);
    setInterval(function(){
     
      gl.drawArrays(gl.TRIANGLES, 0, n);
    }, 16);
     
}

function initVertexBuffers(gl) {
  let vertices =  setCube(1, 1,1);
  let color = setColors();
  const n = vertices.length ; // The number of vertices

   
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT*vertices.length + color.BYTES_PER_ELEMENT*color.length , gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  gl.bufferSubData(gl.ARRAY_BUFFER,vertices.BYTES_PER_ELEMENT*vertices.length, color);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color  < 0) console.log(  "a_Color < 0 : "+ a_Color);

  var FSIZE = vertices.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(a_Color, 3, gl.UNSIGNED_BYTE, true, 0, vertices.BYTES_PER_ELEMENT*vertices.length );
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);
  return n;
}
