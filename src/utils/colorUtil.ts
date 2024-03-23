
function hexToRgba(hex: string): [number, number, number, number] {
    // Remove '#' from hex color value if present
    hex = hex.replace('#', '');

    // Convert hex color value to RGBA
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return RGBA values as an array with range 0..1
    // Opacity = full
    return [r / 255, g / 255, b / 255, 1]; 
}

function getColor(): [number, number, number, number] {
    const colorPicker = document.getElementById('point-color') as HTMLInputElement
    return hexToRgba(colorPicker.value);
}

export { getColor };