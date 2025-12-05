/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AForm.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:57:19 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:14 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef AAFORM_HPP
#define AAFORM_HPP

#include <iostream>

class	Bureaucrat;

typedef std::string string ;

class	AForm
{
	private:
		const string _name;
		bool	_signed;
		const int	_grade;
		const int	_execute;
	public:
		AForm();
		AForm(string name, int grade, int execute);
		AForm(AForm &old);
		AForm &operator=(AForm &other);
		~AForm();
		bool	isSigned() const;
		string	getName() const;
		int	getGrade() const;
		int	getExecute() const;
		void	beSigned(const Bureaucrat &bureaucrat);
		virtual	void execute(Bureaucrat const & executor) const = 0;
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

std::ostream& operator<<(std::ostream& os, const AForm& Aform);


#endif
