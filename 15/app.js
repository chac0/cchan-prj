'use strict'

var gl;

var time = new Time();
var camera = new OrbitCamera();

var sun = null;
var earth = null;
var moon = null;
var starField = null;
var starFieldAnim = null;
var mercury = null;
var venus = null;
var mars = null;
var jupiter = null;
var saturn = null;
var uranus = null;
var neptune = null;
var saturnRing = null;
var earthAtmos = null;

var earthOrbit = null; //transform matrix for putting planet into orbit
var moonOrbit = null;
var mercuryOrbit = null;
var venusOrbit = null;
var marsOrbit = null;
var jupiterOrbit = null;
var saturnOrbit = null;
var uranusOrbit = null;
var neptuneOrbit = null;

var projectionMatrix = new Matrix4();

// the shaders that will be used by each piece of geometry
var diffuseShaderProgram;
var emissionShaderProgram;
var emitAnimShaderProgram;
var earthShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    diffuseVS: null,
    diffuseFS: null,
    vertexColorVS: null,
    vertexColorFS: null,
    sphereJSON: null,
    sunImage: null,
    earthImage: null,
    moonImage: null,
    starFieldImage: null,
    emissionVS: null,
    emissionFS: null,
    emitAnimFS: null,
    mercuryImage: null,
    venusImage: null,
    marsImage: null,
    jupiterImage: null,
    saturnImage: null,
    uranusImage: null,
    neptuneImage: null,
    saturnRingImage: null,
    earthAtmosImage: null,
    earthFS: null,
    earthNightImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/diffuse.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/diffuse.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        loadImage('./data/2k_sun.jpg'),
        loadImage('./data/2k_earth_daymap.jpg'),
        loadImage('./data/2k_moon.jpg'),
        loadImage('./data/2k_stars.jpg'),
        fetch('./shaders/emission.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/emission.fs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/emitAnim.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/2k_mercury.jpg'),
        loadImage('./data/2k_venus.jpg'),
        loadImage('./data/2k_mars.jpg'),
        loadImage('./data/2k_jupiter.jpg'),
        loadImage('./data/2k_saturn.jpg'),
        loadImage('./data/2k_uranus.jpg'),
        loadImage('./data/2k_neptune.jpg'),
        loadImage('./data/2k_saturn_ring.png'),
        loadImage('./data/2k_earth_clouds.png'),
        fetch('./shaders/earth.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/2k_earth_nightmap.jpg')
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.diffuseVS = values[0];
        loadedAssets.diffuseFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.sunImage = values[3];
        loadedAssets.earthImage = values[4];
        loadedAssets.moonImage = values[5];
        loadedAssets.starFieldImage = values[6];
        loadedAssets.emissionVS = values[7];
        loadedAssets.emissionFS = values[8];
        loadedAssets.emitAnimFS = values[9];
        loadedAssets.mercuryImage = values[10];
        loadedAssets.venusImage = values[11];
        loadedAssets.marsImage = values[12];
        loadedAssets.jupiterImage = values[13];
        loadedAssets.saturnImage = values[14];
        loadedAssets.uranusImage = values[15];
        loadedAssets.neptuneImage = values[16];
        loadedAssets.saturnRingImage = values[17];
        loadedAssets.earthAtmosImage = values[18];
        loadedAssets.earthFS = values[19];
        loadedAssets.earthNightImage = values[20];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    // Diffuse shader for most planets
    diffuseShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.diffuseVS, loadedAssets.diffuseFS);

    diffuseShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(diffuseShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(diffuseShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(diffuseShaderProgram, "aTexcoords")
    };

    diffuseShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(diffuseShaderProgram, "uProjectionMatrix"),
        sunOriginUniform: gl.getUniformLocation(diffuseShaderProgram, "uSunOrigin"),
        textureUniform: gl.getUniformLocation(diffuseShaderProgram, "uTexture")
    };

    // Emission shaders for stars
    emissionShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.emissionVS, loadedAssets.emissionFS);

    emissionShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(emissionShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(emissionShaderProgram, "aTexcoords")
    };

    emissionShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uProjectionMatrix"),
        textureUniform: gl.getUniformLocation(emissionShaderProgram, "uTexture")
    };

    // Emission shaders for blinking stars
    emitAnimShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.emissionVS, loadedAssets.emitAnimFS);

    emitAnimShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(emitAnimShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(emitAnimShaderProgram, "aTexcoords")
    };

    emitAnimShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(emitAnimShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(emitAnimShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(emitAnimShaderProgram, "uProjectionMatrix"),
        textureUniform: gl.getUniformLocation(emitAnimShaderProgram, "uTexture"),
        timeUniform: gl.getUniformLocation(emitAnimShaderProgram, "uTime")
    };

    // Diffuse shader for Earth only
    earthShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.diffuseVS, loadedAssets.earthFS);

    earthShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(earthShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(earthShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(earthShaderProgram, "aTexcoords")
    };

    earthShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(earthShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(earthShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(earthShaderProgram, "uProjectionMatrix"),
        sunOriginUniform: gl.getUniformLocation(earthShaderProgram, "uSunOrigin"),
        textureUniform: gl.getUniformLocation(earthShaderProgram, "uTexture"),
        altTextureUniform: gl.getUniformLocation(earthShaderProgram, "uAltTexture")
    };
}

// -------------------------------------------------------------------------
function createScene() {
    sun = new WebGLGeometryJSON(gl);
    sun.create(loadedAssets.sphereJSON, loadedAssets.sunImage);

    earth = new WebGLGeometryJSON(gl);
    earth.create(loadedAssets.sphereJSON, loadedAssets.earthImage, loadedAssets.earthNightImage);

    moon = new WebGLGeometryJSON(gl);
    moon.create(loadedAssets.sphereJSON, loadedAssets.moonImage);

    starField = new WebGLGeometryJSON(gl);
    starField.create(loadedAssets.sphereJSON, loadedAssets.starFieldImage);

    starFieldAnim = new WebGLGeometryJSON(gl);
    starFieldAnim.create(loadedAssets.sphereJSON, loadedAssets.starFieldImage);

    mercury = new WebGLGeometryJSON(gl);
    mercury.create(loadedAssets.sphereJSON, loadedAssets.mercuryImage);

    venus = new WebGLGeometryJSON(gl);
    venus.create(loadedAssets.sphereJSON, loadedAssets.venusImage);

    mars = new WebGLGeometryJSON(gl);
    mars.create(loadedAssets.sphereJSON, loadedAssets.marsImage);

    jupiter = new WebGLGeometryJSON(gl);
    jupiter.create(loadedAssets.sphereJSON, loadedAssets.jupiterImage);

    saturn = new WebGLGeometryJSON(gl);
    saturn.create(loadedAssets.sphereJSON, loadedAssets.saturnImage);

    uranus = new WebGLGeometryJSON(gl);
    uranus.create(loadedAssets.sphereJSON, loadedAssets.uranusImage);

    neptune = new WebGLGeometryJSON(gl);
    neptune.create(loadedAssets.sphereJSON, loadedAssets.neptuneImage);

    saturnRing = new WebGLGeometryQuad(gl);
    saturnRing.create(loadedAssets.saturnRingImage);

    earthAtmos = new WebGLGeometryJSON(gl);
    earthAtmos.create(loadedAssets.sphereJSON, loadedAssets.earthAtmosImage);

    // Scale planets
    starField.worldMatrix.identity().scale(10, 10, 10);
    starFieldAnim.worldMatrix.identity().scale(9.9, 9.9, 9.9);
    sun.worldMatrix.identity().scale(0.3, 0.3, 0.3).rotateX(10);
    earth.worldMatrix.identity().scale(0.12, 0.12, 0.12).rotateX(6);
    earthAtmos.worldMatrix.identity().scale(0.125, 0.125, 0.125).rotateX(6);
    moon.worldMatrix.identity().scale(0.04, 0.04, 0.04).rotateX(10);
    mercury.worldMatrix.identity().scale(0.06, 0.06, 0.06).rotateX(10);
    venus.worldMatrix.identity().scale(0.09, 0.09, 0.09).rotateX(10);
    mars.worldMatrix.identity().scale(0.07, 0.07, 0.07).rotateX(10);
    jupiter.worldMatrix.identity().scale(0.2, 0.2, 0.2).rotateX(10);
    saturn.worldMatrix.identity().scale(0.18, 0.18, 0.18).rotateX(-10);
    uranus.worldMatrix.identity().scale(0.15, 0.15, 0.15).rotateX(10);
    neptune.worldMatrix.identity().scale(0.12, 0.12, 0.12).rotateX(10);
    saturnRing.worldMatrix.identity().scale(18.0, 18.0, 18.0).rotateX(80);

    // Initialize orbit transform
    starFieldAnim.worldMatrix.rotateY(90);

    earthOrbit = new Matrix4().identity().translate(70, 0, 0);
    earth.worldMatrix = earthOrbit.clone().multiplyRightSide(earth.worldMatrix);
    earthAtmos.worldMatrix = earthOrbit.clone().multiplyRightSide(earthAtmos.worldMatrix);

    moonOrbit = new Matrix4().identity().translate(10, 0, 0);
    moon.worldMatrix = moonOrbit.clone().multiplyRightSide(moon.worldMatrix);
    moon.worldMatrix = earthOrbit.clone().multiplyRightSide(moon.worldMatrix);

    mercuryOrbit = new Matrix4().identity().translate(25, 0, 0);
    mercury.worldMatrix = mercuryOrbit.clone().multiplyRightSide(mercury.worldMatrix);

    venusOrbit = new Matrix4().identity().translate(40, 0, 0);
    venus.worldMatrix = venusOrbit.clone().multiplyRightSide(venus.worldMatrix);

    marsOrbit = new Matrix4().identity().translate(90, 0, 0);
    mars.worldMatrix = marsOrbit.clone().multiplyRightSide(mars.worldMatrix);

    jupiterOrbit = new Matrix4().identity().translate(120, 0, 0);
    jupiter.worldMatrix = jupiterOrbit.clone().multiplyRightSide(jupiter.worldMatrix);

    saturnOrbit = new Matrix4().identity().translate(160, 0, 0);
    saturn.worldMatrix = saturnOrbit.clone().multiplyRightSide(saturn.worldMatrix);
    saturnRing.worldMatrix = saturnOrbit.clone().multiplyRightSide(saturnRing.worldMatrix);

    uranusOrbit = new Matrix4().identity().translate(200, 0, 0);
    uranus.worldMatrix = uranusOrbit.clone().multiplyRightSide(uranus.worldMatrix);

    neptuneOrbit = new Matrix4().identity().translate(220, 0, 0);
    neptune.worldMatrix = neptuneOrbit.clone().multiplyRightSide(neptune.worldMatrix);

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    time.update();
    camera.update(time.deltaTime);

    // Rotate Stars
    sun.worldMatrix.rotateY(0.1);
    starField.worldMatrix.rotateY(-0.01);
    starFieldAnim.worldMatrix.rotateY(-0.012);

    // Rotate Earth and Moon
    // 1. revert orbit transforms
    earth.worldMatrix = earthOrbit.clone().inverse().multiplyRightSide(earth.worldMatrix);
    earthAtmos.worldMatrix = earthOrbit.clone().inverse().multiplyRightSide(earthAtmos.worldMatrix);
    moon.worldMatrix = earthOrbit.clone().inverse().multiplyRightSide(moon.worldMatrix);
    moon.worldMatrix = moonOrbit.clone().inverse().multiplyRightSide(moon.worldMatrix);

    // 2. do local transforms
    earth.worldMatrix.rotateY(0.8);
    earthAtmos.worldMatrix.rotateY(1.2);
    moon.worldMatrix.rotateY(1.5);

    // 3. transform orbits
    earthOrbit.rotateY(0.5);
    moonOrbit.rotateY(3);

    // 4. reapply orbit transforms
    earth.worldMatrix = earthOrbit.clone().multiplyRightSide(earth.worldMatrix);
    earthAtmos.worldMatrix = earthOrbit.clone().multiplyRightSide(earthAtmos.worldMatrix);
    moon.worldMatrix = moonOrbit.clone().multiplyRightSide(moon.worldMatrix);
    moon.worldMatrix = earthOrbit.clone().multiplyRightSide(moon.worldMatrix);

    //Rotate other planets
    mercury.worldMatrix = mercuryOrbit.clone().inverse().multiplyRightSide(mercury.worldMatrix);
    mercury.worldMatrix.rotateY(0.8);
    mercuryOrbit.rotateY(1.5);
    mercury.worldMatrix = mercuryOrbit.clone().multiplyRightSide(mercury.worldMatrix);

    venus.worldMatrix = venusOrbit.clone().inverse().multiplyRightSide(venus.worldMatrix);
    venus.worldMatrix.rotateY(0.8);
    venusOrbit.rotateY(1);
    venus.worldMatrix = venusOrbit.clone().multiplyRightSide(venus.worldMatrix);

    mars.worldMatrix = marsOrbit.clone().inverse().multiplyRightSide(mars.worldMatrix);
    mars.worldMatrix.rotateY(0.8);
    marsOrbit.rotateY(0.25);
    mars.worldMatrix = marsOrbit.clone().multiplyRightSide(mars.worldMatrix);

    jupiter.worldMatrix = jupiterOrbit.clone().inverse().multiplyRightSide(jupiter.worldMatrix);
    jupiter.worldMatrix.rotateY(0.8);
    jupiterOrbit.rotateY(0.125);
    jupiter.worldMatrix = jupiterOrbit.clone().multiplyRightSide(jupiter.worldMatrix);

    saturn.worldMatrix = saturnOrbit.clone().inverse().multiplyRightSide(saturn.worldMatrix);
    saturnRing.worldMatrix = saturnOrbit.clone().inverse().multiplyRightSide(saturnRing.worldMatrix);
    saturn.worldMatrix.rotateY(0.8);
    saturnRing.worldMatrix.rotateY(0.8);
    saturnOrbit.rotateY(0.10);
    saturn.worldMatrix = saturnOrbit.clone().multiplyRightSide(saturn.worldMatrix);
    saturnRing.worldMatrix = saturnOrbit.clone().multiplyRightSide(saturnRing.worldMatrix);

    uranus.worldMatrix = uranusOrbit.clone().inverse().multiplyRightSide(uranus.worldMatrix);
    uranus.worldMatrix.rotateY(0.8);
    uranusOrbit.rotateY(0.08);
    uranus.worldMatrix = uranusOrbit.clone().multiplyRightSide(uranus.worldMatrix);

    neptune.worldMatrix = neptuneOrbit.clone().inverse().multiplyRightSide(neptune.worldMatrix);
    neptune.worldMatrix.rotateY(0.8);
    neptuneOrbit.rotateY(0.06);
    neptune.worldMatrix = neptuneOrbit.clone().multiplyRightSide(neptune.worldMatrix);


    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // New frame, clear frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera view variables
    var cameraPosition = camera.getPosition();
    projectionMatrix.setPerspective(45, aspectRatio, 0.1, 1000);

    // Fill buffers
    gl.useProgram(diffuseShaderProgram);
    var uniforms = diffuseShaderProgram.uniforms;
    gl.uniform3f(uniforms.sunOriginUniform, sun.worldMatrix.elements[3], sun.worldMatrix.elements[7], sun.worldMatrix.elements[11]);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    gl.useProgram(emissionShaderProgram);
    var uniforms = emissionShaderProgram.uniforms;
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    gl.useProgram(emitAnimShaderProgram);
    var uniforms = emitAnimShaderProgram.uniforms;
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
    gl.uniform1f(uniforms.timeUniform, time.secondsElapsedSinceStart);

    gl.useProgram(earthShaderProgram);
    var uniforms = earthShaderProgram.uniforms;
    gl.uniform3f(uniforms.sunOriginUniform, sun.worldMatrix.elements[3], sun.worldMatrix.elements[7], sun.worldMatrix.elements[11]);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Render
    starField.render(camera, projectionMatrix, emissionShaderProgram);

    // Blend blinking stars
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    starFieldAnim.render(camera, projectionMatrix, emitAnimShaderProgram);
    gl.disable(gl.BLEND);

    sun.render(camera, projectionMatrix, emissionShaderProgram);
    earth.render(camera, projectionMatrix, earthShaderProgram);
    moon.render(camera, projectionMatrix, diffuseShaderProgram);
    mercury.render(camera, projectionMatrix, diffuseShaderProgram);
    venus.render(camera, projectionMatrix, diffuseShaderProgram);
    mars.render(camera, projectionMatrix, diffuseShaderProgram);
    jupiter.render(camera, projectionMatrix, diffuseShaderProgram);
    saturn.render(camera, projectionMatrix, diffuseShaderProgram);
    uranus.render(camera, projectionMatrix, diffuseShaderProgram);
    neptune.render(camera, projectionMatrix, diffuseShaderProgram);

    //Blend png transparencies
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    saturnRing.render(camera, projectionMatrix, diffuseShaderProgram);
    earthAtmos.render(camera, projectionMatrix, diffuseShaderProgram);
    gl.disable(gl.BLEND);
}
