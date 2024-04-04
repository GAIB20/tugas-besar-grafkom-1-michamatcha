import Point from "./point";
import { getColor } from "../utils/colorUtil";
import * as math from 'mathjs'
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";


class Rectangle implements Drawable, Transformable, Selectable{


    initialPoint : Point
    secondPoint : Point
    vertices: number[] = []
    points : Point[]
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
    
    getWidth(){
        return (Math.max(this.initialPoint.x, this.secondPoint.x) - Math.min(this.initialPoint.x, this.secondPoint.x))
    }
    getHeight(){
        return (Math.max(this.initialPoint.y, this.secondPoint.y) - Math.min(this.initialPoint.y, this.secondPoint.y))
    }
    getMiddlePoint(): Point{
        var res = new Point(0, 0, getColor())
        res.x = Math.min(this.initialPoint.x, this.secondPoint.x) + (this.getWidth()/2)
        res.y = Math.min(this.initialPoint.y, this.secondPoint.y) + (this.getHeight()/2)
        return res
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
        var point1 = new Point(this.initialPoint.x, this.initialPoint.y, getColor())
        var point2 = new Point(this.secondPoint.x, this.initialPoint.y, getColor())
        var point3 = new Point(this.secondPoint.x, this.secondPoint.y, getColor())
        var point4 = new Point(this.initialPoint.x, this.initialPoint.y, getColor())
        var point5 = new Point(this.secondPoint.x, this.secondPoint.y, getColor())
        var point6 = new Point(this.initialPoint.x, this.secondPoint.y, getColor())
        this.points = [point1, point2, point3, point4, point5, point6]
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

    rotate(_theta: number) { // theta in degrees
        console.log(`point 1 : ${this.initialPoint.x}, ${this.initialPoint.y}`)
        console.log(`point 2 : ${this.secondPoint.x}, ${this.secondPoint.y}`)
        _theta = _theta * (Math.PI/180) // degrees to radian
        console.log(`radian : ${_theta}`)
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
        const rotationMatrix = [[cosTheta, -sinTheta], [sinTheta, cosTheta]]
        var middlePoint = this.getMiddlePoint()
        console.log(middlePoint)

        var point1 = this.points[0]
        var point2 = this.points[1]
        var point3 = this.points[2]
        var point4 = this.points[3]
        var point5 = this.points[4]
        var point6 = this.points[5]

        var points = [[point1.x, point1.y], [point2.x, point2.y], [point3.x, point3.y], [point4.x, point4.y], [point5.x, point5.y], [point6.x, point6.y]]
        for (let i= 0; i < 6; i++){
            // translate point to origin
            points[i][0] -= middlePoint.x
            points[i][1] -= middlePoint.y
            // rotate
            points[i] = [cosTheta * points[i][0] - sinTheta * points[i][1], sinTheta * points[i][0] + cosTheta * points[i][1]]
            
            // translate back
            points[i][0] += middlePoint.x
            points[i][1] += middlePoint.y
            this.points[i].x = points[i][0]
            this.points[i].y = points[i][1]
            console.log(`points[${i}] : ${points[i]}`)
        }
        this.initialPoint.x = points[0][0]
        this.initialPoint.y = points[0][1]

        this.secondPoint.x = points[2][0]
        this.secondPoint.y = points[2][1]
        this.vertices = [...points[0],...getColor(),...points[1], ... getColor(),... points[2], ... getColor(),
                        ...points[3], ... getColor(),... points[4],...getColor(), ...points[5], ...getColor()]
        console.log(`this: ${this.vertices}`)

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