import { getColor } from "../utils/colorUtil"
import Polygon from "../model/polygon"
import Point from "../model/point"

enum PolygonHandlerState {
    DrawFirst,
    DrawNext
}

class PolygonHandler implements Handler {
    gl: WebGLRenderingContext
    state: PolygonHandlerState
    polygons: Array<Polygon>
    polygon: Polygon

    constructor(gl: WebGLRenderingContext, polygons: Array<Polygon>) {
        this.gl = gl
        this.polygons = polygons
        this.polygon = null
        this.state = PolygonHandlerState.DrawFirst
    }

    onMouseDown(e: MouseEvent): void {
        
    }
    onMouseUp(e: MouseEvent): void {
        
    }
    onMouseClick(e: MouseEvent): void {
        switch (this.state) {
            case PolygonHandlerState.DrawFirst:
                this.polygon = new Polygon()
                this.polygons.push(this.polygon)
                this.state = PolygonHandlerState.DrawNext
            case PolygonHandlerState.DrawNext:
                var point = new Point(0,0,getColor())
                point.setCoordinateFromEvent(e)

                this.polygon.addPoint(point)
                break
        }
    }
    onMouseMove(e: MouseEvent): void {
        
    }
}

export { PolygonHandler, PolygonHandlerState }