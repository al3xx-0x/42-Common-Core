#include "Server.hpp"

Server *server;

void signalHandler(int) {
	if (server != NULL)
		delete server;
	exit(0);
}

int main(const int argc, char *argv[]) {
	std::stringstream strStream;
	int port;
	std::string passcode;

	if (argc != 3) {
		Server::help();
		return 1;
	}
	signal(SIGHUP, signalHandler);
	signal(SIGINT, signalHandler);
	signal(SIGQUIT, signalHandler);
	signal(SIGPIPE, signalHandler);
	signal(SIGTERM, signalHandler);
	strStream << argv[1];
	strStream >> port;

    strStream.str("");
    strStream.clear();

	strStream << argv[2];
	strStream >> passcode;
	try {
		server = new Server(port, passcode);
		server->start();
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
	delete server;
	return 0;
}



