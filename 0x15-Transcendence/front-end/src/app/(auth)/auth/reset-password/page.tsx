'use client'
import {BiHide, BiShow} from "react-icons/bi";
import React, {useEffect, useState, Suspense} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Loader} from "lucide-react";
import { baseUrl } from "@/app/types";

const DURATION = 0.2

function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const route = useRouter();

    // Validation schema for reset password
    const resetPasswordSchema = Yup.object({
        new_password: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('new_password')], 'Passwords must match')
            .required('Please confirm your password'),
    });

    async function handleResetPassword(values: { new_password: string, confirm_password: string }, { setSubmitting }: any) {
        try {
            const response = await fetch(
                `${baseUrl}/api/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        new_password: values.new_password,
                        confirm_password: values.confirm_password,
                        token: searchParams.get("token")
                    }),
                }
            );
            if (response.ok) {
                toast({ title: 'Password reset successful', description: 'You can now log in with your new password.' });
                route.replace('/auth?mode=sign-in');
            } else {
                const data = await response.json();
                toast({ title: 'Error', description: (data.error || 'Failed to reset password'), variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="min-h-screen py-4 px-4 sm:px-8 md:px-16 lg:px-32 bg-[url(/images/backgound.png)]  bg-cover bg-center  xl:px-64 w-full flex justify-center items-center transition-all duration-500">
            <div className='bg-gradient-to-r w-full min-w-[320px] max-w-2xl  p-[3px] rounded-2xl'>
                <div className={`relative card-hover-effect backdrop-blur bg-[#081C29] min-w-[320px] gap-4 flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl p-10`}>
                    <div className="w-full h-full">
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DURATION }}
                        exit={{ opacity: 0, x: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center"
                    >
                        Reset password
                    </motion.h1>

                    <Formik
                        initialValues={{ new_password: '', confirm_password: '' }}
                        validationSchema={resetPasswordSchema}
                        onSubmit={handleResetPassword}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className='w-full flex flex-col gap-10'>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label htmlFor="new_password">New password</label>
                                        <div className='relative items-center'>
                                            <Field
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="new_password"
                                                className="w-full px-4 py-2 h-12 bg-[#0F1725]/70 border rounded-[5px] focus:border-[#10B6FC] focus:outline-none"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl"
                                            >
                                                {showNewPassword ? <BiShow/> : <BiHide/>}
                                            </span>
                                        </div>
                                        <ErrorMessage name="new_password" component="div" className="text-red-400 text-sm" />
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label htmlFor="confirm_password">Confirm password</label>
                                        <div className='relative items-center'>
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirm_password"
                                                className="w-full px-4 py-2 h-12 bg-[#0F1725]/70 border rounded-[5px] focus:border-[#10B6FC] focus:outline-none"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl"
                                            >
                                                {showConfirmPassword ? <BiShow/> : <BiHide/>}
                                            </span>
                                        </div>
                                        <ErrorMessage name="confirm_password" component="div" className="text-red-400 text-sm" />
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className={`transition-all duration-300 rounded-lg hover:bg-[#0fa0e0] disabled:bg-[##0fa0e0] border-[#00F5FF] border bg-[#10B6FC] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div
                                        className={`h-12 w-full flex justify-center disabled:bg-gray-500 items-center rounded-[5px] font-semibold`}
                                    >
                                        {isSubmitting ? <Loader className='animate-spin'/> : "Reset password"}
                                    </div>
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default function page() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
