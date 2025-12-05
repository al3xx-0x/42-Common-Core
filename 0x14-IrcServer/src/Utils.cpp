#include "../include/Server.hpp"
#include "../include/Channel.hpp"


bool isValidChannelName (String channelName) {
	int n = 2;

	if (channelName[0] != '#')
		return false;
	if (channelName[1] == '\0')
		return false;
	if (strchr(String::WHITESPACES, channelName[1]))
		return false;
	while (channelName[n] != '\0') {
		if (isprint(channelName[n]) == false)
			return false;
		if (isalnum(channelName[n]) == false && strchr("-_", channelName[n]) == NULL) {
			return false;
		}
		n++;

	}
	return true;
}


void	displayArgs (vectorString args) {
	int n = 0;
	for (vectorString::iterator it = args.begin(); it != args.end() ; it++) {
		std::cout << "[" << n << "]" << "[" << it->c_str() << "]" << std::endl;
		n++;
	}
	std::cout << "[TOTAL] : [" << n << "]" << std::endl;
}

byte c2m(char mode_char) {
	switch (mode_char) {
		case 'i':
			return CHN_INVITEONLY;
		case 't':
			return CHN_TOPICSETOPONLY;
		case 'k':
			return CHN_CHANKEYENABLED;
		case 'o':
			return CHN_OTHER;
		case 'l':
			return CHN_ULIMIT;
		default:
			// error , highly recommended to use throw and catchiii dak lerror
			return (0);
	}
	return (0);
}

char m2c(byte mode) {
	switch (mode) {
		case CHN_INVITEONLY:
			return 'i';
		case CHN_TOPICSETOPONLY:
			return 't';
		case CHN_CHANKEYENABLED:
			return 'k';
		case CHN_OTHER:
			return 'o';
		case CHN_ULIMIT:
			return 'l';
		default:
			// error , highly recommanded to use throw and catchiii dak lerror
			return (-1);
	}
}

String m2s(byte mode, std::vector<String> &in_args, String *out_args_holder) {
	(void)in_args;
	(void)mode;
	String res = "+";
	byte _chnmodes[6] = {
		0b00000001,
		0b00000010,
		0b00000100,
		0b00001000,
		0b00010000,
		0b00100000
	};

	int j = 2;
	for (int i = 0; i < 6; i++) {
		if ((mode & _chnmodes[i]) == _chnmodes[i]) {
			char m = m2c(_chnmodes[i]);
			res.append(1, m);
			if (m == 'k') {
				*out_args_holder += " ";
				*out_args_holder += in_args[j];
				j++;
			}
		}
	}
	return res;
}

byte s2nm(byte origin_mode, String oldMode, vectorString &args) {
	(void)args;
	byte newMode = origin_mode;
	enum {NONE, ADD, REMOVE} action;

	for (String::iterator modeStringIterator = oldMode.begin(); modeStringIterator < oldMode.end(); modeStringIterator++) {
		if (*modeStringIterator == '+') {
			action = ADD;
		}else if (*modeStringIterator == '-') {
			action = REMOVE;
		}else {
			byte mode = c2m(*modeStringIterator);
			// check if the m is valid , read src code of c2m func to know it..

			if (action == ADD)
				newMode |= mode;
			else if (action == REMOVE)
				newMode &= (~mode);
			else
				// error
				throw std::runtime_error("error the mode is not valid!");
		}
	}
	return newMode;
}

void	limeChatLog(String response) {
	char *s = (char *) response.c_str();
	if (strchr(s, '\r'))
		*((char *) strchr(s, '\r')) = '\0';
	std::cout << "lime chat : [" << s << "]" << std::endl;
}