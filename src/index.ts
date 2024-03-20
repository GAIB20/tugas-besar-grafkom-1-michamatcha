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



// CREATE VERTEX SHADER
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
if(vertexShader === null){
  throw new Error("could establish vertex shader")
}
const vertexShaderCode = `
  attribute vec2 coordinates;
  void main(void) {
    gl_Position = vec4(coordinates, 0.0, 1.0);
  }
`;
gl.shaderSource(vertexShader, vertexShaderCode)

gl.compileShader(vertexShader)


// CREATE FRAGMENT SHADER
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
if (fragmentShader === null)
  throw new Error("Could not establish fragment shader"); 
const fragmentShaderCode = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);


const shaderProgram = gl.createProgram();
if (shaderProgram === null) throw new Error("Could not create shader program");
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Step 1: Initialize the array of vertices for our triangle
const vertices = new Float32Array([0.5, -0.5, -0.5, -0.5, 0.0, 0.5]);

// Step 2: Create a new buffer object
const vertex_buffer = gl.createBuffer();

// Step 3: Bind the object to `gl.ARRAY_BUFFER`
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Step 4: Pass the array of vertices to `gl.ARRAY_BUFFER
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Step 5: Get the location of the `coordinates` attribute of the vertex shader
const coordinates = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coordinates, 2, gl.FLOAT, false, 0, 0);

// Step 6: Enable the attribute to receive vertices from the vertex buffer
gl.enableVertexAttribArray(coordinates);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.5, 0.5, 0.5, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);