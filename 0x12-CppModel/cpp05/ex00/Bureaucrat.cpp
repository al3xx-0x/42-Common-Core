/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Bureaucrat.cpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 13:16:28 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/11 14:52:40 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bureaucrat.hpp"

Bureaucrat::Bureaucrat(string name, int grade)
	: _name(name), _grade(grade)
	{
		std::cout << "Bureaucrat: Constructor Called" << std::endl;
		if (_grade <= 0)
			throw GradeTooHighException();
		if (_grade > 150)
			throw GradeTooLowException();
	}

Bureaucrat::Bureaucrat(Bureaucrat &old)
	: _name(old._name), _grade(old._grade) {}

Bureaucrat	&Bureaucrat::operator=(const Bureaucrat &other)
{
	if (this != &other)
	{
		this->_grade = other._grade;
	}
	return *this;
}

Bureaucrat::~Bureaucrat()
{
	std::cout << "Bureaucrat: Destructor Called" << std::endl;
}

void	Bureaucrat::incrementBureaucratGrade()
{
	if (_grade <= 1)
		throw GradeTooHighException();
	_grade--;
}

void	Bureaucrat::decrementBureaucratGrade()
{
	if (_grade >= 150)
		throw GradeTooLowException();
	_grade++;
}

int	Bureaucrat::getGrade() const
{
	return _grade;
}

string	Bureaucrat::getName() const
{
	return _name;
}

const char* Bureaucrat::GradeTooHighException::what() const throw() {
	return "Grade too high!";
}

const char* Bureaucrat::GradeTooLowException::what() const throw() {
	return "Grade too low!";
}

std::ostream& operator<<(std::ostream& out, const Bureaucrat& bureaucrat) {
    out << bureaucrat.getName() << ", bureaucrat grade " << bureaucrat.getGrade();
    return out;
}
