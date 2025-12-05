/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Brain.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 16:34:12 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 16:51:36 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Brain.hpp"

Brain::Brain()
{
	for(int i = 0; i < 100; i++)
	{
		ideas[i] = "no idea";
	}
	std::cout << "Brain Default Contructor Called" << std::endl;
}

Brain::~Brain()
{
	std::cout << "Brain Destructor Called" << std::endl;
}

Brain::Brain(Brain &other)
{
	*this = other;
}

Brain	&Brain::operator=(const Brain &other)
{
	if (this != &other)
	{
		for(int i = 0; i < 100; i++)
		{
			this->ideas[i] = other.ideas[0];
		}
	}
	return *this;
}

