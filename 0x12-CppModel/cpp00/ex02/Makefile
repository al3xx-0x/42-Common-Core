# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/06 13:34:45 by sbouabid          #+#    #+#              #
#    Updated: 2024/07/06 18:01:29 by sbouabid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC = c++
CPPFLAGS = -Wall -Wextra -Werror -std=c++98
NAME = Account
SRCF = tests.cpp Account.cpp
RM = rm -f
OBJF = $(SRCF:.cpp=.o)
HEADERS = Contact.hpp PhoneBook.hpp

all: $(NAME)

%.o: %.cpp $(HEADERS)
	$(CC) $(CPPFLAGS) -c $< -o $@

$(NAME): $(OBJF)
	$(CC) $(CPPFLAGS) $(OBJF) -o $(NAME)

clean:
	$(RM) $(OBJF)

fclean: clean
	$(RM) $(NAME)
