import Point from "./point"

class Line {
    point1: Point
    point2: Point

    public constructor(_point1: Point){
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

    
}