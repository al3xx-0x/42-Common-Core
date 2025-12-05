import { useState, useEffect } from "react";
import { electric_blue } from "@/app/Utils";
import { Player } from "@/app/types";

export enum Direction {
    HORIZONTAL,
    VERTICAL
}

export default function PongPreview(
    {
        ballColor,
        paddleSize,
        ballSize,
        ballSpeed,
        background,
        bgEnabled,
        direction,
        player1,
        player2
    }: {
        player1: Player,
        player2: Player,
        ballColor: string,
        paddleSize: number,
        ballSize: number,
        ballSpeed: number,
        background: string,
        bgEnabled: boolean,
        direction: Direction,
    }) {
    const [leftY, setLeftY] = useState(50);
    const [rightY, setRightY] = useState(50);
    const [ball, setBall] = useState({ x: 50, y: 50, dx: 0.5, dy: 0.4 });
    const [movingPaddle, setMovingPaddle] = useState('right');
    const ballHeight = ballSize * 0.9;
    const paddleHeight = paddleSize * 0.6;
    const ball_speed = ballSpeed * 0.2;

    useEffect(() => {
        let frameId: number;
        let loop = () => {}

        if (direction === Direction.HORIZONTAL) {
            loop = () => {
                setBall((prev) => {
                    let { x, y, dx, dy } = prev;
                    x += dx * ball_speed;
                    y += dy * ball_speed;

                    // Convert percentages to relative positions for collision detection
                    const ballRadius = ballHeight / 10; // Approximate radius in percentage terms
                    const paddleThickness = 3; // 3% height (h-3 class)
                    const paddleWidthPercent = (paddleHeight / 250) * 100; // Convert to percentage of container

                    // Bounce left and right walls
                    if (x <= (1 + ballRadius) || x >= (98 - ballRadius)) {
                        dx = -dx;
                    }

                    // Top paddle collision
                    if (
                        y - ((ballRadius / 2)) <= 1 + (paddleThickness) && // Top paddle is at 1% (top-1)
                        x >= leftY - paddleWidthPercent / 2 &&
                        x <= leftY + paddleWidthPercent / 2 &&
                        dy < 0
                    ) {
                        dy = -dy;
                        setMovingPaddle('bottom');
                    }

                    // Bottom paddle collision
                    if (
                        y + (ballRadius / 2) >= 98 - (paddleThickness) && // Bottom paddle is at 98% (bottom-1)
                        x >= rightY - paddleWidthPercent / 2 &&
                        x <= rightY + paddleWidthPercent / 2 &&
                        dy > 0
                    ) {
                        dy = -dy;
                        setMovingPaddle('top');
                    }

                    // Reset ball if it goes off screen
                    if (y < 0 || y > 100) {
                        x = 50;
                        y = 50;
                        dx = ball_speed * (Math.random() > 0.5 ? 1 : -1);
                        dy = ball_speed * (Math.random() > 0.5 ? 1 : -1);
                        setMovingPaddle('bottom');
                    }

                    return { x, y, dx, dy };
                });

                // Intelligent paddle movement - only move the active paddle horizontally
                const paddleSpeed = ball_speed ;
                const paddleWidthPercent = (paddleHeight / 250) * 100;

                if (movingPaddle === 'top') {
                    setLeftY(prev => {
                        let newX = prev;
                        if (ball.x < prev) {
                            newX -= paddleSpeed;
                        } else if (ball.x > prev) {
                            newX += paddleSpeed;
                        }

                        // Clamp to boundaries
                        const minX = paddleWidthPercent / 2;
                        const maxX = 100 - paddleWidthPercent / 2;
                        return Math.max(minX, Math.min(maxX, newX));
                    });
                } else {
                    setRightY(prev => {
                        let newX = prev;
                        if (ball.x < prev) {
                            newX -= paddleSpeed;
                        } else if (ball.x > prev) {
                            newX += paddleSpeed;
                        }

                        // Clamp to boundaries
                        const minX = paddleWidthPercent / 2;
                        const maxX = 100 - paddleWidthPercent / 2;
                        return Math.max(minX, Math.min(maxX, newX));
                    });
                }
                frameId = requestAnimationFrame(loop);
            };
        } else {
            loop = () => {
                setBall((prev) => {
                    let { x, y, dx, dy } = prev;
                    x += dx * ball_speed;
                    y += dy * ball_speed;

                    // Convert percentages to relative positions for collision detection
                    const ballRadius = ballHeight / 10; // Approximate radius in percentage terms
                    const paddleThickness = 3; // 3% height (h-3 class)
                    const paddleWidthPercent = (paddleHeight / 250) * 100; // Convert to percentage of container

                    // Bounce off top and bottom walls
                    if (y <= (1 + ballRadius) || y >= (98 - ballRadius)) {
                        dy = -dy;
                    }

                    // Left paddle collision (vertical paddle)
                    if (
                        x - ((ballRadius / 2)) <= 1 + (paddleThickness) &&
                        y >= leftY - paddleWidthPercent / 2 &&
                        y <= leftY + paddleWidthPercent / 2 &&
                        dx < 0
                    ) {
                        dx = -dx;
                        setMovingPaddle('right');
                    }

                    // Right paddle collision (vertical paddle)
                    if (
                        x + (ballRadius / 2) >= 98 - (paddleThickness) &&
                        y >= rightY - paddleWidthPercent / 2 &&
                        y <= rightY + paddleWidthPercent / 2 &&
                        dx > 0
                    ) {
                        dx = -dx;
                        setMovingPaddle('left');
                    }

                    // Right paddle collision (vertical paddle)
                    if (x < 0 || x > 100) {
                        x = 50;
                        y = 50;
                        dx = ball_speed * (Math.random() > 0.5 ? 1 : -1);
                        dy = ball_speed * (Math.random() > 0.5 ? 1 : -1);
                        setMovingPaddle('right');
                    }

                    return { x, y, dx, dy };
                });

                // Intelligent paddle movement - only move the active paddle horizontally
                const paddleSpeed = ball_speed ;
                const paddleWidthPercent = (paddleHeight / 250) * 100;

                if (movingPaddle === 'left') {
                    setLeftY(prev => {
                        let newY = prev;
                        if (ball.y < prev) newY -= paddleSpeed;
                        else if (ball.y > prev) newY += paddleSpeed;
                        return Math.max(paddleWidthPercent/2, Math.min(100-paddleWidthPercent/2, newY));
                    });
                } else {
                    setRightY(prev => {
                        let newY = prev;
                        if (ball.y < prev) newY -= paddleSpeed;
                        else if (ball.y > prev) newY += paddleSpeed;
                        return Math.max(paddleWidthPercent/2, Math.min(100-paddleWidthPercent/2, newY));
                    });
                }
                frameId = requestAnimationFrame(loop);
            };
        }

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [ball_speed, ballHeight, paddleHeight, ball.x, movingPaddle]);

    return (
        <div className="flex w-full  rounded-lg card-hover-effect flex-col items-center gap-3 h-full">
            {/*<div className="flex w-full flex-col items-center gap-2">*/}
            {/*    <a className="font-bold text-2xl" style={{color: electric_blue}}>Game Preview</a>*/}
            {/*    <a className="m-0 text-gray-500">Live Demo</a>*/}
            {/*</div>*/}

            <div className='flex relative h-full w-full aspect-[7/3] bg-dark  border-[#23ccdc]/30 p-1 rounded-lg'>

                <div
                    className="relative rounded-lg bg-[#081C29]/80 transition-all duration-300 w-full flex-1"
                    style={{
                        background: `url(${bgEnabled ? background : ''}) center/cover no-repeat`,
                    }}
                >
                    {direction === Direction.HORIZONTAL ? (
                        // Horizontal paddles (top/bottom)
                        <>
                            <div
                                className="absolute z-10 top-1 rounded-full h-3"
                                style={{
                                    left: `${leftY}%`,
                                    transform: "translateX(-50%)",
                                    background: player1.paddleColor,
                                    width: `${paddleHeight}px`
                                }}
                            />
                            <div
                                className="absolute z-10 bottom-1 rounded-full h-3"
                                style={{
                                    left: `${rightY}%`,
                                    transform: "translateX(-50%)",
                                    background: player2.paddleColor,
                                    width: `${paddleHeight}px`
                                }}
                            />
                        </>
                    ) : (
                        // Vertical paddles (left/right)
                        <>
                            <div
                                className="absolute z-10 left-1 rounded-full w-3"
                                style={{
                                    top: `${leftY}%`,
                                    transform: "translateY(-50%)",
                                    background: player1.paddleColor,
                                    height: `${paddleHeight}px`
                                }}
                            />
                            <div
                                className="absolute z-10 right-1 rounded-full w-3"
                                style={{
                                    top: `${rightY}%`,
                                    transform: "translateY(-50%)",
                                    background: player2.paddleColor,
                                    height: `${paddleHeight}px`
                                }}
                            />
                        </>
                    )}

                    {/* Ball */}
                    <div
                        className="absolute rounded-full"
                        style={{
                            top: `${ball.y}%`,
                            left: `${ball.x}%`,
                            transform: "translate(-50%, -50%)",
                            background: ballColor,
                            width: `${ballHeight}px`,
                            height: `${ballHeight}px`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}