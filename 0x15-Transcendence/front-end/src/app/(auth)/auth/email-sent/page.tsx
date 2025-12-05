"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Mail, MailCheck } from "lucide-react";
import Loading from "@/app/(app)/components/Loading";
import { baseUrl } from "@/app/types";
const DURATION = 0.2;

function EmailSentPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;
    setEmail(email);
  }, []);

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
          toast({
              title: 'Recovery Email Sent',
              description: 'Please check your email for the password reset link.'
          });
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
            <MailCheck className="text-[#10B6FC]" size={64} />
            <h1 className="text-3xl font-semibold text-center">
              Check Your Email
            </h1>
            <h3 className="text-xl font-normal text-center text-gray-200">
              We've sent a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <EmailSentPage />
    </Suspense>
  );
}
