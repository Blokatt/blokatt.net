function main() {
    var canvas = $("#canvas-visual");    
    var gl = canvas[0].getContext("webgl2");
    if (!gl) {
        return;
    }     
    gl.clientWidth = canvas.width;
    gl.clientHeight = canvas.height;
    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
