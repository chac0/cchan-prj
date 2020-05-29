// CST 325 Final
// Jason Tse

precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexcoords;

void main(void) {
    //Use time to vary opacity
    float alpha = sin(uTime * 70.0);

    // material color
    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    gl_FragColor = vec4(albedo, alpha);
}
