const fshGlitch = `
#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265359
#define TAU 6.28318530718

precision highp float;

varying vec2 v_vTexcoord;

uniform sampler2D u_sampler;
uniform float time;         
uniform vec2 resolution;

//MAIN CONTROLLER UNIFORMS
uniform float intensity;       //overall effect intensity, 0-1 (no upper limit)
uniform float rngSeed;         //seed offset (changes configuration around)

//TUNING
uniform float lineSpeed;       //line speed
uniform float lineDrift;       //horizontal line drifting
uniform float lineResolution;  //line resolution
uniform float lineVertShift;   //wave phase offset of horizontal lines
uniform float lineShift;       //horizontal shift
uniform float jumbleness;      //amount of "block" glitchiness
uniform float jumbleResolution;//ŕesolution of blocks
uniform float jumbleShift;     //texture shift by blocks  
uniform float jumbleSpeed;     //speed of block variation
uniform float dispersion;      //color channel horizontal dispersion
uniform float channelShift;    //horizontal RGB shift
uniform float noiseLevel;      //level of noise
uniform float shakiness;       //horizontal shakiness
//

vec2 resRatios = normalize(resolution);
float tm = abs(time);

//colour extraction

vec4 extractRed(vec4 col){
    return vec4(col.r, 0., 0., col.a);
}

vec4 extractGreen(vec4 col){
    return vec4(0., col.g, 0., col.a);
}

vec4 extractBlue(vec4 col){
    return vec4(0., 0., col.b, col.a);
}

//coord manipulation

float saw(float v, float d){
    return mod(v, d) * (d - floor(mod(v, d * 2.0)) * (d * 2.0)) + floor(mod(v, d * 2.0)); 
}

vec2 vec2LockIn(vec2 v){
    return vec2(saw(v.x, 1.), saw(v.y, 1.));
}

vec2 shiftX(vec2 vec, float offset){
    return vec2LockIn(vec2(vec.x + offset, vec.y));
}

float tMod(float v, float d){
    return mod(mod(v, d) + d, d); 
}

float downsample(float v, float res){
    if (res == 0.0) return 0.0;
    return floor(v * res) / res;
}

//RNG function (uses improved version by Andy Gryc)

highp float rand(vec2 co)
{
    //highp vec2 _co = co + 1. + rngSeed;
    highp vec2 _co = vec2(mod(co.x, resolution.x), mod(co.y, resolution.y));
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(_co.xy, vec2(a,b));
    highp float sn= mod(dt + rngSeed * .0001,3.14);
    return fract(sin(sn) * c);
}

//jumble generation

float jumble(vec2 coord, float randOffset, float Resolution){
	float t = (jumbleSpeed >= 0.00001) ? (tm * 0.02) : 0.0;
    vec2 jumbleSubRes = vec2(Resolution, Resolution);
    vec2 gridCoords = vec2(downsample(coord.x, jumbleSubRes.x / resRatios.y), downsample(coord.y, jumbleSubRes.y / resRatios.x));
    vec2 gridCoordsSeed = vec2(downsample(coord.y, jumbleSubRes.x / resRatios.x), downsample(coord.x, jumbleSubRes.y / resRatios.y));
    vec2LockIn(gridCoords);
    vec2LockIn(gridCoordsSeed);
    float shift = rand(.001 + randOffset + gridCoords + downsample(t + intensity, jumbleSpeed));
    return ((((shift - .5)) * downsample(intensity, 10.) * jumbleShift) * floor(rand(.001 + randOffset + gridCoordsSeed + downsample(t + intensity, jumbleSpeed)) + jumbleness));
}

void main()
{
    vec4 outColour;
    vec2 coords = v_vTexcoord;
    
    //base line shift
    float dY = downsample(v_vTexcoord.y, 50. * lineResolution);
    float wave0 = sin((downsample(rand(vec2(dY, dY)) * TAU, 50. * lineResolution) * 80. + tm * lineSpeed) + lineVertShift * TAU);
    dY = downsample(v_vTexcoord.y, 25. * lineResolution);
    float wave1 = cos((downsample(rand(vec2(dY, dY)) * TAU, 25. * lineResolution) * 80. + tm * lineSpeed) + lineVertShift * TAU);
    float driftSin = resolution.y * 2.778;
    coords = shiftX(coords,(wave0 * (1. + rand(vec2(wave0, wave0)) * shakiness) +
                            wave1 * (1. + rand(vec2(wave1, wave1)) * shakiness) +
                            sin((v_vTexcoord.y * (driftSin) + 2. + tm * lineSpeed) + lineVertShift * TAU) * lineDrift + 
                            rand(coords + tm) * lineSpeed * shakiness + 
                            cos((v_vTexcoord.y * (driftSin * .1) + 1. + tm * lineSpeed) + lineVertShift * TAU) * lineDrift) * lineShift * intensity);
    
    //jumbles
    coords.y += jumble(coords, 0., jumbleResolution * 100.) * intensity * .25;
    coords.x += jumble(coords, .25, jumbleResolution * 100.) * intensity * .25;
    
    //avoid coord clamping
    coords = vec2LockIn(coords); 
    
    //channel split
    outColour = extractRed(texture2D( u_sampler, shiftX(coords, (channelShift + rand(coords) * dispersion) * intensity))) +
                extractBlue(texture2D( u_sampler, shiftX(coords, -(channelShift + rand(coords) * dispersion) * intensity))) +
                extractGreen(texture2D( u_sampler, coords));
    
    //add noise
    outColour.r *= 1. + (rand(tm * coords * 2.)) * intensity * noiseLevel * .55;
    outColour.g *= 1. + (rand(tm * coords)) * intensity * noiseLevel * .5;
    outColour.b *= 1. + (rand(tm * coords * 3.)) * intensity * noiseLevel * .4;
    
    //set fragment colour
    gl_FragColor = outColour;
}
`


