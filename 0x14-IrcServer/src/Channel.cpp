/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Channel.cpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:26 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/08 08:12:00 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/Channel.hpp"
#include "../include/Member.hpp"
#include "../include/Server.hpp"

Channel::Channel() {
	std::cout << "channel c called : " << channelName << std::endl;
}

Channel::Channel(String channelName) {
	this->channelName = channelName;
	this->mode = 0;
	this->passwd = "";
	this->topic = "";
	this->max_users = 10;
}

Channel::~Channel() {

}

String	Channel::getMembersStr () {
	MemberIterator m_it;
	String			members = "";

	for (m_it = this->members.begin(); m_it != this->members.end(); m_it++) {
		if (m_it->second.getPermissions() & OPERATOR) {
			members = members + " @" + m_it->second.getNickName() + " ";
		} else
			members += m_it->second.getNickName() + " ";
	}
	return members;
}

String	Channel::getChannelName() {
	return (this->channelName);
}

std::map<int, Member>	&Channel::getMembers() {
	return (this->members);
}

String	Channel::getPasswd() {
	return (this->passwd);
}


byte	Channel::getMode() {
	return (this->mode);
}

std::map<int, Client>	&Channel::getInvitedUsers() {
	return (this->invited_users);
}

String	Channel::getTopic() {
	return (this->topic);
}

MemberIterator Channel::getMember(int clientFD) {
	return this->members.find(clientFD);
}

size_t		Channel::getMaxUsers() {
	return (this->max_users);
}

// SETTERS

void Channel::setTopic(String topic) {
	this->topic = topic;
}

bool Channel::isOperator(int clientFD) {
	return (getMember(clientFD)->second.getPermissions() & OPERATOR) == OPERATOR;
}

void	Channel::setPasswd(String passwd) {
	this->passwd = passwd;
}

void	Channel::setMode(byte mode) {
	this->mode = mode;
}

void	Channel::setMaxUsers(size_t maxUsers) {
	this->max_users = maxUsers;
}

// ACTIONS

void Channel::broadcast(String msg) {
	MemberIterator 	memberIterator = this->members.begin();
	for (;memberIterator != this->members.end(); memberIterator++)
	{
		send(memberIterator->second.getFd(), msg.c_str(), msg.length(), 0);
	}
}

void Channel::broadcast(Client sender, String msg) {
	MemberIterator 	memberIterator = this->members.begin();
	for (;memberIterator != this->members.end(); memberIterator++)
	{
		if (sender.fd != memberIterator->first)
			send(memberIterator->second.getFd(), msg.c_str(), msg.length(), 0);
	}
}

bool Channel::isMember(int clientFD) {
	return this->members.find(clientFD) != this->members.end();
}

void Channel::remove(MemberIterator member) {
	this->members.erase(member);
}

void Channel::remove(int clientFD) {
	this->members.erase(clientFD);

}

void Channel::addMember(Member member) {
	this->members.insert(std::make_pair(member.getFd(), member));
}
