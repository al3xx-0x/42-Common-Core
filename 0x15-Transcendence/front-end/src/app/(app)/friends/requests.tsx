import { baseUrl } from "@/app/types";
import { User } from "@/app/types";
import { fetchWithToken } from "@/app/Utils";
import { Users, MessageCircle, Gamepad2, Check, X, UserRoundPlus } from "lucide-react";
import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

export type State = {
    name: string;
    status: string;
    avatar: string;
}

export default function Requests(
	{
		requests = [], friendsSetter, requestsSetter} :
		{
			requests? : User[],
			friendsSetter: Dispatch<SetStateAction<User[]>>,
			requestsSetter: Dispatch<SetStateAction<User[]>>,
	}
){
	const { t } = useTranslation();

	const responseRequest = async ({friend, action}: {friend: User, action: string}) => {

		const response = await fetchWithToken(
			`${baseUrl}/api/friends/respond`,
			{
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify({
					friend_id: friend.id,
					action: action
				})
			}
		);
		const data = await response.json();

		if (response.ok) {
			if (action === 'accepted')
				friendsSetter(prev => [...(prev || []), friend]);
			requestsSetter(prev => prev.filter(friendRequest => friendRequest.id !== friend.id));
		}
	}
	return (
		<div className="bg-[#081C29]/80 border h-full border-[#21364a] hover:border-[#23ccdc]/30 rounded-2xl">
			<div className="p-3 md:p-4 h-full flex flex-col">
			{/* Add title with icon inside card */}
			<div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
				<h2 className="text-lg md:text-2xl font-semibold text-white flex items-center">
				<UserRoundPlus className="size-4 md:size-7 mr-2 text-cyan-500" />
				{t("game.friendRequests")}
				</h2>
			</div>

			{!requests?.length && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Users className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="mb-2">{t("game.noRequestsYet")}</p>
                  </div>
              )}
			<div className="max-h-[560px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 space-y-3 md:space-y-4">
				{(requests || []).map((request, index) => (
				<div
					key={index}
					className="flex items-center justify-between p-3 rounded-lg bg-[#113A4B]/50 transition-all duration-300 hover:bg-cyan-500/20 "
				>
					<div className="flex items-center space-x-3 min-w-0 flex-1">
					<div className="relative flex-shrink-0 cursor-pointer">
						<div className="h-8 w-8 md:h-10 md:w-10 relative flex shrink-0 overflow-hidden rounded-full">
							<img
								src={`${baseUrl}${request.profile_image}`}
								className="object-cover"
						/>
						<div className="bg-[#113a4b] flex h-full w-full items-center justify-center rounded-full text-white text-sm font-medium">
						</div>
						</div>
					</div>
					<div className="min-w-0 flex-1">
						<h1 className="text-white font-bold text-sm md:text-lg truncate">{`${request.first_name} ${request.last_name}`}</h1>
						<p>@{request.username}</p>
					</div>
					</div>
					<div className="flex space-x-1 text-cyan-500 md:space-x-2 flex-shrink-0 ml-2">
					<div>
						<button
							onClick={() => responseRequest({friend: request, action: 'rejected'})}
							className="h-6 w-6 md:h-8 md:w-16 bg-cyan-500/20  hover:text-red-500 transition-all duration-300 rounded-md flex items-center justify-center cursor-pointer border-none">
							<X className="size-4 md:size-6"/>
						</button>
					</div>
					<div>
						<button
							onClick={() => responseRequest({friend: request, action: 'accepted'})}
								className="h-6 w-6 md:h-8 md:w-16 bg-cyan-500/20  hover:text-cyan-300 transition-all duration-300 rounded-md flex items-center justify-center cursor-pointer border-none">
							<Check className="size-4 md:size-6 " />
						</button>
					</div>
					</div>
				</div>
				))}
			</div>
		</div>
		</div>
    )
}