var c = 0.0;

var timePrev = 0;
var time = 0;

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
    bcgTexture = loadTexture(gl, "/assets/visual_scripts/bktglitch/town_tex.png");
    //neonTexture = loadTexture(gl, "/assets/visual_scripts/neon-glow/neon_tex.png");
    passShaderProgram = shaderProgramFull(gl, vshPass, fshPass);

    var glitchShaderProgram = shaderProgramFull(gl, vshPass, fshGlitch);    
    glitchShaderProgram.uniforms.resolution = gl.getUniformLocation(glitchShaderProgram.program, "resolution");
    glitchShaderProgram.uniforms.intensity = gl.getUniformLocation(glitchShaderProgram.program, "intensity");
    glitchShaderProgram.uniforms.rngSeed = gl.getUniformLocation(glitchShaderProgram.program, "rngSeed");
    glitchShaderProgram.uniforms.lineSpeed = gl.getUniformLocation(glitchShaderProgram.program, "lineSpeed");
    glitchShaderProgram.uniforms.lineDrift = gl.getUniformLocation(glitchShaderProgram.program, "lineDrift");
    glitchShaderProgram.uniforms.lineResolution = gl.getUniformLocation(glitchShaderProgram.program, "lineResolution");
    glitchShaderProgram.uniforms.lineVertShift = gl.getUniformLocation(glitchShaderProgram.program, "lineVertShift");
    glitchShaderProgram.uniforms.lineShift = gl.getUniformLocation(glitchShaderProgram.program, "lineShift");
    glitchShaderProgram.uniforms.jumbleness = gl.getUniformLocation(glitchShaderProgram.program, "jumbleness");
    glitchShaderProgram.uniforms.jumbleResolution = gl.getUniformLocation(glitchShaderProgram.program, "jumbleResolution");
    glitchShaderProgram.uniforms.jumbleShift = gl.getUniformLocation(glitchShaderProgram.program, "jumbleShift");
    glitchShaderProgram.uniforms.jumbleSpeed = gl.getUniformLocation(glitchShaderProgram.program, "jumbleSpeed");
    glitchShaderProgram.uniforms.dispersion = gl.getUniformLocation(glitchShaderProgram.program, "dispersion");
    glitchShaderProgram.uniforms.channelShift = gl.getUniformLocation(glitchShaderProgram.program, "channelShift");
    glitchShaderProgram.uniforms.noiseLevel = gl.getUniformLocation(glitchShaderProgram.program, "noiseLevel");
    glitchShaderProgram.uniforms.shakiness = gl.getUniformLocation(glitchShaderProgram.program, "shakiness");
    glitchShaderProgram.uniforms.time = gl.getUniformLocation(glitchShaderProgram.program, "time");

    const baseFBO = createFBO(1024, 512);

    var shapeFBO = createObject(
        [
            -1, 1,
            1, 1,
            -1, -1,
            1, -1,
            -1, 1,
            1, 1,
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

        resizeCanvas();
        c += .1;

     
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
            gl.bindTexture(gl.TEXTURE_2D, bcgTexture);
            
            blendColour = [1.0, 1.0, 1.0, 1.0];

            setModelTransform([
                1.52, 0, 0,
                0, 1.52, 0,
                -.1, .3, 1
            ]);

            drawObject(shapeFBO);

            gl.colorMask(false, false, false, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        setCameraTransform(MATRIX_IDENTITY);
        setModelTransform(MATRIX_IDENTITY);

        // HORIZONTAL
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        {
            gl.viewport(0, 0, Math.min(1024, gl.canvas.width), Math.min(512, gl.canvas.height));
            gl.colorMask(true, true, true, true);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
                                    
            
            gl.bindTexture(gl.TEXTURE_2D, baseFBO.texture);


            gl.useProgram(glitchShaderProgram.program);
            
            prepareGenericAttributes(shapeFBO, glitchShaderProgram);

            gl.uniform1i(glitchShaderProgram.uniforms.sampler, 0);
            gl.uniform4fv(glitchShaderProgram.uniforms.colour, blendColour);
            gl.uniformMatrix3fv(glitchShaderProgram.uniforms.modelTransform, false, modelTransform);
            gl.uniformMatrix3fv(glitchShaderProgram.uniforms.cameraTransform, false, cameraTransform);
            
            gl.uniform2f(glitchShaderProgram.uniforms.resolution, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(glitchShaderProgram.uniforms.time, time * .25);
            gl.uniform1f(glitchShaderProgram.uniforms.rngSeed, 0.0);
            gl.uniform1f(glitchShaderProgram.uniforms.intensity, 1.2 + Math.sin(time / 2000. - 1.25) * 0.8);
            gl.uniform1f(glitchShaderProgram.uniforms.lineSpeed, 0.01);
            gl.uniform1f(glitchShaderProgram.uniforms.lineDrift, 0.1);
            gl.uniform1f(glitchShaderProgram.uniforms.lineResolution, 1.00);
            gl.uniform1f(glitchShaderProgram.uniforms.lineShift, 0.004000);
            gl.uniform1f(glitchShaderProgram.uniforms.lineVertShift, 0.00);
            gl.uniform1f(glitchShaderProgram.uniforms.jumbleness, .3 + Math.sin(time / 5000) * .3);
            gl.uniform1f(glitchShaderProgram.uniforms.jumbleShift, 0.15 + Math.sin(time / 3000 + 2.5) * .1);
            gl.uniform1f(glitchShaderProgram.uniforms.jumbleResolution, 0.3);
            gl.uniform1f(glitchShaderProgram.uniforms.dispersion, 0.0025);
            gl.uniform1f(glitchShaderProgram.uniforms.jumbleSpeed, 1.5);
            gl.uniform1f(glitchShaderProgram.uniforms.channelShift, 0.004);
            gl.uniform1f(glitchShaderProgram.uniforms.shakiness, 1.5);
            gl.uniform1f(glitchShaderProgram.uniforms.noiseLevel, 0.5);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            //drawObject(shapeFBO);

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

