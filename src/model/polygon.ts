import { getColor } from "../utils/colorUtil";
import Point from "./point";
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";

class Polygon implements Drawable, Transformable, Selectable {
    points: Point[]
    pointsBuffer: number[]

    constructor() {
        this.points = []
        this.pointsBuffer = []
    }

    public addPoint(point: Point) {
        this.points.push(point)
        this.grahamScan()
        this.refreshBuffer()
    }

    public refreshBuffer() {
        this.pointsBuffer = []
        for (let i = 2; i < this.points.length; i++) {
            this.pointsBuffer.push(...this.points[0].toArray())
            this.pointsBuffer.push(...this.points[i-1].toArray())
            this.pointsBuffer.push(...this.points[i].toArray())
        }
    }

    public grahamScan() {
        // guard
        if (this.points.length < 4) 
            return

        // pick a pivot (smallest y)
        let pickIdx = 0
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].y < this.points[pickIdx].y) {
                pickIdx = i
            }
        }

        // sort by orientation
        let point = this.points[pickIdx]
        this.points.splice(pickIdx, 1)
        this.points.sort((a, b) => this.orientation(point, b, a))

        // remove point with same orientation
        let points_tmp = [this.points[0]]
        for (let i = 0; i < this.points.length; i++) {
            if (this.orientation(point, this.points[i], points_tmp[points_tmp.length - 1]) === 0) {
                if (this.points[i].y < points_tmp[points_tmp.length - 1].y) {
                    points_tmp[points_tmp.length - 1] = this.points[i]
                }
            }
            else {
                points_tmp.push(this.points[i])
            }
        }

        this.points = points_tmp

        // iterate each points
        let new_points = [point, this.points[0], this.points[1]]

        for (let i = 2; i < this.points.length; i++) {
            while (new_points.length >= 2 && 
                this.orientation(
                    new_points[new_points.length - 2], 
                    new_points[new_points.length - 1], 
                    this.points[i]) < 0) {
                new_points.pop()
            }
            
            new_points.push(this.points[i])
        }

        this.points = new_points
    }
    // Centroid of a polygon
    // 
    getCentroid() {
        let a = 0
        for (let i = 0; i < this.points.length; ++i) {
            a += this.points[i].x * this.points[(i+1)%this.points.length].y - this.points[i].y * this.points[(i+1)%this.points.length].x
        }
        a /= 2

        let cx = 0
        let cy = 0
        for (let i = 0; i < this.points.length; ++i) {
            cx += (this.points[i].x + this.points[(i+1)%this.points.length].x)*(this.points[i].x * this.points[(i+1)%this.points.length].y - this.points[(i+1)%this.points.length].x * this.points[i].y)
            cy += (this.points[i].y + this.points[(i+1)%this.points.length].y)*(this.points[i].x * this.points[(i+1)%this.points.length].y - this.points[(i+1)%this.points.length].x * this.points[i].y)
        }
        cx /= 6 * a
        cy /= 6 * a

        return new Point(cx, cy, getColor())
    }

    // Centroid of vertices
    getMiddlePoint() {
        return new Point(
            this.points.map((x) => x.x).reduce((prev, cur) => prev + cur) / this.points.length,
            this.points.map((x) => x.y).reduce((prev, cur) => prev + cur) / this.points.length,
            getColor()
        )
    }

    // negative = counterclockwise
    // positive = clockwise
    // 0 = straight
    public orientation(point1: Point, point2: Point, point3: Point): number {
        return (point2.y - point1.y)*(point3.x - point2.x) - (point3.y - point2.y)*(point2.x - point1.x)
    }

    public draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pointsBuffer), gl.DYNAMIC_DRAW)
        gl.drawArrays(gl.TRIANGLES, 0, this.pointsBuffer.length / 6)
    }
    changeColor(id: number, color: [number, number, number, number]): void {
        this.points[id].setColor(color)
        this.refreshBuffer()
    }
    changeAllColor(color: [number, number, number, number]): void {
        this.points.forEach((point) => {
            point.setColor(color)
        })
        this.refreshBuffer()
    }

    public translate(_deltaX: number, _deltaY: number) {
        this.points.forEach((point) => {
            point.moveCoordinateX(_deltaX)
            point.moveCoordinateY(_deltaY)
        })
        this.refreshBuffer()
    }
    isCoordInside(coord: [number, number]): boolean {
        if (this.points.length < 3) return false
        let side = null // positive = true, negative = false
        let coordPoint = new Point(coord[0], coord[1], [0,0,0,0])
        for (let i = 0; i < this.points.length - 1; i++) {
            let side_now = this.orientation(this.points[i], this.points[i+1], coordPoint) > 0
            if (side === null) {
                side = side_now
            }
            else if (side !== side_now) {
                return false
            }
        }
        return true
    }
    dilate(_scale: number) {
        const mid = this.getCentroid()
        this.points.forEach((point) => {
            point.x -= mid.x
            point.y -= mid.y
            point.x = _scale * point.x
            point.y = _scale * point.y
            point.x += mid.x
            point.y += mid.y
        })
        this.refreshBuffer()
    }
    rotate(_theta: number) {
        _theta = _theta * (Math.PI/180) // degrees to radian
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta)
        const mid = this.getCentroid()
        const canvas = document.getElementById("canvas") as HTMLCanvasElement

        this.points.forEach((point) => {
            // translate centroid to origin
            point.x -= mid.x
            point.y -= mid.y

            // scale points appropriately
            point.x *= canvas.width
            point.y *= canvas.height
            
            // rotate
            let px = cosTheta * point.x - sinTheta * point.y
            let py = sinTheta * point.x + cosTheta * point.y
            point.x = px
            point.y = py

            // scale points back
            point.x /= canvas.width
            point.y /= canvas.height
            
            // translate centroid back
            point.x += mid.x
            point.y += mid.y
        })
        this.refreshBuffer()
    }
    movePoint(id: number, _posX: number, _posY: number): void {
        this.points[id].x = _posX;
        this.points[id].y = _posY;
        this.refreshBuffer()
    }
    commitMove(): void {
        this.grahamScan()
        this.refreshBuffer()
    }
    
    showAllVertex(pointers: VertexPointer[]): void {
        while (pointers.length > 0) 
            pointers.pop()
        
        this.points.forEach((point) => {
            pointers.push(new VertexPointer(point.complement()))
        })
    }
}

export default Polygon