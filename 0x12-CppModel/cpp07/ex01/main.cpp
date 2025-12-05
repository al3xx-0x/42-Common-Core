/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 13:32:56 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:33:02 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "iter.hpp"
#include <string>

int main()
{
	std::string arr[] = {"hello", "world", "Welcome"};
	::iter(arr, 3, ::printElement<std::string>);

	int	arr2[] = {10, 20, 30, 40};
	::iter(arr2, 4, ::incrementElement<int>);
	::iter(arr2, 4, ::printElement<int>);
}
