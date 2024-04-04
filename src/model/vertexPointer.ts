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
    isCoordInside(coord: [number, number]): boolean {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        return Math.abs(this.point.x - coord[0]) * canvas.height < VertexPointer.POINT_SIZE && 
            Math.abs(this.point.y - coord[1]) * canvas.width < VertexPointer.POINT_SIZE
    }
    showAllVertex(vertex: VertexPointer[]): void {
        // do nothing (this is the vertex)
    }
}

export default VertexPointer