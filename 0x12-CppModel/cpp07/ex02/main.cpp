/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 10:33:25 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:35:25 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Array.hpp"
#include <cstdlib>
#include <exception>

int	main()
{

	try {
		Array<int> arr(5);
		arr[0] = 4;
		arr[1] = 8;
		arr[2] = 16;
		arr[3] = 32;
		arr[4] = 64;
		for (int i = 0; i < 5; i++)
		{
			std::cout << arr[i] << std::endl;
		}
		std::cout << "size : " << arr.size() << std::endl;
	} catch (std::exception &e)
	{
		std::cout << e.what() << std::endl;
	}
}
