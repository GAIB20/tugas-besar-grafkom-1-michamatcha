import Point from "./point";
import { getColor } from "../utils/colorUtil";


class Rectangle implements Drawable{
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

    draw(gl: WebGLRenderingContext): void {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }

}
export default Rectangle