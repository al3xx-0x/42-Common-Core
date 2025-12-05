/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Harl.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/09 18:01:52 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/10 10:21:44 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Harl.hpp"

Harl::Harl(){};
Harl::~Harl(){};

void	Harl::debug()
{
	std::cout << "[ DEBUG ]" << std::endl;
	std::cout << "I love having extra bacon for my 7XL-double-cheese-triple-pickle-specialketchup burger.\nI really do!" << std::endl;
	std::cout << std::endl;
}

void	Harl::info()
{
	std::cout << "[ INFO ]" << std::endl;
	std::cout << "I cannot believe adding extra bacon costs more money.\nYou didn’t put enough bacon in my burger! If you did, I wouldn’t be asking for more!" << std::endl;
	std::cout << std::endl;
}

void	Harl::warning()
{
	std::cout << "[ WARNING ]" << std::endl;
	std::cout << "I think I deserve to have some extra bacon for free.\nI’ve been coming for years whereas you started working here since last month." << std::endl;
	std::cout << std::endl;
}

void	Harl::error()
{
	std::cout << "[ ERROR ]" << std::endl;
	std::cout <<  "This is unacceptable! I want to speak to the manager now." << std::endl;
	std::cout << std::endl;
}

void	Harl::complain(std::string level)
{
	void	(Harl::*ptr)(void);
	std::string str[4] = {"DEBUG", "INFO", "WARNING", "ERROR"};
	int i = 0;
	while (i < 4 && str[i] != level)
	{
		i++;
	}
	switch (i)
	{
	case 0:
		ptr = &Harl::debug;
		(this->*ptr)();
		ptr = &Harl::info;
		(this->*ptr)();
		ptr = &Harl::warning;
		(this->*ptr)();
		ptr = &Harl::error;
		(this->*ptr)();
		break;
	case 1:
		ptr = &Harl::info;
		(this->*ptr)();
		ptr = &Harl::warning;
		(this->*ptr)();
		ptr = &Harl::error;
		(this->*ptr)();
		break;
	case 2:
		ptr = &Harl::warning;
		(this->*ptr)();
		ptr = &Harl::error;
		(this->*ptr)();
		break;
	case 3:
		ptr = &Harl::error;
		(this->*ptr)();
		break;
	default:
		std::cout << "[ Probably complaining about insignificant problems ]" << std::endl;
		return;
	}
}
