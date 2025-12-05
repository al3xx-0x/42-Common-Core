"use client"
import { useTranslation } from "react-i18next";
import {motion as Motion} from 'framer-motion';

import Friends from "@/app/(app)/friends/friends";
import Requests from "@/app/(app)/friends/requests";
import { useEffect, useState } from "react";
import { fetchWithToken } from "@/app/Utils";
import { baseUrl } from "@/app/types";
import { User } from "@/app/types";
import { AnimatePresence } from "framer-motion";

export default function Page() {
	// const [friends, setFriends] = useState<User[]>([]);
	const [friends, setFriends] = useState<User[]>([]);
	const [requests, setRequests] = useState<User[]>([]);

	useEffect(() => {
		const fetchFriends = async () => {
			const response = await fetchWithToken(
				`${baseUrl}/api/friends`,
				{
					method: 'GET'
				}
			);
			if (response.ok) {
				const data = await response.json();
				const {friends} = data;
				setFriends(friends);
			} else {
				setFriends([]);
			}
		}
		const fetchFriendRequests = async () => {
			const response = await fetchWithToken(
				`${baseUrl}/api/friends/requests`,
				{
					method: 'GET'
				}
			);
			if (response.ok) {
				const data = await response.json();
				const {requests} = data;
				setRequests(requests);
			} else {
				setRequests([]);

			}
		}
		fetchFriends();
		fetchFriendRequests();
	}, []);
	return (
		<AnimatePresence mode="wait">
			<Motion.div
				initial={{opacity: 0, x: -50}}
				animate={{opacity: 1, x: 0}}
				exit={{opacity: 0, x: -50}}
				transition={{ duration: 0.3 }}
				className="flex pt-20"
			>
				{/* Main Content */}
				<main className="flex-1 bg-cyan-950 h-screen md:ml-20 p-4 md:p-6 flex flex-col gap-6">
					<Friends friends={friends}/>
					<Requests
						requests={requests}
						friendsSetter={setFriends}
						requestsSetter={setRequests}
					/>
				</main>
			</Motion.div>
		</AnimatePresence>
	);
}