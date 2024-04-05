import Point from "../model/point";
import Square from "../model/square";
import { getColor } from "../utils/colorUtil";

class SquareHandler implements Handler {
    gl: WebGLRenderingContext;
    isDrawing: boolean;
    squares: Square[];
    square: Square;

    constructor(gl: WebGLRenderingContext, squares: Square[] = []) {
        this.gl = gl;
        this.isDrawing = true;
        this.squares = squares;
        this.square = null;
    }

    onMouseDown(e: MouseEvent): void {}

    onMouseUp(e: MouseEvent): void {
        switch (this.isDrawing) {
            case true:
                break;
            case false:
                break;
        }
    }

    onMouseMove(e: MouseEvent): void {
        switch (this.isDrawing) {
            case true:
                break;
            case false:
                if (this.square) {
                    if (this.square.vertices.length > 0) {
                        const newPoint2 = new Point(0, 0, getColor());
                        newPoint2.setCoordinateFromEvent(e);
                        console.log(`newPoint2: ${newPoint2.x}, ${newPoint2.y}`)
                        var kuadran
                        if((newPoint2.x >= this.square.vertices[0]) && (newPoint2.y >= this.square.vertices[1])){
                            kuadran = 1
                        }else if((newPoint2.x <= this.square.vertices[0]) && (newPoint2.y >= this.square.vertices[1])){
                            kuadran = 2
                        }else if((newPoint2.x <= this.square.vertices[0]) && (newPoint2.y <= this.square.vertices[1])){
                            kuadran = 3
                        }else {
                            kuadran = 4
                        }
                        console.log(`kuadran : ${kuadran}`)
                        const dx = newPoint2.x - this.square.vertices[0]
                        const dy = newPoint2.y - this.square.vertices[1]
                        var distance = Math.sqrt(dx* dx + dy*dy)
                        console.log(`distance: ${distance}`)
                        this.square.setSideLength(distance)
                        console.log(`Sdistance: ${this.square.sideLength}`)
                        this.square.setSecondPoint(kuadran)
                        console.log(`ini firs: ${this.square.initialPoint.x}, ${this.square.initialPoint.y}`)
                        console.log(`ini second: ${this.square.secondPoint.x}, ${this.square.secondPoint.y}`)
                        this.square.setAllPointsByInput()
                        console.log(this.square.vertices)
                        
                    }
                }
                break;
        }
    }

    onMouseClick(e: MouseEvent): void {
        switch (this.isDrawing) {
            case true:
                this.square = new Square;
                this.squares.push(this.square);

                const newPoint1 = new Point(0, 0, getColor());
                newPoint1.setCoordinateFromEvent(e);
                console.log(`newPoint1 : ${newPoint1}`)
                this.square.setInitialPoint(newPoint1);

                const newPoint2 = new Point(0, 0, getColor());
                newPoint2.setCoordinateFromEvent(e);
                console.log(`newPoint2 : ${newPoint2}`)
                var kuadran
                if((newPoint2.x >= this.square.vertices[0]) && (newPoint2.y >= this.square.vertices[1])){
                    kuadran = 1
                }else if((newPoint2.x <= this.square.vertices[0]) && (newPoint2.y >= this.square.vertices[1])){
                    kuadran = 2
                }else if((newPoint2.x <= this.square.vertices[0]) && (newPoint2.y <= this.square.vertices[1])){
                    kuadran = 3
                }else if((newPoint2.x >= this.square.vertices[0]) && (newPoint2.y >= this.square.vertices[1])){
                    kuadran = 4
                }
                console.log(`kuadran : ${kuadran}`)
                const dx = newPoint2.x - this.square.vertices[0]
                const dy = newPoint2.y - this.square.vertices[1]
                var distance = Math.sqrt(dx* dx + dy*dy)
                this.square.setSideLength(distance)
                
                this.square.setSecondPoint(kuadran)
                console.log(`ini secondPoint: ${this.square.secondPoint.x}, ${this.square.secondPoint.y}`)
                this.square.setAllPointsByInput()

                this.isDrawing = false;
                break;
            case false:
                this.square = null;
                this.isDrawing = true;
                break;
            default:
                break;
        }
    }
}

export { SquareHandler };
