// CST 325 Final
// Jason Tse

precision mediump float;

uniform vec3 uSunOrigin;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    vec3 normalizedLightDirection = normalize(uSunOrigin - vWorldPosition);
    vec3 normalizedWorldNormal = normalize(vWorldNormal);
    float lambertTerm = max(dot(normalizedLightDirection, normalizedWorldNormal), 0.0);

    // material color
    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;
    float alpha = texture2D(uTexture, vTexcoords).a;
    vec3 diffuseColor = albedo * lambertTerm;

    gl_FragColor = vec4(diffuseColor, alpha);
}
