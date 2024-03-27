import { BallItem, CoordsInterface, SpeedInterface } from "../../Interfaces/interfaces";
import createBall from "../../utils/createBall";
import {green} from "../../utils/vars";

class Ball {
    ball: BallItem;
    speed: SpeedInterface;
    context: CanvasRenderingContext2D;
    canvasElement: HTMLCanvasElement;
    color: string
    flag: boolean = false;

    constructor(ball: BallItem, speed: SpeedInterface, context: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement, color: string = '#FFFFFF') {
        this.ball = ball;
        this.speed = speed;
        this.context = context;
        this.canvasElement = canvasElement;
        this.color = color;
    }

    calcNewPosition() {
        let oldPosition = {x: this.ball.x, y: this.ball.y}
        let newPosition = {x: this.ball.x + this.speed.speedX, y: this.ball.y + this.speed.speedY}
        this.#updatePosition(oldPosition, newPosition)
        
        this.speed.speedX -= this.speed.speedX / 200;
        this.speed.speedY -= this.speed.speedY / 200;
    }


    #updatePosition(oldPosition: CoordsInterface, newPosition: CoordsInterface) {
        createBall(this.context, oldPosition.x, oldPosition.y, this.ball.radius + 1, green)
        createBall(this.context, newPosition.x , newPosition.y, this.ball.radius, this.ball.color);

        this.ball.x = newPosition.x;
        this.ball.y = newPosition.y;
    }
}

export default Ball;