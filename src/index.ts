import { LineHandler } from "./handler/lineHandler";
import { RectangleHandler } from "./handler/rectangleHandler";
import Line from "./model/line";
import Point from "./model/point";
import Rectangle from "./model/rectangle";
import { getColor } from "./utils/colorUtil";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
if(canvas === null) {
  throw new Error("Couldnt find canvas element")
}
const gl = canvas.getContext("webgl");

if(gl === null){
  throw new Error("Couldnt get webgl context")
}
var shapeActive; // 0 : line, 1: rectangle, 2: square, 3: polygon
var order;

const shapeButtons = document.getElementsByClassName("shape");
Array.from(shapeButtons).forEach(button =>{
  button.addEventListener('click', function(){
    Array.from(shapeButtons).forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    handleShapeButton(this.id)
  })
})


var currentAction
const basicActionButtons = document.getElementsByClassName("basicAction");
Array.from(basicActionButtons).forEach(button => {
  button.addEventListener('click', function(){
    Array.from(basicActionButtons).forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    currentAction = this.id
    changeCurrentHandler(null)
})
})


const selectButton = document.getElementById("selectButton")
selectButton.addEventListener('click', function(){
  canvas.onmousedown= (e) => {
    // check rectangle
    var new_point = new Point(0,0,getColor())
    var temp : boolean
    var count = rectangles.length-1;
    new_point.setCoordinateFromEvent(e)
    for(let i = rectangles.length-1; i >= 0; i--){
      temp = rectangles[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside rectangle ${count}`)
        shapeActive = 1
        order = count
        break
      }
      count--
    }

    // check line
    count = lines.length - 1
    for(let i = lines.length - 1; i >= 0; i--){
      temp = lines[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside lines ${count}`)
        shapeActive = 0
        order = count
        break
      }
    }
    

  }
})

const translateXSlider = document.getElementById('translateX') as HTMLInputElement
const translateYSlider = document.getElementById('translateY') as HTMLInputElement
const translateXValue = document.getElementById('translateXValue')
const translateYValue = document.getElementById('translateYValue')
const dilatationSlider = document.getElementById('dilatation')
const dilatationValue = document.getElementById('dilatationValue')
function updateSlider(slider, displayElement){
  displayElement.textContent = slider.value
}
// updateSlider(translateXSlider, translateXValue)
var previewX
var previewY
translateXSlider.addEventListener('input', () => {
  previewX = parseFloat(translateXValue.textContent)
  previewY = parseFloat(translateYValue.textContent)
  console.log(`prev: ${previewX}`)
  updateSlider(translateXSlider, translateXValue)
  translation()
  previewX = parseFloat(translateXValue.textContent)
  console.log(`now: ${previewX}`)
}
)
translateYSlider.addEventListener('input', () => {
  previewX = parseFloat(translateXValue.textContent)
  previewY = parseFloat(translateYValue.textContent)
  console.log(`prev: ${previewY}`)
  updateSlider(translateYSlider, translateYValue)
  translation()
  previewY = parseFloat(translateYValue.textContent)
  console.log(`prev: ${previewY}`)
}
)
dilatationSlider.addEventListener('input', () => updateSlider(dilatationSlider, dilatationValue))

const translateButton = document.getElementById("translateButton")


function translation(){
  if(currentAction == "translateButton"){
    let diffX = (parseFloat(translateXSlider.value) - previewX) / 300;
    console.log(`diffX: ${diffX}`)
    let diffY = (parseFloat(translateYSlider.value) - previewY) / 300;
    console.log(`diffY: ${diffY}`)
    if(shapeActive === 0 && lines[order]) { 
        lines[order].translate(diffX, diffY);
    } else if(shapeActive === 1 && rectangles[order]) {
        rectangles[order].translate(diffX, diffY);
    }
  }
}

// translateButton.addEventListener('click', function(){
//   switch(shapeActive){
//     case 0:
//       lines[order].translate((parseFloat(translateXSlider.value) / 100), (parseFloat(translateYSlider.value) / 100))
//     case 1:
//       rectangles[order].translate(parseFloat(translateXSlider.value)/100, parseFloat(translateYSlider.value) / 100)
//     case 2:
//       console.log("square")
//     case 3:
//       console.log("polygon")
//   }
// })
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
attribute vec4 colors;
varying vec4 colors_frag;
void main(void) {
  gl_Position = vec4(coordinates, 0.0, 1.0);
  colors_frag = colors;
}
`;

const fragmentShaderCode = `
  varying mediump vec4 colors_frag;
  void main(void) {
    gl_FragColor = colors_frag;
  }
`;


const shaderProgram= initShader(gl, vertexShaderCode, fragmentShaderCode)



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
    // console.log(element)
  });
  rectangles.forEach(element => {
    // console.log(element)
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
  if (vertexShader === null || fragmentShader === null) {
    return null; // One of the shaders failed to compile
  }
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
function changeCurrentHandler(new_handler: Handler | null) {
  current_handler = new_handler
  if(new_handler){
    canvas.onmouseup = (e) => current_handler.onMouseUp(e)
    canvas.onmousedown = (e) => current_handler.onMouseDown(e)
    canvas.onmousemove = (e) => current_handler.onMouseMove(e)
    canvas.onclick = (e) => current_handler.onMouseClick(e)
  }else{
    canvas.onmouseup = null
    canvas.onmousedown = null
    canvas.onmousemove = null
    canvas.onclick = null
  }

}




// // Step 1: Initialize the array of vertices for our triangle

// // Step 2: Create a new buffer object
 
// // Step 3: Bind the object to `gl.ARRAY_BUFFER`

// // Step 4: Pass the array of vertices to `gl.ARRAY_BUFFER

// // Step 5: Get the location of the `coordinates` attribute of the vertex shader

// // Step 6: Enable the attribute to receive vertices from the vertex buffer
