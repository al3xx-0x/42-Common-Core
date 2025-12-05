/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Bot.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/09 14:27:51 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/10 09:52:16 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bot.hpp"
#include <exception>
#include <netinet/in.h>
#include <sstream>
#include <sys/socket.h>
#include <arpa/inet.h>

int server_fd = -1;

Bot::Bot(char *IP, String Port, String Password)
{
	int port;
	std::stringstream ss(Port);
	ss >> port;

	int botSocket = socket(AF_INET, SOCK_STREAM, 0);

	if (botSocket == -1)
		throw std::runtime_error("Socket Creation Failed!");

	sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_port = htons(port);
	serverAddress.sin_addr.s_addr = inet_addr(IP);

	if (connect(botSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) == -1) {
		close(botSocket);
		throw std::runtime_error("Connection to server failed!");
	}
	this->serverFd = botSocket;
	server_fd = botSocket;
	sendMsgToServer("PASS " + Password);
	/*
	 * Need a sleep to ensure that the server will parse NICK command because PASS cmd will take some time
	 */
	usleep(1000);
	sendMsgToServer("NICK bot");
}

void	Bot::sendMsgToServer(String msg) {
	msg += "\r\n";
	send(this->serverFd, msg.c_str(), msg.length(), 0);
}

void	Bot::listen() {
	String		welcomeMsg = ":IRCServer 001";
	String		target		= "";
	String		message;
	char		buffer[1024];
	int			bytesReceived = 0;
	while (true) {
		memset(buffer, 0, sizeof(buffer));
		bytesReceived = recv(this->serverFd, buffer, 1024, 0);
		if (bytesReceived > 0) {
			buffer[bytesReceived] = '\0';
			message = buffer;
			if (welcomeMsg == message.substr(0, 14)) {
				std::cout << message;
				continue;
			}
			target = message.substr(0, message.find(':'));
			message = message.substr(message.find(':') + 1);
			try {
				ReversePolishNotation rpn(message.c_str());
				rpn.rpn();
			} catch (std::exception &e) {
				std::string result = e.what();
				if (!message.empty() && !target.empty())
					sendMsgToServer("PRIVMSG " + target + " : " + result);
			}
		} else {
			throw std::runtime_error("Failed to receive message from server!");
		}
	}
}
