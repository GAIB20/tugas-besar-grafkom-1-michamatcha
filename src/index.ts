import { LineHandler } from "./handler/lineHandler";
import { RectangleHandler } from "./handler/rectangleHandler";
import Line from "./model/line";
import Rectangle from "./model/rectangle";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
if(canvas === null) {
  throw new Error("Couldnt find canvas element")
}
const gl = canvas.getContext("webgl");

if(gl === null){
  throw new Error("Couldnt get webgl context")
}

const shapeButtons = document.getElementsByClassName("shape");
Array.from(shapeButtons).forEach(button =>{
  button.addEventListener('click', function(){
    Array.from(shapeButtons).forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    handleShapeButton(this.id)
  })
})

function handleShapeButton(buttonId: string){
  switch(buttonId){
    case "shapeLine":
      console.log("Line selected")
      changeCurrentHandler(new LineHandler(gl, lines))
      break;
    case "shapeSquare":
      console.log("Square selected");
      break;
    case "shapeRectangle":
      console.log("Rectangle selected")
      changeCurrentHandler(new RectangleHandler(gl, rectangles))
      break
    case "shapePolygon":
      console.log("Polygon selected");
      break
  }
}

const lines: Array<Line> = []
const rectangles : Array <Rectangle> = []


// CREATE VERTEX SHADER

const vertexShaderCode = `
  attribute vec2 coordinates;
  uniform vec2 translation;
  attribute vec4 colors;
  varying vec4 colors_frag;
  void main(void) {
    gl_Position = vec4(coordinates + translation, 0.0, 1.0);
    colors_frag = colors;
  }
`;

const fragmentShaderCode = `
  varying mediump vec4 colors_frag;
  void main(void) {
    gl_FragColor = colors_frag;
  }
`;



// const shaderProgram = gl.createProgram();
// if (shaderProgram === null) throw new Error("Could not create shader program");
// gl.attachShader(shaderProgram, vertexShader);
// gl.attachShader(shaderProgram, fragmentShader);
// gl.linkProgram(shaderProgram);

const shaderProgram= initShader(gl, vertexShaderCode, fragmentShaderCode)
const programInfo = {
  program: shaderProgram,
  attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'coordinates'),
      colors: gl.getAttribLocation(shaderProgram, "colors")
  },
};


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
    console.log(element)
  });
  rectangles.forEach(element => {
    console.log(element)
    element.draw(gl)
  })

  window.requestAnimationFrame(drawScene);
}
function loadShader(gl, type, source){
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Error compiling shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

return shader;
  }

function initShader(gl, vertexShaderCode, fragmentShaderCode){
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode)
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
    alert("unable to init shader program : " + gl.getProgramInfoLog(shaderProgram))
    return null
  }
  return shaderProgram
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




// // Step 1: Initialize the array of vertices for our triangle

// // Step 2: Create a new buffer object
 
// // Step 3: Bind the object to `gl.ARRAY_BUFFER`

// // Step 4: Pass the array of vertices to `gl.ARRAY_BUFFER

// // Step 5: Get the location of the `coordinates` attribute of the vertex shader

// // Step 6: Enable the attribute to receive vertices from the vertex buffer
