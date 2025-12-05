#pragma once
#include <poll.h>
#include "../include/String.hpp"

#define RED		"\e[31m"
#define GREEN	"\e[32m"
#define YELLOW	"\e[33m"
#define BLUE	"\e[34m"
#define DEF     "\e[0m"

#define NOTHING		0b00000000
#define FOUNDER		0b00000001
#define REGULAR		0b00001000
#define OPERATOR	0b00000010
#define KICKED		0b00000100

#define USERNAME	0b00000001
#define USRNICKNAME	0b00000010
#define CHANNELNAME	0b00000100

#define CHN_INVITEONLY		0b00000001
#define CHN_OTHER			0b00000010
#define CHN_ULIMIT			0b00000100
#define CHN_TOPICSETOPONLY	0b00001000
#define CHN_CHANKEYENABLED	0b00010000
#define CHN_CHANOPERATOR	0b00100000

#define PREFIX ":IRCServer "
#define POSTFIX "\r\n"
#define ERR_NICKNAMEINUSE(target)				PREFIX "433 " + target + " :Nickname is already in use" POSTFIX
#define ERR_USERONCHANNEL(channel, target)		PREFIX "443 " + target + " " + channel + " :is already on channel" POSTFIX
#define ERR_NEEDMOREPARAMS(command)				PREFIX "461 " + command + " :Not enough parameters" POSTFIX
#define ERR_UNKNOWNCOMMAND(command)				PREFIX "421 " + command + " :Unknown command" POSTFIX
#define ERR_CHANOPRIVSNEEDED(channel)			PREFIX "482 " + channel + " :You're not channel operator" POSTFIX
#define ERR_ERRONEUSNICKNAME(nick)				PREFIX "432 " + nick + " :Erroneus nickname" POSTFIX
#define ERR_NOTEXTTOSEND()						PREFIX "412 :No text to send" POSTFIX
#define ERR_NOSUCHCHANNEL(channel)				PREFIX "403 " + channel + " :No such channel" POSTFIX
#define ERR_NOSUCHNICK(nick)					PREFIX "401 " + nick + " :No such nick/channel" POSTFIX
#define ERR_NOTONCHANNEL(target, channel)		PREFIX "442 " + target + " " + channel + " :You're not on that channel" POSTFIX
#define ERR_USERNOTINCHANNEL(user, channel) 	PREFIX "441 " + user + " " + channel + " :They aren't on that channel" POSTFIX
#define ERR_NONICKNAMEGIVEN(target)           	PREFIX "431 " + target + " :No nickname given" POSTFIX
#define ERR_PASSWDMISMATCH(target)				PREFIX "464 " + target + ":Password incorrect" POSTFIX
#define ERR_ALREADYREGISTRED(target)			PREFIX "462 " + target + ":You may not reregister" POSTFIX
#define ERR_BADCHANNELKEY(channel)				PREFIX "475 " + channel + " :Cannot join channel (+k)" + POSTFIX

#define RPL_WELCOME(sender, msg)               		PREFIX "001 " + sender + " : " + msg + POSTFIX
#define RPL_NAMREPLY(sender, channel, users)    	PREFIX "353 " + sender + " = " + channel + " :" + users + POSTFIX
#define RPL_ENDOFNAMES(sender, channel)        		PREFIX "366 " + sender + " " + channel + " :End of /NAMES list." POSTFIX
#define RPL_JOIN(sender, channel)          			":" + sender + " JOIN :" + channel + POSTFIX
#define RPL_TOPIC(sender, channel, topic)			PREFIX " 332 " + sender + " " + channel + " :" + topic + POSTFIX
#define RPL_PRIVMSG(sender, target, msg)			":" + sender + " PRIVMSG " + target + " :" + msg + POSTFIX
#define RPL_KICK(kikker, target, channel, reason)	":" +  kikker +" KICK " + channel + " " + target + " :" + reason + POSTFIX
#define RPL_NICK(sender, nick)						":" + sender + " NICK " + nick + POSTFIX
#define RPL_PART(sender, channel, reason)			":" + sender + " PART " + channel + " :" + reason + POSTFIX
#define RPL_NOTOPIC(sender, channel)				PREFIX " 331 " + sender + " " + channel + " :No topic is set" + POSTFIX
#define RPL_NOTICE(target, channel)					PREFIX " NOTICE " + target + " :No topic is set for " + channel + POSTFIX
#define RPL_SETTINGTOPIC(sender, channel, topic)			":" + sender + " TOPIC " + channel + " :" + topic + POSTFIX
#define RPL_CHANMODE(channel, mode, args)			PREFIX "MODE " + channel + " " + mode + " " + args + POSTFIX
#define ERR_CHANNELISFULL(client, channel)			PREFIX " 471 " + client + " " + channel + " :Cannot join channel (+l)" POSTFIX
#define ERR_BADCHANMASK(channel)					PREFIX " 476 " + channel + " :Bad Channel Mask" POSTFIX
#define ERR_INVITEONLYCHAN(client, channel)			PREFIX " 473 " + client + " " + channel + " :Cannot join channel (+i)" POSTFIX
#define ERR_UNKNOWNMODE(target, mode)				PREFIX " 472 " + target + " " + mode + " :Unknown MODE flag" + POSTFIX
#define RPL_INVITE(sender, target, channel)			":" + sender + " INVITE " + target + " " + channel + POSTFIX
#define RPL_INVITING(nickname, targnick, targchan) 	PREFIX " 341 " + nickname + " " + targnick + " " + targchan + POSTFIX
#define NOTFOUND false
typedef unsigned char byte;
typedef std::vector<pollfd>::iterator PollfdIterator;
typedef std::vector<String>	vectorString;

int		getCount(String **args);
bool	isValidChannelName (String channelName);
bool	isValidUserName (String &userName);
void	displayArgs (vectorString args);
byte	c2m(char mode_char) ;
char	m2c(byte mode) ;
String	m2s(byte mode, std::vector<String> &in_args, String *out_args_holder) ;
byte	s2nm(byte origin_mode, String oldMode, vectorString &args) ;
void	limeChatLog(String response);