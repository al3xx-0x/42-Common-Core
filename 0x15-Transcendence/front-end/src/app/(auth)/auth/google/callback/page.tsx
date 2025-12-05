'use client'
import { Loader } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from 'react'

function GoogleCallbackHelpper() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const handleCallback = async () => {
			const accessToken = searchParams.get('token');
			if (!accessToken) return;
			localStorage.setItem('accessToken', accessToken);
			router.replace('/Home');
		};
		handleCallback();
	}, [searchParams, router]);

	return (
		<div className="flex flex-col gap-2 text-xl items-center text-cyan-500 justify-center bg-cyan-950 h-screen ">
			<Loader size={32} className="animate-spin"/>
			<span>Please wait</span>
		</div>
	);
}

export default function GoogleCallback() {
	return (
		<Suspense>
			<GoogleCallbackHelpper />
		</Suspense>
	);
}

