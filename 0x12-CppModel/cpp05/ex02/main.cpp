/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:37:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:37:27 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bureaucrat.hpp"
#include "AForm.hpp"
#include "PresidentialPardonForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"

int	main()
{
	try {
		Bureaucrat b("alex", 1);
		ShrubberyCreationForm s("sh-home");
		s.execute(b);
	} catch (std::exception &e)
	{
		std::cout << e.what() << std::endl;
	}
	std::cout << "==============\n";
	try {
		Bureaucrat b("alex", 10);
		RobotomyRequestForm rb("robot");
		rb.execute(b);
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
	std::cout << "==============\n";
	try {
		Bureaucrat b("alex", 1);
		PresidentialPardonForm pp("Presidential");
		pp.execute(b);
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
	std::cout << "==============\n";
	try {
		Bureaucrat b("alex", 1);
		RobotomyRequestForm rb("robot");
		b.executeForm(rb);

	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
}
