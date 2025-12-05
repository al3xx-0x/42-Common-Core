/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:33:53 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 16:46:50 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cat.hpp"

Cat::Cat()
{
	type = "Cat";
	std::cout << "Cat Default Constructor Called" << std::endl;
}

Cat::~Cat()
{
	std::cout << "Cat Destrcutor Called" << std::endl;
}

Cat::Cat(Cat &other)
{
	*this = other;
}

Cat	&Cat::operator=(const Cat &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

void	Cat::makeSound() const
{
	std::cout << "Cat sound: Meow Meow!" << std::endl;
}

std::string	Cat::getType() const
{
	return  this->type;
}
