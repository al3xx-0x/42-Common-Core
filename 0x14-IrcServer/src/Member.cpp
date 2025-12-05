/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Member.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:26 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/05 08:00:22 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/Client.hpp"
#include "../include/Member.hpp"

Member::Member() {
	this->nickName = "";
	this->fd = -1;
	this->permissions = 0;
}
Member::Member (Client &member, byte permissions) {
	this->fd = member.fd;
	this->nickName = member.getNickName();
	this->permissions = permissions;
}
Member::~Member() {

}

int		Member::getFd() {
	return (this->fd);
}
String	Member::getNickName() {
	return (this->nickName);
}
byte	Member::getPermissions() {
	return (this->permissions);
}

void	Member::setFd(int newv) {
	this->fd = newv;
}
void	Member::setNickName(String nickName) {
	this->nickName = nickName;
}
void	Member::setPermissions(byte permissions) {
	this->permissions = permissions;
}


