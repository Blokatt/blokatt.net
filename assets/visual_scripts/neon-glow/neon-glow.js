var gl;
var c = 0.0;

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

const vshBlur = `
precision mediump float;
attribute vec2 a_vPosition;
attribute vec2 a_vTexcoord;
varying vec4 v_vColour;
varying vec2 v_vTexcoord;
uniform vec4 u_vColour;
uniform mat3 u_vTransformModel;
void main() {
    v_vColour = u_vColour;
    v_vTexcoord = a_vTexcoord;
    vec3 vPos = u_vTransformModel * vec3(a_vPosition.xy, 1.);
    gl_Position = vec4(vPos.xy, 0., 1.);
}
`

const fshBlurH = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;

#define RADIUS 75.0
#define PI 3.1415926535897932384626433832795
#define SIGMA (RADIUS / 3.)
#define TSQR_SIGMA (2. * SIGMA * SIGMA)
#define NOISE_LEVEL 0.1

varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform sampler2D u_sampler;
uniform vec3 u_glowProperties;
uniform float u_time;

// The compiler should optimise this.
float gauss(float v) {
	return (1.0 / sqrt(TSQR_SIGMA * PI)) * exp(-(v * v) / TSQR_SIGMA);   
}

// Doesn't have to be necessarily intensity, smoothstep wouldn't be a bad idea 
float luma(vec3 c){
	return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

// Should be replaced with a texture.
float rand(vec2 n) { 
	n += fract(length(u_glowProperties) + u_time * .01);
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453) - .5;
}

void main()
{	
    vec2 offset = vec2(dFdx(v_vTexcoord.x), 0.);
	vec4 blur = vec4(0);    
		
    for (float i = -RADIUS; i <= RADIUS; i += 1.) {  
		if (v_vTexcoord.x < 0. || v_vTexcoord.y < 0. || v_vTexcoord.x > 1. || v_vTexcoord.y > 1.) {
			continue;
		}
		vec3 tex = texture2D(u_sampler, v_vTexcoord + offset * i).rgb;
		vec2 gaussV = vec2(gauss(i), gauss(i * u_glowProperties.b));    	
		blur += vec4(vec3(tex.rgb * gaussV.x), luma(tex) * gaussV.y);	
    }

    gl_FragColor = vec4(blur.rgb * u_glowProperties.r, blur.a * u_glowProperties.g ) * (1. + NOISE_LEVEL * rand(gl_FragCoord.xy));	    
}
`

const fshBlurV = `
#extension GL_OES_standard_derivatives : enable

precision mediump float;

#define RADIUS 75.0
#define PI 3.1415926535897932384626433832795
#define SIGMA (RADIUS / 3.)
#define TSQR_SIGMA (2. * SIGMA * SIGMA)
#define NOISE_LEVEL 0.1

varying vec2 v_vTexcoord;
varying vec4 v_vColour;

uniform sampler2D u_sampler;
uniform vec3 u_glowProperties;
uniform float u_time;

// The compiler should optimise this.
float gauss(float v) {
	return (1.0 / sqrt(TSQR_SIGMA * PI)) * exp(-(v * v) / TSQR_SIGMA);   
}

// Should be replaced with a texture.
float rand(vec2 n) { 
	n += fract(length(u_glowProperties) + u_time * .01);
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453) - .5;
}

void main()
{	
    vec4 blur = vec4(0);    
    vec2 offset = vec2(0., dFdy(v_vTexcoord.y));
    	
    for (float i = -RADIUS; i <= RADIUS; i += 1.) {  
		if (v_vTexcoord.x < 0. || v_vTexcoord.y < 0. || v_vTexcoord.x > 1. || v_vTexcoord.y > 1.) {
			continue;
		}
		vec4 tex = texture2D(u_sampler, v_vTexcoord + offset * i);
		vec2 gaussV = vec2(gauss(i), gauss(i * u_glowProperties.b));
    	blur += vec4(vec3(tex.rgb * gaussV.x), tex.a * gaussV.y);		
    }	
	
    gl_FragColor = v_vColour * vec4(blur.rgb * (u_glowProperties.r * u_glowProperties.r) + blur.aaa * (u_glowProperties.g * u_glowProperties.g), 1.0) * (1. + NOISE_LEVEL * rand(gl_FragCoord.xy));	        
}

