/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 11:17:10 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 15:36:48 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "easyfind.hpp"

int	main()
{
	std::vector<int> arr;
	arr.push_back(10);
	arr.push_back(20);
	arr.push_back(30);
	arr.push_back(40);
	arr.push_back(50);
	std::vector<int>::iterator it = easyfind(arr, 30);
	std::cout << *it << std::endl;

	try {
		std::vector<int> arr;
		arr.push_back(20);
		arr.push_back(10);
		arr.push_back(30);
		arr.push_back(40);
		arr.push_back(50);
		std::vector<int>::iterator it = easyfind(arr, 90);
		std::cout << *it << std::endl;
	} catch (std::exception &e) {
		std::cout << e.what() << std::endl;
	}
}
