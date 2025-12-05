/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   iter.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 13:32:33 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:32:51 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ITER_HPP
#define ITER_HPP

#include <iostream>

template <typename T, typename F>
void	iter(T *arr, size_t size, F func)
{
	for (size_t i = 0; i < size; i++)
	{
		func(arr[i]);
	}
}

template <typename T>
void	printElement(T element)
{
	std::cout << element << std::endl;
}

template <typename T>
void	incrementElement(T &element)
{
	element+=1;
}

#endif
