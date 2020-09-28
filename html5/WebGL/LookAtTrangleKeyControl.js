
var VSHADER_SOURCE = 
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModeMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main () {\n' + 
    '   gl_Position = u_ViewMatrix * u_ModeMatrix * a_Position;\n' +
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
    

    var u_ModeMatrix = gl.getUniformLocation(gl.program,"u_ModeMatrix");
    var modeMatrix = new Matrix4();
    modeMatrix.setRotate(-10,1,0,0)
    gl.uniformMatrix4fv(u_ModeMatrix,false,modeMatrix.elements);

    var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0,0,g_eysZ,   0,0,0,  0,1,0);
    // viewMatrix.setLookAt(0.20,0.25,0.25,0,0,0,0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
    
    document.onkeydown = function(evt) {
        keyDown(evt,gl,n,u_ViewMatrix)
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

var g_eysX = 0,g_eysY = 0,g_eysZ = 0.25,step = 0.03;
function keyDown(evt,gl,n,u_ViewMatrix){
    console.log(evt.keyCode);
    if(evt.keyCode == 39){
        //right
        g_eysX += step;
    } else if(evt.keyCode == 38) {
        //up
        g_eysY += step;
    } else if(evt.keyCode == 40) {
        //down
        g_eysY -= step;
    } else if(evt.keyCode == 37) {
        //left
        g_eysX -= step;
    } else if(evt.keyCode == 65) {
        //a
        g_eysZ -= step;
    } else if(evt.keyCode == 68) {
        //d
        g_eysZ += step;
    } else if(evt.keyCode == 82) {
        //r
        g_eysX = g_eysY = 0; 
        g_eysZ = 0.25;
    }
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(g_eysX,g_eysY,g_eysZ,0,0,0,0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);

    console.log("eyeX: " + g_eysX + "\neyeY: " + g_eysY + "\neyeZ: " + g_eysZ);
}

function drawCoord(canvas){
    var canvas = document.getElementById('coord');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,255,1.0';
    ctx.fillRect(0,canvas.height/2,canvas.width,1);
    ctx.fillRect(canvas.width/2,0,1,canvas.height);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //green
        0.0,0.5,    -0.4,   0.4,1.0,0.4,
        -0.5,-0.5,  -0.4,   0.4,1.0,0.4,
        0.5,-0.5,   -0.4,   1.0,0.4,0.4,
        //yellow
        0.5,0.4,    -0.2,   1.0,0.4,0.4,
        -0.5,-0.4,  -0.2,   1.0,1.0,0.4,
        0.5,-0.6,   -0.2,   1.0,1.0,0.4,
        //bule
        0.0,0.3,     0.0,   0.4,0.4,1.0,
        -0.5,-0.6,   0.0,   0.4,0.4,1.0,
        0.5,-0.7,    0.0,   1.0,0.4,0.4,
    ]);
    var n = 9;

    
    var vertexBuffer = gl.createBuffer();
    
    var FSize = Float32Array.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');

    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSize * 6,0);

    gl.enableVertexAttribArray(a_Position);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSize * 6,FSize * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}