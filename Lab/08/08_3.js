"use strict";
class line {
    vertBuffer = [];
    colorBuffer = [];
    gl;
    constructor(point1, point2, color, gl) {
        this.vertBuffer = this.vertBuffer.concat(point1, point2)
        this.colorBuffer = this.colorBuffer.concat(color, color);
        this.vertBuffer = new Float32Array(this.vertBuffer);
        this.colorBuffer = new Uint8Array(this.colorBuffer);
        this.gl = gl;
    }
    setAttribs() {
        const vertexGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexGLBuffer);
        const FSIZE = this.colorBuffer.BYTES_PER_ELEMENT * this.colorBuffer.length +
            this.vertBuffer.BYTES_PER_ELEMENT * this.vertBuffer.length;
        gl.bufferData(gl.ARRAY_BUFFER, FSIZE, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vertBuffer));
        gl.bufferSubData(gl.ARRAY_BUFFER, this.vertBuffer.BYTES_PER_ELEMENT * this.vertBuffer.length, this.colorBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexGLBuffer);
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(a_Color, 3, gl.UNSIGNED_BYTE, true, 0, this.vertBuffer.BYTES_PER_ELEMENT * this.vertBuffer.length);

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);
    }
    draw() {
        gl.enable(gl.DEPTH_TEST);
        this.setAttribs();

        var primitiveType = gl.LINES;
        var offset = 0;
        var count = 2;
        gl.drawArrays(primitiveType, 0, count);
    }
};
function vec3Mul(a, b) {
    let out = [];
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out;
}
class cone {
    vertBuffer = []
    colorBuffer = []
    indexBuffer = []
    normalBuffer = []
    position = []
    resolution = 30
    rad = undefined
    height = undefined
    gl = undefined
    generateVertBuffer() {
        this.vertBuffer = [0, this.height / 2.0, 0];
        for (let ii = 0; ii < 360 / this.resolution; ii++) {
            let x = this.rad * Math.cos(ii * this.resolution * Math.PI / 180.0);
            let z = this.rad * Math.sin(ii * this.resolution * Math.PI / 180.0);
            this.vertBuffer.push(x);
            this.vertBuffer.push(-this.height / 2.0);
            this.vertBuffer.push(z);
        }
        this.vertBuffer.push(0);
        this.vertBuffer.push(-this.height / 2.0);
        this.vertBuffer.push(0);

        this.vertBuffer = new Float32Array(this.vertBuffer);
    }
    generateIndexBuffer = function () {
        this.indexBuffer = [];
        for (let ii = 1; ii < this.vertBuffer.length / 3 - 1; ii++) {
            this.indexBuffer.push(0);
            this.indexBuffer.push(ii);
            if (ii + 1 < this.vertBuffer.length / 3 - 1)
                this.indexBuffer.push(ii + 1);
            else
                this.indexBuffer.push(1);
        }
        for (let ii = 1; ii < this.vertBuffer.length / 3 - 1; ii++) {
            this.indexBuffer.push(this.vertBuffer.length / 3 - 1);

            if (ii + 1 < this.vertBuffer.length / 3 - 1)
                this.indexBuffer.push(ii + 1);
            else
                this.indexBuffer.push(1);
            this.indexBuffer.push(ii);
        }
        this.indexBuffer = new Uint16Array(this.indexBuffer);
    }
    generateColorBuffer = function (color) {
        for (let ii = 0; ii < this.vertBuffer.length / 3; ii++) {
            this.colorBuffer = this.colorBuffer.concat(color);
        }
        this.colorBuffer = new Uint8Array(this.colorBuffer);
    }

    init(rad, height, gl, color) {
        this.rad = rad;
        this.height = height;
        this.gl = gl;
        this.generateVertBuffer();
        this.generateIndexBuffer();
        this.generateNormalBuffer();
        this.generateColorBuffer(color);
    }

    drawNormal() {
        for (let i = 0; i < (this.vertBuffer.length) / 3; i++) {
            let p1 = [
                this.vertBuffer[(i) * 3],
                this.vertBuffer[(i) * 3 + 1],
                this.vertBuffer[(i) * 3 + 2]
            ];
            let p2 = [
                (this.normalBuffer[i * 3] + this.vertBuffer[(i) * 3]),
                (this.normalBuffer[i * 3 + 1] + this.vertBuffer[(i) * 3 + 1]),
                (this.normalBuffer[(i) * 3 + 2] + this.vertBuffer[(i) * 3 + 2])
            ];
            let normal = new line(p1, p2, [255, 0, 0], this.gl);
            normal.draw();
        }
    }

