function createBackground(context: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement) {
    context.fillStyle = '#278E2A';
    context.fillRect(0, 0, canvasElement.width, canvasElement.height);
}

export default createBackground