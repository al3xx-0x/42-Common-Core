#include "../include/Server.hpp"
#include "../include/InputParser.hpp"
#include "../include/Client.hpp"
#include "../include/Channel.hpp"
#include "../include/Utils.hpp"

Server::Server(int port, const String &passcode) {
	pollfd pfd;
	struct sockaddr_in serverAddress;
	int opt = 1;

	ServerFD = socket(AF_INET, SOCK_STREAM, 0);
	if (ServerFD == -1)
		throw std::runtime_error("Socket Creation Failed !");

	std::memset(&serverAddress, 0, sizeof(serverAddress));
	std::memset(&pfd, 0, sizeof(pfd));
	std::memset(&buffer, 0, sizeof(buffer));

	serverAddress.sin_port = htons(port);
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_addr.s_addr = INADDR_ANY;


	setsockopt(ServerFD, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
	if (bind(ServerFD, (struct sockaddr *) &serverAddress, sizeof(serverAddress)) == -1) {
		close(ServerFD);
		throw std::runtime_error("Bind Failed !");
	}

	if (listen(ServerFD, 1024) == -1) {
		close(ServerFD);
		throw std::runtime_error("Listen Failed !");
	}

	pfd.events = POLLIN;
	pfd.fd = ServerFD;
	pfds.push_back(pfd);
	this->serverPasscode = passcode;
	std::cout << "The Server has been Started..." << std::endl;
}

void Server::start() {
	int pollEvent;

	while (true) {
		pollEvent = poll(pfds.data(), pfds.size(), -1);
		if (pollEvent == -1)
			throw std::runtime_error("Poll Failed !");
		if (pfds[0].revents & POLLIN) {
			if (AcceptNewClient() != 0)
				continue;
			else
				log("New Client Connected But He Does Not Wrote The Password Yet...", BLUE);
		}
		MonitorClientMovements();
	}
}

String Server::ReceiveMsgFromClient(int ClientFD) {
	ssize_t bytes = 0;
	memset(buffer, 0, sizeof(buffer));
	bytes = recv(ClientFD, buffer, sizeof(buffer), 0);
	buffer[bytes] = '\0';
	return (buffer);
}

void Server::log(const String &msg, const String &color) {
	time_t _time = std::time(NULL);
	String currTime = std::ctime(&_time);
	if (currTime.find("\n") != String::npos)
		currTime.replace(currTime.find("\n"), 1, "\0");
	std::cout << "[" << currTime << "] " << color + msg + "\e[0m" << std::endl;
}

int Server::AcceptNewClient() {
	pollfd	pfd;
	int		clientFd;

	memset(&pfd,  0, sizeof (pfd));
	clientFd = accept(this->ServerFD, NULL, NULL);

	if (clientFd == -1)
		return 1;

	Client	client(clientFd, "", "");

	pfd.fd = clientFd;
	pfd.events = POLLIN;
	Clients[clientFd] = client;
	pfds.push_back(pfd);

	log("New Client Trying To Connect", BLUE);
	return 0;
}

bool Server::pass(Client &client, PollfdIterator &pfdIt, String response) {
	unsigned char passwdLength;

	if (client.isAccepted()) {
		client.sendMessage(ERR_ALREADYREGISTRED(client.getNickName()));
		return 1;
	}
	passwdLength = (unsigned char) (response.length() - response.contains('\n'));
	if (serverPasscode.length() ==  passwdLength && strncmp(serverPasscode.c_str(), response.c_str(), serverPasscode.length()) == 0) {
		log("New Client Connected !", GREEN);
		client.accept();
		return true;
	} else {
		log(client.getNickName() + " : Incorrect password", YELLOW);
		client.sendMessage(ERR_PASSWDMISMATCH(client.getNickName()));
		close(client.fd);
		if (!pfds.empty() && pfds.size() > 1) {
			pfdIt = pfds.erase(pfdIt);
		}
	}
	return false;
}

void Server::MonitorClientMovements() {
	String response;
	ClientIterator clientIt;
	std::vector<pollfd>::iterator it;
	String command;
	bool 	accepted;

	it = (pfds.begin() + 1);
	while (it < pfds.end()) {
		if (it->revents & POLLIN) {
			response = ReceiveMsgFromClient(it->fd).c_str();
			clientIt = getClient(it->fd);
			clientIt->second.parser.setArgs(clientIt->second.parser.getInput() + " " + response);
			if (((String)clientIt->second.parser.getInput()).contains("\n")) {
				// the input if buffered and is ready
				clientIt->second.parser.split();
				if (!clientIt->second.parser.getArgs().empty()) {
					command = clientIt->second.parser.getArgs()[0];
					accepted = clientIt->second.isAccepted();
					if (command == "PASS" && clientIt->second.parser.getArgs().size() > 1) {
						pass(clientIt->second, it, clientIt->second.parser.getArgs()[1]);
					} else if (accepted) {
						execClientCommand(clientIt->second);
					} else {
						clientIt->second.sendMessage(ERR_PASSWDMISMATCH(String("")));
						close(it->fd);
						it = pfds.erase(it);
						Clients.erase(clientIt);
					}
					if (accepted && command == "QUIT")
						continue;
					clientIt->second.clearParser();
				}
			}
			if (response.empty()) {
				log("Client Disconnected !", YELLOW);
				close(it->fd);
				pfds.erase(it);
				Clients.erase(clientIt->second.fd);
				if (pfds.size() == 1) {
					log("The Server Is Empty", RED);
					break;
				}
				return;
			} else if (clientIt->second.isAccepted()) {
				if (response.containsOnly("\n") || response.containsOnly(String::WHITESPACES)) {
					it++;
					continue;
				}
				log(clientIt->second.getUserName() + ": New command received", BLUE);
			}
		}
		it++;
	}
}

void Server::execClientCommand(Client &client) {
	vectorString userIn;
	int index = -1;

	int (Server::*executables[])(Client &c) = {
			&Server::nick, &Server::user, &Server::join,
			&Server::msg, &Server::invite, &Server::kick,
			&Server::mode, &Server::part, &Server::quit,
			&Server::topic, &Server::ping, &Server::pong,
	};
	String commands[] = {
			"NICK", "USER", "JOIN",
			"PRIVMSG", "INVITE", "KICK",
			"MODE", "PART", "QUIT",
			"TOPIC", "PING", "PONG"
	};
	try {
		userIn = client.parser.getArgs();
		for (int n = 0; n < (int) (sizeof(commands) / sizeof(String)); n++) {
			if (commands[n] == userIn[0]) {
				index = n;
				break;
			}
		}
		if (index != -1 && index < 12) {
			(this->*executables[index])(client);
		} else {
			client.sendMessage(ERR_UNKNOWNCOMMAND(userIn[0]));
		}
	} catch (std::exception &e) {
		(void)e;
	}
}

void Server::welcome_msg(Client client) {
	String str[11];
	str[0] = "                          ";
	str[1] = "          Welcome To      ";
	str[2] = "                          ";
	str[3] = "      ██╗ ██████╗  ██████╗";
	str[4] = "      ██║ ██╔══██╗██╔════╝";
	str[5] = "      ██║ ██████╔╝██║     ";
	str[6] = "      ██║ ██╔══██╗██║     ";
	str[7] = "      ██║ ██║  ██║╚██████╗";
	str[8] = "      ╚═╝ ╚═╝  ╚═╝ ╚═════╝";
	str[9] = "      Internet Relay Chat ";
	str[10] = "                          ";
	for (int n = 0; n < 11; n++) {
		client.sendMessage(RPL_WELCOME(client.getNickName(), str[n]));
	}
}

Server::~Server() {
	std::cout << "\rShutting down..." << std::endl;
	std::vector<pollfd>::iterator it;

	for (it = pfds.begin(); it != pfds.end(); it++) {
		close(it->fd);
	}
}

ClientIterator Server::getClient(int fd) {
	std::map<int, Client>::iterator it;
	for (it = this->Clients.begin(); it != this->Clients.end(); it++) {
		if (it->second.fd == fd) {
			return it;
		}
	}
	return Clients.end();
}

ClientIterator Server::getClient(String nickName) {
	std::map<int, Client>::iterator it;
	for (it = Clients.begin(); it != Clients.end(); it++) {
		if (it->second.getNickName() == nickName)
			return it;
	}
	return Clients.end();
}

int Server::nick(Client &client) {
	vectorString args;
	ClientIterator clientInfo;
	int argc;

	args = client.parser.getArgs();
	argc = args.size();

	if (argc == 1) {
		client.sendMessage(ERR_NONICKNAMEGIVEN(client.getNickName()));
		return 1;
	}

	if (client.getNickName().contains("#@&")) {
		client.sendMessage(ERR_ERRONEUSNICKNAME(args[1]));
		return 1;
	}

	if (client.getNickName() == args[1])
		return 1;

	clientInfo = getClient(args[1]);

	if (clientInfo != Clients.end()) {
		client.sendMessage(ERR_NICKNAMEINUSE(client.getNickName()));
		return 1;
	}

	if (client.isFirstLogin()) {
		client.setNickName(args[1]);
		welcome_msg(client);
	} else {
		client.sendMessage(RPL_NICK(client.getNickName(), args[1]));
		client.setNickName(args[1]);
	}
	return 0;
}

int Server::user(Client &client) {
	vectorString args;
	int count;

	args = client.getArgs();
	count = args.size();
	if (count == 1) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}
	if (client.getUserName() != "") {
		client.sendMessage(ERR_ALREADYREGISTRED(client.getNickName()));
		return 1;
	}
	if (args[1].length() > 128) {
		client.setUserName(args[1].substr(0, 127));
		return 1;
	}
	client.setUserName(args[1]);
	return 0;
}


