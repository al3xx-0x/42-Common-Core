/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Client.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:26 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/09 15:27:51 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/Client.hpp"

Client::Client() {
	this->fd = -1;
	this->userName = "";
	this->nickName = "";
	this->accepted = false;
	this->firstLogin = true;
}

Client::Client(int fd, std::string userName, std::string nickName) {
	this->fd = fd;
	this->userName = userName;
	this->nickName = nickName;
	this->accepted = false;
	this->firstLogin = true;
}

Client::~Client() {

}

std::string	Client::getUserName() {
	return (this->userName);
}

String	Client::getNickName() {
	return (this->nickName);
}

bool	Client::isAccepted() {
	return (this->accepted);
}

InputParser	&Client::getParser() {
	return (this->parser);
}

bool	Client::isFirstLogin() {
	bool val = firstLogin;
	if (firstLogin)
		firstLogin = false;
	return val;
}

void	Client::setUserName(std::string username) {
	this->userName = username;
}

void	Client::setNickName(String nickname) {
	this->nickName = nickname;
}

void	Client::accept() {
	this->accepted = true;
}

void 	Client::resetFirstLogin() {
	this->firstLogin = true;
	this->accepted = false;
}

void Client::clearParser() {
	this->parser.getArgs().clear();
}

void Client::sendMessage(String msg) {
	send(this->fd,  msg.c_str(), msg.length(), 0);
}

std::vector<String> Client::getArgs() {
	return this->parser.getArgs();
}


