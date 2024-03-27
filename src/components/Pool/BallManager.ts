import { canvasHeight, canvasWidth} from "../../utils/vars";
import { BallItem, SpeedInterface } from "../../Interfaces/interfaces";
import Ball from "./Ball";




class BallManager {
    speed: SpeedInterface;
    index: number;
    ballArray: BallItem[];
    instanceOfBallArray: Ball[] = [];
    context: CanvasRenderingContext2D;
    canvasElement: HTMLCanvasElement;
    triggerPause: boolean = false;
    startNewTurn: () => void;
    constructor(speed: SpeedInterface, index: number, ballArray: BallItem[], context: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement, startNewTurn: () => void) {
        this.speed = speed;
        this.index = index;
        this.ballArray = ballArray;
        this.context = context;
        this.canvasElement = canvasElement;
        this.startNewTurn = startNewTurn;
        this.#init();
    }

    changeColor(targetIndex: number, color: string) {
        this.instanceOfBallArray.forEach((ball, index) => {
            if (targetIndex === index) {
                ball.ball.color = color;
            }
        })
    }

    setTrigger() {
        this.triggerPause = !this.triggerPause;
    }


    #init() {

        this.#initBallsArray();
        this.#collisionLoop();
    }

    #initBallsArray() {
        this.instanceOfBallArray = this.ballArray.map((ball, index) => {
            const defaultSpeed = { speedX: 0, speedY: 0 };
            if (index === this.index) {
                defaultSpeed.speedX = this.speed.speedX;
                defaultSpeed.speedY = this.speed.speedY;
            }
            return new Ball(ball, defaultSpeed, this.context, this.canvasElement)
        });
    }

    //Каждые 10 мс канвас перерисовывается в зависимости от физичики шаров
    #collisionLoop() {
        let id: number;
        id = setInterval(() => {
            if (this.triggerPause) {
                return;
            }
            this.instanceOfBallArray.forEach((ballInstance, index) => {
                this.#checkCollisionWBorder(ballInstance);
                this.#checkCollisionCallback(ballInstance, index);
                ballInstance.calcNewPosition();
            });
            //Если шары почти останавились, то прерываем setTimeout, включаем рекурсивнуюю функцию animations
            if (this.instanceOfBallArray.every(ballInstance => Math.abs(ballInstance.speed.speedX) < 0.1 && Math.abs(ballInstance.speed.speedY) < 0.1)) {
                this.instanceOfBallArray.forEach(item => {
                    item.speed.speedX = 0;
                    item.speed.speedY = 0;
                });

                this.startNewTurn()
                alert('Следующий ход');
                clearInterval(id);
            }
        }, 10) as unknown as number;
    }

    #checkCollisionCallback(ballInstance: Ball, ballIndex: number) {
        this.instanceOfBallArray.forEach((otherBall, index) => {
            if (ballIndex !== index) {
                const dx = otherBall.ball.x - ballInstance.ball.x;
                const dy = otherBall.ball.y - ballInstance.ball.y;
                const distance = Math.sqrt(dx ** 2 + dy ** 2);
                const totalRadius = ballInstance.ball.radius + otherBall.ball.radius;

                if (totalRadius >= distance) {
                    const nx = dx / distance;
                    const ny = dy / distance;

                    const relativeVelocityX = otherBall.speed.speedX - ballInstance.speed.speedX;
                    const relativeVelocityY = otherBall.speed.speedY - ballInstance.speed.speedY;

                    const dotProduct = relativeVelocityX * nx + relativeVelocityY * ny;

                    if (dotProduct > 0) return;

                    ballInstance.speed.speedX += dotProduct * nx;
                    ballInstance.speed.speedY += dotProduct * ny;

                    otherBall.speed.speedX -= dotProduct * nx;
                    otherBall.speed.speedY -= dotProduct * ny;
                }
            }
        });
    }

    #checkCollisionWBorder(ballInstance: Ball) {
        const ball = ballInstance.ball;
        const radius = ball.radius;

        const borderWidth = 3;
        const maxX = canvasWidth - borderWidth;
        const maxY = canvasHeight - borderWidth;
        const minX = borderWidth;
        const minY = borderWidth;

        if (ball.x + radius > maxX || ball.x - radius < minX) {
            ballInstance.speed.speedX *= -1;
        }

        if (ball.y + radius > maxY || ball.y - radius < minY) {
            ballInstance.speed.speedY *= -1;
        }
    }
}

export default BallManager;