import { LineHandler } from "./handler/lineHandler";
import { RectangleHandler } from "./handler/rectangleHandler";
import { PolygonHandler } from "./handler/polygonHandler";
import Line from "./model/line";
import Point from "./model/point";
import Rectangle from "./model/rectangle";
import { getColor } from "./utils/colorUtil";
import Polygon from "./model/polygon";
import VertexPointer from "./model/vertexPointer";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
if(canvas === null) {
  throw new Error("Couldnt find canvas element")
}
const gl = canvas.getContext("webgl");

if(gl === null){
  throw new Error("Couldnt get webgl context")
}
var shapeActive; // 0 : line, 1: rectangle, 2: square, 3: polygon, 4: vertexPointers
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
    var new_point = new Point(0,0,getColor())
    var temp : boolean
    var count = polygons.length-1;
    new_point.setCoordinateFromEvent(e)

    // check polygon
    for(let i = polygons.length-1; i >= 0; i--){
      temp = polygons[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside polygon ${count}`)
        shapeActive = 3
        order = count
        break
      }
      count--
    }

    // check rectangle
    count = rectangles.length-1;
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
      count--
    }

    // check pointer
    count = vertexPointers.length - 1
    for(let i = vertexPointers.length - 1; i >= 0; i--){
      temp = vertexPointers[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside vertex ${count}`)
        shapeActive = 4
        order = count
        break
      }
      count--
    }
    
    if(shapeActive === 0 && lines[order]) { 
      lines[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 1 && rectangles[order]) {
      rectangles[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 3 && polygons[order]) {
      polygons[order].showAllVertex(vertexPointers);
    } else if (shapeActive === 4 && vertexPointers[order]) {
      vertexPointers[order].showAllVertex(vertexPointers)
    }
  }
})

const translateXSlider = document.getElementById('translateX') as HTMLInputElement
const translateYSlider = document.getElementById('translateY') as HTMLInputElement
const translateXValue = document.getElementById('translateXValue')
const translateYValue = document.getElementById('translateYValue')
const dilatationSlider = document.getElementById('dilatation') as HTMLInputElement
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
  console.log(`now: ${previewY}`)
}
)

var previewScale
dilatationSlider.addEventListener('input', () => {
  previewScale = parseFloat(dilatationValue.textContent)
  updateSlider(dilatationSlider, dilatationValue)
  dilate()
  previewScale = parseFloat(dilatationValue.textContent)
})

const translateButton = document.getElementById("translateButton")
function translation(){
  if(currentAction === "translateButton"){
    let diffX = (parseFloat(translateXSlider.value) - previewX) / 300;
    console.log(`diffX: ${diffX}`)
    let diffY = (parseFloat(translateYSlider.value) - previewY) / 300;
    console.log(`diffY: ${diffY}`)
    if(shapeActive === 0 && lines[order]) { 
        lines[order].translate(diffX, diffY);
        lines[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 1 && rectangles[order]) {
        rectangles[order].translate(diffX, diffY);
        rectangles[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 3 && polygons[order]) {
        polygons[order].translate(diffX, diffY)
        polygons[order].showAllVertex(vertexPointers);
    }
  }
}

function dilate(){
  if(currentAction === "dilateButton"){
    let diff = (parseFloat(dilatationSlider.value))/previewScale
    console.log(`diff: ${diff}`)
    if(shapeActive === 0 && lines[order]){
      lines[order].dilate(diff)
      lines[order].showAllVertex(vertexPointers);
    }else if(shapeActive === 1 && rectangles[order]){
      rectangles[order].dilate(diff)
      rectangles[order].showAllVertex(vertexPointers);
    }else if(shapeActive === 3 && polygons[order]) {
      polygons[order].dilate(diff)
      polygons[order].showAllVertex(vertexPointers);
  }
  }

}

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
      changeCurrentHandler(new PolygonHandler(gl, polygons))
      break
  }
}



const lines: Array<Line> = []
const rectangles : Array <Rectangle> = []
const polygons: Array<Polygon> = []
const vertexPointers: Array<VertexPointer> = []


// CREATE VERTEX SHADER

const vertexShaderCode = `
attribute vec2 coordinates;
attribute vec4 colors;
varying vec4 colors_frag;
void main(void) {
  gl_Position = vec4(coordinates, 0.0, 1.0);
  gl_PointSize = 10.0;
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
  });
  rectangles.forEach(element => {
    element.draw(gl)
  })
  polygons.forEach (element => {
    element.draw(gl);
  })
  vertexPointers.forEach (element => {
    element.draw(gl);
  });

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
