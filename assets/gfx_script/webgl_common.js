function shaderProgram(gl, vsh, fsh) {
    const vert = loadShader(gl, gl.VERTEX_SHADER, vsh);
    const frag = loadShader(gl, gl.FRAGMENT_SHADER, fsh);

    const outProgram = gl.createProgram();
    gl.attachShader(outProgram, vert);
    gl.attachShader(outProgram, frag);
    gl.linkProgram(outProgram);
    if (!gl.getProgramParameter(outProgram, gl.LINK_STATUS)) {
        alert("Failed to link shader program.");
        return null;
    }

    return outProgram;
}

function loadShader(gl, type, src) {
    const outShader = gl.createShader(type);
    gl.shaderSource(outShader, src);
    gl.compileShader(outShader);

    if (!gl.getShaderParameter(outShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(outShader));
        gl.deleteShader(outShader);
        return null;
    }

    return outShader;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

function shaderProgramFull(gl, vsh, fsh) {
    var shaderProg = shaderProgram(gl, vsh, fsh);
    if (shaderProg) {
        return {
            program: shaderProg,
            attributes: {
                position: gl.getAttribLocation(shaderProg, "a_vPosition"),
                uv: gl.getAttribLocation(shaderProg, "a_vTexcoord")
            },
            uniforms: {
                sampler: gl.getUniformLocation(shaderProg, 'u_sampler'),
                colour: gl.getUniformLocation(shaderProg, "u_vColour"),
                modelTransform: gl.getUniformLocation(shaderProg, "u_vTransformModel"),
                cameraTransform: gl.getUniformLocation(shaderProg, "u_vTransformCamera")
            }
        }
    }
    return null;
}

function createObject(pos, uv) {
    const vPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    ///        
    const vUVBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vUVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

    return {
        position: vPosBuffer,
        uv: vUVBuffer
    }
}

function prepareGenericAttributes(shape, program) {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.position);
    gl.vertexAttribPointer(
        program.attributes.position,
        numComponents,
        type,
        normalize,
        stride,
        0);
    gl.enableVertexAttribArray(program.attributes.position);

    //
    gl.bindBuffer(gl.ARRAY_BUFFER, shape.uv);
    gl.vertexAttribPointer(
        program.attributes.uv,
        2,
        gl.FLOAT,
        false,
        0,
        0);
    gl.enableVertexAttribArray(program.attributes.uv);
}

function drawObject(shape) {

    prepareGenericAttributes(shape, passShaderProgram);

    gl.useProgram(passShaderProgram.program);

    gl.uniform1i(passShaderProgram.uniforms.sampler, 0);
    gl.uniform4fv(passShaderProgram.uniforms.colour, blendColour);
    gl.uniformMatrix3fv(passShaderProgram.uniforms.modelTransform, false, modelTransform);
    gl.uniformMatrix3fv(passShaderProgram.uniforms.cameraTransform, false, cameraTransform);

    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function setModelTransform(arr) {
    //check dimensions    
    if (arr.length != 9) return;
    modelTransform = arr;
    return modelTransform;
}

function setCameraTransform(arr) {
    //check dimensions    
    if (arr.length != 9) return;
    cameraTransform = arr;
    return cameraTransform;
}

function createFBO(width, height) {

    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    {
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, 0);

    return {
        buffer: fb,
        texture: targetTexture
    };
}

var blendColour = [1, 1, 1, 1];

const MATRIX_IDENTITY = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
];

var modelTransform = MATRIX_IDENTITY;
var cameraTransform = MATRIX_IDENTITY;

const vshPass = `
precision mediump float;
attribute vec2 a_vPosition;
attribute vec2 a_vTexcoord;
varying vec4 v_vColour;
varying vec2 v_vTexcoord;
uniform vec4 u_vColour;
uniform mat3 u_vTransformModel;
uniform mat3 u_vTransformCamera;
void main() {
    v_vColour = u_vColour;
    v_vTexcoord = a_vTexcoord;
    vec3 vPos = u_vTransformCamera * u_vTransformModel * vec3(a_vPosition.xy, 1.);
    gl_Position = vec4(vPos.xy, 0., 1.);
}
`

const fshPass = `
precision mediump float;
varying vec4 v_vColour;
varying vec2 v_vTexcoord;
uniform sampler2D u_sampler;
void main() {
    gl_FragColor = v_vColour * texture2D(u_sampler, v_vTexcoord);    
    gl_FragColor.rgb *= v_vColour.a;
}
`

var gl;
var passShaderProgram;

