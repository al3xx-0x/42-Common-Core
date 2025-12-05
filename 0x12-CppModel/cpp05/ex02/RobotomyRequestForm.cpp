/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RobotomyRequestForm.cpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/12 15:17:02 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:41 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "RobotomyRequestForm.hpp"
#include "AForm.hpp"

RobotomyRequestForm::RobotomyRequestForm()
	: AForm("Default", 72, 45), _target("Default")
	{
		std::cout << "RobotomyRequestForm: Default Constructor Called\n";
	}

RobotomyRequestForm::RobotomyRequestForm(string target)
	: AForm(target, 72, 45), _target(target)
{
	std::cout << "RobotomyRequestForm: Constructor Called\n";
}

RobotomyRequestForm::RobotomyRequestForm(RobotomyRequestForm &other)
{
	*this = other;
}

RobotomyRequestForm	&RobotomyRequestForm::operator=(RobotomyRequestForm &other)
{
	if (this != &other)
		_target = other._target;
	return *this;
}

RobotomyRequestForm::~RobotomyRequestForm()
{
	std::cout << "RobotomyRequestForm: Destructor Called\n";
}

void	RobotomyRequestForm::execute(Bureaucrat const & executor) const
{
	if (!isSigned() && executor.getGrade() > this->getGrade())
		throw GradeTooLowException();
	std::cout << "Brrrr... Zzzzz... Vrrrr... 3annnnn\n";
	if (std::rand() % 2 == 0)
		std::cout << _target << " has been robotomized successfully 50\% of the time\n";
	else
		std::cout << "informs that the robotomy failed\n";
}
