
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'void main () {\n' + 
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'void main() {\n' +
    '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("init shader fialed!");
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttrib3f(a_Position,0.0,0.5,0.0);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    canvas.onmousedown = function(ev) {
        click(ev,gl,canvas,a_Position);
    }

    // gl.drawArrays(gl.POINTS,0,1);
}

function click(ev,gl,canvas,a_Position) {
    var x = ev.clientX;
    var y = ev.clientY;

    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = -((y - rect.top) - canvas.height/2) / (canvas.height/2);

    gl.vertexAttrib3f(a_Position,x,y,0.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,1);
}