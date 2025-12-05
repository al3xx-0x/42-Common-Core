/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 10:28:42 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/06 17:11:12 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PhoneBook.hpp"

int	main()
{
	std::string	input;
	PhoneBook crappy;

	std::cout << "Welcome to your awesome phonebook 📖"<<std::endl<<std::endl;
	std::cout << "*------commands------*"<<std::endl;
	std::cout << "|  ADD               |"<<std::endl;
	std::cout << "|  SEARCH            |"<<std::endl;
	std::cout << "|  EXIT              |"<<std::endl;
	std::cout << "*--------------------*"<<std::endl<<std::endl;
	while (1)
	{
		std::cout << "\\::> ";
		getline(std::cin, input);
		if (input == "ADD")
		{
			if (crappy.ADD() == 1)
				return 0;
		}
		else if (input == "SEARCH")
		{
			if (crappy.SEARCH() == 1)
				return 0;
		}
		else if (input == "EXIT")
			return 0;
		else if (std::cin.eof())
			return 0;
	}
}
