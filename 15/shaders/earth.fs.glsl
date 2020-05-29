// CST 325 Final
// Jason Tse

precision mediump float;

uniform vec3 uSunOrigin;
uniform sampler2D uTexture;
uniform sampler2D uAltTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    vec3 normalizedLightDirection = normalize(uSunOrigin - vWorldPosition);
    vec3 normalizedWorldNormal = normalize(vWorldNormal);
    float lambertTerm = max(dot(normalizedLightDirection, normalizedWorldNormal), 0.0);

    // material color
    vec3 dayValue = texture2D(uTexture, vTexcoords).rgb * lambertTerm;
    vec3 nightValue = texture2D(uAltTexture, vTexcoords).rgb * (1.0 - lambertTerm);
    
    vec3 diffuseColor = dayValue + nightValue;

    gl_FragColor = vec4(diffuseColor, 1.0);
}
