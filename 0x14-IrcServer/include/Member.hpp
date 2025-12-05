/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Member.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:28 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/05 07:59:31 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once
#include "../include/Utils.hpp"
#include "../include/Client.hpp"
class Member {
	private:
		int		fd;
		String	nickName;
		byte	permissions;
	public:
		Member();
		Member (Client &member, byte permissions);
		~Member();
		int		getFd();
		String	getNickName();
		byte	getPermissions();

		void		setFd(int fd);
		void		setNickName(String nickName);
		void		setPermissions(byte permissions);
};
typedef std::map<int, Member>::iterator MemberIterator;
