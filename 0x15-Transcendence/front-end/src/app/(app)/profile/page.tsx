"use client";

import {
  SearchResult,
  FriendshipStatus,
  useUser,
} from "@/app/types";
import {
  CalendarDays,
  ChartNoAxesCombined,
  Edit,
  Gamepad2,
  MapPin,
  Medal,
  MessageCircleMore,
  Skull,
  Trophy,
  User as UserIcon,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";
import { useEffect, useState, Suspense, use } from "react";
import { useTranslation } from "react-i18next";
import MatchPlayed from "../game/mode/tournament/matchplayed";
import TimeSpend from "./timeSpend";
import GameHistory from "./GameHistory";
import { useRouter, useSearchParams } from "next/navigation";
import { achievementRank, fetchWithToken, getImageUrl } from "@/app/Utils";
import { baseUrl } from "@/app/types";
import Color from "color";
import {
  removeFriendRequest,
  addFriend,
  ConfirmRemoveFriend,
} from "../friends/friendship";

const orbitron = Orbitron({ subsets: ["latin"], weight: "600" });


function ProfileComponent() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(0);

  useEffect(() => {
    setPrev(current === 0 ? achievementRank.length - 1 : current - 1);
    setNext(current === achievementRank.length - 1 ? achievementRank.length - 1 : current + 1);
  }, [current]);
  const params = useSearchParams();

  // const UserContextValue = useContext<SearchResult>(UserContext);
  const currentUser = useUser();
  const [user, setUser] = useState<SearchResult>(currentUser.user);
  const router = useRouter();
  const [id, setId] = useState(0);
  const [friendshipStatus, setFriendshipStatus] = useState(
    FriendshipStatus.none
  );

  const [currentUserPage, setUserPage] = useState(false);
  const [confirmRemoveFriend, setConfirmRemoveFriend] = useState(false);

  const prevRankXP = achievementRank[current].xp;
  const nextRankXP = achievementRank[next]?.xp
  const progress = ((user.score - prevRankXP) * 100) / (nextRankXP - prevRankXP);

  useEffect(() => {
    // Set ID to current user if no ID parameter is provided
    const urlId = params.get("id");
    if (!urlId) {
      setId(currentUser.user.id);
    } else {
      setId(Number(urlId));
    }
  }, [currentUser.user.id]);


  useEffect(() => {
    const urlId = params.get("id");
    const targetId = urlId ? Number(urlId) : currentUser.user.id;


    setUserPage(targetId === currentUser.user.id);


    const fetchUser = async () => {
      const response = await fetchWithToken(
        `${baseUrl}/api/settings/profile?id=${targetId}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFriendshipStatus(data.user.friendship_status ?? "none");
        setUser(data.user);
        setCurrent(data.user.lvl > 1 ? data.user.lvl - 1 : 0);
      } else {
        // Only go back if it's not the current user's own profile
        if (targetId !== currentUser.user.id) {
          router.back();
        }
      }
    };

    // Only fetch if we have a valid user context
    if (currentUser.user.id) {
      fetchUser();
    }
  }, [params, currentUser.user]);

  useEffect(() => {
    setUser((prevUser) =>
      prevUser?.id === currentUser.user.id ? currentUser.user : prevUser
    );
  }, [currentUser.user]);

  const FriendShipActions = () => {
    if (currentUserPage) return;

    switch (friendshipStatus) {
      case FriendshipStatus.none:
        return (
          <div className="flex gap-3 text-cyan-500">
            <button
              onClick={() => [
                addFriend({
                  id: id,
                  onSuccess: () => {
                    setFriendshipStatus(FriendshipStatus.pending);
                  },
                }),
              ]}
              className="flex items-center gap-2  bg-cyan-500/20 p-2 rounded-lg"
            >
              <UserPlus />
              {t('profile.addFriend')}
            </button>
          </div>
        );

      case FriendshipStatus.pending:
        return (
          <div className="flex gap-3">
            <button
              onClick={() => {
                removeFriendRequest({
                  id: id,
                  onSuccess: () => {
                    setFriendshipStatus(FriendshipStatus.none);
                  },
                });
              }}
              className="flex items-center text-xs md:text-lg text-cyan-500 gap-2 bg-cyan-500/40 p-2 rounded-lg hover:bg-cyan-500/30 animations"
            >
              <UserMinus />
              {t('profile.cancelRequest')}
            </button>
          </div>
        );
      case FriendshipStatus.accepted:
        return (
          <div className=" flex gap-3 text-cyan-500 items-center">
            <button
              onClick={() => {
                router.push(`/Chat?id=${id}`);
              }}
              className="bg-cyan-500/15 p-2  rounded-lg hover:bg-cyan-500/30 animations"
            >
              <MessageCircleMore />
            </button>
            <button
              onClick={() => setConfirmRemoveFriend(true)}
              className="flex items-center gap-2 bg-cyan-500/15 p-2 rounded-lg hover:bg-cyan-500/30 animations"
            >
              <Users />
              {t('profile.friends')}
            </button>
          </div>
        );
    }
  };

  const PlayerStats = () => {
    return (
      <div className="flex items-center gap-10">
      {[
        {
          label: t('profile.matches'),
          color: Color("cyan"),
          icon: Gamepad2,
          value: user.match_count,
        },
        {
          label: t('profile.win'),
          color: Color("green"),
          icon: Trophy,
          value: user.win_count,
        },
        {
          label: t('profile.lose'),
          color: Color("red"),
          icon: Skull,
          value: user.lose_count,
        },
      ].map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col justify-center items-center group"
          >
            <div className="flex  gap-2 p-1 items-center ">
              <div
                className="p-1  rounded-lg"
                style={{
                  backgroundColor: item.color.alpha(0.1).toString(),
                }}
              >
                <item.icon
                  color={item.color.toString()}
                  size={26}
                  className={``}
                />
              </div>
              {/* <span className="text-slate-400 md:text-sm text-xs font-medium">{item.lablel}</span> */}
              <span className="md:text-xl font-bold "
                style={{
                  color: `${item.color}`
                }}>
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
    );
  }

  return (
    <div>
      <ConfirmRemoveFriend
        confirm={confirmRemoveFriend}
        setConfirm={setConfirmRemoveFriend}
        onConfirm={() => {
          removeFriendRequest({
            id: id,
            onSuccess: () => {
              setFriendshipStatus(FriendshipStatus.none);
              setConfirmRemoveFriend(false);
            },
          });
        }}
      />
      <div className="flex pt-20  bg-cyan-950">
        <main className="flex-1 md:ml-20 p-4 md:p-6 space-y-6 ">
          <div>

            <div className="relative mb-24 flex flex-col md:flex-row justify-between w-full h-full">

              <div className="rounded-lg w-full h-40 sm:h-56 md:h-[280px]  relative overflow-hidden">

                <img
                  src={getImageUrl(user.cover)}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="absolute bg-black/10 rounded-lg m-2 p-1 backdrop-blur-sm right-0 top-0  justify-center hidden xl:block">
                  <PlayerStats/>
                </div>
              <div className="absolute rounded-lg bg-[#081C29]/80  backdrop-blur-2xl shadow-2xl -bottom-6 w-full h-[80px] md:h-[100px]">

                <div>
                  <div className="flex flex-row  ml-28 md:ml-36 justify-between h-full">
                    <div className="flex flex-col justify-center gap-1 md:gap-3 px-4">
                      <div className="flex flex-row gap-3 items-center">
                        <div className="flex flex-col ">
                          <div className="text-xs md:text-xl font-bold truncate max-w-full xl:w-full text-white">
                            {user?.first_name} {user.last_name}
                          </div>
                          <span className="text-xs md:text-xl font-thin text-white">
                            @{user?.username}
                          </span>
                        </div>
                        {currentUserPage && (
                          <Link href={"/Settings"}>
                            <button className="w-6 h-6 md:h-8 md:w-8 rounded-lg bg-[#06b6d433] hover:bg-[#06b6d433] flex items-center justify-center animations text-cyan-500 hover:text-white ">
                              <Edit size={16} />
                            </button>
                          </Link>
                        )}
                      </div>
                      <div className="flex gap-4 md:gap-6">
                        <div className="flex  flex-row gap-2 items-center">
                          <CalendarDays className="text-[#06b6d4]" size={16} />
                          <span className="text-[#cbd5e1] line-clamp-1 md:text-sm text-xs">
                            {user.created_at}
                          </span>
                        </div>
                        <div className="flex flex-row gap-2 items-center ">
                          <MapPin className="text-[#06b6d4]" size={16} />
                          <span className="text-[#cbd5e1] md:text-sm text-xs">
                            {t('profile.location')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-center gap-2 md:gap-6 md:p-4 p-3 items-end">
                      <FriendShipActions />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-4">
                <div className="relative group bg-dark rounded-full">
                  <img
                    src={getImageUrl(user?.profile_image)}
                    alt=""
                    className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-full border border-[#06b6d4]"
                  />
                  <img
                    src={achievementRank[current].image}
                    className="absolute h-10 w-10 md:h-12 md:w-12 -bottom-6 right-1/2 left-1/3"
                  />
                </div>
              </div>
            </div>
          </div>
		  <div className="xl:hidden ">
		  <div className="bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg">
            <div className="p-3 md:p-4 h-full  flex flex-col">
              <div className="mb-4  md:mb-6 pb-3 border-b border-[#21364a]">
                <div className="flex items-center h-full w-full">
                  <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
                    <div className="bg-cyan-500/20 p-2 rounded-lg mr-2">
                      <ChartNoAxesCombined className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" />
                    </div>
                    {t('profile.performanceOverview')}
                  </h2>
                </div>
              </div>
              <PlayerStats />
            </div>
          </div>
		  </div>
          {/* main section */}
          <div className={``}>
            <div className={`grid md:grid-cols-2 gap-6`}>
              <div className="bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg w-full h-full">
                <div className="p-3 md:p-4 h-full flex flex-col">
                  <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
                    <div className="flex items-center h-full w-full">
                      <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
                        <div className="bg-cyan-500/20 p-2 rounded-lg mr-2">
                          <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" />
                        </div>
                        {t('profile.about')}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#b9bec4] text-sm md:text-base leading-relaxed">
                      {user?.bio || t('profile.defaultBio')}
                    </p>
                  </div>
                </div>
              </div>
              {/* Achievement */}
              <div className="bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg w-full h-full">
                <div className="p-3 md:p-4 h-full flex flex-col">
                  <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
                    <div className="flex justify-between items-center h-full w-full">
                      <h2 className="text-lg 2xl:text-xl font-semibold flex items-center">
                        <div className="bg-cyan-500/20 p-2 rounded-lg mr-2">
                          <Medal className="h-4 w-4 md:h-5 md:w-5   text-cyan-500 " />
                        </div>
                        {t('profile.achievements')}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex flex-col items-center">
                      <div className="flex flex-row items-center">
                        {/** Previous */}
                        {/* <div>
                          <img
                            src={achievementRank[prev].image}
                            alt=""
                            className=" h-auto w-32 drop-shadow-[0_0_40px_rgba(30,76,137,0.8)]"
                          />
                          <h1
                            className={`text-xl bg-gradient-to-r from-[#d7d6d1] to-[#a29b97] inline-block text-transparent bg-clip-text  ${orbitron.className}`}
                          >
                            {achievementRank[prev].rank}</h1>
                        </div> */}
                        <img
                          src={achievementRank[current].image}
                          alt=""
                          className=" h-auto w-56 drop-shadow-[0_0_40px_rgba(30,76,137,0.8)]"
                        />
                        {/** Next */}
                        {/* <div className={`${current === achievementRank.length - 1 && 'opacity-0'}`}>
                          <img
                            src={achievementRank[next].image}
                            alt=""
                            className=" h-auto w-32 drop-shadow-[0_0_40px_rgba(30,76,137,0.8)]"
                          />
                            <h1
                            className={`text-2xl bg-gradient-to-r from-[#d7d6d1] to-[#a29b97] inline-block text-transparent bg-clip-text ${orbitron.className}`}
                          >
                            {achievementRank[next].rank}
                          </h1>
                        </div> */}
                      </div>
                        {/** Current */}
                      <h1
                        className={`text-2xl bg-gradient-to-r from-[#d7d6d1] to-[#a29b97] inline-block text-transparent bg-clip-text mb-10 ${orbitron.className}`}
                      >
                        {achievementRank[current].rank}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span className={`${current === next && 'opacity-0'}`}>{achievementRank[current].level}</span>
                        <span>{achievementRank[next].level}</span>
                      </div>
                      <div className="relative w-full h-6 xl:h-8 bg-[#081C29]/80 rounded-lg border border-[#666262]/30 overflow-hidden">
                        <div
                          className="bg-cyan-500/20 transition-all duration-700 text-cyan-500 h-full rounded-md"
                          style={{ width: `${ !user?.score ? 0 : (user.score / achievementRank[next].xp) * 100 }%`}}
                        />
                        {
                          current === next ? (
                            <div className="absolute inset-0 flex justify-center items-center text-xs xl:text-lg font-semibold text-cyan-500">
                              {t('profile.maxLevelAchieved')}
                            </div>
                          ) :  <span className="absolute text-cyan-500 inset-0 flex justify-center items-center text-xs xl:text-lg font-semibold">
                          {`${user.score ?? 0}/${achievementRank[next].xp}XP`}
                        </span>
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-full gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TimeSpend user={user}/>
              {/* win rate */}
              <MatchPlayed user={user} />
            </div>
            {currentUserPage && <GameHistory />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Profile1() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">{t('game.loading')}</div>}>
      <ProfileComponent />
    </Suspense>
  );
}
