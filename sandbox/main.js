
/* eslint no-console:0 consistent-return:0 */


vertexShaderSource = getSourceSynch("/sandbox/vertex.vert");
fragmentShaderSource = getSourceSynch("/sandbox/frag.frag");

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
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);

  
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCube(gl, 50, 50, 50);
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
  var fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
  var fudgeFactor =  0.8;
  gl.uniform1f(fudgeLocation, fudgeFactor);
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  // Bind the position buffer.


  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
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

  for(var ii = 0; ii< 10; ii++ )
    for(var jj = 0; jj < 10; jj++){
      redrawCube( gl , 'y', ii*100 + gl.canvas.width/4 , gl.canvas.height/2+200, jj*100 )
    }
  // setInterval(redrawCube, 32, gl , 'y', gl.canvas.width/2, gl.canvas.height/2, 3 );
  // setInterval(redrawCube, 32, gl, 'x', gl.canvas.width/2-200*2, gl.canvas.height/2, 3);
  // setInterval(redrawCube, 32, gl, 'x', gl.canvas.width/2+200*2, gl.canvas.height/2, 3 );
}


anglex=0;
angley=0;
agelez=0;
function redrawCube(gl, axis, x, y, z){
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  switch (axis) {
    case 'y':
      updateCube(
        gl, x, y, z,  anglex, angley);
        angley++;
      break;
    case 'x':
      updateCube(
        gl, x, y, z, anglex , angley);
        anglex++;
    default:
      break;
  }
  
  

  //gl.clearColor(0, 0, 0, 0);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  // отрисовка прямоугольника
  gl.drawArrays(gl.TRIANGLES, 0, 6*6);
  if(angley == 360) angley =0;
 
  if(anglex == 360) anglex =0;
  
}

function updateCube(gl, x, y, z,  xrot, yrot, zrot =0 ){
  
  var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000);
    matrix = m4.translate(matrix, x, y, z);
    matrix = m4.xRotate(matrix, xrot * Math.PI / 180);
    matrix = m4.yRotate(matrix, yrot * Math.PI / 180);
    matrix = m4.zRotate(matrix, zrot* Math.PI / 180);
    matrix = m4.scale(matrix, 1, 1, 1);
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
}


function randomInt(range) {
  return Math.floor(Math.random() * range);
}

main();