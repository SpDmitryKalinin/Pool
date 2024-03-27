import { canvasHeight, canvasWidth } from "./vars";

function createBorder(context: CanvasRenderingContext2D) {
    context.strokeStyle = '#4f3011';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvasWidth, canvasHeight);
}

export default createBorder;