import { LineHandler } from "./handler/lineHandler";
import { RectangleHandler } from "./handler/rectangleHandler";
import { PolygonHandler } from "./handler/polygonHandler";
import Line from "./model/line";
import Point from "./model/point";
import Rectangle from "./model/rectangle";
import { getColor } from "./utils/colorUtil";
import Polygon from "./model/polygon";
import VertexPointer from "./model/vertexPointer";
import Selectable from "./model/selectable";
import { MovePointHandler } from "./handler/movePointHandler";
import { EmptyHandler } from "./handler/emptyHandler";
import { AddPointHandler } from "./handler/addPointHandler";
import Square from "./model/square";
import { SquareHandler } from "./handler/squareHandler";

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
var pointOrder = -1; // -1: no point picked

const selectNone = () => {
  shapeActive = -1;
  order = -1;
  pointOrder = -1;
}
const handleNone = () => {
  changeCurrentHandler(new EmptyHandler())
}

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

    let tmpShapeActive = shapeActive
    shapeActive = -1

    // check polygon
    for(let i = polygons.length-1; i >= 0; i--){
      temp = polygons[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside polygon ${count}`)
        shapeActive = 3
        order = count
        pointOrder = -1
        break
      }
      count--
    }

    //check square
    count = squares.length-1;
    for(let i = squares.length-1; i >= 0; i--){
      temp = squares[i].isCoordInside([new_point.x, new_point.y])
      if(temp){
        console.log(`Inside square ${count}`)
        shapeActive = 2
        order = count
        pointOrder = -1
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
        pointOrder = -1
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
        pointOrder = -1
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
        pointOrder = count
        shapeActive = tmpShapeActive
        break
      }
      count--
    }
    
    
    while (vertexPointers.length) {
      vertexPointers.pop()
    }
    if(shapeActive === 0 && lines[order]) { 
      lines[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 1 && rectangles[order]) {
      rectangles[order].showAllVertex(vertexPointers);
    } else if(shapeActive === 2 && squares[order]){
      squares[order].showAllVertex(vertexPointers)
    }else if(shapeActive === 3 && polygons[order]) {
      polygons[order].showAllVertex(vertexPointers);
    } 
    
    if (pointOrder != -1 && vertexPointers[pointOrder]) {
      vertexPointers[pointOrder].showAllVertex(vertexPointers)
    }
  }
})

const translateXSlider = document.getElementById('translateX') as HTMLInputElement
const translateYSlider = document.getElementById('translateY') as HTMLInputElement
const translateXValue = document.getElementById('translateXValue')
const translateYValue = document.getElementById('translateYValue')
const dilatationSlider = document.getElementById('dilatation') as HTMLInputElement
const dilatationValue = document.getElementById('dilatationValue')
const rotationSlider = document.getElementById('rotation') as HTMLInputElement
const rotationDegrees = document.getElementById('rotationValue')
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

var previewDegree
rotationSlider.addEventListener('input', () =>{
  previewDegree = parseFloat(rotationDegrees.textContent)
  console.log(`preview: ${previewDegree}`)
  updateSlider(rotationSlider, rotationDegrees)
  rotate()
  previewDegree = parseFloat(rotationDegrees.textContent)
  console.log(`preview: ${previewDegree}`)
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
      
    } else if(shapeActive === 2 && squares[order]){
        squares[order].translate(diffX, diffY);
        squares[order].showAllVertex(vertexPointers);
    }
    
    else if(shapeActive === 3 && polygons[order]) {
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
    }else if(shapeActive ===2 && squares[order]){
      squares[order].dilate(diff)
      squares[order].showAllVertex(vertexPointers)
    }
    else if(shapeActive === 3 && polygons[order]) {
      polygons[order].dilate(diff)
      polygons[order].showAllVertex(vertexPointers);
    }
  }

}

function rotate(){
  if(currentAction === "rotateButton"){
    let diff = (parseFloat(rotationSlider.value)) - previewDegree
    console.log(`diff: ${diff}`)
    if(shapeActive === 0 && lines[order]){
      lines[order].rotate(diff)
      lines[order].showAllVertex(vertexPointers);
    }else if(shapeActive===1 && rectangles[order]){
      rectangles[order].rotate(diff)
      rectangles[order].showAllVertex(vertexPointers);
    }else if(shapeActive === 2 && squares[order]){
      squares[order].rotate(diff)
      squares[order].showAllVertex(vertexPointers);
    }else if(shapeActive === 3 && polygons[order]) {
      polygons[order].rotate(diff)
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
      changeCurrentHandler(new SquareHandler(gl, squares))
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

const colorPicker = document.getElementById("point-color") as HTMLElement
colorPicker.addEventListener('change', (ev) => {
    // check if a point / shape is selected

    let shapeSelected: Drawable = null
    switch (shapeActive) {
      case 0:
        shapeSelected = lines[order]
        break
      case 1:
        shapeSelected = rectangles[order]
        break
      case 2:
        shapeSelected = squares[order]
        break
      case 3:
        shapeSelected = polygons[order]
        break
    }

    if (shapeSelected) {
      if (pointOrder == -1) {
        shapeSelected.changeAllColor(getColor())
      }
      else {
        shapeSelected.changeColor(pointOrder, getColor())
      }
    }

})

// move point
const movePoint = document.getElementById("movePoint") as HTMLElement
movePoint.addEventListener('click', (ev) => {
  let shapeSelected: Transformable = null
  switch (shapeActive) {
    case 0:
      shapeSelected = lines[order]
      break
    case 1:
      shapeSelected = rectangles[order]
      break
    case 2:
      shapeSelected = squares[order]
      break
    case 3:
      shapeSelected = polygons[order]
      break
  }

  if (shapeSelected && pointOrder != -1) {
      changeCurrentHandler(new MovePointHandler(gl, shapeSelected, pointOrder, vertexPointers, selectNone))
  }
  else {
    alert("Select any point before pressing move point")
  }
})

// delete
const deleteButton = document.getElementById("delete")
deleteButton.addEventListener('click', (ev) => {
  if (pointOrder != -1) {
    alert("Can only delete shape, not point")
    return
  }

  switch (shapeActive) {
    case 0:
      // hapus line
      lines.splice(order, 1)
      break
    case 1:
      // hapus rect
      rectangles.splice(order, 1)
      break
    case 2:
      // hapus square
      squares.splice(order, 1)
      break
    case 3:
      // hapus polygon
      polygons.splice(order, 1)
      break
  }
  vertexPointers.splice(0, vertexPointers.length)

})

// polygon tools
const addPoint = document.getElementById("addPoint")
addPoint.addEventListener('click', (ev) => {
  let shapeSelected: Polygon = null
  switch (shapeActive) {
    case 3:
      shapeSelected = polygons[order]
      break
    default:
      break
  }

  if (shapeSelected && pointOrder == -1) {
    // do ur job here
    changeCurrentHandler(new AddPointHandler(gl, shapeSelected, vertexPointers, handleNone))
  }
  else {
    alert("Select a polygon to add point")
  }
})

const removePoint = document.getElementById("removePoint")
removePoint.addEventListener('click', (ev) => {
  let shapeSelected: Polygon = null
  switch (shapeActive) {
    case 3:
      shapeSelected = polygons[order]
      break
    default:
      break
  }

  if (shapeSelected && pointOrder != -1) {
      shapeSelected.removePointFromId(pointOrder)
  }
  else {
      alert("Select any point of a polygon to remove it")
  }
})

const saveButton = document.getElementById("save")
saveButton.addEventListener('click', (ev) => {
  const alldata = {
    'lines': lines,
    'rectangles': rectangles,
    'polygons': polygons,
    'squares': squares
  }
  const jsonstr = JSON.stringify(alldata)
  const blob = new Blob([jsonstr], {type: 'application/json'})
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = "save-data" + new Date().toLocaleString()

  a.click()
  URL.revokeObjectURL(url)
})

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
fileInput.addEventListener('change', async () => {
  const selectedFile = fileInput.files?.[0];
  if (selectedFile) {
    let allshape = JSON.parse(await selectedFile.text())
    while(lines.length) lines.pop()
    while(rectangles.length) rectangles.pop()
    while(polygons.length) polygons.pop()
    while(squares.length) squares.pop()
    
    while(allshape.lines.length) {
      var saveLine = allshape.lines.pop()
      var tmpLine = new Line()
      tmpLine.fromJson(saveLine)
      lines.push(tmpLine)
    }
    while(allshape.rectangles.length) {
      var saveRect = allshape.rectangles.pop()
      var tmpRect = new Rectangle()
      tmpRect.fromJson(saveRect)
      rectangles.push(tmpRect)
    }
    while(allshape.polygons.length) {
      var savePoly = allshape.polygons.pop()
      var tmpPoly = new Polygon()
      tmpPoly.fromJson(savePoly)
      polygons.push(tmpPoly)
    }
    while(allshape.squares.length) {
      var saveSquare = allshape.squares.pop()
      var tmpSquare = new Square()
      tmpSquare.fromJson(saveSquare)
      squares.push(tmpSquare)
    }

  } 
});


const lines: Array<Line> = []
const rectangles : Array <Rectangle> = []
const polygons: Array<Polygon> = []
const squares: Array <Square> = []
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
  squares.forEach(element => {
    // console.log(element)
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
