interface Transformable {
    // translate by (_deltaX, _deltaY)
    translate(_deltaX: number, _deltaY: number): void;
    // scale by _scale
    // steps:
    // 1. translate so its centroid is in (0,0)
    // 2. scale
    // 3. translate its centroid back
    dilate(_scale: number): void;
    // rotate by _theta degrees (not in radian!)
    // steps:
    // 1. translate so its centroid is in (0,0)
    // 2. scale to get original size (from [-1, 1] to [0, canvas.size])
    // 3. rotate
    // 4. scale back
    // 5. translate its centroid back
    rotate(_theta: number);
}