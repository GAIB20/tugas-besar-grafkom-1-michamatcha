import Point from "./point";
import { getColor } from "../utils/colorUtil";
import * as math from 'mathjs'
import Selectable from "./selectable";
import VertexPointer from "./vertexPointer";

class Square implements Drawable, Transformable, Selectable {
    setSecondPoint(newPoint2: Point) {
        throw new Error("Method not implemented.");
    }
    setInitialPoint(newPoint1: Point) {
        throw new Error("Method not implemented.");
    }
    initialPoint: Point;
    sideLength: number;
    vertices: number[] = [];
    points: Point[];
    colors: number[];

    constructor(_initialPoint: Point, _sideLength: number) {
        this.initialPoint = _initialPoint;
        this.sideLength = _sideLength;
        this.setAllPointsByInput();
    }

    setColors(colors: [number, number, number, number]) {
        this.colors = colors;
    }

    getMiddlePoint(): Point {
        const res = new Point(0, 0, getColor());
        res.x = this.initialPoint.x + this.sideLength / 2;
        res.y = this.initialPoint.y + this.sideLength / 2;
        return res;
    }

    setAllPointsByInput() {
        const x = this.initialPoint.x;
        const y = this.initialPoint.y;
        this.vertices = [
            x, y, ...getColor(),
            x + this.sideLength, y, ...getColor(),
            x + this.sideLength, y + this.sideLength, ...getColor(),
            x, y, ...getColor(),
            x + this.sideLength, y + this.sideLength, ...getColor(),
            x, y + this.sideLength, ...getColor()
        ];
        this.points = [
            new Point(x, y, getColor()),
            new Point(x + this.sideLength, y, getColor()),
            new Point(x + this.sideLength, y + this.sideLength, getColor()),
            new Point(x, y, getColor()),
            new Point(x + this.sideLength, y + this.sideLength, getColor()),
            new Point(x, y + this.sideLength, getColor())
        ];
    }

    translate(_deltaX: number, _deltaY: number) {
        this.initialPoint.moveCoordinateX(_deltaX);
        this.initialPoint.moveCoordinateY(_deltaY);
        this.setAllPointsByInput();
    }

    dilate(_scale: number) {
        this.sideLength *= _scale;
        this.setAllPointsByInput();
    }

    rotate(_theta: number) {
        // Square maintains the same orientation after rotation
    }

    isCoordInside(coord: [number, number]): boolean {
        return (
            coord[0] >= this.initialPoint.x &&
            coord[0] <= this.initialPoint.x + this.sideLength &&
            coord[1] >= this.initialPoint.y &&
            coord[1] <= this.initialPoint.y + this.sideLength
        );
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
