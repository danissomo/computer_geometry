//у меня в vscode стоит расширение, которое поднимает сервер 
//так что пользуюсь им и получаю шейдеры из файла
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


  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);


  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCube(gl, 200, 200, 200);

  var colorLocation = gl.getAttribLocation(program, "a_color");
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //Очищаем canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);


  matrixLocation = gl.getUniformLocation(program, "u_matrix");
  var fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
  var fudgeFactor = 0.3;
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

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  var i = 0;
  setInterval(function(){
    //компаную матрицу позиционирования
  var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000); //перспектива просто чтобы было
  matrix = m4.translate(matrix, gl.canvas.width / 2, gl.canvas.height / 2, 3); // ставлю в центр куб
  //генерирую матрицу поворота вокруг оси параллельной Oy
  matrixRot = m4.yRotate( m4.translation(-100, 0 , -100),i/2); //1
  matrixRot = m4.translate(matrixRot, 100,0 , 100); //2
  matrix = m4.multiply(  matrix, matrixRot); // применяю матрицу поворота вокруг оси параллельной Oy

  // рисуем
  gl.uniformMatrix4fv(matrixLocation, false, matrix); 
  gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
  i++;
  }, 100)
  
}


main();