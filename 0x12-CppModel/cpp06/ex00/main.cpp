/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/19 10:15:46 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/19 15:47:35 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScalarConverter.hpp"
#include <sstream>
#include <limits>
#include <iomanip>

int	main(int ac, char **av)
{
	if (ac == 2)
		ScalarConverter::convert(av[1]);

}
