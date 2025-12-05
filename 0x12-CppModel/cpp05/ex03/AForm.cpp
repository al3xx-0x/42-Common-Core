/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AForm.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:57:17 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/12 14:52:48 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AForm.hpp"
#include "Bureaucrat.hpp"

AForm::AForm()
	: _name("Default"), _grade(0), _execute(0)
	{
		std::cout << "AForm: Default Consturctor Called\n";
	}

AForm::AForm(string name, int grade, int execute)
	: _name(name), _grade(grade), _execute(execute)
	{
		std::cout << "AForm: Constructor Called\n";
		_signed = false;
		if (_grade < 1)
		{
			throw GradeTooHighException();
		}
		else if (_grade > 150)
		{
			throw GradeTooLowException();
		}
	}

AForm::AForm(AForm &old)
	: _name(old._name), _grade(old._grade), _execute(old._execute)
	{
		_signed = old._grade;
	}

AForm	&AForm::operator=(AForm &other)
{
	if (this != &other)
		_signed = other._signed;
	return *this;
}

AForm::~AForm()
{
	std::cout << "AForm: Destructor Called\n";
}

bool	AForm::isSigned() const
{
	return _signed;
}

int	AForm::getGrade() const
{
	return _grade;
}

int	AForm::getExecute() const
{
	return _execute;
}

string	AForm::getName() const
{
	return _name;
}

void	AForm::beSigned(const Bureaucrat &bureaucrat)
{
	if (bureaucrat.getGrade() <= _grade)
	{
		_signed = true;
	}
	else {
		throw GradeTooLowException();
	}
}

const char* AForm::GradeTooHighException::what() const throw() {
	return "Grade too high";
}

const char* AForm::GradeTooLowException::what() const throw() {
	return "Grade too low!";
}

const char *AForm::AlreadySigned::what() const throw() {
	return ("Already Signed");
}

std::ostream& operator<<(std::ostream& os, const AForm& form) {
	os << form.getName() << ", form sign grade " << form.getGrade()
		<< ", form execute grade " << form.getExecute();
	return os;
}

