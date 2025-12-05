/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Bureaucrat.hpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 10:18:14 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/11 14:37:23 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef BUREAUCRAT_HPP
#define BUREAUCRAT_HPP

#include <iostream>

typedef std::string string ;

class	Bureaucrat
{
	private:
		const string	_name;
		int	_grade;
	public:
		Bureaucrat(string name, int grade);
		Bureaucrat(Bureaucrat &old);
		Bureaucrat&	operator=(const Bureaucrat &other);
		~Bureaucrat();
		string	getName() const;
		int	getGrade() const;
		void	incrementBureaucratGrade();
		void	decrementBureaucratGrade();

		class	GradeTooHighException : public std::exception
		{
			public:
				const char* what() const throw();
		};
		class	GradeTooLowException : public std::exception
		{
			public:
				const char* what() const throw();
		};
};

std::ostream& operator<<(std::ostream& os, const Bureaucrat& bureaucrat);

#endif
