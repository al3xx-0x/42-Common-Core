"use client"
import {useContext} from "react";
import {dark_blue} from "@/app/Utils";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {BackgroundImageContext} from "@/app/types";



export default function GameBackground({ images } : {images: string[]}) {
    const {backgroundEnabled: background, index: index, setBackground: setBackground, setBackgroundImage: setBackgroundImage } = useContext(BackgroundImageContext);
    return (
        <div className="backdrop-blur-2xl flex w-full flex-col   gap-5 border p-10 pl-5 pr-5 rounded-xl card-hover-effect">
            <h2 className="font-bold">Choose Table</h2>
            <div className="flex gap-5  items-center h-full">
                <div onClick={() => {
                    if (background)
                        setBackgroundImage(((index === 0) ? images.length - 1 : index - 1))
                }} className="flex items-center ">
                    <a className={`p-4 duration-200  opacity-70 hover:opacity-100 border-[1px] bg-[${dark_blue}] rounded-2xl  cursor-pointer`}>
                        <ChevronLeft/>
                    </a>
                </div>
                <div className="w-full h-full items-center  pb-0 flex flex-col justify-center">
                    <div>
                        <div
                            className="w-64  h-40 border  border-gray-500/80 rounded-[10px] bg-no-repeat bg-center bg-cover"
                            style={{backgroundImage: `url(${images[index]})`, filter: background? `blur(0px)` : `blur(2px)`}}
                        />
                        <div className="flex gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={background}
                                onChange={() => {setBackground(!background)}}
                            />
                            <p className="">Background</p>
                        </div>
                    </div>
                </div>
                <div  onClick={() => {
                    if (background)
                        setBackgroundImage(((index === images.length - 1) ? 0 : index + 1))
                }} className="flex items-center ">
                    <a className={`p-4 bg-[${dark_blue}] duration-200 opacity-70 hover:opacity-100 border-[1px]  rounded-2xl cursor-pointer`}>
                        <ChevronRight/>
                    </a>
                </div>
            </div>

        </div>
    );
}
