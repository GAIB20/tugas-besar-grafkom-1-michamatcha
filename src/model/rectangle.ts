import Point from "./point";
import { getColor } from "../utils/colorUtil";
import * as math from 'mathjs'
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";


class Rectangle implements Drawable, Transformable, Selectable, Serializable {


    initialPoint : Point
    secondPoint : Point
    vertices: number[] = []
    points : Point[]
    colors: number[]
    rotation: number = 0 // in degree


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
        res.x = (this.initialPoint.x + this.secondPoint.x) /2
        res.y = (this.initialPoint.y + this.secondPoint.y) /2
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
        var tempPoints : Point[]
        var middlePoint = this.getMiddlePoint()
        tempPoints = this.points
        for(let i = 0; i < 6; i++){
            tempPoints[i].moveCoordinateX(-middlePoint.x)
            tempPoints[i].moveCoordinateY(-middlePoint.y)

            tempPoints[i].x *= _scale
            tempPoints[i].y *= _scale

            tempPoints[i].moveCoordinateX(middlePoint.x)
            tempPoints[i].moveCoordinateY(middlePoint.y)
        }
        this.points = tempPoints
        this.vertices = [this.points[0].x, this.points[0].y, ...this.points[0].getColor(), 
            this.points[1].x, this.points[1].y, ...this.points[1].getColor(),
            this.points[2].x, this.points[2].y, ...this.points[2].getColor(),
            this.points[3].x, this.points[3].y, ...this.points[3].getColor(),
            this.points[4].x, this.points[4].y, ...this.points[4].getColor(),
            this.points[5].x, this.points[5].y, ...this.points[5].getColor()]
    }

    rotate(_theta: number) { // theta in degrees
        console.log(`point 1 : ${this.initialPoint.x}, ${this.initialPoint.y}`)
        console.log(`point 2 : ${this.secondPoint.x}, ${this.secondPoint.y}`)
        this.rotation += _theta
        _theta = _theta * (Math.PI/180) // degrees to radian
        console.log(`radian : ${_theta}`)
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
        const rotationMatrix = [[cosTheta, -sinTheta], [sinTheta, cosTheta]]
        var middlePoint = this.getMiddlePoint()
        const canvas = document.getElementById("canvas") as HTMLCanvasElement

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

            // scale points appropriately
            points[i][0] *= canvas.width
            points[i][1] *= canvas.height

            // rotate
            points[i] = [cosTheta * points[i][0] - sinTheta * points[i][1], sinTheta * points[i][0] + cosTheta * points[i][1]]
            
            // scale points back
            points[i][0] /= canvas.width
            points[i][1] /= canvas.height

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
        this.vertices = [...points[0], ... point1.getColor(),...points[1], ... point2.getColor(),... points[2], ... point3.getColor(),
                        ...points[3], ... point4.getColor(),... points[4],...point5.getColor(), ...points[5], ...point6.getColor()]
        console.log(`this: ${this.vertices}`)

    }


    isCoordInside(coord: [number, number]): boolean {
        var tempPoints : Point[] = []
        tempPoints[0] = this.points[0]
        tempPoints[1] = this.points[1]
        tempPoints[2] = this.points[2]
        tempPoints[3] = this.points[5]

        let signs : number[] = []
        for(let i = 0; i < 4; i++){
            const p1 =tempPoints[i]
            const p2 = tempPoints[(i+1) % 4]
            const edgeVector = { x: p2.x - p1.x, y: p2.y - p1.y };
            const pointVector = { x: coord[0] - p1.x, y: coord[1] - p1.y };
            
        
            const crossProduct = edgeVector.x * pointVector.y - edgeVector.y * pointVector.x;
            if (crossProduct < 0) {
              signs.push(-1);
            } else if (crossProduct > 0) {
              signs.push(1);
            } else {
              signs.push(0); 
            }

        }
        const allPositiveOrZero = signs.every(sign => sign >= 0);
        const allNegativeOrZero = signs.every(sign => sign <= 0);
      
        return allPositiveOrZero || allNegativeOrZero;
    }
    draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }
    changeColor(id: number, color: [number, number, number, number]): void {
        if (id === 0) {
            for (let i = 0; i < 4; i++) {
                this.vertices[0 * 6 + 2 + i] = color[i]
            }
            this.points[0].setColor(color)
            for (let i = 0; i < 4; i++) {
                this.vertices[3 * 6 + 2 + i] = color[i]
            }
            this.points[3].setColor(color)
        }
        else if (id === 1) {
            for (let i = 0; i < 4; i++) {
                this.vertices[1 * 6 + 2 + i] = color[i]
            }
            this.points[1].setColor(color)
        }
        else if (id === 2) {
            for (let i = 0; i < 4; i++) {
                this.vertices[2 * 6 + 2 + i] = color[i]
            }
            this.points[2].setColor(color)
            for (let i = 0; i < 4; i++) {
                this.vertices[4 * 6 + 2 + i] = color[i]
            }
            this.points[4].setColor(color)
        }
        else if (id === 3) {
            for (let i = 0; i < 4; i++) {
                this.vertices[5 * 6 + 2 + i] = color[i]
            }
            this.points[5].setColor(color)
        }
    }
    changeAllColor(color: [number, number, number, number]): void {
        this.points.forEach((point) => {
            point.setColor(color)
        })
        for (let j = 0; j < 6; ++j) {
            for (let i = 0; i < 4; i++) {
                this.vertices[j * 6 + 2 + i] = color[i]
            }
        }
    }
    movePoint(id: number, _posX: number, _posY: number): void {
        const temprot = this.rotation
        const _theta = -temprot * (Math.PI/180)

        // Rotate new position, centered around middlepoint
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        const mid = this.getMiddlePoint()
        _posX -= mid.x
        _posY -= mid.y

        _posX *= canvas.width
        _posY *= canvas.height

        let _pos = [cosTheta * _posX - sinTheta * _posY, sinTheta * _posX + cosTheta * _posY]
        _posX = _pos[0]
        _posY = _pos[1]

        _posX /= canvas.width
        _posY /= canvas.height

        _posX += mid.x
        _posY += mid.y

        this.rotate(-this.rotation)

        if (id === 0) {
            this.vertices[0 * 6 + 0] = this.points[0].x = _posX
            this.vertices[0 * 6 + 1] = this.points[0].y = _posY
            this.vertices[3 * 6 + 0] = this.points[3].x = _posX
            this.vertices[3 * 6 + 1] = this.points[3].y = _posY

            this.vertices[5 * 6 + 0] = this.points[5].x = _posX
            this.vertices[1 * 6 + 1] = this.points[1].y = _posY
        }
        else if (id === 1) {
            this.vertices[1 * 6 + 0] = this.points[1].x = _posX
            this.vertices[1 * 6 + 1] = this.points[1].y = _posY

            this.vertices[2 * 6 + 0] = this.points[2].x = _posX
            this.vertices[0 * 6 + 1] = this.points[0].y = _posY
            this.vertices[4 * 6 + 0] = this.points[4].x = _posX
            this.vertices[3 * 6 + 1] = this.points[3].y = _posY
        }
        else if (id === 2) {
            this.vertices[2 * 6 + 0] = this.points[2].x = _posX
            this.vertices[2 * 6 + 1] = this.points[2].y = _posY
            this.vertices[4 * 6 + 0] = this.points[4].x = _posX
            this.vertices[4 * 6 + 1] = this.points[4].y = _posY

            this.vertices[1 * 6 + 0] = this.points[1].x = _posX
            this.vertices[5 * 6 + 1] = this.points[5].y = _posY
        }
        else if (id === 3) {
            this.vertices[5 * 6 + 0] = this.points[5].x = _posX
            this.vertices[5 * 6 + 1] = this.points[5].y = _posY

            this.vertices[0 * 6 + 0] = this.points[0].x = _posX
            this.vertices[2 * 6 + 1] = this.points[2].y = _posY
            this.vertices[3 * 6 + 0] = this.points[3].x = _posX
            this.vertices[4 * 6 + 1] = this.points[4].y = _posY
        }
        this.rotate(temprot)
    }
    commitMove(): void {
        
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
    fromJson(json: any): void {
        this.initialPoint = new Point(0,0,[0,0,0,0])
        this.initialPoint.fromJson(json.initialPoint)
        this.secondPoint = new Point(0,0,[0,0,0,0])
        this.secondPoint.fromJson(json.secondPoint)
        this.vertices = json.vertices
        this.points = []
        json.points.forEach((point: any) => {
            var tmp = new Point(0,0,[0,0,0,0])
            tmp.fromJson(point)
            this.points.push(tmp)
        })
        this.colors = json.colors
        this.rotation = json.rotation
    }

}
export default Rectangle