int Server::join(Client &client) {
	vectorString args;
	ChannelIterator channel;
	String out_args = "";
	int count = 0;

	args = client.getArgs();
	count = args.size();
	if (count < 2) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}
	channel = Channels.find(args[1]);

	// <	CANNOT FOUND CHANNEL WITH THE SELECTED NAME 	>
	if (channel == this->Channels.end()) {
		if (isValidChannelName(args[1])) {
			Channel newChannel = Channel(args[1]);
			Member member = Member(client, OPERATOR | FOUNDER | REGULAR);
			newChannel.getMembers()[member.getFd()] = member;
			if (count >= 3) {
				newChannel.setPasswd(args[2]);
				newChannel.setMode(newChannel.getMode() | CHN_CHANKEYENABLED);
			}
			this->Channels.insert(std::make_pair(newChannel.getChannelName(), newChannel));
			client.sendMessage(RPL_JOIN(client.getNickName(), newChannel.getChannelName()));
			client.sendMessage(RPL_NAMREPLY(client.getNickName(), newChannel.getChannelName(), ("@" + client.getNickName())));
			client.sendMessage(RPL_ENDOFNAMES(client.getNickName(), newChannel.getChannelName()));
			if (count >= 3)
				client.sendMessage(RPL_CHANMODE(newChannel.getChannelName(), "+k", newChannel.getPasswd()));
		} else {
			client.sendMessage(ERR_BADCHANMASK(args[1]));
		}
	}
	// <	THERE CHANNEL WITH THE SELECTED NAME	>
	else {
		if ((channel->second.getMode() & CHN_CHANKEYENABLED) == CHN_CHANKEYENABLED) {
			if (count < 3 || channel->second.getPasswd() != args[2]) {
				client.sendMessage(ERR_BADCHANNELKEY(channel->second.getChannelName()));
				return 1;
			}
		}
		if ((channel->second.getMode() & CHN_INVITEONLY) == false) {
			if ((channel->second.getMode() & CHN_ULIMIT) == CHN_ULIMIT && channel->second.getMembers().size() + 1 > channel->second.getMaxUsers()) {
				client.sendMessage(ERR_CHANNELISFULL(client.getNickName(), channel->second.getChannelName()));
				return 1;
			}
			Member member(client, REGULAR);
			channel->second.getMembers().insert(std::make_pair(member.getFd(), member));
			
			channel->second.broadcast(RPL_JOIN(client.getNickName(), channel->first));
			client.sendMessage(RPL_NAMREPLY(client.getNickName(), channel->first, channel->second.getMembersStr()));
			client.sendMessage(RPL_ENDOFNAMES(client.getNickName(), channel->first));
			client.sendMessage(RPL_CHANMODE(channel->second.getChannelName(), m2s(channel->second.getMode(), args, &out_args), out_args));
		} else {
			ClientIterator invited = channel->second.getInvitedUsers().find(client.fd);

			if (invited != channel->second.getInvitedUsers().end()) {
				Member member(client, REGULAR);
				channel->second.getMembers().insert(std::make_pair(member.getFd(), member));
				channel->second.broadcast(RPL_JOIN(client.getNickName(), channel->first));
				client.sendMessage(RPL_NAMREPLY(client.getNickName(), channel->first, channel->second.getMembersStr()));
				client.sendMessage(RPL_ENDOFNAMES(client.getNickName(), channel->first));
				client.sendMessage(RPL_CHANMODE(channel->second.getChannelName(), m2s(channel->second.getMode(), args, &out_args), out_args));
			} else {
				client.sendMessage(ERR_INVITEONLYCHAN(client.getNickName(), channel->second.getChannelName()));
			}
		}
	}
	return 0;
}

