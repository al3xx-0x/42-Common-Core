/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Channel.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:28 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/08 08:11:22 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include "Server.hpp"

class Channel {
	private:
		String						channelName;
		std::map<int, Member>		members;
		String						passwd;
		size_t						max_users;
		byte						mode;
		std::map<int, Client>		invited_users;
		String						topic;
	public:
		Channel();
		Channel(String channelName);
		~Channel();
		bool 						isMember(int clientFD);
		bool						isOperator(int clientFD);
		MemberIterator 				getMember(int clientFD);
		void 						remove(int clientFD);
		void 						remove(MemberIterator member);
		std::map<int, Client>		&getInvitedUsers();
		void 						broadcast(String msg);
		void 						broadcast(Client sender, String msg);

		
		String						getMembersStr ();
		String						getChannelName();
		std::map<int, Member>		&getMembers();
		String						getPasswd();
		void						setTopic(String topic);
		byte						getMode();
		String						getTopic();
		size_t						getMaxUsers();

		void						addMember(Member member);
		void						setPasswd(String passwd);
		void						setMode(byte mode);
		void						setMaxUsers(size_t n);
};

typedef std::map<String, Channel>::iterator ChannelIterator;
