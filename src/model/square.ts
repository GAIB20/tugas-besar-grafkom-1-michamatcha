import Point from "./point";
import { getColor } from "../utils/colorUtil";
import * as math from 'mathjs'
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";

class Square implements Drawable, Transformable, Selectable {
    point1: Point
    point2: Point
    point3: Point
    point4: Point
    point5: Point
    point6: Point
    initialPoint: Point;
    secondPoint: Point;
    sideLength: number = 0;
    vertices: number[] = [];
    points: Point[];
    colors: number[];

    setSideLength(_length){
        this.sideLength = _length
    }
    setInitialPoint(newPoint1: Point) {
        this.initialPoint = new Point(0, 0, getColor())
        this.initialPoint = newPoint1
    }
    setSecondPoint(kuadran: number) {
        this.secondPoint = new Point(0, 0, getColor())
        const canvas = document.getElementById("canvas") as HTMLCanvasElement

        switch(kuadran){
            case 1:
                this.secondPoint.x = this.initialPoint.x + this.sideLength * canvas.height / canvas.width
                this.secondPoint.y = this.initialPoint.y + this.sideLength
                break
            case 2:
                this.secondPoint.x = this.initialPoint.x - this.sideLength * canvas.height / canvas.width
                this.secondPoint.y = this.initialPoint.y + this.sideLength
                break
            case 3:
                this.secondPoint.x = this.initialPoint.x - this.sideLength * canvas.height / canvas.width
                this.secondPoint.y = this.initialPoint.y - this.sideLength

                break
            case 4:
                this.secondPoint.x = this.initialPoint.x + this.sideLength * canvas.height / canvas.width
                this.secondPoint.y = this.initialPoint.y - this.sideLength

                break
        }
        
    }

    setColors(colors: [number, number, number, number]) {
        this.colors = colors;
    }

    getMiddlePoint(): Point {
        const res = new Point(0, 0, getColor());
        res.x = (this.initialPoint.x + this.secondPoint.x) /2
        res.y = (this.initialPoint.y + this.secondPoint.y) /2
        return res;
    }

    setAllPointsByInput() {
        this.point1 = new Point(this.initialPoint.x, this.initialPoint.y, getColor())
        this.point2 = new Point(this.secondPoint.x, this.initialPoint.y, getColor())
        this.point3 = new Point(this.secondPoint.x, this.secondPoint.y, getColor())
        this.point4 = new Point(this.initialPoint.x, this.initialPoint.y, getColor())
        this.point5 = new Point(this.secondPoint.x, this.secondPoint.y, getColor())
        this.point6 = new Point(this.initialPoint.x, this.secondPoint.y, getColor())
        this.points= [this.point1, this.point2, this.point3, this.point4, this.point5, this.point6]
        this.vertices = [this.point1.x, this.point1.y, ...this.point1.getColor(), 
            this.point2.x, this.point2.y, ...this.point2.getColor(),
            this.point3.x, this.point3.y, ...this.point3.getColor(),
            this.point4.x, this.point4.y, ...this.point4.getColor(),
            this.point5.x, this.point5.y, ...this.point5.getColor(),
            this.point6.x, this.point6.y, ...this.point6.getColor()]
    }

    translate(_deltaX: number, _deltaY: number) {
        for(let i = 0; i < 6; i++){
            this.points[i].moveCoordinateX(_deltaX)
            this.points[i].moveCoordinateY(_deltaY)
        }
        this.point1 = this.points[0]
        this.point2 = this.points[1]
        this.point3 = this.points[2]
        this.point4 = this.points[3]
        this.point5 = this.points[4]
        this.point6 = this.points[5]
        this.points= [this.point1, this.point2, this.point3, this.point4, this.point5, this.point6]
        this.vertices = [this.point1.x, this.point1.y, ...this.point1.getColor(), 
            this.point2.x, this.point2.y, ...this.point2.getColor(),
            this.point3.x, this.point3.y, ...this.point3.getColor(),
            this.point4.x, this.point4.y, ...this.point4.getColor(),
            this.point5.x, this.point5.y, ...this.point5.getColor(),
            this.point6.x, this.point6.y, ...this.point6.getColor()]
    }

