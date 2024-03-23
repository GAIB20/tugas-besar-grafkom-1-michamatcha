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
    public moveX(_delta : number){
        this.point1.moveCoordinateX(_delta);
        this.point2.moveCoordinateX(_delta);
    }
    public moveY(_delta: number){
        this.point1.moveCoordinateX(_delta);
        this.point2.moveCoordinateY(_delta);
    }

    public draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.point1.toArray(), ...this.point2.toArray()]), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 2);
    }

    
}

export default Line;