/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Intern.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/13 10:46:51 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 12:07:49 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


#include "Intern.hpp"

Intern::Intern(void)
{
	std::cout << "Intern: Default Contructor Called\n";
}

Intern::Intern(Intern &other)
{
	*this = other;
}

Intern &Intern::operator=(Intern &other)
{
	if (this != &other)
	{
		this->_target = other._target;
	}
	return *this;
}

Intern::~Intern()
{
	std::cout << "Intern: Destructor Called\n";
}

AForm	*Intern::makeForm(string name, string target)
{
	string arr[] = {"shrubbery creation", "robotomy request", "presidential pardon"};
	int i = 0;
	while (i < 3 && arr[i] != name)
	{
		i++;
	}
	switch (i)
	{
		case 0:
			std::cout << "Intern creates " << name << std::endl;
			return new ShrubberyCreationForm(target);
			break;
		case 1:
			std::cout << "Intern creates " << name << std::endl;
			return new RobotomyRequestForm(target);
			break;
		case 2:
			std::cout << "Intern creates " << name << std::endl;
			return new PresidentialPardonForm(target);
			break;
		default:
			std::cout << "Intern can not create a form called " << name << std::endl;
	}
	return NULL;
}
