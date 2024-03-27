import React, { useCallback, useEffect, useRef, useState } from "react";
import Animation from "./animation";
import createBall from "../../utils/createBall";
import { ballArray} from "../../utils/vars";
import createBorder from "../../utils/createBorder";
import Popup from "../Popup/popup";
import createBackground from "../../utils/createBackground";

const Pool: React.FC = () => {
    const poolRef = useRef<HTMLCanvasElement | null>(null);
    const [status, setStatus] = useState<boolean>(false);
    const animationInstance = useRef<Animation | null>(null);

    //Создаем класс, который будет отвечать за атрисовку графики
    useEffect(() => {
        const context = createPool(poolRef.current);
        if (!context || !poolRef.current) {
            return;
        }
        animationInstance.current = new Animation(context, poolRef.current, ballArray, handleChangeStatus);
    }, []);

    //Останавливаем игру, когда вызван popup
    useEffect(() => {
        if (animationInstance.current && animationInstance.current.setClassTrigger) {
            animationInstance.current.setClassTrigger();
        }
    }, [status]);

    
    //Функция смены цвета для шара
    const changeColor = useCallback((color: string) => {
        if (animationInstance.current && animationInstance.current.setColor) {
            animationInstance.current.setColor(animationInstance.current.targetBallIndex, color);
        }
    }, []);
    
    function handleChangeStatus() {
        setStatus(prevStatus => !prevStatus);
    }

    //Инициализация канваса
    function createPool(canvasElement: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
        if (!canvasElement) {
            return null;
        }

        const context = canvasElement.getContext("2d")!;
        if (!context) {
            return null;
        }

        createBackground(context, canvasElement);
        createBorder(context);
        ballArray.forEach(ball => {
            createBall(context, ball.x, ball.y, ball.radius, ball.color);
        });

        return context;
    }

    return (
        <>
            <canvas ref={poolRef} className="canvas-pool" width={400} height={800}></canvas>
            <Popup status={status} togglePopup={handleChangeStatus} callback={changeColor} />
        </>
    );
};

export default Pool;