import * as math from 'mathjs'
import Point from "./point"
import { getColor } from '../utils/colorUtil'
import Selectable from "./selectable"
import VertexPointer from "./vertexPointer"

class Line implements Drawable, Transformable, Selectable {


    point1: Point
    point2: Point

    public setPoint1(_point1: Point) {
        this.point1 = _point1
    }
    public setPoint2(_point2 : Point){
        this.point2 = _point2
    }


    public getGradient(){
        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x)
    }
    getMiddlePoint() {
        return new Point((this.point1.x + this.point2.x) / 2, (this.point1.y + this.point2.y) / 2,
            [(this.point1.color[0] + this.point2.color[0]) / 2, 
            (this.point1.color[1] + this.point2.color[1]) / 2, 
            (this.point1.color[2] + this.point2.color[2]) / 2,
            (this.point1.color[3] + this.point2.color[3]) / 2,
        ])
    }

    isCoordInside(coord: [number, number]): boolean {
        return (( Math.abs((this.point1.y - coord[1]) - (this.getGradient() *(this.point1.x - coord[0]))) < 0.03 ) && (coord[0] >= Math.min(this.point1.x, this.point2.x)) && (coord[0] <= Math.max(this.point1.x, this.point2.x)) &&
        (coord[1] >= Math.min(this.point1.y, this.point2.y) && (coord[1] <= Math.max(this.point2.y, this.point1.y))))
        
    }
    showAllVertex(pointers: VertexPointer[]): void {
        while (pointers.length > 0) 
            pointers.pop()
        pointers.push(new VertexPointer(this.point1.complement()))
        pointers.push(new VertexPointer(this.point2.complement()))
    }
    public draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.point1.toArray(), ...this.point2.toArray()]), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 2);
    }
    public translate(_deltaX : number, _deltaY: number){
        this.point1.moveCoordinateX(_deltaX);
        this.point2.moveCoordinateX(_deltaX);
        this.point1.moveCoordinateY(_deltaY);
        this.point2.moveCoordinateY(_deltaY);
    }
    dilate(_scale: number) {
        const mid = this.getMiddlePoint()
        this.point1.moveCoordinateX(-mid.x)
        this.point1.moveCoordinateY(-mid.y)
        this.point2.moveCoordinateX(-mid.x)
        this.point2.moveCoordinateY(-mid.y)

        this.point1.x = _scale * this.point1.x
        this.point1.y = _scale * this.point1.y
        this.point2.x = _scale * this.point2.x
        this.point2.y = _scale * this.point2.y

        
        this.point1.moveCoordinateX(mid.x)
        this.point1.moveCoordinateY(mid.y)
        this.point2.moveCoordinateX(mid.x)
        this.point2.moveCoordinateY(mid.y)
    }

    rotate(_theta: number) {
        _theta = _theta * (Math.PI/180) // degrees to radian
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
        const rotationMatrix = [[cosTheta, -sinTheta], [sinTheta, cosTheta]]
        const mid = this.getMiddlePoint()
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        
        // translate points to middle
        this.point1.x -= mid.x
        this.point1.y -= mid.y
        this.point2.x -= mid.x
        this.point2.y -= mid.y

        // scale points appropriately
        this.point1.x *= canvas.width
        this.point1.y *= canvas.height
        this.point2.x *= canvas.width
        this.point2.y *= canvas.height

        // rotate points
        var p1 = new Point(cosTheta * this.point1.x - sinTheta * this.point1.y,
            sinTheta * this.point1.x + cosTheta * this.point1.y,
            this.point1.color)
        var p2 = new Point(cosTheta * this.point2.x - sinTheta * this.point2.y,
            sinTheta * this.point2.x + cosTheta * this.point2.y,
            this.point2.color)
        this.point1 = p1
        this.point2 = p2

        // scale points back
        this.point1.x /= canvas.width
        this.point1.y /= canvas.height
        this.point2.x /= canvas.width
        this.point2.y /= canvas.height
        
        // translate back
        this.point1.x += mid.x
        this.point1.y += mid.y
        this.point2.x += mid.x
        this.point2.y += mid.y
        
    }

    

    
}

export default Line;