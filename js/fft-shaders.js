
/**
 * Original work is from:
 * @author David Li / http://david.li/waves/
 * @author Aleksandr Albert / http://www.routter.co.tt
 * @author jbouny / https://github.com/fft-ocean
 *
 * can be found here: https://github.com/jbouny/fft-ocean
 
 * Modified:
 * @author Arkadiy 
 */


THREE.ShaderLib['ocean_sim_vertex'] = {
	varying: {
		"vUV": { type: "v2" }
	},
	vertexShader: [
		'varying vec2 vUV;',

		'void main (void) {',
			'vUV = position.xy * 0.5 + 0.5;',
			'gl_Position = vec4(position, 1.0 );',
		'}'
	].join('\n')
};

THREE.ShaderLib['ocean_subtransform'] = {
	uniforms: {
		"u_input": { type: "t", value: null },
		"u_transformSize": { type: "f", value: 512.0 },
		"u_subtransformSize": { type: "f", value: 250.0 }
	},
	varying: {
		"vUV": { type: "v2" }
	},
	fragmentShader: [
		//GPU FFT using a Stockham formulation

		'const float PI = 3.14159265359;',

		'uniform sampler2D u_input;',
		'uniform float u_transformSize;',
		'uniform float u_subtransformSize;',

		'varying vec2 vUV;',
		
		'vec2 multiplyComplex (vec2 a, vec2 b) {',
			'return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);',
		'}',

		'void main (void) {',
			'#ifdef HORIZONTAL',
				'float index = vUV.x * u_transformSize - 0.5;',
			'#else',
				'float index = vUV.y * u_transformSize - 0.5;',
			'#endif',

			'float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize * 0.5) + mod(index, u_subtransformSize * 0.5);',

			//transform two complex sequences simultaneously
			'#ifdef HORIZONTAL',
				'vec4 even = texture2D(u_input, vec2(evenIndex + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
				'vec4 odd = texture2D(u_input, vec2(evenIndex + u_transformSize * 0.5 + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
			'#else',
				'vec4 even = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + 0.5) / u_transformSize).rgba;',
				'vec4 odd = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + u_transformSize * 0.5 + 0.5) / u_transformSize).rgba;',
			'#endif',

			'float twiddleArgument = -2.0 * PI * (index / u_subtransformSize);',
			'vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));',

			'vec2 outputA = even.xy + multiplyComplex(twiddle, odd.xy);',
			'vec2 outputB = even.zw + multiplyComplex(twiddle, odd.zw);',

			'gl_FragColor = vec4(outputA, outputB);',
		'}'
	].join('\n')
};
