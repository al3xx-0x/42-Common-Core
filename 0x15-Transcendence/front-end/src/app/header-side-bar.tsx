"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  Search,
  LogOut,
  Menu,
  X,
  Bolt,
  Gamepad2,
  MessageCircleMore,
  UserRoundSearch,
  Users,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";
import { Orbitron } from "next/font/google";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { SearchResult, User, UserContext, useUser } from "@/app/types";
import Confirmator from "./(app)/components/Confirmator";
import { AnimatePresence } from "framer-motion";
import { motion as Motion } from "framer-motion";
import { fetchWithToken, getImageUrl } from "./Utils";
import { baseUrl } from "@/app/types";
import { debounce, set } from "lodash";
import Loading from "./(app)/components/Loading";
import NotificationBell from "@/components/NotificationBell";
import { useSocket } from "@/context/SocketContext";

const orbitron = Orbitron({ subsets: ["latin"], weight: "800" });

export default function HeaderSideBar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [confirmation, setConfirmation] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userImage, setUserImage] = useState("/default.png");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [indicatorTop, setIndicatorTop] = useState(-100);

  const { user } = useUser();

  const menuRefs = {
    "/Home": useRef<HTMLButtonElement>(null),
    "/friends": useRef<HTMLButtonElement>(null),
    "/Chat": useRef<HTMLButtonElement>(null),
    "/Settings": useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    const activeRef = menuRefs[pathname as keyof typeof menuRefs];

    if (activeRef?.current) {
      const rect = activeRef.current.getBoundingClientRect();
      setIndicatorTop(rect.top - 80);
    } else {
      setIndicatorTop(-100);
    }
  }, [pathname]);

  useEffect(() => {
    if (!user.profile_image) return;
    setUserImage(getImageUrl(user.profile_image));
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchInput("");
  }, [pathname]);

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResult([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetchWithToken(
        `${baseUrl}/api/search?to_find=${encodeURIComponent(value)}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const { result } = await response.json();
        setSearching(false);
        setSearchResult(result);
      } else {
        setSearching(false);
        setSearchResult([]);
      }
    } catch (error) {
      setSearching(false);
      setSearchResult([]);
    }
  };

  const debounceHandler = useCallback(
    debounce((text: string) => {
      handleSearch(text);
    }, 300),
    []
  );

  useEffect(() => {
    if (!searchInput.trim()) {
      setSearch(false);
      setSearchResult([]);
    } else {
      setSearch(true);
    }
  }, [searchInput]);

  const SearchOverlay = () => {
    if (!search) return null;
    return (
      <div className="fixed bg-black/20 backdrop-blur-sm inset-0 w-full h-screen  z-40">
        <AnimatePresence>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: search ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="sidebar"
            className="fixed inset-0 z-40 flex flex-col pt-24 px-4 md:px-32"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSearchInput("");
                setSearch(false);
              }}
              className="absolute top-24 right-4 md:right-10 p-2 text-cyan-500 hover:bg-cyan-500/20 animations rounded-full z-50"
            >
              <X />
            </button>

            {/* Loading Indicator */}
            {searching && (
              <div className="absolute inset-0 flex items-center justify-center z-40">
                <Loading size={32} color="#00F5FF" isloading={true} />
              </div>
            )}

            {/* Search Results Container - This is the key fix */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="flex flex-col h-full gap-4 md:gap-6 pb-8  pt-12">
                {!searchResult?.length && searchInput?.length && !searching ? (
                  <div className="flex  items-center flex-col  h-full justify-center text-cyan-500 gap-4 text-xl">
                    <UserRoundSearch size={32} />
                    <span>{t("game.notFound")}</span>
                  </div>
                ) : (
                  searchResult.map((user) => (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/profile?id=${user.id}`, {});
                        setSearch(false);
                        setSearchInput("");
                      }}
                      key={user.id}
                      className="flex cursor-pointer animations rounded-lg hover:bg-cyan-500/20 gap-4 w-full items-center p-4 md:p-8 justify-between"
                    >
                      <div className="flex gap-4">
                        <img
                          src={`${baseUrl}${user.profile_image}`}
                          className="bg-[#21364a] h-12 w-12 md:h-16 md:w-16 object-cover rounded-full border-2 border-cyan-500 transition-all duration-200 cursor-pointer"
                        />
                        <div>
                          <h1 className="text-white font-bold">
                            {user.first_name} {user.last_name}
                          </h1>
                          <h2 className="text-white">@{user.username}</h2>
                        </div>
                      </div>
                      <div className="z-50 bg-cyan-500/40 p-2 rounded-full flex items-center justify-center">
                        <ChevronRight className="text-[#00F5FF]" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const { socket, isConnected } = useSocket();

  const logout = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log("Logout response:", response);
      if (response.ok) {
        if (socket) {
          socket.disconnect();
        }
        setIsSidebarOpen(false);
        localStorage.clear();
        socket?.disconnect();
        router.replace("/auth?mode=sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      <SearchOverlay />
      {
        <AnimatePresence>
          {confirmation && (
            <Confirmator
              title={t("game.logout")}
              message={t("game.logoutConfirmMessage")}
              confirmTitle={t("game.logout")}
              onCancel={() => setConfirmation(false)}
              onConfirm={() => logout()}
            />
          )}
        </AnimatePresence>
      }
      <header className=" fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-[#081C29]/95 backdrop-blur-md border-b border-[#081C29]">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden  rounded-lg text-cyan-500 bg-cyan-500/10 hover:text-cyan-600 transition-transform duration-300 p-1 mr-2"
          >
            {isSidebarOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
          <button
            onClick={() => router.push("/Home")}
            className="bg-transparent border-none p-0 cursor-pointer"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <img
                src="/images/logo.png"
                alt="ZeroServe Logo"
                className="h-10 w-16 md:h-12 md:w-12  px-3 md:px-0 cursor-pointer"
              />
              <p
                className={`bg-gradient-to-r md:text-xl hidden md:block font-bold bg-clip-text text-cyan-400  ${orbitron.className}`}
              >
                ZEROSERVE
              </p>
            </div>
          </button>
        </div>

        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div
            tabIndex={0}
            className="relative animations flex bg-[#21364A] rounded-full focus:border focus:border-[#498195]/70  px-4 "
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a4aca7] h-4 w-4" />
            <input
              onFocus={() => {
                setSearch(true);
              }}
              value={searchInput}
              onChange={(element) => {
                const text = element.target.value.trim();
                setSearchInput(element.target.value);
                debounceHandler(text);
              }}
              placeholder={t("game.search")}
              className="pl-9 p-2 w-full text-lg focus:outline-none bg-transparent  text-white focus-visible:ring-0"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearch(false);
                  setSearchInput("");
                  setSearchResult([]);
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <NotificationBell />
          <button
            onClick={() => router.push(`/profile?id=${user.id}`)}
            className="bg-transparent border-none p-0 cursor-pointer"
          >
            <img
              src={userImage}
              alt=""
              className={`${isConnected ? 'border-cyan-500' : 'border-cyan-500/50'} bg-[#21364a]  h-12 w-12 object-cover  rounded-full md:h-11 md:w-11 border-2 transition-all duration-200 cursor-pointer`}
            />
          </button>
        </div>
      </header>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-20 z-30 bottom-0 w-16 md:w-20 bg-[#081C29]/95 backdrop-blur-md border-r border-[#21364a]/50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="relative flex flex-col items-center py-6 h-full">
          <Motion.div
            layout
            initial={{ opacity: 0 }}
            className="absolute hidden md:block h-10 md:h-12 left-1 w-1 rounded-full bg-[#00F5FF]"
            animate={{ top: indicatorTop, opacity: indicatorTop > 0 ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />

          <Motion.div
            layout
            initial={{ opacity: 0 }}
            className="absolute rounded-2xl flex items-center justify-center bg-[#00F5FF]/25 h-10 w-10 md:h-12 md:w-12 transition-all duration-300"
            animate={{ top: indicatorTop, opacity: indicatorTop > 0 ? 1 : 0 }}
            transition={{ duration: 0.0, ease: "easeInOut" }}
          />
          <div className="flex left-0 flex-col  items-center gap-4">
            <Link href="/Home">
              <button
                ref={menuRefs["/Home"]}
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-[10px] flex items-center justify-center hover:bg-[white]/10 text-[white]/90 hover:text-[white] h-10 w-10 md:h-12 md:w-12 transition-all duration-300 "
              >
                <Gamepad2 className="size-6 md:size-8 text-[#00F5FF]" />
              </button>
            </Link>

            <Link href="/friends">
              <button
                ref={menuRefs["/friends"]}
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-[10px] flex items-center justify-center hover:bg-[white]/10 text-[white]/90 hover:text-[white] h-10 w-10 md:h-12 md:w-12 transition-all duration-300 "
              >
                <Users className="h-7 w-6 text-[#00F5FF] md:h-7  md:w-8" />
              </button>
            </Link>

            <Link href="/Chat">
              <button
                ref={menuRefs["/Chat"]}
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-[10px] flex items-center justify-center hover:bg-[white]/10 text-[white]/90 hover:text-[white] h-10 w-10 md:h-12 md:w-12 transition-all duration-300 "
              >
                <MessageCircleMore className="h-7 w-6 text-[#00F5FF] md:h-7 md:w-8" />
              </button>
            </Link>

            <Link href="/Settings">
              <button
                ref={menuRefs["/Settings"]}
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-[10px] flex items-center justify-center hover:bg-[white]/10 text-[white]/90 hover:text-[white] h-10 w-10 md:h-12 md:w-12 transition-all duration-300 "
              >
                <Bolt className="h-7 w-6 text-[#00F5FF] md:h-7 md:w-8" />
              </button>
            </Link>
          </div>

          <div className="flex-grow" />

          <button
            onClick={() => setConfirmation(true)}
            aria-label={t("game.logout")}
            className="rounded-lg px-1.5 h-10 w-10 md:h-12 md:w-12
                      text-red-500 hover:bg-[#00F5FF]/20 hover:border-[#a2a8ab] hover:text-[#00F5FF]
                      transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/50"
          >
            <LogOut className="h-7 w-6 md:h-7 md:w-8" />
          </button>
        </nav>
      </aside>
    </div>
  );
}
