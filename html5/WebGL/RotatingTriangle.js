
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_modelMatrix;\n' +
    'void main () {\n' + 
    '   gl_Position = u_modelMatrix * a_Position;\n' +
    '}\n';
//
var FSHADER_SOURCE = 
    'void main() {\n' +
    '   gl_FragColor = vec4(0.0,1.0,0.0,1.0);\n' +
    '}\n';

var ANGLE = 45;

function main() {
    drawCoord();
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("init shader fialed!");
    }

    var n = initVertexBuffers(gl);

    gl.clearColor(0.0,0.0,0.0,1.0);
    

    
    // xformMatrix.setTranslate(0.5,0,0);
    // xformMatrix.rotate(ANGLE,0,0,1);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);

    var u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');

    var currentAngle = 0;
    var modelMatrix = new Matrix4();

    var tickDrew = function(){
        currentAngle = animate(currentAngle);
        drew(gl,n,currentAngle,modelMatrix,u_modelMatrix);

        requestAnimationFrame(tickDrew);
    }


    tickDrew();

    // gl.drawArrays(gl.LINES,0,n);
    // gl.drawArrays(gl.LINE_STRIP,0,n);
    // gl.drawArrays(gl.LINE_LOOP,0,n);
    // gl.drawArrays(gl.TRIANGLES,0,n);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
}

function drew(gl,n,currentAngle,modelMatrix,u_modelMatrix){
    modelMatrix.setRotate(currentAngle,0,0,1);
    gl.uniformMatrix4fv(u_modelMatrix,false,modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

var g_last = Date.now();

function animate(angle){
    var now = Date.now();
    var elapsed = now - g_last;

    g_last = now;

    var newAngle = angle + (ANGLE * elapsed) / 1000.0;

    return newAngle %= 360;
}

function drawCoord(canvas){
    var canvas = document.getElementById('coord');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,255,1.0';
    ctx.fillRect(0,canvas.height/2,canvas.width,1);
    ctx.fillRect(canvas.width/2,0,1,canvas.height);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
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