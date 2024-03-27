import createBorder from "./createBorder";

function createBall(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {

    context.beginPath();
    context.arc(x, y, radius, 0,  Math.PI * 2); 
    context.fillStyle = color; 
    context.fill(); 
    context.closePath()
    createBorder(context)
}

export default createBall