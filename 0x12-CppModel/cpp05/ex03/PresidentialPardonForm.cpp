/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PresidentialPardonForm.cpp                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/13 09:00:34 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:53 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PresidentialPardonForm.hpp"
#include "AForm.hpp"
#include "Bureaucrat.hpp"

PresidentialPardonForm::PresidentialPardonForm()
	: AForm("Default", 25, 5), _target("Default")
	{
		std::cout << "PresidentialPardonForm: Default Constructor Called\n";
	}

PresidentialPardonForm::PresidentialPardonForm(string target)
	:	AForm(target, 25, 5), _target(target)
	{
		std::cout  << "PresidentialPardonForm: Constructor Called\n";
	}

PresidentialPardonForm::PresidentialPardonForm(PresidentialPardonForm &other)
{
	*this = other;
}

PresidentialPardonForm	&PresidentialPardonForm::operator=(PresidentialPardonForm &other)
{
	if (this != &other)
	{
		this->_target = other._target;
	}
	return *this;
}

PresidentialPardonForm::~PresidentialPardonForm()
{
	std::cout << "PresidentialPardonForm: Destructor Called\n";
}

void	PresidentialPardonForm::execute(Bureaucrat const & executor) const
{
	if (!isSigned() &&executor.getGrade() > this->getGrade())
		throw GradeTooLowException();
	std::cout << _target << " has been pardoned by Zaphod Beeblebrox\n";
}
