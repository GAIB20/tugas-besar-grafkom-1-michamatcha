interface Drawable {
    draw(gl: WebGLRenderingContext): void;
    changeColor(id: number, color: [number, number, number, number]): void
    changeAllColor(color: [number, number, number, number]): void
}