    draw() {
        //drawNormal();
        this.setAttribs();
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = this.indexBuffer.length;
        var indexType = gl.UNSIGNED_SHORT;
        gl.drawElements(primitiveType, count, indexType, offset);
    }

    setAttribs() {
        const vertexGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexGLBuffer);
        const FSIZE = this.colorBuffer.BYTES_PER_ELEMENT * this.colorBuffer.length +
            this.vertBuffer.BYTES_PER_ELEMENT * this.vertBuffer.length +
            3 * this.normalBuffer.BYTES_PER_ELEMENT * this.normalBuffer.length;
        const colorOffset = this.vertBuffer.BYTES_PER_ELEMENT * this.vertBuffer.length;
        const normalOffset = colorOffset // this.colorBuffer.BYTES_PER_ELEMENT * this.colorBuffer.length;
        let v = new Float32Array(this.vertBuffer), c = new Uint8Array(this.colorBuffer), n = new Float32Array(this.normalBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, FSIZE, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, v);
        // gl.bufferSubData(gl.ARRAY_BUFFER, colorOffset, c);
        gl.bufferSubData(gl.ARRAY_BUFFER, normalOffset, n);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexGLBuffer);


        const indexGLBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexGLBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indexBuffer),
            gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexGLBuffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        //const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        const a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
        gl.enableVertexAttribArray(a_Position);
        //gl.enableVertexAttribArray(a_Color);
        gl.enableVertexAttribArray(a_Normal);


        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        //gl.vertexAttribPointer(a_Color, 3, gl.UNSIGNED_BYTE, true, 0, colorOffset);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, normalOffset);


    }
    constructor() {

    }
    generateNormalBuffer() {

        let normalMap = new Map();
        for (let ii = 0; ii < this.vertBuffer.length / 3; ii++) {
            normalMap.set(ii, []);
            for (let jj = 0; jj < this.indexBuffer.length; jj++)
                if (ii == this.indexBuffer[jj])
                    normalMap.get(ii).push(Math.floor(jj / 3));
        }
        for (let [vertNum, vertPoly] of normalMap) {
            let sumNorm = vec3.create();
            for (let vert of vertPoly) {
                let normalI = vec3.create();
                let plygonV1 = NaN, plygonV2 = NaN;
                let v1Index = -1, v2Index = -1;
                let inverse2Flag = false;
                let inverse1Flag = false;
                if (this.indexBuffer[vert * 3] != vertNum)
                    v1Index = this.indexBuffer[vert * 3] * 3;
                if (this.indexBuffer[vert * 3 + 1] != vertNum)
                    v2Index = this.indexBuffer[vert * 3 + 1] * 3;
                if (v1Index == -1) {
                    v1Index = this.indexBuffer[vert * 3 + 2] * 3;
                    inverse1Flag = true;
                }
                if (v2Index == -1) {
                    v2Index = this.indexBuffer[vert * 3 + 2] * 3;
                    inverse2Flag = true;
                }
                plygonV1 = vec3.fromValues(this.vertBuffer[v1Index] - this.vertBuffer[vertNum * 3],
                    this.vertBuffer[v1Index + 1] - this.vertBuffer[vertNum * 3 + 1],
                    this.vertBuffer[v1Index + 2] - this.vertBuffer[vertNum * 3 + 2]);
                plygonV2 = vec3.fromValues(this.vertBuffer[v2Index] - this.vertBuffer[vertNum * 3],
                    this.vertBuffer[v2Index + 1] - this.vertBuffer[vertNum * 3 + 1],
                    this.vertBuffer[v2Index + 2] - this.vertBuffer[vertNum * 3 + 2]);
                vec3.normalize(plygonV1, plygonV1);
                vec3.normalize(plygonV2, plygonV2);
                let notVecMul = vec3.create();
                vec3.multiply(notVecMul, plygonV1, plygonV2);
                let sumNotVecMul = notVecMul[0] + notVecMul[1] + notVecMul[2];

                if (inverse2Flag)
                    normalI = vec3Mul(plygonV1, plygonV2);
                else
                    normalI = vec3Mul(plygonV2, plygonV1);


                vec3.normalize(normalI, normalI);
                vec3.add(sumNorm, sumNorm, normalI);
            }

            vec3.normalize(sumNorm, sumNorm);
            this.normalBuffer.push(sumNorm[0]);
            this.normalBuffer.push(sumNorm[1]);
            this.normalBuffer.push(sumNorm[2]);

        }
        this.normalBuffer = new Float32Array(this.normalBuffer);
    }

};

