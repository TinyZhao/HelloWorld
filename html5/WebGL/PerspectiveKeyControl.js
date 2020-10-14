
var VSHADER_SOURCE = 
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_PorjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main () {\n' + 
    '   gl_Position = u_PorjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
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
    canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("init shader fialed!");
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);

    var n = initVertexBuffers(gl);

    gl.clearColor(0.0,0.0,0.0,1.0);

    var nf = document.getElementById("nearFar");
    

    u_PorjMatrix = gl.getUniformLocation(gl.program,"u_PorjMatrix");
    u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
    u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
    
    document.onkeydown = function(evt) {
        keyDown(evt,gl,n,nf);
    }

    drew(gl,n,nf);
}

function drew(gl,n,nf){
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(g_eysX,g_eysY,g_eysZ,0,0,-100,0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);

    var projMatrix = new Matrix4();
    projMatrix.setPerspective(30,canvas.width/canvas.height,1,g_far);
    gl.uniformMatrix4fv(u_PorjMatrix,false,projMatrix.elements);

    var modelMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);

    gl.polygonOffset(1.0,1.0);
    modelMatrix.setTranslate(-0.75,0,0);
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES,0,n);

    // modelMatrix.setTranslate(-1.5,0,0);
    // gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    // gl.drawArrays(gl.TRIANGLES,0,n);
}

var g_eysX = 0,g_eysY = 0,g_eysZ = 5,g_near = 0,g_far = 100,step = 0.05;
function keyDown(evt,gl,n,nf){
    console.log(evt.keyCode);
    
    switch (evt.keyCode) {
        case 87: g_far += step; break;
        case 83: g_far -= step; break;
        case 68: g_near += step; break;
        case 65: g_near -= step; break;
        case 39: 
            g_eysX += step;
            break;
        case 37: 
            g_eysX -= step;
            break;
        case 38: 
            g_eysY += step;
            break;
        case 40: 
            g_eysY -= step;
            break;
        case 82: 
            g_near = 0;
            g_far = 0.5;
            g_eysX = g_eysY = 0; 
            g_eysZ = 5;
            break;
    
        default:
            return;
    }

    drew(gl,n,nf);
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
        0.75,1.0,    -4,   0.4,1.0,0.4,
        0.25,-1.0,   -4,   0.4,1.0,0.4,
        1.25,-1.0,  -4,   1.0,0.4,0.4,
        //yellow
        0.75,1.0,    -2,   1.0,0.4,0.4,
        0.25,-1.0,  -2,   1.0,1.0,0.4,
        1.25,-1.0,   -2,   1.0,1.0,0.4,
        //bule
        0.75,1.0,     0.0,   0.4,0.4,1.0,
        0.25,-1.0,   0.0,   0.4,0.4,1.0,
        1.25,-1.0,    0.0,   1.0,0.4,0.4,

        //green
        // -0.75,1.0,    -4,   0.4,1.0,0.4,
        // -1.25,-1.0,   -4,   0.4,1.0,0.4,
        // -0.25,-1.0,  -4,   1.0,0.4,0.4,
        // //yellow
        // -0.75,1.0,    -2,   1.0,0.4,0.4,
        // -1.25,-1.0,  -2,   1.0,1.0,0.4,
        // -0.25,-1.0,   -2,   1.0,1.0,0.4,
        // //bule
        // -0.75,1.0,     0.0,   0.4,0.4,1.0,
        // -1.25,-1.0,   0.0,   0.4,0.4,1.0,
        // -0.25,-1.0,    0.0,   1.0,0.4,0.4,
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