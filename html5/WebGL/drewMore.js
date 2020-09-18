
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    '//uniform vec4 u_Translation;\n' +
    'uniform float u_CosB,u_SinB;\n' +
    'void main () {\n' + 
    '   gl_Position = a_Position;' +
    '   //gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    '   //gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
    '   //gl_Position.z = a_Position.z;\n' +
    '   //gl_Position.w = 1.0;\n' + 
    '}\n';
//
var FSHADER_SOURCE = 
    'void main() {\n' +
    '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    drawCoord();
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("init shader fialed!");
    }

    var n = initVertexBuffers(gl);


    var radian = Math.PI * 90 / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_CosB = gl.getUniformLocation(gl.program,'u_CosB');
    gl.uniform1f(u_CosB,cosB);
    var u_SinB = gl.getUniformLocation(gl.program,'u_SinB');
    gl.uniform1f(u_SinB,sinB);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.LINES,0,n);
    // gl.drawArrays(gl.LINE_STRIP,0,n);
    // gl.drawArrays(gl.LINE_LOOP,0,n);
    gl.drawArrays(gl.TRIANGLES,0,n);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
}

function drawCoord(canvas){
    var canvas = document.getElementById('coord');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,255,0,1.0';
    ctx.fillRect(0,canvas.height/2,canvas.width,1);
    ctx.fillRect(canvas.width/2,0,1,canvas.height);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5,-0.5,0,0.5,0.5,-0.5
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');

    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}