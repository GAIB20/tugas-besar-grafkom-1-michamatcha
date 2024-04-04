import Point from "../model/point";
import Rectangle from "../model/rectangle"
import { getColor } from "../utils/colorUtil";



class RectangleHandler implements Handler{
    gl: WebGLRenderingContext;
    isDrawing: boolean
    rectangles: Array <Rectangle>
    rectangle : Rectangle 


    constructor(gl: WebGLRenderingContext, rectangles: Array<Rectangle> = []){
        this.gl = gl
        this.isDrawing = true
        this.rectangles = rectangles
        this.rectangle = null
    }

    onMouseDown(e: MouseEvent): void {


    }

    onMouseUp(e: MouseEvent): void {
        switch(this.isDrawing){
            case true:
                break;
            case false:
                break
        }
        
    }
    onMouseMove(e: MouseEvent): void {
        switch(this.isDrawing){
            case true:
                break;
            case false:
                if(this.rectangle){
                    if(this.rectangle.vertices.length > 0){
                        var new_point2 = new Point(0, 0, getColor())
                        new_point2.setCoordinateFromEvent(e)
                        this.rectangle.setSecondPoint(new_point2)
                        this.rectangle.setAllPointsByInput(this.rectangle.initialPoint, this.rectangle.secondPoint)
                    }
                }
                break
        }
    }
    onMouseClick(e: MouseEvent): void {
        switch(this.isDrawing){
            case true:
                this.rectangle = new Rectangle
                this.rectangles.push(this.rectangle)

                var new_point1 = new Point(0, 0, getColor())
                new_point1.setCoordinateFromEvent(e)
                this.rectangle.setInitialPoint(new_point1)
                var new_point2 = new Point(0, 0, getColor())
                new_point2.setCoordinateFromEvent(e)
                this.rectangle.setSecondPoint(new_point2)
                this.rectangle.setAllPointsByInput(new_point1, new_point2)
                this.isDrawing = false
                break
            case false:
                this.rectangle = null
                this.isDrawing =true
                break
            default:
                break

        }
    }
    
}
export {RectangleHandler}