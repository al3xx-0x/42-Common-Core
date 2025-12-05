"use client"
import { Shield, CheckCircle2, Save } from "lucide-react"
import React, { ReactElement, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {fetchWithToken} from "@/app/Utils";
import {baseUrl, useUser} from "@/app/types";
import {BiHide, BiShow} from "react-icons/bi";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Switch} from "@radix-ui/react-switch";
import { UserContext } from "@/app/types";
import SaveBtn from "../../components/SaveBtn";
import { toast } from "@/hooks/use-toast";
import { Toast } from "@radix-ui/react-toast";
import Loading from "../../components/Loading";

export default function SecuritySettings() {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnable] = useState<boolean>(false);

  const {user} = useUser();

  useEffect(() => {
    setTwoFactorEnable(user.two_factor_enabled);
  }, [user])

  const handleSave = async () => {
    if (isSaving) return;

    if (!currentPassword) {
      // setError("")
      return;
    }

    setIsSaving(true)
    setSaved(false)

    try {
      const response = await fetchWithToken(
          `${baseUrl}/api/settings/security`,
          {
            method: 'PUT',
            body: JSON.stringify (
                {
                  "currentPassword": currentPassword,
                  "newPassword": newPassword,
                  "confirmPassword": confirmPassword
                }
            )
          }
      );
      console.log("response => ", response);
      if (response.status === 400) {

        toast({ description: t('game.inviteed'), className: 'bg-green-500 text-white border-none' });

        // setError(data.error);
      }
      if (response.status === 201) {
        const data = await response.json();
        if (data.success) {
          setTimeout(() => {
            setIsSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
          }, 800);
        }
      }
    } catch (e: any) {
      console.log("error => ", e);
      setIsSaving(false);
    } finally {
      // setIsSaving(false)
    }
  }

  const twofaHandler = async (enabled: boolean) => {
    await fetchWithToken(
      `${baseUrl}/api/settings/2fa`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ enabled })
      }
    )
  }

  return (
    <div
    className="rounded-lg  bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 transition-all duration-300 h-full flex flex-col">
      <div className="p-6 gap-y-8 flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div
            className="p-2 mr-2 rounded-lg border"
            style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A"}}>
            <Shield className="h-5 w-5 text-[#23ccdc]" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.security")}</h2>
        </div>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.currentPassword) {
              errors.currentPassword = t('game.currentPasswordRequired');
            }
            if (!values.newPassword) {
              errors.newPassword = t('game.newPasswordRequired');
            }
            if (!values.confirmPassword) {
              errors.confirmPassword = t('game.confirmPasswordRequired');
            } else if (values.newPassword !== values.confirmPassword) {
              errors.confirmPassword = t('game.passwordsDoNotMatch');
            }
            return errors;
          }}
          onSubmit={async (values, { setFieldError, setSubmitting }) => {
            try {
              if (user.isGoogleLogin) {
                setFieldError("currentPassword", t("game.googleLoginPasswordChangeError"));
                return;
              }
              setIsSaving(true);
              const response = await fetchWithToken(`${baseUrl}/api/settings/security`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              }).finally(() => setIsSaving(false));

              console.log("response => ", response); // Add this line to log the response

              const data = await response.json();

              if (response.status === 400) {
                const {error} = data;
                toast({ description: error, className: 'bg-red-600 text-white border-none' });
              }
              if (response.ok) {
                setTimeout(() => {
                  setIsSaving(false);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2500);
                }, 800);
              } else {
                setSaved(false);
                if (data.code === 1) setFieldError("currentPassword", data.error);
                if (data.code === 2) setFieldError("confirmPassword", data.error);
              }
            } catch (e) {
              console.error("Error during form submission:", e);
            }
          }}
        >
          {
            () => (
                <Form
                    className='space-y-4 flex-grow'>
                  {
                    [
                      {
                        label: t("game.currentPassword"),
                        name: 'currentPassword',
                        fieldVisibility: showCurrentPassword,
                        fieldVisibilitySetter: setShowCurrentPassword,
                      },
                      {
                        label: t("game.newPassword"),
                        name: 'newPassword',
                        fieldVisibility: showNewPassword,
                        fieldVisibilitySetter: setShowNewPassword,
                      },
                      {
                        label: t("game.confirmPassword"),
                        name: 'confirmPassword',
                        fieldVisibility: showConfirmPassword,
                        fieldVisibilitySetter: setShowConfirmPassword,
                      },
                    ].map((field, index) => {
                      return (
                          <div>
                            <label className="block text-[#a4aca7] text-sm mb-2">{field.label}</label>
                            <div className="relative items-center">
                              <Field
                                  name={field.name}
                                  type={field.fieldVisibility ? "text" : "password"}
                                  placeholder="••••••••"
                                  disabled={user.isGoogleLogin}
                                  className="w-full p-2 focus:outline-none rounded-md bg-[#113A4B]/50 border border-[#498195]/30 text-white focus:border-[#23ccdc] focus-visible:ring-0"
                              />
                              <span
                                  onClick={() => field.fieldVisibilitySetter(!field.fieldVisibility)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl">
                                {field.fieldVisibility ? <BiShow /> : <BiHide />}
                              </span>
                            </div>
                            <ErrorMessage
                                name={field.name}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                          </div>
                      )
                    })
                  }
                  <div
                                  // disabled={user.isGoogleLogin}

                  className="flex items-center justify-between mt-6">
                    {saved && (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>{t("settingsSavedSuccessfully")}</span>
                        </div>
                    )}
                        <button
                              type={"submit"}
                              disabled={isSaving || user.isGoogleLogin}
                              className="ml-auto flex items-center gap-2 bg-cyan-500/30 enabled:hover:bg-cyan-500/50 disabled:opacity-60 text-white px-10 py-2 rounded-lg transition-all duration-300"
                            >
                              { !isSaving && <Save size={16}/> }
                              <Loading isloading={isSaving} label={t("game.save")}/>
                        </button>
                  </div>
                </Form>
            )
          }
        </Formik>
        <div className="relative flex flex-col mt-6">
          <div className="flex items-center  justify-between text-xl">
            <span className="font-medium">{t('game.twoFactor')}</span>
            <Switch
                disabled={user.isGoogleLogin}
                type="button"
                onClick={() => {
                  const newValue = !twoFactorEnabled;
                  setTwoFactorEnable(newValue);
                  twofaHandler(newValue);
                }}
                className={`absolute right-0  bottom-0 inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${twoFactorEnabled ? 'bg-[#0DC6DF]/50' : 'bg-[#0DC6DF]/10'}`}>
                <span
                    className={`inline-block h-6 w-6 transform rounded-full transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-8 bg-[#00F5FF]' : 'translate-x-1 bg-gray-600'}`}/>
            </Switch>
          </div>
            <span className="mt-1 text-sm text-gray-500">
                {t('game.twoFactorDesc')}
            </span>
        </div>
      </div>
    </div>
  )
}