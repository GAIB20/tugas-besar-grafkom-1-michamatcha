import Point from "./point";
import { getColor } from "../utils/colorUtil";
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";


class Rectangle implements Drawable, Transformable, Selectable{


    initialPoint : Point
    secondPoint : Point
    vertices: number[] = []
    colors: number[]


    setInitialPoint(_point: Point){
        this.initialPoint = _point
    }
    setSecondPoint(_point : Point){
        this.secondPoint = _point
        
    }
    setColors(colors : [number, number, number, number]){
        this.colors = colors
    }
    
    setAllPointsByInput(_point1: Point, _point2: Point){
        this.vertices = [
            this.initialPoint.x, this.initialPoint.y, ...getColor(),
            this.secondPoint.x, this.initialPoint.y, ...getColor(),  
            this.secondPoint.x, this.secondPoint.y, ...getColor(),
            this.initialPoint.x, this.initialPoint.y, ...getColor(),
            this.secondPoint.x, this.secondPoint.y, ...getColor(),
            this.initialPoint.x, this.secondPoint.y, ...getColor()   
        ];
    }
    translate(_deltaX: number, _deltaY: number) {
        this.initialPoint.moveCoordinateX(_deltaX)
        this.secondPoint.moveCoordinateX(_deltaX)
        this.initialPoint.moveCoordinateY(_deltaY)
        this.secondPoint.moveCoordinateY(_deltaY)
        this.setAllPointsByInput(this.initialPoint, this.secondPoint)
    }

    dilate(_scale: number) {
        this.initialPoint.x = (_scale * this.initialPoint.x)
        this.initialPoint.y = (_scale * this.initialPoint.y)
        this.secondPoint.x = (_scale * this.secondPoint.x)
        this.secondPoint.y = (_scale * this.secondPoint.y)
        this.setAllPointsByInput(this.initialPoint, this.secondPoint)
    }


    isCoordInside(coord: [number, number]): boolean {
        return (coord[0] >= Math.min(this.initialPoint.x, this.secondPoint.x) && coord[0] <= Math.max(this.initialPoint.x, this.secondPoint.x)&&
        coord[1] >= Math.min(this.initialPoint.y, this.secondPoint.y) && coord[1] <= Math.max(this.initialPoint.y, this.secondPoint.y)) 
    }
    draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }

    showAllVertex(pointers: VertexPointer[]): void {
        while (pointers.length > 0) 
            pointers.pop()
        
        const usedidx = [0, 1, 2, 5]
        usedidx.forEach((i: number) => {
            pointers.push(new VertexPointer(new Point(this.vertices[i * 6 + 0], this.vertices[i * 6 + 1], 
                [this.vertices[i * 6 + 2], this.vertices[i * 6 + 3], this.vertices[i * 6 + 4], this.vertices[i * 6 + 5]])
                .complement()
            ))
        });
        
    }

}
export default Rectangle