int Server::msg(Client &client) {
	vectorString args;
	ClientIterator targetUser;
	ChannelIterator targetChannel;

	args = client.getArgs();
	if (args.size() < 3) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}
	targetUser = getClient(args[1]);
	targetChannel = Channels.end();
	if (targetUser == Clients.end()) {
		targetChannel = Channels.find(args[1]);
		if (targetChannel == Channels.end()) {
			client.sendMessage(ERR_NOSUCHNICK(client.getNickName()));
			return 1;
		}
	}

	if (targetChannel != Channels.end()) {
		if (!targetChannel->second.isMember(client.fd)) {
			client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), targetChannel->first));
			return 1;
		}
		targetChannel->second.broadcast(client, RPL_PRIVMSG(client.getNickName(), targetChannel->first, args[2]));
		return 0;
	}

	if (targetUser != Clients.end()) {
		if (targetUser->second.getNickName() == "bot") {
			targetUser->second.sendMessage(client.nickName + ":" + args[2]);
			return 0;
		}
		targetUser->second.sendMessage(RPL_PRIVMSG(client.getNickName(), targetUser->second.getNickName(), args[2]));
		return 0;
	}
	return 1;
}

int Server::invite(Client &client) {
	ChannelIterator channel;
	MemberIterator currentClient;
	ClientIterator toInvite;
	vectorString args;

	args = client.parser.getArgs();
	if (args.size() < 3) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}
	channel = Channels.find(args[2]);
	if (channel == Channels.end()) {
		client.sendMessage(ERR_NOSUCHCHANNEL(args[1]));
		return 1;
	}
	currentClient = channel->second.getMember(client.fd);
	if (currentClient == channel->second.getMembers().end()) {
		client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), channel->second.getChannelName()));
		return 1;
	}

	if (!channel->second.isOperator(client.fd)) {
		client.sendMessage(ERR_CHANOPRIVSNEEDED(channel->second.getChannelName()));
		return 1;
	}

	toInvite = getClient(args[1]);
	if (toInvite == Clients.end()) {
		// user !found OR !exists
		client.sendMessage(ERR_NOSUCHNICK(args[1]));
		return 1;
	}
	if (channel->second.isMember(toInvite->second.fd)) {
		client.sendMessage(ERR_USERONCHANNEL(toInvite->second.getNickName(), args[1]));
		return 1;
	}

	channel->second.getInvitedUsers().insert(std::make_pair(toInvite->first, toInvite->second));

	client.sendMessage(RPL_INVITING(client.getNickName(), args[1], args[2]));
	toInvite->second.sendMessage(RPL_INVITE(client.getNickName(), args[1], channel->second.getChannelName()));
	return 0;
}

