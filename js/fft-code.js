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

// Here goes scaffolding to run three.js



function initAndRunFFT() {
    
    this.renderer = renderer;
	this.renderer.clearColor( 0xffffff );
	
	this.scene = new THREE.Scene();
	
	// Enable necessary extensions
	this.renderer.context.getExtension('OES_texture_float');
	this.renderer.context.getExtension('OES_texture_float_linear');
    
    // 0 - The vertex shader used in all of the simulation steps
	var fullscreeenVertexShader = THREE.ShaderLib["ocean_sim_vertex"];
		
	// 1 - Horizontal wave vertices used for FFT
	var oceanHorizontalShader = THREE.ShaderLib["ocean_subtransform"];
	var oceanHorizontalUniforms = THREE.UniformsUtils.clone(oceanHorizontalShader.uniforms);
	this.materialOceanHorizontal = new THREE.ShaderMaterial({
		uniforms: oceanHorizontalUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: "#define HORIZONTAL \n" + oceanHorizontalShader.fragmentShader
	});
	this.materialOceanHorizontal.uniforms.u_transformSize = { type: "f", value: this.resolution };
	this.materialOceanHorizontal.uniforms.u_subtransformSize = { type: "f", value: null };
	this.materialOceanHorizontal.uniforms.u_input = { type: "t", value: null };
	this.materialOceanHorizontal.depthTest = false;
	
	// 2 - Vertical wave vertices used for FFT
	var oceanVerticalShader = THREE.ShaderLib["ocean_subtransform"];
	var oceanVerticalUniforms = THREE.UniformsUtils.clone(oceanVerticalShader.uniforms);
	this.materialOceanVertical = new THREE.ShaderMaterial({
		uniforms: oceanVerticalUniforms,
		vertexShader: fullscreeenVertexShader.vertexShader,
		fragmentShader: oceanVerticalShader.fragmentShader
	});
	this.materialOceanVertical.uniforms.u_transformSize = { type: "f", value: this.resolution };
	this.materialOceanVertical.uniforms.u_subtransformSize = { type: "f", value: null };
	this.materialOceanVertical.uniforms.u_input = { type: "t", value: null };
	this.materialOceanVertical.depthTest = false;
    
    this.materialOceanHorizontal.blending = 0;
	this.materialOceanVertical.blending = 0;
    
    	// Create the simulation plane
	this.screenQuad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ) );
	this.scene.add(this.screenQuad);
}

var DEMO = {
    

    initialize : function (){

        this.ms_Renderer = new THREE.WebGLRenderer();
        this.ms_Renderer.context.getExtension( 'OES_texture_float' );
        this.ms_Renderer.context.getExtension( 'OES_texture_float_linear' );
        this.ms_Renderer.setClearColor( 0x000000 );
        
        this.ms_Scene = new THREE.Scene();
        
		this.ms_Camera = new THREE.PerspectiveCamera( 55.0, WINDOW.ms_Width / WINDOW.ms_Height, 0.5, 1000000 );
		this.ms_Camera.position.set( 0, 350, 800 );
        this.ms_Camera.lookAt( new THREE.Vector3() );        
        
        // Initialize Ocean
		var gsize = 512;
		var res = 512;
		var gres = 256;
		var origx = -gsize / 2;
		var origz = -gsize / 2;
		this.ms_Ocean = new THREE.Ocean( this.ms_Renderer, this.ms_Camera, this.ms_Scene,
		{
			INITIAL_SIZE : 200.0,
			INITIAL_WIND : [ 10.0, 10.0 ],
			INITIAL_CHOPPINESS : 3.6,
			CLEAR_COLOR : [ 1.0, 1.0, 1.0, 0.0 ],
			SUN_DIRECTION : this.ms_MainDirectionalLight.position.clone(),
			OCEAN_COLOR: new THREE.Vector3( 0.35, 0.4, 0.45 ),
			SKY_COLOR: new THREE.Vector3( 10.0, 13.0, 15.0 ),
			EXPOSURE : 0.15,
			GEOMETRY_RESOLUTION: gres,
			GEOMETRY_SIZE : gsize,
			RESOLUTION : res
} );
    }
}