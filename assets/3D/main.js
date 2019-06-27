
var model, timer, scene, camera, w, h, renderer, light, loader, bayerTexture, effect;
w = window.innerWidth;
h = window.innerHeight;
init();
function init() {
    renderer = new THREE.WebGLRenderer({ canvas: headerCanvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    camera = new THREE.OrthographicCamera(w / - 200, w / 200, h / 200, h / - 200, 1, 1000);
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
    camera.left = w / -200;
    camera.right = w / 200
    camera.top = h / 200;
    camera.bottom = h / - 200;
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    //model.rotation.y = -Math.PI / 2. + .1;
    if (typeof model !== 'undefined') {
        model.rotation.y = .05 + Math.sin(timer.getElapsedTime() * .5 - 1.5) * .5;
        model.rotation.z = .25 * Math.sin(timer.getElapsedTime() * 1.);
        model.position.x = 0.027778;
        model.position.z = 0.111111;
        model.position.y = 0.887044;
    }
    //model.rotation.y += .01;
    //light.position.y += .01;

    //camera.position.x = -.1;
    //camera.position.y = 3;
    //camera.position.z = 2.6;
    camera.position.x = 4.05667;
    camera.position.y = 3.92538;
    camera.position.z = .411046;

    camera.rotation.x = .05;
    camera.rotation.y = Math.PI / 2 - .1;
    //camera.rotation.y = -.1;
    camera.rotation.z = .08;
    effect.uniforms['tSize'].value = [window.innerWidth, window.innerHeight];
    effect.uniforms['time'].value = timer.getElapsedTime();
    composer.render();
    //renderer.render(scene, camera);
}
animate();
