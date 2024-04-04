import * as math from 'mathjs'
import Point from "./point"
import { getColor } from 'src/utils/colorUtil'

class Line implements Drawable {


    point1: Point
    point2: Point

    public setPoint1(_point1: Point) {
        this.point1 = _point1
    }
    public setPoint2(_point2 : Point){
        this.point2 = _point2
    }


    public getMiddle(){
        var res = new Point(0, 0, getColor())
        res.x = (this.point1.x + this.point2.x)/2
        res.y = (this.point1.y + this.point2.y) /2 
        return res;
    }
    public getGradient(){
        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x)
    }

    isCoordInside(coord: [number, number]): boolean {
        return (((this.point1.y - coord[1]) == (this.getGradient() *(this.point1.x - coord[0]))) && (coord[0] >= Math.min(this.point1.x, this.point2.x)) && (coord[0] <= Math.max(this.point1.x, this.point2.x)) &&
        (coord[1] >= Math.min(this.point1.y, this.point2.y) && (coord[1] <= Math.max(this.point2.y, this.point1.y))))
        
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
        this.point1.x = _scale * this.point1.x
        this.point1.y = _scale * this.point1.y
        this.point2.x = _scale * this.point2.x
        this.point2.y = _scale * this.point2.y
    }

    rotate(_theta: number) {
        _theta = _theta * (Math.PI/180) // degrees to radian
        const cosTheta = Math.cos(_theta)
        const sinTheta = Math.sin(_theta);
        const rotationMatrix = [[cosTheta, -sinTheta], [sinTheta, cosTheta]]
        
        // translate points to middle
        this.point1.x -= this.getMiddle().x
        this.point1.y -= this.getMiddle().y
        this.point2.x -= this.getMiddle().x
        this.point2.y -= this.getMiddle().y


        // rotate points
        this.point1.x = cosTheta * this.point1.x - sinTheta * this.point1.y
        this.point1.y = sinTheta * this.point1.x + cosTheta * this.point1.y
        this.point2.x = cosTheta * this.point2.x - sinTheta * this.point2.y
        this.point2.y = sinTheta * this.point2.x + cosTheta * this.point2.y
        

        // translate back
        this.point1.x += this.getMiddle().x
        this.point1.y += this.getMiddle().y
        this.point2.x += this.getMiddle().x
        this.point2.y += this.getMiddle().y
        
    }

    

    
}

export default Line;