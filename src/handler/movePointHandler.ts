import Point from "../model/point";
import VertexPointer from "../model/vertexPointer";

class MovePointHandler implements Handler {
    gl: WebGLRenderingContext;
    shape: Transformable;
    pointId: number;
    vertexPointers: Array<VertexPointer>
    moving: boolean
    selectNoneCallback: () => void

    constructor(gl: WebGLRenderingContext, shape: Transformable, pointId: number, vertexPointers: Array<VertexPointer>, selectNoneCallback: () => void) {
        this.gl = gl;
        this.shape = shape;
        this.pointId = pointId;
        this.vertexPointers = vertexPointers;
        this.moving = true;
        this.selectNoneCallback = selectNoneCallback
    }

    onMouseClick(e: MouseEvent): void {
        if (!this.moving) return
        let p = new Point(0,0,[0,0,0,0])
        p.setCoordinateFromEvent(e)
        this.shape.movePoint(this.pointId, p.x, p.y)
        this.shape.commitMove()

        while(this.vertexPointers.length)
            this.vertexPointers.pop()
        this.selectNoneCallback()

        this.moving = false
    }
    onMouseMove(e: MouseEvent): void {
        if (!this.moving) return
        let p = new Point(0,0,[0,0,0,0])
        p.setCoordinateFromEvent(e)
        this.shape.movePoint(this.pointId, p.x, p.y)
    }
    onMouseDown(e: MouseEvent): void {
        
    }
    onMouseUp(e: MouseEvent): void {
        
    }
}

export { MovePointHandler }