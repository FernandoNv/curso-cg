
import vertShaderSrc from './simple.vert.js';
import fragShaderSrc from './simple.frag.js';

import Shader from './shader.js';

class Scene {
  constructor(gl) {
    this.data = [];

    this.delta = 0;
    this.mat = mat4.create();
    this.matLoc = -1;

    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    this.vaoLoc = -1;

    this.init(gl);
  }

  init(gl) {
    this.createShaderProgram(gl);
    this.createVAO(gl);
    this.createUniforms(gl);
  }

  createShaderProgram(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.matLoc = gl.getUniformLocation(this.program, "u_mat");
  }

  loadModel() {
    this.data = [
      // posição 2D (x,y)
      0.1, 0.8, 0.1, 0.9, 0.25, 0.8,
      0.25, 0.8, 0.4, 0.9, 0.4, 0.8,

      0.1, 0.5, 0.4, 0.8, 0.1, 0.8,
      0.1, 0.5, 0.4, 0.5, 0.4, 0.8,

      0.4, 0.1, 0.8, 0.5, 0.4, 0.5,
      0.4, 0.1, 0.8, 0.1, 0.8, 0.5,

      0.8, 0.1, 0.9, 0.1, 0.8, 0.3,

      // Cor (rgb)
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

      1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

      0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ];
  }

  createVAO(gl) {
    this.loadModel();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");

    // Criação do VBO (Shader.createBuffer)
    const dataBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.data));

    // Criação do VAO
    // Q1) Escreva a implementação da função abaixo, que constroi um VAO contendo informações de posicão e
    // cores, e esteja de acordo com a estrutura do array this.data
    this.vaoLoc = Shader.createVAO(gl, coordsAttributeLocation, colorsAttributeLocation, dataBuffer);
  }

  objectTransformation() {
    // Q2) Escreva matrizes de transformação que façam o modelo do gatinho se mover da direita para esquerda.
    // - O gatinho deve ter altura e largura 1.0
    // - O gatinho deve começar a caminhada com a ponta do rabo na posição (1.0, -0.5)
    // - Quando a cabeça do gatinho atingir o final da área de desenho, o movimento deve ser reiniciado
  }

  draw(gl) {  
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vaoLoc);

    this.objectTransformation();
    gl.uniformMatrix4fv(this.matLoc, false, this.mat);

    // Q3) Implemente o comando dl.drawArrays adequado para o programa em questão
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");

    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.scene = new Scene(this.gl);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}
