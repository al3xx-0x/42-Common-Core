"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import Loading from "@/app/(app)/components/Loading";
import { baseUrl } from "@/app/types";
const DURATION = 0.2;

function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;
    setEmail(email);
    return () => {
      sessionStorage.clear();
    }
  }, []);


  const router = useRouter();
  async function sendResetLink() {
    if (!email) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "Email required, please relaod the page or try again later.",
      });
      return;
    }
    try {
      setSubmitting(true);
      const response = await fetch (
          `${baseUrl}/api/auth/forgot-password`,
          {
              method: 'POST',
              headers: {
                  'Content-Type' : 'application/json'
              },
              body: JSON.stringify({
                  email: email
              })
          }
      );
      if (response.ok) {
        router.replace('/auth/email-sent');
      } else {
        throw new Error("Failed to send reset link");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while sending rest link.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:px-8 md:px-16 lg:px-32 bg-[url(/images/backgound.png)]  bg-cover bg-center  xl:px-64 w-full flex justify-center items-center transition-all duration-500">
      <div className="bg-gradient-to-r w-full min-w-[320px] max-w-2xl  p-[3px] rounded-2xl">
        <div
          className={`relative  gap-y-8 card-hover-effect backdrop-blur bg-[#081C29] min-w-[320px] gap-4 flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl p-10`}
        >
          <div className="flex flex-col gap-4 items-center">
            <Mail className="" size={64} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center">
              Forgot Password
            </h1>
            <h3 className="text-xl font-normal text-center text-gray-200">
              Enter your email address below and we’ll send you a link to reset
              your password.
            </h3>
          </div>
          <input
            className="w-full px-2 mx-2 h-12 text-start border bg-[#081C29]/60 border-[#00F5FF] rounded text-lg"
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendResetLink}
            disabled={isSubmitting}
            className={`transition-all w-full duration-300 rounded-lg hover:bg-[#0fa0e0] disabled:bg-[##0fa0e0] border-[#00F5FF] border bg-[#10B6FC] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div
              className={`h-12 w-full flex justify-center disabled:bg-gray-500 items-center rounded-[5px] font-semibold`}
            >
              <Loading isloading={isSubmitting} label="Send Reset Link" />
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
      <ForgotPasswordPage />
    </Suspense>
  );
}
