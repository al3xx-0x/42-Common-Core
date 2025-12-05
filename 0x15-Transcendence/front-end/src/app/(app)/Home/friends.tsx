import { Users, Search, MessageCircle, Gamepad2 } from "lucide-react";
import Link from "next/link"
import { useTranslation } from "react-i18next";

export type State = {
    name: string;
    status: string;
    avatar: string;
}

export default function Friends({friends} : {friends : State[]}){
  const { t, i18n } = useTranslation();
    return (
        <div className="xl:col-span-1">
            <div className="bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg">
              <div className="p-3 md:p-4 h-full flex flex-col">
                {/* Add title with icon inside card */}
                <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
                  <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#339AF0]" />
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
                <div className="max-h-[500px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 space-y-3 md:space-y-4">
                  {friends.map((friend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#113A4B]/50 transition-all duration-300  hover:mx-4 md:hover:mx-8 hover:scale-105"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="relative flex-shrink-0 cursor-pointer">
                          <div className="h-8 w-8 md:h-10 md:w-10 relative flex shrink-0 overflow-hidden rounded-full">
                            <img
                              src={friend.avatar}
                              alt="Friend avatar"
                              className="aspect-square h-full w-full object-cover"
                              onError={(e: any) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display = "flex";
                              }}
                            />
                            <div className="bg-[#113a4b] flex h-full w-full items-center justify-center rounded-full text-white text-sm font-medium">
                            </div>
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#113a4b] ${
                              friend.status === 'Online' || friend.status === 'متصل' || friend.status === 'ⵏ ⴰⴷⵓⵍ' ? 'bg-[#00ff88] animate-pulse' : 'bg-[#5d5d5d]'
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-sm md:text-base truncate">{friend.name}</p>
                          <p className={`text-xs md:text-sm ${friend.status === 'Online' || friend.status === 'ⵏ ⴰⴷⵓⵍ' || friend.status === 'متصل' ? 'text-[#00ff88]' : 'text-[#a4aca7]'}`}>
                            {friend.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 md:space-x-2 flex-shrink-0 ml-2">
                        <div>
                          <Link href={"/Chat"}>
                            <button className="h-6 w-6 md:h-8 md:w-8 bg-[#B9B8B8]/20 text-[#ffffff] hover:text-[#23ccdc] hover:bg-[#23ccdc]/20 transition-all duration-300 hover:scale-110 rounded-md flex items-center justify-center cursor-pointer border-none">
                              <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </Link>
                        </div>
                        <div>
                          <Link href={"/game/mode/head-to-head"}>
                            <button className="h-6 w-6 md:h-8 md:w-8 bg-[#B9B8B8]/20 text-[#ffffff] hover:text-[#23ccdc] hover:bg-[#23ccdc]/20 transition-all duration-300 hover:scale-110 rounded-md flex items-center justify-center cursor-pointer border-none">
                              <Gamepad2 className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
    )
}