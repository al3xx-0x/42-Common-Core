import { baseUrl } from "@/app/types";
import { User } from "@/app/types";
import { useSocket } from "@/context/SocketContext";
import { toast } from "@/hooks/use-toast";
import { Users, Search, MessageCircle, Gamepad2, MessageCircleMore, UserRoundPlus } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export type State = {
    name: string;
    status: string;
    avatar: string;
}

export default function Friends({friends = []} : {friends? : User[]}){
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const {socket} = useSocket();
    return (
          <div className="bg-[#081C29]/80 border h-full  border-[#21364a] hover:border-[#23ccdc]/30 rounded-2xl">
            <div className="p-3 md:p-4 h-full flex flex-col">
              {/* Add title with icon inside card */}
              <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
                <h2 className="text-lg md:text-2xl font-semibold text-white flex items-center">
                  <Users className="size-4 md:size-7 mr-2 text-cyan-500" />
                  {t("game.friends")}
                </h2>
              </div>

              {/* Keep the existing search bar */}
              <div className="mb-4 md:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a4aca7] h-4 w-4" />
                  <input
                      placeholder={t("game.searchFriends")}
                    className="pl-10 bg-[#081C29]/80 border border-[#D9D9D9]/20 text-white focus:border-[#498195]/70 focus:outline-none w-full h-10 rounded-md px-3 py-2"
                  />
                </div>
              </div>
                {!friends?.length && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Users className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="mb-2">{t("game.noFriendsYet")}</p>
                  </div>
              )}
              <div className="max-h-[560px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 space-y-3 md:space-y-4">
                {friends?.length && (friends || []).map((friend, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/profile?id=${friend.id}`)}
                    className="flex  items-center w-full justify-between p-3 rounded-lg bg-cyan-500/15 transition-all duration-300  cursor-pointer hover:bg-cyan-500/20 "
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative flex-shrink-0 cursor-pointer">
                        <div className="h-8 w-8 md:h-10 md:w-10 relative flex shrink-0 overflow-hidden rounded-full">
                          <img
                            src={`${baseUrl}${friend.profile_image}`}
                            alt="Friend avatar"
                            className="object-cover"
                            onError={(e: any) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling.style.display = "flex";
                            }}
                          />
                          <div className="bg-[#113a4b] flex h-full w-full items-center justify-center rounded-full text-white text-sm font-medium">
                          </div>
                        </div>
                        {/* <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#113a4b] ${
                            friend.status === 'Online' || friend.status === 'متصل' || friend.status === 'ⵏ ⴰⴷⵓⵍ' ? 'bg-[#00ff88] animate-pulse' : 'bg-[#5d5d5d]'
                          }`}
                        /> */}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-bold text-sm md:text-base truncate">{`${friend.first_name} ${friend.last_name}`}</p>
                        <p>@{friend.username}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1  md:space-x-2 flex-shrink-0 ml-2">
                      <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/Chat?id=${friend.id}`)
                            }}
                            className="h-6 w-6 md:h-8 md:w-16 bg-cyan-500/20 text-cyan-500 hover:text-[#23ccdc] hover:bg-[#23ccdc]/20 transition-all duration-300  rounded-md flex items-center justify-center cursor-pointer border-none">
                            <MessageCircleMore className="size-4 md:size-6" />
                          </button>
                      </div>
                      <div>
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              socket?.emit("gameInvite", { receiverId: friend.id });
                              toast({ description: t('game.inviteed'), className: 'bg-green-500 text-white border-none' });
                            }}
                            className="h-6 w-6 md:h-8 md:w-16 bg-cyan-500/20 text-cyan-500 hover:text-[#23ccdc] hover:bg-[#23ccdc]/20 transition-all duration-300  rounded-md flex items-center justify-center cursor-pointer border-none">
                            <Gamepad2 className="size-4 md:size-6" />
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