int Server::kick(Client &client) {
	ChannelIterator channel;
	MemberIterator clientMember;
	MemberIterator toKick;
	vectorString args;

	args = client.getArgs();
	channel = Channels.find(args[1]);

	if (channel == Channels.end()) {
		client.sendMessage(ERR_NOSUCHCHANNEL(args[1]));
		return 1;
	}
	clientMember = channel->second.getMember(client.fd);

	if (!channel->second.isMember(client.fd)) {
		client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), channel->first));
		return 1;
	}

	if ((clientMember->second.getPermissions() & OPERATOR) != OPERATOR) {
		client.sendMessage(ERR_CHANOPRIVSNEEDED(channel->second.getChannelName()));
		return 1;
	}

	ClientIterator targetInfo = getClient(args[2]);
	if (targetInfo == Clients.end()) {
		client.sendMessage(ERR_NOSUCHNICK(args[2]));
		return 1;
	}
	toKick = channel->second.getMember(targetInfo->second.fd);
	if (toKick == channel->second.getMembers().end()) {
		client.sendMessage(ERR_USERNOTINCHANNEL(targetInfo->second.getNickName(), channel->first));
		return 1;
	}

	if (args.size() > 3)
		channel->second.broadcast(
				RPL_KICK(client.getNickName(), toKick->second.getNickName(), channel->second.getChannelName(),
						 args[3]));
	else
		channel->second.broadcast(
				RPL_KICK(client.getNickName(), toKick->second.getNickName(), channel->second.getChannelName(), ""));
	channel->second.remove(toKick);
	return 0;
}

