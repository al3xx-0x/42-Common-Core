/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/09 11:40:39 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/10 09:41:19 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bot.hpp"

void	_sendMsgToServer(String msg) {
	msg += "\r\n";
	send(server_fd, msg.c_str(), msg.length(), 0);
	close(server_fd);
	exit(0);
}

void	signalHandler(int) {
	_sendMsgToServer("QUIT");
	exit (0);
}

int	main(int ac, char **av)
{
	signal(SIGHUP, signalHandler);
	signal(SIGINT, signalHandler);
	signal(SIGQUIT, signalHandler);
	signal(SIGPIPE, signalHandler);
	signal(SIGTERM, signalHandler);

	if (ac == 4)
	{
		try {
			Bot bot(av[1], av[2], av[3]);
			bot.listen();
		} catch (std::exception &e) {
			std::cerr << e.what() << std::endl;
		}
	}
	else {
		std::cerr << "The program take IP, Port and Password of Server" << std::endl;
	}
}