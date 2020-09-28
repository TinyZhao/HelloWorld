
var VSHADER_SOURCE = 
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main () {\n' + 
    '   gl_Position = a_Position;\n' +
    '   v_Color = a_Color;\n' +
    '}\n';
//
var FSHADER_SOURCE = 
    'precision highp float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';


function main() {
    drawCoord();
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("init shader fialed!");
    }

    var n = initVertexBuffers(gl);

    gl.clearColor(0.0,0.0,0.0,1.0);


    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);



    // gl.drawArrays(gl.LINES,0,n);
    // gl.drawArrays(gl.LINE_STRIP,0,n);
    // gl.drawArrays(gl.LINE_LOOP,0,n);
    // gl.drawArrays(gl.TRIANGLES,0,n);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
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
        0.0,0.5, 1.0,0.0,0.0,
        -0.5,-0.5, 0.0,1.0,0.0,
        0.5,-0.5, 0.0,0.0,1.0,
    ]);
    var n = 3;

    
    var vertexBuffer = gl.createBuffer();
    
    var FSize = Float32Array.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');

    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSize * 5,0);

    gl.enableVertexAttribArray(a_Position);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSize * 5,FSize * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}