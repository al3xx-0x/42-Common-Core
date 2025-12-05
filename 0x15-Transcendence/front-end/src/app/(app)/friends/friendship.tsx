import { baseUrl } from "@/app/types";
import { FriendshipStatus } from "@/app/types";
import { fetchWithToken } from "@/app/Utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Confirmator from "../components/Confirmator";


export const ConfirmRemoveFriendRequest = ( {confirm, setConfirm, onConfirm} : {confirm: boolean, setConfirm: (val: boolean) => void, onConfirm: () => void}) => {
	return (
		<AnimatePresence>
              {confirm && (
                <Confirmator
                  title="Remove request"
                  message="Are you sure you want to remove this friend request ?"
                  onCancel={() => {
                    setConfirm(false)
                  }}
                  onConfirm={() => onConfirm()}
                />
              )}
        </AnimatePresence>
	);
}

export const ConfirmRemoveFriend = ( {confirm, setConfirm, onConfirm} : {confirm: boolean, setConfirm: (val: boolean) => void, onConfirm: () => void}) => {
	return (
		<AnimatePresence>
              {confirm && (
                <Confirmator
                  title="Remove request"
                  message="Are you sure you want to remove this friend ?"
                  onCancel={() => {
                    setConfirm(false)
                  }}
                  onConfirm={() => onConfirm()}
                />
              )}
        </AnimatePresence>
	);
}

export const removeFriendRequest = async ({id, onSuccess} : {id?: number, onSuccess?: () => void}) => {
	// useState()
	const response = await fetchWithToken(
		`${baseUrl}/api/friends/request/remove`,
		{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			friend_id: id,
		})
		}
	);
	const data = await response.json();
	if (response.ok) {
		onSuccess && onSuccess();
	}
}

export const addFriend = async ({id, onSuccess} : {id?: number, onSuccess?: () => void}) => {
	const response = await fetchWithToken(
		`${baseUrl}/api/friends/request/add`,
		{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			friend_id: id,
		})
		}
	);
	const data = await response.json();

	if (response.ok) {
		onSuccess && onSuccess();
	}
}