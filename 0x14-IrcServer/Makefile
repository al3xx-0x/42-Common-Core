CC = c++

CPPFLAGS = -Wall -Wextra -Werror -std=c++98 -I include
CLASSES = Server.cpp String.cpp Utils.cpp Client.cpp Member.cpp Channel.cpp InputParser.cpp
OBJ = $(CLASSES:%.cpp=%.o)
RM = rm -rf
MAIN = main.cpp
NAME = ircserv
BONUS = bot
B_CLASSES = Bot.cpp RPN.cpp
B_OBJ = $(B_CLASSES:%.cpp=CBOT/%.o) src/String.o

all: $(NAME)

bonus: $(BONUS)

$(BONUS): CBOT/$(MAIN) $(B_OBJ)
	$(CC) $(CPPFLAGS) CBOT/$(MAIN) $(B_OBJ) -o $(BONUS)

CBOT/%.o: CBOT/%.cpp CBOT/%.hpp
	$(CC) $(CPPFLAGS) -c $< -o $@

%.o: src/%.cpp include/%.hpp
	$(CC) $(CPPFLAGS) -c $< -o $@

$(NAME): $(MAIN) $(OBJ)
	$(CC) $(CPPFLAGS) $(MAIN) $(OBJ) -o $(NAME)

ca: fclean all
	$(RM) $(OBJ) $(B_OBJ)

clean:
	$(RM) $(OBJ) $(B_OBJ)

fclean: clean
	$(RM) $(NAME) $(NAME).dSYM $(BONUS).dSYM $(BONUS)

re: fclean all

.PHONY: clean
