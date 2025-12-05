import { Coords, Player, TableResulution, useGame } from "@/app/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PingPongProps {
	playerY: number;
	opponentY: number;
	ballCoordinates: Coords
}

export default function Table({ playerY, opponentY, ballCoordinates} : PingPongProps) {
	return (
		<div className="relative bg-dark w-[960px] h-[640px] rounded-lg">
			{/* Player 1 */}
			<div className="absolute  z-10 left-0 h-[100px] w-[20px] bg-cyan-500 rounded-full"
				style={{
					transform: `translateY(${playerY}px)`,
				}}
			/>

			{/* Player 2 */}
			<div className="absolute z-10 right-0 h-[100px] w-[20px] bg-cyan-500 rounded-full"
				style={{
					transform: `translateY(${opponentY}px)`,
					transition: 'transform 0.1s ease-out'
				}}
			/>

			{/* Ball */}
			<div
				className={`absolute z-10 bg-cyan-500 rounded-full`}
				style={{
					width: "40px",
					height: "40px",
					transform: `translate(${ballCoordinates.x - 20}px, ${ballCoordinates.y - 20}px)`,
					// transition: 'transform 0.1s ease-out'
				}}
			/>

			{/* Middle line and circle */}
			<div className="absolute  h-full left-1/2 -translate-x-1/2 transform border-r-2 border-dashed border-cyan-500" />
			<div className="absolute bg-cyan-950 h-24 w-24 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform border-cyan-500 rounded-full border-2 border-dashed"/>

			{/* Corners */}
			<div className="absolute -translate-x-2 translate-y-2 bottom-0 h-2 z-10 w-24 bg-cyan-700 rounded-r-full"/>
			<div className="absolute -translate-x-2 translate-y-2 bottom-0 h-24 z-10 w-2 bg-cyan-700 rounded-t-full"/>

			<div className="absolute -translate-x-2 -translate-y-2 top-0 h-2 z-10 w-24 bg-cyan-700 rounded-r-full"/>
			<div className="absolute -translate-x-2 -translate-y-2 top-0 h-24 z-10 w-2 bg-cyan-700 rounded-b-full"/>


			<div className="absolute -translate-y-2 translate-x-1 right-0 h-2 z-10 w-24 bg-cyan-700 rounded-l-full"/>
			<div className="absolute -translate-y-2 translate-x-1 right-0 h-24 z-10 w-2 bg-cyan-700 rounded-b-full"/>

			<div className="absolute translate-x-1 translate-y-1 right-0 bottom-0 h-2 z-10 w-24 bg-cyan-700 rounded-l-full"/>
			<div className="absolute translate-x-1 translate-y-1 right-0 bottom-0 h-24 z-10 w-2 bg-cyan-700 rounded-t-full"/>
		</div>
	);
}