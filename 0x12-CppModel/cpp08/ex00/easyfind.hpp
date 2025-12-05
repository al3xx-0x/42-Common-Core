/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   easyfind.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 11:17:08 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 15:34:23 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef EASY_FIND_HPP
#define EASY_FIND_HPP

#include <algorithm>
#include <iostream>
#include <vector>

class	couldntFindIt : public std::exception
{
	const char *what() const throw()
	{
		return "I couldn't find it";
	}
};

template <typename T>
typename T::iterator	easyfind(T& container, int find)
{
	typename T::iterator it = std::find(container.begin(), container.end(), find);

	if (it == container.end())
	{
		throw couldntFindIt();
	}
	return it;
}


#endif
