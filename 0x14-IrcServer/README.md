# IrcServer

fully functional **internet relay chat (irc)** server in c++98, handling multiple clients simultaneously with channels, private messaging, and operator commands.   includes bonus irc bot with rpn calculator. 

**timeline**: september 8, 2024 - december 10, 2024 (~3 months)

## description

network programming project implementing irc server from scratch using c++98 and socket programming.    handles multiple concurrent clients with `poll()`, implements irc protocol (rfc 1459), supports authentication, channels, and various irc commands.

**teaches**: network programming (tcp/ip sockets), i/o multiplexing with `poll()`, irc protocol, multi-client server architecture, channel/user management, non-blocking i/o

## features

**server core**: multi-client support, non-blocking i/o (`poll()`), password authentication, client registration (nick/user), channel management, private messaging, channel operators

**irc commands**: 
- **auth/registration**: `pass <password>`, `nick <nickname>`, `user <username>`
- **channels**: `join <channel>`, `part <channel>`, `topic <channel> [topic]`, `invite <nick> <channel>`, `kick <channel> <user>`
- **messaging**: `privmsg <target> <message>`, `ping`, `pong`
- **modes**: `+i` (invite-only), `+t` (topic restriction), `+k <password>`, `+o/-o <nick>` (operator), `+l/-l <limit>` (user limit)
- **connection**: `quit`

**bonus bot**: rpn calculator, private message response, automatic connection

## project structure

```
0x14-irc-server/
├── main.cpp, makefile
├── include/                # server. hpp, client.hpp, channel.hpp, member.hpp, inputparser.hpp, string. hpp, utils.hpp
├── src/                    # implementations (server.cpp, client.cpp, channel.cpp, member.cpp, inputparser.cpp, string.cpp, utils.cpp)
└── cbot/                   # bonus bot (main.cpp, bot.hpp/cpp, rpn. hpp/cpp)
```

## compilation

```bash
make          # compile irc server (ircserv)
make bonus    # compile bot
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile
```

## usage

**start server**:
```bash
./ircserv <port> <password>
# example: ./ircserv 6667 mySecretPass123
```

**connect with irc client**:
```bash
# irssi
irssi
/connect localhost 6667 mySecretPass123
/nick yournickname
/join #channel

# weechat
weechat
/server add myserver localhost/6667
/set irc.server.myserver.password mySecretPass123
/connect myserver

# netcat (nc)
nc localhost 6667
pass mysecretpass123
nick yournickname
user username 0 * :real name
join #channel
privmsg #channel :hello everyone! 
```

**start bot (bonus)**:
```bash
./bot <server_ip> <port> <password>
# example: ./bot 127.0.0.1 6667 mySecretPass123
# usage: /msg bot 3 4 + 2 *  → bot: 14
```

## command examples

**authentication**: `pass mySecretPass123`, `nick alice`, `user alice 0 * :alice smith`  
**channels**: `join #general`, `topic #general :welcome! `, `invite bob #general`, `part #general`, `kick #general bob :spamming`  
**messaging**: `privmsg #general :hello everyone!`, `privmsg bob :hey! `, `privmsg bot :5 3 + 2 *`  
**modes**: `mode #general +i` (invite-only), `mode #general +k secretpass` (password), `mode #general +l 10` (user limit), `mode #general +t` (topic restriction), `mode #general +o alice` (grant operator), `mode #general -o alice` (revoke operator)  
**quit**: `quit :goodbye everyone!`

## implementation details

**server architecture**: non-blocking i/o with `poll()` - main loop: `poll()` → accept new clients → monitor client movements

**client management**: each client has fd (socket), nickname, username, auth status, parser

**channel system**: supports members, operators, modes (+i/+t/+k/+l), topic, invited users

**input parsing**: commands split into command + arguments (e.g., "join #general password" → args[0]="join", args[1]="#general", args[2]="password")

**bot**: connects to server, authenticates, listens for privmsg, evaluates rpn expressions ("3 4 + 2 *" → 14), sends results

## key concepts

**socket programming**: `socket()` → `bind()` → `listen()` → `accept()` → `send()`/`recv()`

**i/o multiplexing**: `poll(pfds. data(), pfds.size(), -1)` → check `revents & pollin` for data

**irc protocol**: `command [param1] [param2] [... ] [:trailing]` (e.g., `nick alice`, `join #general`, `privmsg #general :hello`)

**server responses (rfc 1459)**: 001 (welcome), 331 (no topic), 332 (topic), 353 (user list), 366 (end names), 433 (nick in use), 461 (not enough params), 462 (already registered)

## testing

**basic connection**: server: `./ircserv 6667 pass123` → client: `nc localhost 6667` → `pass pass123`, `nick alice`, `user alice 0 * :alice`, `join #test`, `privmsg #test :hello`, `quit`

**multiple clients**: start server → client1 (alice) joins #general → client2 (bob) joins #general → bob sends message → alice sees it

**channel modes**: `mode #general +i` → try join without invite (fails) → get invited → join works

**bot test**: server → bot connects → client sends `privmsg bot :5 3 + 2 /` → bot responds: 4

**load test**: spawn 10 clients simultaneously with loop

## error handling

socket creation failed (port in use), bind failed (permission denied), password incorrect, nickname in use, not enough parameters, channel not found, permission denied (non-operator)

**server errors**: 461 (not enough params), 433 (nick in use), 442 (not on channel), 482 (not operator)

## protocol flow

**connection**: client: `pass` → `nick` → `user` → server: `001 welcome`  
**join channel**: client: `join #ch` → server: `332 topic`, `353 names`, `366 end`  
**private message**: alice: `privmsg bob :hi` → server forwards to bob

## requirements

- compilation: `-Wall -Wextra -Werror -std=c++98`
- allowed functions: `socket`, `setsockopt`, `bind`, `listen`, `accept`, `send`, `recv`, `poll` (or select/kqueue/epoll), `htons/htonl/ntohs/ntohl`, `inet_addr/inet_ntoa`, `close`, `fcntl`, c++98 stdlib
- forbidden: forking, multithreading, blocking operations, c++11+

**best practices**: non-blocking sockets, signal handling (sigint/sigterm), memory cleanup, comprehensive error checking, code organization (server/client/channel classes), irc compliance (rfc 1459)

---

**grade**: validated ✅  
**developed by**: sbouabid & mait-elk & aabouqas
**created**: october 21, 2024
*"building the backbone of real-time communication!"* 💬