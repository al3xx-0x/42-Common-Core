/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   whatever.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 13:31:59 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:32:01 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef WHATEVER_HPP
#define WHATEVER_HPP

#include <iostream>

template <typename T>
void	swap(T& x, T& y)
{
	T temp = x;
	x = y;
	y = temp;
}

template <typename T>
T	min(T x, T y)
{
	return (x < y) ? x : y;
}

template <typename T>
T	max(T x, T y)
{
	return (x > y) ? x : y;
}

#endif
