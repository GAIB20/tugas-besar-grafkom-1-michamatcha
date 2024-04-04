interface Transformable {
    translate(_deltaX: number, _deltaY: number): void;
    dilate(_scale: number): void;
    rotate(_theta: number);
}