#pragma once

#include <sys/socket.h>
#include <poll.h>
#include <unistd.h>
#include <exception>
#include <cstring>
#include <netinet/in.h>
#include <vector>
#include <sstream>
#include <map>
#include "String.hpp"
#include "../include/Utils.hpp"
#include "../include/InputParser.hpp"
#include "../include/Client.hpp"
#include "../include/Member.hpp"

class	Server
{
	private:
		int							ServerFD;
		std::map<int, Client>		Clients;
		std::vector<pollfd>			pfds;
		char						buffer[1024];
		String						serverPasscode;
		static void					log(const String &msg, const String &color);
		int							AcceptNewClient();
		void 						welcome_msg(Client client);
		std::map<String, Channel>		Channels;
        String		ReceiveMsgFromClient(int ClientFD);
		void		MonitorClientMovements();
		void        execClientCommand(Client &client);
		int 		nick (Client &client);
		int 		user (Client &client);
		int 		join (Client &client);
		int 		msg (Client &client);
		int 		invite (Client &client);
		int 		kick (Client &client);
		int 		mode (Client &client);
		int 		part (Client &client);
		int 		quit (Client &client);
		int 		topic (Client &client);
		int 		ping (Client &client);
		int			pong(Client &client);
		bool 		pass (Client &client, PollfdIterator &pfdIt, String response);
	public:
		Server (int port, const String &passcode);
    	void	start();
    	static	void	help();
		~Server();
		ClientIterator getClient(int fd);
		ClientIterator getClient(String nickName);
};
