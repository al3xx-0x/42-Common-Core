/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Contact.cpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 11:06:54 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/06 17:59:35 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Contact.hpp"

int	Contact::setFirstName()
{
	std::string	input;

	while (input == "")
	{
		std::cout << "Enter first name :: ";
		getline(std::cin, input);
		if (std::cin.eof())
			return (1);
		if (CheckIfEmpty(input) == 1)
			input = "";
	}
	_FirstName = input;
	return (0);
}

int	Contact::setLastName()
{
	std::string	input;

	while (input == "")
	{
		std::cout << "Enter last name :: ";
		getline(std::cin, input);
		if (std::cin.eof())
			return (1);
		if (CheckIfEmpty(input) == 1)
			input = "";
	}
	_LastName = input;
	return (0);
}

int	Contact::setNickName()
{
	std::string	input;

	while (input == "")
	{
		std::cout << "Enter nick name :: ";
		getline(std::cin, input);
		if (std::cin.eof())
			return (1);
		if (CheckIfEmpty(input) == 1)
			input = "";
	}
	_NickName = input;
	return (0);
}

int	Contact::setPhoneNumber()
{
	std::string	input;

	while (input == "")
	{
		std::cout << "Enter phone number :: ";
		getline(std::cin, input);
		if (std::cin.eof())
			return (1);
		if (CheckIfEmpty(input) == 1)
			input = "";
		if (CheckIfNumbers(input) == 0)
			input = "";
	}
	_PhoneNumber = input;
	return (0);
}

int	Contact::setDarkestSecret()
{
	std::string	input;

	while (input == "")
	{
		std::cout << "Enter darkest secret :: ";
		getline(std::cin, input);
		if (std::cin.eof())
			return (1);
		if (CheckIfEmpty(input) == 1)
			input = "";
	}
	_DarkestSecret = input;
	return (0);
}

void	Contact::addSpace(std::string str)
{
	int size;

	size = 10 - str.size();

	for (int i = 0; i < size; i++)
	{
		std::cout << " ";
	}
	std::cout << str;
}

int		Contact::CheckIfEmpty(std::string str)
{
	int	i = 0;

	while (str[i])
	{
		if (str[i] != ' ')
			return 0;
		i++;
	}
	return (1);
}

int		Contact::CheckIfNumbers(std::string str)
{
	int	i = 0;

	while (str[i])
	{
		// if (!(str[i] >= '0' && str[i] <= '9'))
		// 	return (0);
		if (!isnumber(str[i]))
			return (0);
		i++;
	}
	return (1);
}

void	Contact::printTableInfo(int index)
{
	std::cout << "|         " << index << "|";
	if (_FirstName.length() > 10)
		std::cout << _FirstName.substr(0, 9) + ".";
	else
		addSpace(_FirstName);
	std::cout << "|";
	if (_LastName.length() > 10)
		std::cout << _LastName.substr(0, 9) + ".";
	else
		addSpace(_LastName);
	std::cout << "|";
	if (_NickName.length() > 10)
		std::cout << _NickName.substr(0, 9) + ".";
	else
		addSpace(_NickName);
	std::cout << "|" << std::endl;
}

void	Contact::printFullInfo()
{
	std::cout << "First Name     :  " + _FirstName << std::endl;
	std::cout << "Last Name      :  " + _LastName << std::endl;
	std::cout << "Nick Name      :  " + _NickName << std::endl;
	std::cout << "Phone Number   :  " + _PhoneNumber << std::endl;
	std::cout << "darkest secret :  " + _DarkestSecret << std::endl << std::endl;
}
