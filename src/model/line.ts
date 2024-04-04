import Point from "./point"

class Line implements Drawable {

    point1: Point
    point2: Point

    public setPoint1(_point1: Point) {
        this.point1 = _point1
    }
    public setPoint2(_point2 : Point){
        this.point2 = _point2
    }
    public translate(_deltaX : number, _deltaY: number){
        this.point1.moveCoordinateX(_deltaX);
        this.point2.moveCoordinateX(_deltaX);
        this.point1.moveCoordinateY(_deltaY);
        this.point2.moveCoordinateY(_deltaY);
    }


    public getGradient(){
        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x)
    }

    isCoordInside(coord: [number, number]): boolean {
        return (((this.point1.y - coord[1]) == (this.getGradient() *(this.point1.x - coord[0]))) && (coord[0] >= Math.min(this.point1.x, this.point2.x)) && (coord[0] <= Math.max(this.point1.x, this.point2.x)) &&
        (coord[1] >= Math.min(this.point1.y, this.point2.y) && (coord[1] <= Math.max(this.point2.y, this.point1.y))))
        
    }
    public draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.point1.toArray(), ...this.point2.toArray()]), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 2);
    }
    dilate(_scale: number) {
        this.point1.x = _scale * this.point1.x
        this.point1.y = _scale * this.point1.y
        this.point2.x = _scale * this.point2.x
        this.point2.y = _scale * this.point2.y
    }

    

    
}

export default Line;