int Server::mode(Client &client) {
	vectorString args;
	ChannelIterator channel;
	MemberIterator member;
	std::stringstream ss;

	args = client.getArgs();

	if (args.size() < 3) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}

	channel = Channels.find(args[1]);
	if (channel == Channels.end()) {
		client.sendMessage(ERR_NOSUCHCHANNEL(args[1]));
		return 1;
	}
	
	member = channel->second.getMember(client.fd);
	if (member == channel->second.getMembers().end()) {
		// you are not memeber in this channel
		client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), channel->second.getChannelName()));
		return 1;
	}

	if (!channel->second.isOperator(member->second.getFd())) {
		client.sendMessage(ERR_CHANOPRIVSNEEDED(channel->second.getChannelName()));
		return 1;
	}
	
	byte mode = s2nm(channel->second.getMode(), args[2], args);
	channel->second.setMode(mode);
	String out_args = "";
	for (size_t i = 3; i < args.size(); i++) {
		out_args += " " + args[i];
	}
	channel->second.broadcast(RPL_CHANMODE(channel->second.getChannelName(), args[2], out_args));
	byte action = '\0';
	int arg = 3;
	for (int i = 0; i < args[2][i]; i++) {
		if (strchr("+-", args[2][i]))
			action = args[2][i];
		else {
			byte to_apply = c2m(args[2][i]);
			if (to_apply == 0) {
				client.sendMessage(ERR_UNKNOWNMODE(client.getNickName(), args[2][i]));
				continue ;
			}
			if (action == '-') {
				if (args[2][i] == 'o') {
					ClientIterator targetClient = getClient(args[arg]);
					if (targetClient == Clients.end()) {
						client.sendMessage(ERR_NOSUCHNICK(args[arg]));
					}else {
						MemberIterator target = channel->second.getMember(targetClient->second.fd);
						if (channel->second.isMember(target->second.getFd())) {
							member->second.setPermissions(member->second.getPermissions() & (~OPERATOR));
						} else {
							client.sendMessage(ERR_USERNOTINCHANNEL(target->second.getNickName(), channel->second.getChannelName()));
						}
					}
					arg++;
				} else
					Channels[args[1]].setMode(Channels[args[1]].getMode() & (~to_apply));
			}
			if (action == '+') {
				Channels[args[1]].setMode(Channels[args[1]].getMode() | to_apply);
				if (args[2][i] == 'o') {
					ClientIterator targetClient = getClient(args[arg]);
					if (targetClient == Clients.end()) {
						client.sendMessage(ERR_NOSUCHNICK(args[arg]));
					} else {
						MemberIterator target = channel->second.getMember(targetClient->second.fd);
						if (channel->second.isMember(target->second.getFd())) {
							target->second.setPermissions(target->second.getPermissions() | OPERATOR);
						} else {
							client.sendMessage(ERR_USERNOTINCHANNEL(target->second.getNickName(), channel->second.getChannelName()));
						}
					}
					arg++;
				} else if ((to_apply == CHN_CHANKEYENABLED || to_apply == CHN_ULIMIT) && arg < (int) args.size()) {
					if (to_apply == CHN_CHANKEYENABLED)
						channel->second.setPasswd(args[arg]);
					else
						channel->second.setMaxUsers(atoi(args[arg].c_str()));
					arg++;
				}
			}
		}
	}
	return 0;
}