function main() {
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    const l_ModelViewMatrix =
        gl.getUniformLocation(gl.program, 'ModelViewMatrix');
    const l_MVP = gl.getUniformLocation(gl.program, "MVP");
    const l_InverseTranspose =
        gl.getUniformLocation(gl.program, "NormalMatrix");
    let light = {
        position: gl.getUniformLocation(gl.program, "lights[0].Position"),
        intensity: gl.getUniformLocation(gl.program, "lights[0].Intensity")
    };


    const Ka = gl.getUniformLocation(gl.program, "Ka");
    const Kd = gl.getUniformLocation(gl.program, "Ks");
    const Ks = gl.getUniformLocation(gl.program, "Kd");
    const Shininess = gl.getUniformLocation(gl.program, "Shininess");
    // 8 серебро 
    gl.uniform3fv(Ka, [0.1923, 0.1923, 0.1923]);
    gl.uniform3fv(Kd, [0.5075, 0.5075, 0.5075]);
    gl.uniform3fv(Ks, [0.5083, 0.5083, 0.5083]);
    gl.uniform1f(Shininess, 32);
    gl.uniform4fv(light.position, [3*0.7, -3*0.7, 3, 0]);
    gl.uniform3fv(light.intensity, [0.2, 1, 0.2]);

    let myCone = new cone();
    myCone.init(2, 2, gl, [0.1, 0.1, 0]);
    let i = 0;

    requestAnimationFrame(
        function f(params) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);



            let projectionMatrix = mat4.create();
            mat4.frustum(projectionMatrix, -1, 1, -1, 1, 1, 2000);

            let cameraMatrix = mat4.create();
            mat4.lookAt(cameraMatrix, [0, 0, 4], [0, 0, 0], [0, 1, 0]);

            let viewMatrix = mat4.invert(mat4.create(), cameraMatrix);
            let viewProjectionMatrix = mat4.multiply(mat4.create(), projectionMatrix, cameraMatrix);

            let worldMatrix = mat4.rotateY(mat4.create(), mat4.create(), i * Math.PI / 180);

            let MVP = mat4.multiply(mat4.create(), viewProjectionMatrix, worldMatrix);
            let worldInv = mat4.invert(mat4.create(), worldMatrix);
            let worldInvTrans = mat4.transpose(mat4.create(), worldInv);
            
            gl.uniformMatrix4fv(l_InverseTranspose, false, worldInvTrans );
            gl.uniformMatrix4fv(l_MVP, false, MVP);
            gl.uniformMatrix4fv(l_ModelViewMatrix, false, worldMatrix);
        




         
            myCone.draw();
            i++;
            requestAnimationFrame(f);
        }

    )

}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix;
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec3 a_Normal;\n' +

    'struct LightInfo{\n' +
    '   vec4 Position;\n' +
    '   vec3 Intensity;\n' +
    '};\n' +
    'uniform LightInfo lights[5];\n' +
    'uniform vec3 Kd;\n' +
    'uniform vec3 Ka;\n' +
    'uniform vec3 Ks;\n' +
    'uniform float Shininess;\n' +

    'uniform mat4 ModelViewMatrix;\n' +
    'uniform mat4 NormalMatrix;\n' + //world inverse transpose
    'uniform mat4 MVP;\n' + //world view projection

    'varying vec3 v_Color;\n' +
    'vec3 ads( int lightIndex, vec4 position, vec3 norm ){\n' +
    '   vec3 s = normalize( vec3(lights[lightIndex].Position - position) );\n' +
    '   vec3 v = normalize(vec3(-position));\n' +
    '   vec3 r = reflect( -s, norm );\n' +
    '   vec3 I = lights[lightIndex].Intensity;\n' +
    '   return I * ( Ka + Kd * max( dot(s, norm), 0.0 ) + Ks * pow( max( dot(r,v), 0.0 ), Shininess ) );\n' +
    '}\n' +

    'void main() {\n' +
    '   vec3 eyeNorm = normalize( mat3(NormalMatrix) * a_Normal);\n' +
    '   vec4 eyePosition = ModelViewMatrix * a_Position;\n' +
    '   v_Color = vec3(0.0);\n' +
    '   for( int i = 0; i < 5; i++ )\n' +
    '       v_Color += ads( i, eyePosition, eyeNorm );\n' +
    '   gl_Position = MVP * a_Position;\n' +
    '}\n';
const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying  vec3 v_Color;\n' +
    'void main() {\n' +
    'gl_FragColor = vec4(v_Color, 1.0);' +
    '}\n';

const canvas = document.getElementById('webgl');
const gl = getWebGLContext(canvas);


