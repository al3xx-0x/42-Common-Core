# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/06 13:06:29 by sbouabid          #+#    #+#              #
#    Updated: 2024/07/06 15:15:31 by sbouabid         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC = c++
CPPFLAGS = -Wall -Wextra -Werror -std=c++98
NAME = megaphone
SRCF = megaphone.cpp
RM = rm -f
OBJF = $(SRCF:.cpp=.o)

all:$(NAME)

$(NAME):$(OBJF)
	$(CC) $(CPPFLAGS) $(OBJF) -o $(NAME)

clean:
	$(RM) $(OBJF)
fclean:clean
	$(RM) $(NAME)
