/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/11 14:37:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/11 14:45:48 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Bureaucrat.hpp"

int main() {

	try {
		Bureaucrat p1("alex", -1);
		std::cout << p1 << std::endl;

	}
	catch (std::exception &e)
	{
		std::cout << e.what() << std::endl;
	}
	try {
		Bureaucrat p2("prime", 1);
		std::cout << p2 << std::endl;
	} catch (std::exception &e)
	{
		std::cout << e.what() << std::endl;
	}

	return 0;
}
