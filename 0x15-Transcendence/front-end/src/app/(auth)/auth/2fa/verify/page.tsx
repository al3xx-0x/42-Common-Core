"use client";
import { BiHide, BiShow } from "react-icons/bi";
import React, { useEffect, useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Loader, Mail } from "lucide-react";
import OtpInput from "react-otp-input";
import Loading from "@/app/(app)/components/Loading";
import { baseUrl } from "@/app/types";
const DURATION = 0.2;

function TwoFAVerifyPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const route = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
	  const email = searchParams.get('email');
	  if (!email) return;
	  setEmail(email);
  }, []);


  async function verifyOTP() {
	if (!email) {
		toast({title: 'Error', variant: 'destructive', description: 'Email required, please relaod the page or try again later.'});
		return;
	}
    try {
		setSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/auth/2fa/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
			otp_code: otp
          }),
		  credentials: "include",
        }
      );
      if (response.ok) {
		const data = await response.json();
		localStorage.setItem('accessToken', data.token)
        route.replace("/Home");
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Verfication failed!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while verification.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

	// function resendOtp(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
		// throw new Error("Function not implemented.");
	// }

  return (
    <div className="min-h-screen py-4 px-4 sm:px-8 md:px-16 lg:px-32 bg-[url(/images/backgound.png)]  bg-cover bg-center  xl:px-64 w-full flex justify-center items-center transition-all duration-500">
      <div className="bg-gradient-to-r w-full min-w-[320px] max-w-2xl  p-[3px] rounded-2xl">
        <div
          className={`relative gap-y-20 card-hover-effect backdrop-blur bg-[#081C29] min-w-[320px] gap-4 flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl p-10`}
        >
          <div className="flex flex-col gap-4 items-center">
			<Mail className='' size={64}/>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center">
              OTP verification
            </h1>
            <h3 className="text-xl font-normal text-center text-gray-200">
			Enter the 6-digit security code we sent to <span className="font-semibold">{email}</span>.
			The code is valid for <span className="font-semibold">10 minutes</span>.
			If you didn’t receive the code, check your spam folder
			{/* or <button */}
				{/* className="text-cyan-400 underline hover:text-cyan-300" */}
				{/* onClick={resendOtp}> */}
				{/* request a new code */}
			{/* </button>. */}
			</h3>

          </div>
          <div className="flex items-center justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{ width: "" }}
                  className="w-full mx-2 h-12 border bg-[#081C29]/60 border-[#00F5FF] rounded text-center text-lg"
                />
              )}
            />
          </div>
          <button
		  onClick={verifyOTP}
            disabled={isSubmitting}
            className={`transition-all w-full duration-300 rounded-lg hover:bg-[#0fa0e0] disabled:bg-[##0fa0e0] border-[#00F5FF] border bg-[#10B6FC] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div
              className={`h-12 w-full flex justify-center disabled:bg-gray-500 items-center rounded-[5px] font-semibold`}
            >
			<Loading isloading={isSubmitting} label="Verify"/>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <TwoFAVerifyPage />
    </Suspense>
  );
}
