import {electric_blue} from "@/app/Utils";
import Image from "next/image";
import {PlayerContext, PlayerContextType, Side} from "@/app/types";
import {useContext, useState} from "react";
import {Check} from "lucide-react";

// export class Player {
//     name: string = ""
//     avatar: string = "/default.png"
//     side: Side = Side.UNSET
// }

export type PlayerCardProps = {
    // player: Player
    avatars: string[]
    selected: number
    colors: string[]
    setPaddleColor: (color: string) => void
}
export default function PlayerCard({ avatars} : PlayerCardProps) {
    const {
        avatarUsed,
        playerName,
        setPlayerName,
        colorIndex,
        setColorIndex,
        setAvatar
    } = useContext(PlayerContext)

    const [err, setErr] = useState(false)


    // let side = ""
    // switch (player.side) {
    //     case Side.LEFT:
    //         side = "Left Side"
    //         break
    //     case Side.RIGHT:
    //         side = "Right Side"
    //         break
    // }
    return (
        <></>
        // <div
        //     className={`flex rounded-lg p-8 card-hover-effect  flex-col items-center gap-3`}>
        //     <div className="flex w-full flex-col items-center gap-2">
        //         <a className="font-bold text-2xl" style={{color: electric_blue}} >{player.name}</a>
        //         <a className="m-0 text-gray-500">{side}</a>
        //     </div>
        //     <Image
        //         style={{
        //             borderColor: colors[colorIndex]
        //         }}
        //         className="rounded-lg size-24 border-3 h-full" src={avatars[avatarUsed]} alt={""} width={512} height={512} />
        //     <div className="flex flex-row gap-5">
        //         {
        //             avatars.map((avatar, index) => {
        //                 return <div
        //                     onClick={() => {
        //                     if (selected != index)
        //                         setAvatar(index)
        //                 }}  key={index}
        //                     className={index != selected ? 'transition-transform duration-300 hover:scale-105' : '' + ` rounded-lg    p-0.2 ${index === avatarUsed ? "bg-[#00F5FF]" : "bg-gray-600 "}`}
        //                     style={{
        //                     }}
        //                 >
        //                     {
        //                     <Image
        //                         style={{
        //                             opacity: selected === index ? 0.4 : 0.9,
        //                             cursor: selected === index ? "not-allowed" : "pointer",
        //                         }}
        //                         className={`rounded-lg size-24  border-3 h-full ${index === avatarUsed ? `border-[#00F5FF] drop-shadow-[0_0_10px_rgba(0,245,255,0.7)]  ` : "border-gray-500 "}`}
        //                         src={avatar}
        //                         alt=""
        //                         width={128}
        //                         height={128}
        //                     />

        //                 }</div>
        //             })
        //         }
        //     </div>
        //     <div className="flex flex-col w-full  gap-5">
        //         <div className="flex w-full  flex-col gap-2 transition-all duration-300">
        //             <a className="text-xs">Player Name</a>
        //             <div className={(err ? 'border border-red-500' : 'border-[#00F5FF]/50') + " border flex items-center p-3   bg-[#0F1725]   rounded-[5px] overflow-hidden h-full w-full"} >
        //                 <input
        //                     value={playerName}
        //                     onChange={(e) => {
        //                         setErr((e.target.value?.length) === 0);
        //                         setPlayerName(e.target.value);
        //                     }}
        //                     className="flex text-sm  bg-transparent outline-none w-full"/>
        //             </div>
        //             {
        //                 err && <a className="text-xs text-red-500">Name is required</a>
        //             }
        //         </div>

        //         <div className="flex w-full  flex-col gap-2">
        //             <p className="text-xs">Paddle color</p>
        //             <div

        //                 className="flex gap-2  h-full  rounded-[5px] items-center">
        //                 {
        //                     props.colors.map((color, index) => {
        //                             return (
        //                                 <div
        //                                     onClick={() => {
        //                                         props.setPaddleColor(color)
        //                                         setColorIndex(index)
        //                                     }}
        //                                     key={index}
        //                                     className={`flex justify-center  items-center cursor-pointer w-full h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        //                                         colorIndex === index
        //                                             ? 'border-[#23ccdc] shadow-[0_0_8px_#23ccdc]'
        //                                             : 'border-transparent hover:border-white/30 '
        //                                     }`}
        //                                     style={{
        //                                         backgroundColor: color,
        //                                         opacity: colorIndex === index ? 1 : 0.9
        //                                 }}
        //                                 >
        //                                     { colorIndex === index && <Check className="absolute"/> }
        //                                 </div>
        //                             );
        //                         })
        //                 }
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}