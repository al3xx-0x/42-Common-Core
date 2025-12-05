/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Client.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:28 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/09 10:51:09 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

// #include "Server.hpp"
#include "../include/InputParser.hpp"
#include "String.hpp"
#include <iostream>
#include <sys/socket.h>
#include <map>

class Channel;

class Client {
	private:
		bool					accepted;
		bool 					firstLogin;
	public:
		InputParser				parser;
		std::string				userName;
		String					nickName;
		int						fd;
		Client();
		Client(int fd, std::string userName, std::string nickName);
		~Client();
		std::string				getUserName();
		String					getNickName();
		bool					isAccepted();
		InputParser				&getParser();
		bool 					isFirstLogin();
		std::vector<String> 	getArgs();
		void					setUserName(std::string username);
		void					setNickName(String nickname);
		void					accept();
		void					resetFirstLogin();
		void 					clearParser();
		void 					sendMessage(String msg);
};

typedef std::map<int, Client>::iterator ClientIterator;
