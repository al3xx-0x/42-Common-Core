/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:37:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/12 13:28:22 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bureaucrat.hpp"
#include "Form.hpp"
int	main()
{
	try {
		Bureaucrat b1("alex", 1);
		Form f1("death certificate", 10, 15);
		std::cout << b1 << std::endl;
		std::cout << f1 << std::endl;
		b1.signForm(f1);
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
	std::cout << "\n============================\n" << std::endl;

	try {
		Bureaucrat b1("nobi", 140);
		Form f1("Certificate of celibacy", 10, 10);
		std::cout << b1 << std::endl;
		std::cout << f1 << std::endl;
		b1.signForm(f1);
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
}
