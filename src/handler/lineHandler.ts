import { getColor } from "../utils/colorUtil"
import Line from "../model/line"
import Point from "../model/point"

enum LineHandlerState {
    DrawFirst,
    DrawSecond
}

class LineHandler implements Handler {
    gl: WebGLRenderingContext
    state: LineHandlerState
    lines: Array<Line>
    line: Line

    // TODO pass line_array here (for append only)
    constructor(gl: WebGLRenderingContext, lines: Array<Line>) {
        this.gl = gl
        this.state = LineHandlerState.DrawFirst
        this.lines = lines
        this.line = null
    }

    



    onMouseUp(e: MouseEvent): void {
        switch (this.state) {
            case LineHandlerState.DrawFirst:

                break;
            case LineHandlerState.DrawSecond:
                
                break;  
        }
    }
    onMouseDown(e: MouseEvent): void {
        
    }
    onMouseMove(e: MouseEvent): void {
        switch (this.state) {
            case LineHandlerState.DrawFirst:
                break;
            case LineHandlerState.DrawSecond:
                this.line.point2.setCoordinateFromEvent(e)
                break;  
        }
    }
    onMouseClick(e: MouseEvent): void {
        switch (this.state) {
            case LineHandlerState.DrawFirst:
                this.line = new Line
                this.lines.push(this.line)

                var new_point1 = new Point(0,0,getColor())
                new_point1.setCoordinateFromEvent(e)
                this.line.setPoint1(new_point1)

                var new_point2 = new Point(0,0,getColor())
                new_point2.setCoordinateFromEvent(e)
                this.line.setPoint2(new_point2)

                this.state = LineHandlerState.DrawSecond;
                break;
            case LineHandlerState.DrawSecond:
                this.line = null
                this.state = LineHandlerState.DrawFirst
                break;  
            default:

                break;
        }
    }
}

export {LineHandler, LineHandlerState};