import { LineHandler } from "./handler/lineHandler";
import Line from "./model/line";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
if(canvas === null) {
  throw new Error("Couldnt find canvas element")
}
const gl = canvas.getContext("webgl");

if(gl === null){
  throw new Error("Couldnt get webgl context")
}

// gl.viewport(0, 0, canvas.width, canvas.height)
// gl.clearColor(0.5, 0.5, 0.5, 1.0);
// gl.enable(gl.DEPTH_TEST);
// gl.clear(gl.COLOR_BUFFER_BIT);

const lines: Array<Line> = []


// CREATE VERTEX SHADER
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
if(vertexShader === null){
  throw new Error("could establish vertex shader")
}
const vertexShaderCode = `
  attribute vec2 coordinates;
  attribute vec4 colors;
  varying vec4 colors_frag;
  void main(void) {
    gl_Position = vec4(coordinates, 0.0, 1.0);
    colors_frag = colors;
  }
`;
gl.shaderSource(vertexShader, vertexShaderCode)

gl.compileShader(vertexShader)


// CREATE FRAGMENT SHADER
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
if (fragmentShader === null)
  throw new Error("Could not establish fragment shader"); 
const fragmentShaderCode = `
  varying mediump vec4 colors_frag;
  void main(void) {
    gl_FragColor = colors_frag;
  }
`;
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);


const shaderProgram = gl.createProgram();
if (shaderProgram === null) throw new Error("Could not create shader program");
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

const vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
const coordinates = gl.getAttribLocation(shaderProgram, "coordinates");
const colors =gl.getAttribLocation(shaderProgram, "colors")
gl.enableVertexAttribArray(coordinates);
gl.enableVertexAttribArray(colors);
gl.vertexAttribPointer(coordinates, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(colors     , 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

drawScene();

function drawScene() {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(shaderProgram);
  
  lines.forEach (element => {
    element.draw(gl);
  });

  window.requestAnimationFrame(drawScene);
}

// Set mouse event handler
var current_handler: Handler
function changeCurrentHandler(new_handler: Handler) {
  current_handler = new_handler
  canvas.onmouseup = (e) => current_handler.onMouseUp(e)
  canvas.onmousedown = (e) => current_handler.onMouseDown(e)
  canvas.onmousemove = (e) => current_handler.onMouseMove(e)
  canvas.onclick = (e) => current_handler.onMouseClick(e)
}

changeCurrentHandler(new LineHandler(gl, lines))


// // Step 1: Initialize the array of vertices for our triangle

// // Step 2: Create a new buffer object
 
// // Step 3: Bind the object to `gl.ARRAY_BUFFER`

// // Step 4: Pass the array of vertices to `gl.ARRAY_BUFFER

// // Step 5: Get the location of the `coordinates` attribute of the vertex shader

// // Step 6: Enable the attribute to receive vertices from the vertex buffer