    dilate(_scale: number) {
        var mid = this.getMiddlePoint()
        console.log(mid)
        var tempPoints : Point[]
        tempPoints = this.points
        for(let i = 0; i < 6; i++){
            tempPoints[i].moveCoordinateX(-mid.x)
            tempPoints[i].moveCoordinateY(-mid.y)
            tempPoints[i].x *= _scale
            tempPoints[i].y *= _scale
            tempPoints[i].moveCoordinateX(mid.x)
            tempPoints[i].moveCoordinateY(mid.y)
        }
        this.point1 = tempPoints[0]
        this.point2 = tempPoints[1]
        this.point3 = tempPoints[2]
        this.point4 = tempPoints[3]
        this.point5 = tempPoints[4]
        this.point6 = tempPoints[5]

        this.initialPoint = this.points[0]
        this.secondPoint = this.points[2]

        this.points = [this.point1, this.point2, this.point3, this.point4, this.point5, this.point6]
        this.vertices = [this.point1.x, this.point1.y, ...this.point1.getColor(), 
            this.point2.x, this.point2.y, ...this.point2.getColor(),
            this.point3.x, this.point3.y, ...this.point3.getColor(),
            this.point4.x, this.point4.y, ...this.point4.getColor(),
            this.point5.x, this.point5.y, ...this.point5.getColor(),
            this.point6.x, this.point6.y, ...this.point6.getColor()]
    }

    rotate(_theta: number) {
        console.log(`point 1 : ${this.initialPoint.x}, ${this.initialPoint.y}`)
        console.log(`point 2 : ${this.secondPoint.x}, ${this.secondPoint.y}`)
        _theta = _theta * (Math.PI/180) // degrees to radian
        console.log(`radian : ${_theta}`)
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
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

        for(let i = 0; i < 6; i++){
            this.points[i].x = points[i][0]
            this.points[i].y = points[i][1]
        }
        this.point1 = this.points[0]
        this.point2 = this.points[1]
        this.point3 = this.points[2]
        this.point4 = this.points[3]
        this.point5 = this.points[4]
        this.point6 = this.points[5]

        this.vertices = [...points[0],...getColor(),...points[1], ... getColor(),... points[2], ... getColor(),
                        ...points[3], ... getColor(),... points[4],...getColor(), ...points[5], ...getColor()]
        console.log(`this: ${this.vertices}`)
    }

    isCoordInside(coord: [number, number]): boolean {
        var mid = this.getMiddlePoint()
        const angle = Math.atan2(this.secondPoint.y - this.initialPoint.y, this.secondPoint.x - this.initialPoint.x) - Math.PI / 4;
        const cosTheta = Math.cos(-angle)
        const sinTheta = Math.sin(-angle);

        coord[0] -= mid.x
        coord[1] -= mid.y

        coord[0] = cosTheta * coord[0] - sinTheta * coord[1]
        coord[1] = sinTheta * coord[0] + cosTheta * coord[1]

        coord[0] += mid.x
        coord[1] += mid.y

        const minX = mid.x - this.sideLength / 2;
        const maxX = mid.x + this.sideLength / 2;
        const minY = mid.y - this.sideLength / 2;
        const maxY = mid.y + this.sideLength / 2;

        return (minX <= coord[0]) && (coord[0] <= maxX) && (minY <= coord[1]) && (coord[1] <= maxY)

    }

    draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }

    showAllVertex(pointers: VertexPointer[]): void {
        while (pointers.length > 0) pointers.pop();

        const usedidx = [0, 1, 2, 5];
        usedidx.forEach((i: number) => {
            pointers.push(
                new VertexPointer(
                    new Point(
                        this.vertices[i * 6 + 0],
                        this.vertices[i * 6 + 1],
                        [this.vertices[i * 6 + 2], this.vertices[i * 6 + 3], this.vertices[i * 6 + 4], this.vertices[i * 6 + 5]]
                    ).complement()
                )
            );
        });
    }
}

export default Square;
