/**
 * @author blokatt
 * 
 */

var frag = `
	uniform float time;
	uniform vec2 center;
	uniform float angle;
	uniform float scale;
	uniform vec2 tSize;
	uniform sampler2D tDiffuse;
	uniform sampler2D tBayer;
	uniform vec4 blend;
	varying vec2 vUv;

	vec3 dither(vec3 col, vec2 frag){    
		const float nColR = 6.;
		const float nColG = 6.;
		const float nColB = 6.;					
		float threshold = texture2D(tBayer, mod(frag / 8., 1.)).r;	
		vec3 downsampled = vec3(floor((col.r + threshold / nColR) * nColR) / nColR,
								floor((col.g + threshold / nColG) * nColG) / nColG,
								floor((col.b + threshold / nColB) * nColB) / nColB); 
		return downsampled;
	}

	vec4 image(vec2 uv, float t){
		vec2 frag = vec2(gl_FragCoord.x, gl_FragCoord.y);
		vec4 color = texture2D(tDiffuse, vec2(floor(uv.x * tSize.x) / tSize.x, floor(uv.y * tSize.y) / tSize.y)) * vec4(1.1, 1.02, 1.05, 1.0);
		float off = (.1 * sin(uv.x * 10. + t) + (.05 * sin(uv.x * 5. + t)) - (.025 * cos(uv.x * 20. - t * 5. + .2)) + (.005 * sin(uv.x * 50. - t * 5. + .4))) * .5 - .05;
		vec2 borderTime = vec2(t * 3.5 + uv.yx * 2.5);

		vec3 background = vec3(0., 0., .2) + vec3(.05, 0., .2) * floor(fract((-uv.x + uv.y) * 10. + t) + .5);
		color = vec4(mix(background, color.rgb, min(1., color.a * 1.5)), 1.0);	

		color += vec4(0.05, 0.0, 0.55, 0.0) * (min(1.0,   step(uv.x, .015 + .02 * (sin(borderTime.x		  ) * .5 + .5)) +
														step(	   .985 - .02 * (sin(borderTime.x + 1.57) * .5 + .5), uv.x) +
														step(uv.y, .015 + .02 * (sin(borderTime.y + 0.78) * .5 + .5)) +
														step(	   .985 - .02 * (sin(borderTime.y + 2.35) * .5 + .5), uv.y)));
		
		color = mix(color, vec4(vec3(color.r + color.b + color.r) / 3., color.a), .75);		
		
		return vec4(dither(color.rgb * vec3(.95, .86, .8), frag) - (1.0 - blend.rrr), color.a);
	}

	void main() {		
		gl_FragColor = vec4(image(vec2(vUv.x - .0025, vUv.y), time).r,
							image(vUv, time + 0.15).g,
							image(vec2(vUv.x + .0025, vUv.y), time + 0.3).b,
							image(vUv, time).a);

	}
`;

var vert = `
uniform float time;
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
`

THREE.BktCustom = {
	uniforms: {
		"tBayer": { value: null },
		"tDiffuse": { value: null },
		"tSize": { value: [256, 256] },
		"center": { value: [0.5, 0.5] },
		"angle": { value: 1.57 },
		"time": { value: 0. },
		"scale": { value: 1.0 },
		"blend": { value: [1., 1., 1., 1.] }
	},

	vertexShader: vert,
	fragmentShader: frag
};
