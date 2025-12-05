/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PhoneBook.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 11:05:05 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/06 17:16:27 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PhoneBook.hpp"

int	PhoneBook::ID = 0;

int	PhoneBook::ADD()
{
	static	int index;
	if (index == 8)
		index = 0;
	std::cout << std::endl;
	if (contact[index].setFirstName() == 1)
		return (1);
	if (contact[index].setLastName() == 1)
		return (1);
	if (contact[index].setNickName() == 1)
		return (1);
	if (contact[index].setPhoneNumber() == 1)
		return (1);
	if (contact[index].setDarkestSecret() == 1)
		return (1);
	if (ID < 8)
		ID++;
	index++;
	std::cout <<std::endl<<"seccessfully added"<<std::endl<<std::endl;
	return (0);
}

int	PhoneBook::SEARCH()
{
	std::cout << "*-------------------------------------------*"<<std::endl;
	std::cout << "|     index|first name| last name|  nickname|"<<std::endl;
	std::cout << "*-------------------------------------------*"<<std::endl;
	if (ID == 0)
	{
		std::cout << "*-------------------------------------------*"<<std::endl;
		std::cout <<std::endl<<"phonebook is empty"<<std::endl<<std::endl;
	}
	else
	{
		int i = 0;
		while (i < ID)
		{
			contact[i].printTableInfo(i);
			i++;
		}
		std::cout << "*-------------------------------------------*"<<std::endl;
		std::string	input;
		while (input == "")
		{
			std::cout <<std::endl<<"select index :: ";
			getline(std::cin, input);
			if (std::cin.eof())
				return 1;
			if (input.size() == 1)
			{
				if (input[0] - 48 >= 0 && input[0] - 48 <= 7)
				{
					if (input[0] - 48 < ID)
						contact[input[0] - 48].printFullInfo();
					else
					{
						std::cout << "invalid index !" << std::endl;
						input = "";
					}
				}
				else
				{
					std::cout << "invalid index !" << std::endl;
					input = "";
				}
			}
			else
			{
				std::cout << "invalid index !" << std::endl;
				input = "";
			}
		}
	}
	return 0;
}

