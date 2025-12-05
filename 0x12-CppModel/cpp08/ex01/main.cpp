/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 15:38:26 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 16:26:58 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Span.hpp"
#include <iostream>

int	main()
{
	Span span(10);
	span.addNumber(90);
	span.addNumber(50);
	span.addNumber(40);
	span.addNumber(60);
	span.addNumber(70);
	span.addNumber(30);
	span.addNumber(80);
	span.addNumber(20);
	span.addNumber(10);
	std::cout << span.longestSpan() << std::endl;
	std::cout << span.shortestSpan() << std::endl;
	try {
		std::cout << "=============" << std::endl;
		Span span(5);
		span.addNumber(90);
		span.addNumber(50);
		span.addNumber(40);
		span.addNumber(60);
		span.addNumber(70);
		span.addNumber(30);
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
	try {
		std::cout << "=============" << std::endl;
		Span span(5);
		span.addNumber(90);
		std::cout << span.longestSpan() << std::endl;
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
}

