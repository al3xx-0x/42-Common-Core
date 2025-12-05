import {BackgroundImageContext, TablePreviewProps} from "@/app/types";
import {useContext} from "react";

export default function TablePreview(props:TablePreviewProps) {
    const {index: index, paddleSize, ballSize, ballSpeed, backgroundEnabled: background } = useContext(BackgroundImageContext);
    return (
        <div className="w-full h-64 border bg-no-repeat backdrop-blur-xs bg-cover rounded-2xl flex justify-between items-center"
             style={{backgroundImage: (background ? `url(${props.images[index]})` : "")}}
        >
            <div
                style={{
                    backgroundColor: props.leftPadelColor,
                    animation: `translationY-rev ${ ballSpeed }s ease-in-out infinite`,
                    height: `${paddleSize}px`
                }}
                className={`w-4 h-20 ml-5 border-2 bg z-1 rounded-full animate-updown`}/>
            <div
                style={{
                    animation: `translationX ${ ballSpeed }s ease-in-out infinite`,
                    padding: `${ballSize}px`,
                }}
                className="p-[15px] bg-amber-50 rounded-full w-min h-min "
            />
            <div
                style={{
                    backgroundColor: props.rightPadelColor,
                    animation: `translationY ${ ballSpeed }s ease-in-out infinite`,
                    height: `${paddleSize}px`
                }}
                className={`w-4 mr-5  border-2 h-20 z-1 rounded-full animate-updownReverse`}/>
        </div>
    );
}