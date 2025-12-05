"use client"
import {useContext, useState} from "react";
import { useGame } from "@/app/types";
import {useTranslation} from "react-i18next";
import { Range } from "react-range";
import Slider from "../../../components/Slider";


export default function BallSettings() {
    const game = useGame();

    if (!game)
        throw new Error('BallSettings component require game context');
    const { t } = useTranslation();


    const [ballSpeed, setBallSpeed] = useState(0);
    const [ballSize, setBallSize] = useState(0);
    const [paddleSize, setPaddleSize] = useState(0);


    const ballSpeedLabels = [t('game.slow'), t('game.normal'), t('game.fast'), t('game.veryFast')]
    const sizeLabels = [t('game.thin'), t('game.small'), t('game.medium'), t('game.large')]

    return (
        <div className="relative gap-4 flex flex-col w-full justify-between border p-6 pl-5 pr-5 rounded-xl card-hover-effect">
            <div className="flex items-center mb-6">
                <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
                    <img src="images/match.png" alt="Ball-icon" className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t("game.ball")}</h2>
            </div>
            {
                [
                    {
                        title: t("game.ballSpeed"),
                        maxValue: 3,
                        minValue: 0,
                        label: ballSpeedLabels[ballSpeed],
                        value: game.ballSpeed,
                        action: (index: number) => {
                            const ballSpeedLabels=  [10, 15, 17, 20]
                            game.setBallSpeed(ballSpeedLabels[index])
                        }
                    },
                    {
                        title: t("game.ballSize"),
                        maxValue: 3,
                        minValue: 0,
                        label: sizeLabels[ballSize],
                        value: game.ballSize,
                        action: (index: number) => {
                            const ballSize=  [20, 25, 30, 35]
                            game.setBallSize(ballSize[index])
                        }
                    },
                    {
                        title: t("game.paddleSize"),
                        maxValue: 3,
                        minValue: 0,
                        value: game.paddleSize,
                        label: sizeLabels[paddleSize],
                        action: (index: number) => {
                            const paddleSize =  [100, 125, 130, 150]
                            game.setPaddleSize(paddleSize[index])
                        }
                    },
                ].map((item, index) => {


                    return (
                        <div
                            key={index}
                            className="w-full flex flex-col gap-4">
                            <div className='flex w-full justify-between'>
                                <h2 className="text-center">{item.title}</h2>
                                <p className=" pr-6 text-sm text-[#a4aca7]">
                                    {
                                        item.label
                                    }
                                </p>
                            </div>
                            <div className="w-full flex flex-col items-center gap-2">
                                <Slider
                                    title=""
                                    subtitle=""
                                    initial={0}
                                    minValue={item.minValue}
                                    maxValue={item.maxValue}
                                    action={item.action}
                                />
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}
