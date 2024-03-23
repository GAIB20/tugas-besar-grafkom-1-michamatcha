class Point {
    x: number;
    y: number;
    color : [number, number, number, number]

    public constructor(_x: number, _y: number, _color: [number, number, number, number]){
        this.x = _x
        this.y = _y
        this.color = _color
    }
    public getCoordinates(): [number, number]{
        return [this.x, this.y];
    }
    public setCoordinates(_x: number, _y: number){
        this.x = _x
        this.y = _y
    }
    public getColor(): [number, number, number, number]{
        return this.color
    }
    public setColor(_color : [number, number, number, number]){
        this.color = _color
    }
    public moveCoordinateX(_delta){
        this.x += _delta;
    }
    public moveCoordinateY(_delta){
        this.y += _delta
    }
    public setCoordinateFromEvent(ev: MouseEvent) {
        var rect = (ev.target as HTMLElement).getBoundingClientRect()
        this.x = (ev.clientX - rect.left) / (rect.right - rect.left) * 2 - 1
        this.y = 1 - (ev.clientY - rect.top) / (rect.bottom - rect.top) * 2
    }
    /**
     * @returns Array of length 6, [posX, posY, colorR, colorG, colorB, colorA]
     */
    public toArray(): Float32Array {
        return new Float32Array([this.x, this.y, ...this.color])
    }

    


}
export default Point;