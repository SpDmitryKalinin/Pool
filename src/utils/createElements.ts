import { canvasHeight, canvasWidth } from "./vars";


function createBackground(context: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement) {
    context.fillStyle = '#278E2A';
    context.fillRect(0, 0, canvasElement.width, canvasElement.height);
}



function createBorder(context: CanvasRenderingContext2D) {
    context.strokeStyle = '#4f3011';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvasWidth, canvasHeight);
}




function createBall(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {

    context.beginPath();
    context.arc(x, y, radius, 0,  Math.PI * 2); 
    context.fillStyle = color; 
    context.fill(); 
    context.closePath()
    createBorder(context)
}

export {createBackground, createBorder, createBall}