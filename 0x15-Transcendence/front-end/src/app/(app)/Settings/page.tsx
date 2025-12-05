"use client";

import { useContext, useEffect, useState } from "react";
import ProfileCard from "./General/profile-settings";
import AccountSettings from "./General/account-settings";
import SecuritySettings from "./General/security-settings";
import PongPreview, { Direction } from "./Game/preview";
import PaddleSettings from "./Game/paddle-settings";
import BallSettings from "./Game/ball-settings";
import GameModeSettings from "./Game/gamemodes-settings";
import TableSettings from "./Game/table-settings";
import { useTranslation } from "react-i18next";
import {GameMode, GamePreferences, useGame, UserContext, useUser} from "@/app/types";
import Confirmator from "@/app/(app)/components/Confirmator";
import { AnimatePresence } from "framer-motion";
import { fetchWithToken } from "@/app/Utils";
import { baseUrl } from "@/app/types";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, LogOut } from "lucide-react";
import { motion as Motion } from "framer-motion";
import SaveBtn from "../components/SaveBtn";

export default function SettingsPage() {
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const [deleteAccount, setDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const { t, i18n } = useTranslation();

  const paddleColors = [
    { label: t("colors.white"), hex: "#ffffff" },
    { label: t("colors.red"), hex: "#e83d3d" },
    { label: t("colors.green"), hex: "#01cb01" },
    { label: t("colors.blue"), hex: "#1e90ff" },
    { label: t("colors.yellow"), hex: "#f1c40f" },
    { label: t("colors.purple"), hex: "#9b59b6" },
    { label: t("colors.orange"), hex: "#e67e22" },
  ];
  const ballColors = [
    { label: t("colors.white"), hex: "#ffffff" },
    { label: t("colors.red"), hex: "#e83d3d" },
    { label: t("colors.green"), hex: "#01cb01" },
    { label: t("colors.blue"), hex: "#1e90ff" },
    { label: t("colors.yellow"), hex: "#f1c40f" },
    { label: t("colors.purple"), hex: "#9b59b6" },
    { label: t("colors.orange"), hex: "#e67e22" },
  ];

  const router = useRouter();

  const {user, setUser} = useUser();

  useEffect(() => {
    i18n.changeLanguage(user.language);
  }, [user.language]);

  const Delete = async () => {
    setDeletingAccount(true);
    try {
      const response = await fetchWithToken(
        `${baseUrl}/api/settings/deleteAccount`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDeletingAccount(false);
        setDeleteAccount(false);
        localStorage.clear();
        router.replace("/auth?mode=sign-in");
      }
    } catch {
      setDeletingAccount(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang);

    setUser((prevUser) => ({
      ...prevUser,
      language: lang,
    }));
    // setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
    try {
      await fetchWithToken(`${baseUrl}/api/settings/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: lang,
        }),
      });
    } catch {
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-cyan-950"
      >
        <div>
          {
            <AnimatePresence>
              {deleteAccount && (
                <Confirmator
                  onConfirm={() => Delete()}
                  loading={deletingAccount}
                  title={t("settings.deleteAccountTitle")}
                  message={t("settings.deleteAccountConfirm")}
                  subMsg={t("settings.deleteAccountSubMsg")}
                  confirmTitle={t("settings.deleteAccountBtn")}
                  onCancel={() => setDeleteAccount(false)}
                />
              )}
            </AnimatePresence>
          }
          <div className="flex pt-20">
            {/* Left Sidebar */}

            {showSaveMessage && (
              <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
                <div className="bg-green-600/90 border border-green-500/50 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-medium">
                      {t("settingsSavedSuccessfully")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-20 p-4 md:p-6">
              {/* Settings Header */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {t("game.settings")}
                </h1>
              </div>
              {/* General section */}
              {(
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="mb-20">
                    <ProfileCard />
                  </div>
                  <div className="grid xl:grid-cols-2 flex-wrap gap-6 md:gap-8">
                    <AccountSettings />
                    <SecuritySettings />
                  </div>
                  <div className="w-full  flex justify-between ">
                    <div className="flex justify-start">
                      <button
                        onClick={() => setDeleteAccount(true)}
                        className="bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 px-7 py-2.5 rounded-lg transition-all duration-300"
                      >
                        {t("game.deleteAccount")}
                      </button>
                    </div>
                    {/*Change language*/}
                    <div>
                      <Select
                        defaultValue="english"
                        value={i18n.language}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="gap-x-4  p-6 text-xl bg-[#081C29]/80 border-[#498195]/30 text-white focus:border-[#23ccdc] focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#23ccdc]">
                          <Globe size={20} />
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-[#081C29] border-[#21364a]">
                          <SelectItem
                            value="en"
                            className="text-white hover:bg-[#113A4B]/50"
                          >
                            {t("game.english")}
                          </SelectItem>
                          <SelectItem
                            value="am"
                            className="text-white hover:bg-[#113A4B]/50"
                          >
                            {t("game.tamazight")}
                          </SelectItem>
                          <SelectItem
                            value="es"
                            className="text-white hover:bg-[#113A4B]/50"
                          >
                            {t("game.spanish")}
                          </SelectItem>
                          <SelectItem
                            value="fr"
                            className="text-white hover:bg-[#113A4B]/50"
                          >
                            {t("game.french")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </Motion.div>
    </AnimatePresence>
  );
}