`

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

var passShaderProgram;
var neonTexture;
var neonProperties = [1.6, 6.2, 7.4];
var blendColour = [1, 1, 1, 1];
var modelTransform = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1 
];
var cameraTransform = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
];

var timePrev = 0;
var time = 0;

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

function main() {
    var canvas = $("#canvas-visual");    
    gl = canvas[0].getContext("webgl", { alpha: false });
    if (!gl) {
        glFailed();
        return;
    }         
    gl.getExtension('OES_standard_derivatives');

    requestAnimationFrame(drawScene);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    neonTexture = loadTexture(gl, "/assets/visual_scripts/neon-glow/neon_tex.png");

    passShaderProgram = shaderProgramFull(gl, vshPass, fshPass);
    horizontalBlurShaderProgram = shaderProgramFull(gl, vshBlur, fshBlurH);
    horizontalBlurShaderProgram.uniforms.time = gl.getUniformLocation(horizontalBlurShaderProgram.program, "u_time");
    horizontalBlurShaderProgram.uniforms.glowProperties = gl.getUniformLocation(horizontalBlurShaderProgram.program, "u_glowProperties");

    
    verticalBlurShaderProgram = shaderProgramFull(gl, vshBlur, fshBlurV);
    verticalBlurShaderProgram.uniforms.time = gl.getUniformLocation(verticalBlurShaderProgram.program, "u_time");
    verticalBlurShaderProgram.uniforms.glowProperties = gl.getUniformLocation(verticalBlurShaderProgram.program, "u_glowProperties");

    const baseFBO = createFBO(1024, 512);
    const passFBO = createFBO(1024, 512);


    var shapeNeonA = createObject(
        [
            -1.0, 0.35,
            1.0, 0.35,
            -1.0, -0.35,
            1.0, -0.35,
            -1.0, 0.35,
            1.0, 0.35,
            -1.0, -0.35,
            1.0, -0.35,
        ],
        [
            0.0, 1.0,
            1.0, 1.0,
            0.0, 0.5,
            1.0, 0.5,
        ]
    );

    var shapeNeonB = createObject(
        [
            -0.28, 0.35,
            0.28, 0.35,
            -0.28, -0.35,
            0.28, -0.35,
            -0.28, 0.35,
            0.28, 0.35,
            -0.28, -0.35,
            0.28, -0.35,
        ],
        [
            0.0, 0.5,
            0.28, 0.5,   
            0.0, 0.0,
            0.28, 0.0,                     
        ]
    );

    var shapeFBO = createObject(
        [
            -1,  1,
             1,  1,
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
            -1, -1,
             1, -1,
        ],
        [
            0.0, 1.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
        ]
    );

    blendColour = [1.0, 1.0, 1.0, 1.0];

    function drawScene() {    


        
        if (timePrev != 0) {        
            time += (Date.now() - timePrev);
        }
        timePrev = Date.now();
                
        neonProperties = [1.6, 6.9 + Math.sin(time / 1000.) * 0.75, 7.4];
        resizeCanvas();
        c += .1;
        
        setCameraTransform([
            1, 0, 0,
            0, 1, 0,
            Math.sin(time * .006 + .3) * .003 + Math.sin(time * .002) * .005, Math.sin(time * .005 + .8) * .005 + Math.sin(time * .003) * .0025, 1
        ]);

        // BASE
        gl.bindFramebuffer(gl.FRAMEBUFFER, baseFBO.buffer);  
        {
            gl.blendFunc(gl.ONE, gl.ZERO);
            gl.viewport(0, 0, 1024, 512);        
            gl.colorMask(true, true, true, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, neonTexture);

            //
            setModelTransform([
                .9, 0, 0,
                0, .9, 0,
                0, -.4, 1
            ]);
            blendColour = [1.0, 1.0, 0.5, .75 + Math.random() * .25];
            drawObject(shapeNeonA);

            setModelTransform([
                .9, 0, 0,
                0, .9, 0,
                0, .4, 1
            ]);            
            blendColour = [1.0, 1.5 + Math.sin(time / 500.) * .5, 1.0, .75 + Math.random() * .25];            
            drawObject(shapeNeonB);
            blendColour = [1.0, 1.0, 1.0, 1.0];

            //drawObject(shapeNeonB);

            gl.colorMask(false, false, false, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }       
        
        setCameraTransform([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        // HORIZONTAL
        gl.bindFramebuffer(gl.FRAMEBUFFER, passFBO.buffer);  
        {
            gl.blendFunc(gl.ONE, gl.ZERO);
            gl.viewport(0, 0, 1024, 512);        
            gl.colorMask(true, true, true, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.bindTexture(gl.TEXTURE_2D, baseFBO.texture);
            //
            setModelTransform([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);

            prepareGenericAttributes(shapeFBO, horizontalBlurShaderProgram);

            gl.useProgram(horizontalBlurShaderProgram.program);
            gl.uniform1i(horizontalBlurShaderProgram.uniforms.sampler, 0);
            gl.uniform4fv(horizontalBlurShaderProgram.uniforms.colour, blendColour);
            gl.uniformMatrix3fv(horizontalBlurShaderProgram.uniforms.modelTransform, false, modelTransform);
            gl.uniform3fv(horizontalBlurShaderProgram.uniforms.glowProperties, neonProperties);
            gl.uniform1f(horizontalBlurShaderProgram.uniforms.time, time * .01);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        // HORIZONTAL
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        {            
            gl.viewport(0, 0, Math.min(1024, gl.canvas.width), Math.min(512, gl.canvas.height));
            gl.colorMask(true, true, true, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
            //
            setModelTransform([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);

            gl.bindTexture(gl.TEXTURE_2D, baseFBO.texture);
            //     
            drawObject(shapeFBO);

           
            setModelTransform([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);
            gl.bindTexture(gl.TEXTURE_2D, passFBO.texture);
            prepareGenericAttributes(shapeFBO, verticalBlurShaderProgram);

            gl.useProgram(verticalBlurShaderProgram.program);
            gl.uniform1i(verticalBlurShaderProgram.uniforms.sampler, 0);
            gl.uniform4fv(verticalBlurShaderProgram.uniforms.colour, blendColour);
            gl.uniformMatrix3fv(verticalBlurShaderProgram.uniforms.modelTransform, false, modelTransform);
            gl.uniform3fv(verticalBlurShaderProgram.uniforms.glowProperties, neonProperties);
            gl.uniform1f(verticalBlurShaderProgram.uniforms.time, time);            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            
            //gl.colorMask(false, false, false, true);
            //gl.clearColor(0, 0, 0, 1);
            //gl.clear(gl.COLOR_BUFFER_BIT);
        }
        if (gl.getError() != gl.NO_ERROR) {
            glFailed();
            return;
        } 
        requestAnimationFrame(drawScene);
    }

}

