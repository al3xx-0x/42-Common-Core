/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Bot.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/09 11:35:57 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/10 09:36:38 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include <iostream>
#include <exception>
#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <signal.h>
#include "RPN.hpp"
#include "../include/String.hpp"

extern int server_fd;

class	Bot
{
	private:
		int	serverFd;
	public:
		Bot();
		Bot(char *IP, String Port, String Password);
		void	listen();
		void	sendMsgToServer(String msg);
};

