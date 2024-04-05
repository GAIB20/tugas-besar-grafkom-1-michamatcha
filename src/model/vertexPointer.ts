import Point from "./point";
import Selectable from "./selectable";

class VertexPointer implements Drawable, Selectable {
    point: Point
    static POINT_SIZE = 10

    constructor(p: Point) {
        this.point = p
    }
    draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.point.toArray()]), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    changeColor(id: number, color: [number, number, number, number]): void {
        
    }
    changeAllColor(color: [number, number, number, number]): void {
        
    }
    isCoordInside(coord: [number, number]): boolean {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        return Math.abs(this.point.x - coord[0]) * canvas.height < VertexPointer.POINT_SIZE && 
            Math.abs(this.point.y - coord[1]) * canvas.width < VertexPointer.POINT_SIZE
    }
    showAllVertex(vertex: VertexPointer[]): void {
        while (vertex.length)
            vertex.pop()

        vertex.push(this)
    }

    
}

export default VertexPointer