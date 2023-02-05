uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;


void main () {

    float mixStrength = vElevation * uColorMultiplier + uColorOffset;

    vec3 newColor = mix(uDepthColor, uSurfaceColor, mixStrength);


    gl_FragColor = vec4(newColor, 1.0);
}