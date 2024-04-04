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
                        this.square.setSecondPoint(newPoint2);
                        this.square.setAllPointsByInput();
                    }
                }
                break;
        }
    }

    onMouseClick(e: MouseEvent): void {
        switch (this.isDrawing) {
            case true:
                this.square = new Square(new Point(0, 0, getColor()), 0);
                this.squares.push(this.square);

                const newPoint1 = new Point(0, 0, getColor());
                newPoint1.setCoordinateFromEvent(e);
                this.square.setInitialPoint(newPoint1);

                const newPoint2 = new Point(0, 0, getColor());
                newPoint2.setCoordinateFromEvent(e);
                this.square.setSecondPoint(newPoint2);
                this.square.setAllPointsByInput();

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
