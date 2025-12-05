'use client'
import Image from "next/image";
import {CornerDecoration, Pos} from "@/app/Utils";
import {BiHide, BiShow} from "react-icons/bi";
import React, {useEffect, useState, Suspense} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Loader} from "lucide-react";
import {baseUrl} from "@/app/types";

const DURATION = 0.2

// Validation schemas
const signInSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const signUpSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    userName: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
});

async function continueWithGoogle() {
    try {
        window.location.href = `${baseUrl}/api/login/google`;
    } catch (e) {
    }
}

function AuthPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const [signUp, setSignUp] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginWithGoogle, setLoginWithGoogle] = useState(false);

    const gradient = "bg-gradient-to-r from-[#188C71] to-[#10B6FC]"

    const router = useRouter();

    useEffect(() => {
        if (mode === "sign-up")
            setSignUp(true);
        else
            setSignUp(false);
    }, []);

    const initialValues = {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
        try {
            if (signUp) {
                const response = await fetch(`${baseUrl}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: values.firstName,
                        last_name: values.lastName,
                        name: values.firstName,
                        username: values.userName,
                        email: values.email,
                        password: values.password,
                        confirm_password: values.confirmPassword
                    })
                });

                const data = await response.json();

                switch (response.status) {
                    case 400:
                        setFieldError('confirmPassword', 'Password and confirm password do not match');
                        toast({ description: 'Password and confirm password do not match', className: 'bg-red-500 text-white border-none' });
                        break;
                    case 200:
                        const {redirectTo} = data;
                        toast({ description: 'Account created successfully! Please verify your email.', className: 'bg-green-500 text-white border-none' });
                        window.location.href = redirectTo;
                        break;
                    case 409:
                        toast({ description: 'Email or username already exists', className: 'bg-red-500 text-white border-none' });
                        break;
                    default:
                        toast({ description: 'An error occurred during registration', className: 'bg-red-500 text-white border-none' });
                }
            } else {
                console.log('Signing in with', values);
                // Sign in logic here - you can implement this similarly
                const response = await fetch(`${baseUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify ({
                        email: values.email,
                        password: values.password,
                    }),
                    credentials: "include",
                });
                const data = await response.json();
                console.log(data);
                switch (response.status) {
                    case 403:
                        toast({ title: 'Email Verification Code Sent.', description: data.message, className: 'bg-green-500 text-white border-none' });
                        router.push(`/auth/email/verify?email=${values.email}`);
                        break;
                    case 201:
                        toast({ title: 'OTP Code Sent.', description: data.message, className: 'bg-green-500 text-white border-none' });
                        const { redirectTo } = data;
                        window.location.href = redirectTo;
                        break;
                    case 200:
                        localStorage.setItem('accessToken', data.token)
                        toast({ description: data.message, className: 'bg-green-500 text-white border-none' });
                        router.replace('/Home');
                        break;
                    case 400:
                        setFieldError('password', 'Wrong password');
                        break;
                    case 404:
                        setFieldError('email', "Email not found, please sign up first");
                        setSignUp(true);
                        break;
                    case 409:
                        toast({ description: data.error, className: 'bg-red-500 text-white border-none' });
                        break;
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast({ description: 'Network error occurred', className: 'bg-red-500 text-white border-none' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-4 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 w-full flex justify-center items-center transition-all duration-500">
            <div className='bg-gradient-to-r w-full min-w-[320px] max-w-2xl  p-[3px] rounded-2xl'>
                <div className={`relative card-hover-effect backdrop-blur bg-[#081C29] min-w-[320px] gap-4 flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl p-10`}>
                    <div className="w-full h-full">
                    </div>

                    <motion.h1
                        key={signUp ? "signup" : "signin"}
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DURATION }}
                        exit={{ opacity: 0, x: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center"
                    >
                        {signUp ? "SIGN UP" : "SIGN IN"}
                    </motion.h1>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={signUp ? signUpSchema : signInSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, errors, touched , values}) => (
                            <Form className='w-full flex flex-col gap-10'>
                                <AnimatePresence>
                                    {signUp && (
                                        <motion.div
                                            initial={{opacity: 0, height: 0}}
                                            animate={{opacity: 1, height: 'auto'}}
                                            transition={{duration: DURATION}}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="w-full flex gap-5"
                                        >
                                            <div className="flex flex-col gap-2 w-full">
                                                <label>First name</label>
                                                <Field
                                                    type='text'
                                                    name="firstName"
                                                    autoComplete="name"
                                                    className="w-full px-4 py-2 h-12 bg-[#0F1725] border rounded-[5px] focus:border-[#10B6FC] focus:outline-none"
                                                />
                                                <ErrorMessage name="firstName" component="div" className="text-red-400 text-sm" />
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <label>Last name</label>
                                                <Field
                                                    type='text'
                                                    name="lastName"
                                                    autoComplete="name"
                                                    className="w-full px-4 py-2 h-12 bg-[#0F1725] border focus:border-[#10B6FC] rounded-[5px] focus:outline-none"
                                                />
                                                <ErrorMessage name="lastName" component="div" className="text-red-400 text-sm" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {
                                    signUp && (
                                        <div className="flex flex-col gap-2 w-full">
                                                <label>Username</label>
                                                <Field
                                                    type='text'
                                                    name="userName"
                                                    autoComplete="username"
                                                    className="w-full px-4 py-2 h-12 bg-[#0F1725] border focus:border-[#10B6FC] rounded-[5px] focus:outline-none"
                                                />
                                                <ErrorMessage name="userName" component="div" className="text-red-400 text-sm" />
                                            </div>
                                    )
                                }
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label htmlFor="email">Email</label>
                                        <Field
                                            type='email'
                                            name="email"
                                            className="w-full px-4 py-2 h-12 bg-[#0F1725] border rounded-[5px] focus:border-[#10B6FC] focus:outline-none"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-400 text-sm" />
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label htmlFor="password">Password</label>
                                        <div className='relative items-center'>
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                className="w-full px-4  py-2 h-12 bg-[#0F1725] border rounded-[5px] focus:border-[#10B6FC] focus:outline-none"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl"
                                            >
                                                {showPassword ? <BiShow/> : <BiHide/>}
                                            </span>
                                        </div>
                                        <ErrorMessage name="password" component="div" className="text-red-400 text-sm" />
                                        {
                                            signUp === false &&
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{opacity: 0}}
                                                    animate={{opacity: 1}}
                                                    exit={{opacity: 0}}
                                                    className='flex justify-end'>
                                                    <button
                                                        disabled={emailSent}
                                                        onClick={async () => {
                                                            sessionStorage.setItem('email', values.email);
                                                            router.push('/auth/forgot-password');
                                                        }}
                                                        type="button"
                                                        className="
                                                            rounded-full px-2 py-1 transition-all duration-300
                                                            enabled:text-cyan-500 enabled:hover:bg-[#10B6FC]/10 enabled:cursor-pointer
                                                            disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50
                                                        "
                                                    >
                                                        Forgot password ?
                                                    </button>
                                                </motion.div>
                                            </AnimatePresence>
                                        }
                                    </div>

                                    <AnimatePresence>
                                        {signUp && (
                                            <motion.div
                                                initial={{opacity: 0, height: 0}}
                                                animate={{opacity: 1, height: 'auto'}}
                                                transition={{duration: DURATION}}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label htmlFor="confirmPassword">Confirm password</label>
                                                    <div className='relative items-center'>
                                                        <Field
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="confirmPassword"
                                                            className={`w-full px-4 py-2 h-12 bg-[#081C29] border rounded-[5px] focus:outline-none focus:border-[#10B6FC]`}
                                                        />
                                                        <span
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl"
                                                        >
                                                            {showConfirmPassword ? <BiShow/> : <BiHide/>}
                                                        </span>
                                                    </div>
                                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className={`transition-all duration-300 rounded-lg hover:bg-cyan-700 disabled:bg-[##0fa0e0] border-[#00F5FF] border bg-cyan-800 text-cyan-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div
                                        className={`h-12 w-full flex justify-center disabled:bg-gray-500 items-center rounded-[5px] font-semibold`}
                                    >
                                        {isSubmitting ? <Loader className='animate-spin'/> : (signUp ? "Sign up" : "Sign in")}
                                    </div>
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="flex items-center gap-4 my-6 w-full">
                        <div className={`flex-grow h-[1px] ${gradient}`}></div>
                        <span className="text-white text-sm">OR</span>
                        <div className={`flex-grow h-[1px] ${gradient}`}></div>
                    </div>

                    <div className='flex z-10 flex-col w-full gap-2'>
                        <button
                            disabled={loginWithGoogle}
                            onClick={async () => {
                                setLoginWithGoogle(true);
                                try {
                                    continueWithGoogle();
                                } catch (e) {

                                } finally {
                                    setLoginWithGoogle(false);
                                }

                            }}
                            className='flex h-12 cursor-pointer justify-center items-center  p-2 rounded-[5px] w-full border border-[#00F5FF] bg-cyan-50 hover:bg-cyan-100 disabled:bg-transparent hover:opacity-70 transition-all duration-200'
                        >
                            {
                                loginWithGoogle ? <Loader className='animate-spin'/> :
                                <div className='flex items-center gap-5 justify-center'>
                                    <Image
                                        src='/google.webp'
                                        alt='Method'
                                        width={26}
                                        height={26}
                                    />
                                    <span className='text-cyan-700'>Continue with Google</span>
                                </div>
                            }
                        </button>
                    </div>


                    <h2 className="underline z-20 font-semibold text-center">
                        {!signUp ? "You dont" : "Do"} have an account ?
                        <span
                            onClick={() => {
                                setSignUp(!signUp)
                                window.history.pushState({}, '', `?mode=${signUp ? "sign-in" : "sign-up"}`);
                            }}
                            className="font-bold cursor-pointer text-[#10B6FC] ml-1"
                        >
                            {!signUp ? "Sign up" : "Sign in"}
                        </span>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default function page() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <AuthPage />
        </Suspense>
    );
}

