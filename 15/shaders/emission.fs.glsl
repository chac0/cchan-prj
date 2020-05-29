// CST 325 Final
// Jason Tse

precision mediump float;

uniform sampler2D uTexture;

varying vec2 vTexcoords;

void main(void) {
    // material color
    vec4 albedo = texture2D(uTexture, vTexcoords).rgba;

    gl_FragColor = vec4(albedo);
}
