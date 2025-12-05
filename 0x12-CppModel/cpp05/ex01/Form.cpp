/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Form.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:57:17 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/12 14:28:03 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Form.hpp"
#include "Bureaucrat.hpp"

Form::Form(string name, int grade, int execute)
	: _name(name), _grade(grade), _execute(execute)
	{
		std::cout << "Form: Constructor Called\n";
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

Form::Form(Form &old)
	: _name(old._name), _grade(old._grade), _execute(old._execute)
	{
		_signed = old._grade;
	}

Form	&Form::operator=(Form &other)
{
	if (this != &other)
		_signed = other._signed;
	return *this;
}

Form::~Form()
{
	std::cout << "Form: Destructor Called\n";
}

bool	Form::isSigned() const
{
	return _signed;
}

int	Form::getGrade() const
{
	return _grade;
}

int	Form::getExecute() const
{
	return _execute;
}

string	Form::getName() const
{
	return _name;
}

void	Form::beSigned(const Bureaucrat &bureaucrat)
{
	if (bureaucrat.getGrade() <= _grade)
	{
		_signed = true;
	}
	else {
		throw GradeTooLowException();
	}
}

const char* Form::GradeTooHighException::what() const throw() {
	return "Grade too high";
}

const char* Form::GradeTooLowException::what() const throw() {
	return "Grade too low!";
}

const char *Form::AlreadySigned::what() const throw() {
	return ("Already Signed");
}

std::ostream& operator<<(std::ostream& os, const Form& form) {
	os << form.getName() << ", form sign grade " << form.getGrade()
		<< ", form execute grade " << form.getExecute();
	return os;
}

