
var model, timer, scene, camera, w, h, renderer, light, loader, bayerTexture, effect, rand, fade, fadeIn, zoom;
w = window.innerWidth;
h = window.innerHeight;
fade = 0.0;
fadeIn = 0.0;
rand = Math.random() * 6.28;
zoom = 250.0 + Math.floor(Math.random() * 3.0) * 50.0;
init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({ canvas: headerCanvas, antialias: false, alpha: true });
    renderer.setSize(w, h);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    camera = new THREE.OrthographicCamera(w / - zoom, w / zoom, h / zoom, h / - zoom, 1, 1000);
    timer = new THREE.Clock(true);
    loader = new THREE.GLTFLoader();

    loader.load('assets/av2.glb', function (gltf) {
        model = gltf.scene;
   
        model.traverse((node) => {
            if (node.isMesh) {                
                node.material.flatShading = false; // r87+
                node.material.needsUpdate = true;
                node.material.transparent = false;                
                node.material.color.setHex(0xffffff);
            }
        });

        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });


    light = new THREE.PointLight(0x7A2020, 50, 8);
    light.castShadow = true;
    light.position.set(2.91251, 4.2293, 5.0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x400040); // soft white light
    scene.add(ambientLight);

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

    camera.position.z = 10.0;
    camera.rotation.x = .05;   

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
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    var t = timer.getElapsedTime();
    if (typeof model !== 'undefined') {

        fade = Math.min(1.0, fade + (1 - fade) * .04);
        fadeIn = Math.min(1.0, fadeIn + .1);
        
        model.position.y = Math.sin(-t *.5) * .05 + 0.5;

        model.scale.y = 0.5 + fade * 0.5;
        model.scale.z = 3.0 - 2.0 * fade;

        var quatRoll = new THREE.Quaternion();
        quatRoll.setFromAxisAngle(new THREE.Vector3(-0.707, 0.707, 0), 0.807 + Math.sin(t * 1.0) * .15 + 2.0 * (1.0 - fade));

        var quatPitch = new THREE.Quaternion();
        quatPitch.setFromAxisAngle(new THREE.Vector3(0.707, 0.707, 0.0), Math.sin(t * 0.5 + .1) * .2);

        var quatCombined = new THREE.Quaternion().multiplyQuaternions(quatRoll, quatPitch);

        model.setRotationFromQuaternion(quatCombined);
    }

    camera.rotation.z = .08 + (1.0 - fade);

    effect.uniforms['blend'].value = [1.05 * fadeIn, 1.0 * fadeIn, 1.1 * fadeIn, 1.0];
    effect.uniforms['tSize'].value = [window.innerWidth, window.innerHeight];
    effect.uniforms['time'].value = t;
    composer.render();
}