int Server::part(Client &client) {
	vectorString args;
	MemberIterator memberIterator;
	ChannelIterator channel;

	args = client.getArgs();
	channel = this->Channels.find(args[1]);
	if (channel == this->Channels.end()) {
		client.sendMessage(ERR_NOSUCHCHANNEL(args[1]));
		return 1;
	}
	memberIterator = channel->second.getMember(client.fd);
	if (memberIterator == channel->second.getMembers().end()) {
		client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), channel->second.getChannelName()));
		return 1;
	}
	channel->second.broadcast(RPL_PART(client.getNickName(), channel->second.getChannelName(), ((args.size() == 3) ? args[2] : "")));
	channel->second.remove(memberIterator);
	if (channel->second.getMembers().size() == 0)
		Channels.erase(channel);
	return 0;
}

int Server::quit(Client &client) {
	vectorString	args;
	ClientIterator	clientIt;
	ChannelIterator chanI;

	args = client.getArgs();
	client.sendMessage(":" + client.getNickName() + " QUIT :" + (args.size() == 2 ? args[1] : "") + POSTFIX);

	for (chanI = Channels.begin(); chanI != Channels.end(); chanI++) {
		for (clientIt = chanI->second.getInvitedUsers().begin(); clientIt != chanI->second.getInvitedUsers().end(); clientIt++) {
			if (clientIt->first == client.fd) {
				chanI->second.getInvitedUsers().erase(clientIt);
			}
		}
		if (chanI->second.isMember(client.fd)) {
			chanI->second.remove(client.fd);
		}
	}
	client.resetFirstLogin();
	close(client.fd);
	Clients.erase(client.fd);
	return 0;
}

int Server::topic(Client &client) {
	vectorString	args;
	int				argc;

	args = client.parser.getArgs();
	argc = args.size();

	if (argc < 2) {
		client.sendMessage(ERR_NEEDMOREPARAMS(args[0]));
		return 1;
	}

	ChannelIterator channel = this->Channels.find(args[1]);

	if (channel == Channels.end()) {
		client.sendMessage(ERR_NOSUCHCHANNEL(args[1]));
		return 1;
	}

	if (!channel->second.isMember(client.fd)) {
		client.sendMessage(ERR_NOTONCHANNEL(client.getNickName(), args[1]));
		return 1;
	}

	if (argc == 2) {
		if (channel->second.getTopic().empty()) {
			client.sendMessage(RPL_NOTOPIC(client.getNickName(), channel->second.getChannelName()));
		} else {
			client.sendMessage(RPL_TOPIC(client.getNickName(), channel->second.getChannelName(), channel->second.getTopic()));
		}
		return 0;
	}

	if (!channel->second.isOperator(client.fd)) {
		client.sendMessage(ERR_CHANOPRIVSNEEDED(channel->second.getChannelName()));
		return 1;
	}

	channel->second.broadcast(RPL_SETTINGTOPIC(client.getNickName(), channel->second.getChannelName(), args[2]));
	channel->second.setTopic(args[2]);
	return 0;
}

int Server::ping(Client &client) {
	client.sendMessage("PONG IRCServer");
	return 0;
}

int Server::pong(Client &client) {
	(void) client;
	return 0;
}

void Server::help() {
	std::cout << "Usage: ./ircserv <port> <password>" << std::endl;
}

