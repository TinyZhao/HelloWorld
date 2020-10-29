
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main () {\n' + 
    '   gl_Position = u_MvpMatrix * a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';
//
var FSHADER_SOURCE = 
    'precision highp float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
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

    gl.enable(gl.DEPTH_TEST);

    initTexture(gl,n);

    
    // var viewProjMatrix = new Matrix4();
    // viewProjMatrix.setPerspective(30,1,1,100);
    // viewProjMatrix.lookAt(5,5,5,0,0,0,0,1,0);

    // var u_MvpMatrix = gl.getUniformLocation(gl.program,"u_MvpMatrix");

    // currentAngle = [0.0,0.0];
    // initEventHandlers(canvas,currentAngle);

    // var tickDraw = function(){
    //     draw(gl,n,viewProjMatrix,u_MvpMatrix,currentAngle);

    //     requestAnimationFrame(tickDraw);
    // }


    // tickDraw();
}

var g_MvpMatrix = new Matrix4();

function draw(gl,n,viewProjMatrix,u_MvpMatrix,currentAngle){
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle[0],1.0,0.0,0.0);
    g_MvpMatrix.rotate(currentAngle[1],0.0,1.0,0.0);
    
    gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}

function initEventHandlers(canvas,currentAngle){
    var dragging = false;
    var lastX = -1, lastY = -1;

    canvas.onmousedown = function(ev){
        var x = ev.clientX, y = ev.clientY;

        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.rigth && rect.top <= y && y < rect.bottom){
            lastX = x;
            lastY = y;

            dragging = true;
        }
    }

    canvas.onmouseup = function(ev){dragging = false;}

    canvas.onmousemove = function(ev){
        var x = ev.clientX, y = ev.clientY;
        if(dragging){
            var factor = 100/canvas.height;
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);

            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy,90.0),-90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x,lastY = y;
    }

    document.onkeydown = function(evt) {
        keyDown(evt)
    }
}

function keyDown(evt){
    console.log(evt.keyCode);
    var step = 5;
    if(evt.keyCode == 39){
        //right
        currentAngle[1] += step;
    } else if(evt.keyCode == 37) {
        //left
        currentAngle[1] -= step;
    } else if(evt.keyCode == 38) {
        //up
        currentAngle[0] += step;
    } else if(evt.keyCode == 40) {
        //down
        currentAngle[0] -= step;
    } else {
        return;
    }
}

function drawCoord(canvas){
    var canvas = document.getElementById('coord');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,255,1.0';
    ctx.fillRect(0,canvas.height/2,canvas.width,1);
    ctx.fillRect(canvas.width/2,0,1,canvas.height);
}

function initVertexBuffers(gl) {
    var verticesTexCoord = new Float32Array([
        -0.5,0.5,   0.0,0.0,
        -0.5,-0.5,  0.0,0.0,
        0.5,0.5,    1.0,1.0,
        0.5,-0.5,   1.0,0.0,
    ]);

    var n = 4;

    
    var vertexTexCoordBuffer = gl.createBuffer();
    
    var FSize = Float32Array.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoord,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSize * 4,0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSize * 4,FSize * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTexture(gl,n) {
    var texture = gl.createTexture();

    var u_Sampler = gl.getUniformLocation(gl.program,"u_Sampler");

    var img = new Image();

    img.onload = function(){
        loadTexture(gl,n,texture,u_Sampler,img);
    }

    img.src = "./res/res1.png";

    return true;
}

function loadTexture(gl,n,texture,u_Sampler,img){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);

    gl.uniform1i(u_Sampler,0);


    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);

}