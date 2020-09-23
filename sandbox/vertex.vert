attribute vec4 a_position;
uniform float u_fudgeFactor;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main() {
  
    vec4 position = u_matrix * a_position;
    float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
    gl_Position = vec4(position.xyz , zToDivideBy);
    v_color = a_color;
}