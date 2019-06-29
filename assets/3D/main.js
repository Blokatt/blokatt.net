
var model, timer, scene, camera, w, h, renderer, light, loader, bayerTexture, effect, rand, fade, zoom;
w = window.innerWidth;
h = window.innerHeight;
fade = 0.0;
rand = Math.random() * 6.28;
zoom = 150.0 + Math.floor(Math.random() * 3.0) * 25.0;
init();
animate();

function mouseMoved( evt ) {
    console.log("move");    
}

function init() {
    renderer = new THREE.WebGLRenderer({ canvas: headerCanvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    camera = new THREE.OrthographicCamera(w / - zoom, w / zoom, h / zoom, h / - zoom, 1, 1000);
    timer = new THREE.Clock(true);
    loader = new THREE.GLTFLoader();

    loader.load('assets/av.glb', function (gltf) {
        model = gltf.scene;
        model.traverse((node) => {
            if (node.isMesh) {
                //node.material.shading = THREE.SmoothShading; // <=r86
                node.material.flatShading = false; // r87+
                node.material.needsUpdate = true;
                node.material.transparent = false;
                // node.material.depthTest = true;
                node.material.color.setHex(0xffffff);
            }
        });
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });



    light = new THREE.PointLight(0x7A2020, 5, 5);
    light.castShadow = true;
    light.position.set(2.91251, 4.2293, -0.003803);
    scene.add(light);

    document.body.appendChild(renderer.domElement);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    bayerTexture = new THREE.TextureLoader().load("assets/bayer8.png");
    bayerTexture.wrapS = THREE.RepeatWrapping;
    bayerTexture.wrapT = THREE.RepeatWrapping;
    bayerTexture.magFilter = THREE.NearestFilter;
    bayerTexture.minFilter = THREE.NearestFilter;

    effect = new THREE.ShaderPass(THREE.BktCustom);    
    effect.uniforms['scale'].value = 2;    
    effect.uniforms['tBayer'].value = bayerTexture;
    effect.uniforms['time'].value = timer.getElapsedTime();

    composer.addPass(effect);
    effect.renderToScreen = true;
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    w = window.innerWidth;
    h = window.innerHeight;      
    camera.left = w / -zoom;
    camera.right = w / zoom
    camera.top = h / zoom;
    camera.bottom = h / - zoom;
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}




function animate() {
    requestAnimationFrame(animate);

    if (typeof model !== 'undefined') {
        model.rotation.y = .05 + Math.sin(timer.getElapsedTime() * .5 - 1.5 + rand) * .5;
        model.rotation.z = .25 * Math.sin(timer.getElapsedTime() * 1.);
        model.position.x = 0.027778;
        model.position.z = 0.111111;
        model.position.y = 0.887044 + Math.sin(timer.getElapsedTime() * 1.1 + .6) * .5;      
        model.scale.z = 2 - fade;  
        model.scale.y = .5 + fade * .5;  
        fade = Math.min(1.0, fade + (1 - fade) * .05);
    }

    camera.position.x = 4.05667;
    camera.position.y = 3.92538;
    camera.position.z = .411046;

    camera.rotation.x = .05;
    camera.rotation.y = Math.PI / 2 - .1;    
    camera.rotation.z = .08;
     
    effect.uniforms['blend'].value = [1.05 * fade, 1.0 * fade, 1.1 * fade, 1.0 * fade];
    effect.uniforms['tSize'].value = [window.innerWidth, window.innerHeight];
    effect.uniforms['time'].value = timer.getElapsedTime();
    composer.render();
    //renderer.render(scene, camera);
}

