interface Handler {
    gl: WebGLRenderingContext
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseClick(e: MouseEvent): void;
}