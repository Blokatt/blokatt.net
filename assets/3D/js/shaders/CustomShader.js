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
	varying vec2 vUv;
	vec4 dither(vec4 col, vec2 frag){    
		float nColR = 3.;
		float nColG = 3.;
		float nColB = 3.;							
		vec3 downsampled = vec3(floor((col.r + texture2D(tBayer, mod(frag / 8., 1.)).r / nColR) * nColR) / nColR,
								floor((col.g + texture2D(tBayer, mod(frag / 8., 1.)).r / nColG) * nColG) / nColG,
								floor((col.b + texture2D(tBayer, mod(frag / 8., 1.)).r / nColB) * nColB) / nColB); 
		return vec4((downsampled.rgb ), col.a);
	}

	vec4 image(vec2 uv){
		vec2 res = vec2(tSize.x, tSize.y);
		vec2 frag = vec2(gl_FragCoord.x, gl_FragCoord.y);
		vec4 color = texture2D( tDiffuse, vec2(floor(uv.x * res.x) / res.x, floor(uv.y * res.y) / res.y));
		//color = vec4(color.r * .55, color.g * 1.1, color.b * .81 * (min(1., uv.y + .5)), color.a);	
		//color = (color - .5) * 2. + .5;	
		float t = (.1 * sin(uv.x * 10. + time) + (.05 * sin(uv.x * 5. + time)) - (.025 * cos(uv.x * 20. - time * 5. + .2)) + (.005 * sin(uv.x * 50. - time * 5. + .4))) * .5 - .05;
		color *= 1. - 1.5 * smoothstep(.1 + t, .01 + t, uv.y);
		color = mix(color, vec4(vec3(1., 1., 1.) * (color.r + color.b + color.r) / 3., 1.), .75);
		return dither(color * vec4(.95, .86, .8, 1.), frag);
	}

	void main() {		
		gl_FragColor = vec4(image(vec2(vUv.x - .0025, vUv.y)).r, image(vUv).g, image(vec2(vUv.x + .0025, vUv.y)).b, image(vUv).a);

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
		"tSize":    { value: new THREE.Vector2( 256, 256 ) },
		"center":   { value: new THREE.Vector2( 0.5, 0.5 ) },
		"angle":    { value: 1.57 },
		"time": 	{ value: 0.},
		"scale":    { value: 1.0 }

	},

	vertexShader: vert,

	fragmentShader: frag

};
