/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 13:32:19 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:32:23 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "whatever.hpp"

int	main()
{
	int x = 10;
	int y = 20;
	std::cout << "max : " << ::max(x, y) << std::endl;
	std::cout << "min : " << ::min(x, y) << std::endl;
	::swap(x, y);
	std::cout << "x : " << x << std::endl;
	std::cout << "y : " << y << std::endl;
	std::cout << "===============" << std::endl;
	char x2 = 'x';
	char y2 = 'y';
	std::cout << "max : " << ::max(x2, y2) << std::endl;
	std::cout << "min : " << ::min(x2, y2) << std::endl;
	::swap(x2, y2);
	std::cout << "x2 : " << x2 << std::endl;
	std::cout << "y2 : " << y2 << std::endl;
	return 0;
}
