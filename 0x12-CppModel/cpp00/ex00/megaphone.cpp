/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   megaphone.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/06 13:06:40 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/06 17:16:39 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>

int	main(int ac, char **av)
{
	std::string str;
	if (ac == 1)
	{
		std::cout << "* LOUD AND UNBEARABLE FEEDBACK NOISE *" << std::endl;
	}
	else
	{
		int	i = 1;
		int	j;
		while (av[i])
		{
			str = av[i];
			j = 0;
			while (str[j])
			{
				std::cout << (char) toupper(str[j]);
				j++;
			}
			i++;
		}
		std::cout << std::endl;
	}
}
