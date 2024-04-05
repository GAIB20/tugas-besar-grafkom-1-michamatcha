import { getColor } from "../utils/colorUtil";
import Polygon from "../model/polygon";
import Point from "../model/point";
import VertexPointer from "../model/vertexPointer";

class AddPointHandler implements Handler {
    gl: WebGLRenderingContext;
    poly: Polygon
    removeHandlerCallback: () => void
    vertexPointers: Array<VertexPointer>

    constructor(gl: WebGLRenderingContext, poly: Polygon, vertexPointers: Array<VertexPointer>, removeHandlerCallback: () => void) {
        this.gl = gl
        this.poly = poly
        this.removeHandlerCallback = removeHandlerCallback
        this.vertexPointers = vertexPointers
    }

    onMouseClick(e: MouseEvent): void {
        const p = new Point(0, 0, getColor())
        p.setCoordinateFromEvent(e)
        this.poly.addPoint(p)
        this.poly.showAllVertex(this.vertexPointers)
        // this.removeHandlerCallback()
    }
    onMouseMove(e: MouseEvent): void {
        
    }
    onMouseDown(e: MouseEvent): void {
        
    }
    onMouseUp(e: MouseEvent): void {
        
    }
}

export { AddPointHandler }