"use client"
import { User as UserIcon, CheckCircle2 } from "lucide-react"
import {useContext, useEffect, useState} from "react"
import { useTranslation } from "react-i18next"
import {UserContext, useUser} from "@/app/types";
import {User} from "@/app/types"
import {fetchWithToken} from "@/app/Utils";
import {baseUrl} from "@/app/types";
import Loading from "@/app/(app)/components/Loading"
import SaveBtn from "../../components/SaveBtn";
export default function AccountSettings() {
  const {t, i18n} = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const {user} = useUser();


  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setUserName(user.username);
    setEmail(user.email);
    setBio(user.bio);
  }, [user]);

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    setSaved(false)

    try {
      const response = await fetchWithToken (
          `${baseUrl}/api/settings/account`,
          {
            method: 'PUT',
            headers: {
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              bio: bio
            }),
          }
      );
      if (!response.ok) {
        throw new Error('Failed to post profile data .');
      }
      // const data = await response.json();
      if (response.status === 201) {
        setTimeout(() => {
          setIsSaving(false)
          setSaved(true)
          setTimeout(() => setSaved(false), 2500)
        }, 800);
      }
    } catch (error) {
      setIsSaving(false)
    }
  }
  // grid grid-cols-1 xl:grid-cols-3
  return (
    <div className="rounded-lg flex-1 bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 transition-all duration-300 h-full flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div
            className="p-2 mr-2 rounded-lg border"
            style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A"}}>
            <UserIcon className="h-5 w-5 text-[#23ccdc]" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.account")}</h2>
        </div>

        <div className="space-y-4 flex-grow">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[#a4aca7] text-sm mb-2">{t("game.firstName")}</label>
                <input
                    value={firstName}
                    onChange={(text) => setFirstName(text.target.value)}
                    className="w-full p-2 rounded-md bg-[#113A4B]/50 border border-[#498195]/30 text-white focus:outline-none focus:border-[#23ccdc] focus-visible:ring-0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[#a4aca7] text-sm mb-2">{t("game.lastName")}</label>
                <input
                    value={lastName}
                    onChange={(text) => setLastName(text.target.value)}
                  className="w-full p-2 rounded-md bg-[#113A4B]/50 border border-[#498195]/30 text-white focus:outline-none focus:border-[#23ccdc] focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[#a4aca7] text-sm mb-2">{t("game.email")}</label>
            <input
              readOnly
              value={email}
              className="w-full p-2 focus:outline-none rounded-md bg-[#113A4B]/50 border-none text-[#a4aca7] opacity-50 pointer-events-none"
            />
          </div>
          <div>
            <label className="block  text-[#a4aca7] text-sm mb-2">{t("game.username")}</label>
            <input
              readOnly
              value={userName}
              className="w-full p-2 focus:outline-none rounded-md bg-[#113A4B]/50 border-none text-[#a4aca7] opacity-50 pointer-events-none"
            />
          </div>
          <div>
            <label className="block text-[#a4aca7] text-sm mb-2">{t("game.bio")}</label>
            <textarea
                value={bio}
                onChange={(area) => setBio(area.target.value)}
                className="w-full h-40 resize-none p-2 rounded-md bg-[#113A4B]/50 border border-[#498195]/30
                  text-white focus:outline-none focus:border-[#23ccdc] focus-visible:ring-0
                  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          {saved && (
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span>{t("game.settingsSavedSuccessfully")}</span>
            </div>
          )}
            <SaveBtn isSaving={isSaving} onClick={handleSave}/>
        </div>
      </div>
    </div>
  )
}