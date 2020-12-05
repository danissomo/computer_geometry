
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
          ]);
  }