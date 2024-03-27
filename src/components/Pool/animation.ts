import { BallItem, SpeedInterface } from "../../Interfaces/interfaces";
import BallManager from "./BallManager";


type SetColorType = (index: number, color: string) => void;
type SetTriggerType = () => void;

class Animation {
    context: CanvasRenderingContext2D;
    prevX: null | number = null;
    prevY: null | number = null;
    prevTime: null | number = 0;
    canvasElement: HTMLCanvasElement
    speedX: number = 0;
    speedY: number = 0;
    cursorX: number = 0;
    cursorY: number = 0;
    targetBallIndex: number = -1;
    ballArray: BallItem[]
    togglePopup: () => void;
    setColor: null | SetColorType = null;
    setTrigger: null | SetTriggerType = null;
    setClassTrigger: null | SetTriggerType = null;
    instanceBallManager: BallManager | null = null;
    
    constructor(context: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement, ballArray: BallItem[], togglePopup: () => void) {
        this.context = context;
        this.canvasElement = canvasElement;
        this.ballArray = ballArray;
        
        this.togglePopup = togglePopup;
        this.#init();
        
    }

    #init(): void {
        //Слушатели событий
        this.#addEventListeners();
        //Вызываем рекурсивную функцию
        this.#animation(this.context);
    }

    #addEventListeners() {
        const coordsCanvas = this.canvasElement.getBoundingClientRect();
        //Слушатель для определения скорости курсора и его координат вун
        document.addEventListener('mousemove', (e) => this.#updateCursorPosition(e));
        

        //Слушатель для определения коордиант внутри канваса
        this.canvasElement.addEventListener('mousemove', (e) => {
            if (!coordsCanvas) {
                return;
            }
            this.cursorX = e.clientX - coordsCanvas.left;
            this.cursorY = e.clientY - coordsCanvas.top;
        });

        //Слушатель для определения кликнутого шара
        this.canvasElement.addEventListener('click', (e) => {
            const cursorX = e.clientX - coordsCanvas.left;
            const cursorY = e.clientY - coordsCanvas.top;
            if(this.instanceBallManager !== null) {
                for (let i = 0; i < this.ballArray.length; i++) {
                    const ball = this.ballArray[i];
                    const dx = cursorX - ball.x;
                    const dy = cursorY - ball.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= ball.radius) {
                        this.targetBallIndex = i;
                        this.togglePopup()
                        
                        break;
                    }
                }
            }
        });
    }

    
    #detectCollisiton() {
        let targetIndex = -1;
        this.ballArray.forEach((item, index) => {
            const deltaX = this.cursorX - item.x;
            const deltaY = this.cursorY - item.y;
            const distance = Math.sqrt((item.x - this.cursorX) ** 2 + (item.y - this.cursorY) ** 2);
            
            let angle = Math.atan2(deltaY, deltaX);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            if(distance <= item.radius) {
                targetIndex = index;
            }
        })

        return targetIndex;
    }


    #updateCursorPosition(e: MouseEvent) {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const currentTime = performance.now();
        const { speedX, speedY } = this.#calculateCursorSpeed(currentX, currentY, currentTime);
        this.speedX = speedX;
        this.speedY = speedY;
        this.prevX = currentX;
        this.prevY = currentY;
        this.prevTime = currentTime;
    }

    #calculateCursorSpeed(currentX: number, currentY: number, currentTime: number) : SpeedInterface  {
        let isFirstCalc = this.prevX === null || this.prevY === null;
        if(isFirstCalc) {
            return {speedX: 0, speedY: 0,};
        }
        else {
            const distanceX = currentX - this.prevX!;
            const distanceY = currentY - this.prevY!;
            const deltaTime = currentTime - this.prevTime!;
            const speedX = distanceX / deltaTime;
            const speedY = distanceY / deltaTime;

            return { speedX: speedX * 5, speedY: speedY * 5 };
        }
    }

    #animation(context: CanvasRenderingContext2D) {
        const callback = () => this.#animation(context);
        const index = this.#detectCollisiton();
        //Когда определена коллизия то, создаем экземпляр класса, который перерисовывает канвас пока считаются коллизии и приостанавливается рекурсивная функция
        if(index !== -1) {
            this.instanceBallManager = new BallManager({speedX: this.speedX, speedY: this.speedY}, index, this.ballArray, this.context, this.canvasElement, callback);
            this.setClassTrigger = this.instanceBallManager.setTrigger.bind(this.instanceBallManager);
            this.setColor = this.instanceBallManager.changeColor.bind(this.instanceBallManager);
            return
        }
        window.requestAnimationFrame(callback)
    }


}



export default Animation;