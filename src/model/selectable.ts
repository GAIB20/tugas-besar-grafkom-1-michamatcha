import VertexPointer from "./vertexPointer"

interface Selectable {
    isCoordInside(coord: [number, number]) : boolean
    showAllVertex(pointers: VertexPointer[]): void // use complementary color (RGB' = 1-RGB, A'=A)
}

export default Selectable