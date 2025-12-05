/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Form.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:57:19 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/12 14:25:11 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FORM_HPP
#define FORM_HPP

#include <iostream>

class	Bureaucrat;

typedef std::string string ;

class	Form
{
	private:
		const string _name;
		bool	_signed;
		const int	_grade;
		const int	_execute;
	public:
		Form(string name, int grade, int execute);
		Form(Form &old);
		Form &operator=(Form &other);
		~Form();
		bool	isSigned() const;
		string	getName() const;
		int	getGrade() const;
		int	getExecute() const;
		void	beSigned(const Bureaucrat &bureaucrat);
		class	GradeTooHighException : public	std::exception
		{
			public:
				const char* what() const throw();
		};
		class	GradeTooLowException : public std::exception
		{
			public:
				const char* what() const throw();
		};
		class	AlreadySigned : public std::exception
		{
			public:
				const char* what() const throw();
		};
};

std::ostream& operator<<(std::ostream& os, const Form& form);


#endif
