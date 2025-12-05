"use client"

import { Camera, Edit } from "lucide-react"
import {useState, useRef, useContext, useEffect} from "react"
import { useTranslation } from "react-i18next"
import {fetchWithToken} from "@/app/Utils";
import {baseUrl, useUser} from "@/app/types";
import {User, UserContext} from '@/app/types';
import { set } from "lodash";

export default function ProfileCard() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<string>("/default");
  const [coverImage, setCoverImage] = useState<string>("/images/got-table.webp");

  const profileInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)


  const {user, setUser} = useUser();


  useEffect(() => {

    const prefix = `${baseUrl}`;
    if (!user.cover)
      setCoverImage('/images/got-table.webp');
    else
      setCoverImage(prefix + user.cover);

    if (!user.profile_image)
      setProfile('/default.png');
    else
      setProfile(prefix + user.profile_image);
  }, [user])
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const reader = new FileReader()
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result
        if (typeof result === "string") {
          if (type === "profile") {
            const response = await fetchWithToken(
                `${baseUrl}/api/settings/image`,
                {
                  method: 'PUT',
                  body: formData,
                }
            )
            const data = await response.json();
            setProfile(`${baseUrl}` + data.path);
            setUser((prevUser: User) => ({
              ...prevUser,
              profile_image: data.path,
            }));
          } else if (type === "cover") {
            const response = await fetchWithToken (
                `${baseUrl}/api/settings/cover`,
                {
                  method: 'PUT',
                  body: formData,
                }
            )
            const data = await response.json();
            setCoverImage(`${baseUrl}` + data.path);
            setUser((prevUser: User) => ({
              ...prevUser,
              cover: data.path,
            }));
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = (type: "profile" | "cover") => {
    if (type === "profile") {
      profileInputRef.current?.click()
    } else if (type === "cover") {
      coverInputRef.current?.click()
    }
  }

  return (
    <div>
      <div className="relative h-[300px]  text-cyan-500 w-full group">
        <div
          className="relative  w-full bg-dark rounded-lg h-full ">
          <img
            src={coverImage}
            alt="Cover"
            loading="lazy"
            className="w-full h-full rounded-lg object-cover transition-all duration-300 "
          />

            <button
            onClick={() => triggerFileUpload("cover")}
            className='absolute bg-cyan-900 hover:bg-cyan-800 animations p-1.5 top-4 right-4 rounded-full'>
              <Edit size={20} className="hover:text-cyan-400 animations"/>
            </button>

          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="text-white flex flex-col items-center">
              <Camera />
              <span className="text-sm font-medium">Update Cover</span>
            </div>
          </div> */}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <img
              src={profile}
              alt="Profile"
              className="bg-[#21364a] border-2 border-[#06b6d4] rounded-full h-24 w-24 md:h-32 md:w-32 object-cover  transition-all duration-300 group-hover/avatar:brightness-75"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = "/default.png";
              }}
            />
            <button
              onClick={() => triggerFileUpload("profile")}
              className='absolute right-4 p-1 -bottom-1 bg-cyan-900 hover:bg-cyan-800 animations rounded-full'>
              <Edit size={20} className="hover:text-cyan-400 animations"/>
            </button>
        </div>


        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "profile")}
          className="hidden"
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "cover")}
          className="hidden"
        />
      </div>
    </div>
  )
}
