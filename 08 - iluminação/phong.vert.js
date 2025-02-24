export default 
`#version 300 es
precision highp float;

in vec4 position;
in vec4 color;
in vec4 normal;

uniform vec4 light_pos;

uniform vec4 light_amb_c;
uniform float light_amb_k;

uniform vec4 light_dif_c;
uniform float light_dif_k;

uniform vec4 light_esp_c;
uniform float light_esp_k;
uniform float light_esp_p;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec4 vColor;

void main() {
  mat4 modelView = u_view * u_model;

  // posição do vértice no sistema da câmera
  vec4 viewPosition = modelView * position;

  // normal do vértice no sistema da câmera
  vec4 viewNormal = transpose(inverse(modelView)) * normal;
  viewNormal = normalize(viewNormal);

  // posição da luz no sistema da câmera
  vec4 viewLightPos = u_view * light_pos;

  // direção da luz
  vec4 lightDir = normalize(viewLightPos - viewPosition);

  // direção da camera (camera está na origem)
  vec4 cameraDir = normalize(-viewPosition);

  // fator da componente difusa
  float fatorDif = max(0.0, dot(lightDir, viewNormal));

  // fator da componente especular
  vec4 halfVec = normalize(lightDir + cameraDir);
  float fatorEsp = pow(max(0.0, dot(halfVec, viewNormal)), light_esp_p);

  // posição final do vertice
  gl_Position  = u_projection * viewPosition;

  // cor final do vértice
  vColor = 0.25 * color + 0.75 * (light_amb_k * light_amb_c + fatorDif * light_dif_k * light_dif_c + fatorEsp * light_esp_k * light_esp_c);
}`