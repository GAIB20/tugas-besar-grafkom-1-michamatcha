interface Drawable {
    draw(gl: WebGLRenderingContext): void;
    isCoordInside(coord: [number, number]) : boolean
    translate(_deltaX: number, _deltaY: number)
    dilate(_scale: number)
    rotate(_theta: number)
}