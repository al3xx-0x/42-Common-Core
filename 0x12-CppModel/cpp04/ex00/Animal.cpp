/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Animal.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:15:46 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 16:46:40 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Animal.hpp"

Animal::Animal()
	:type("Animal")
{
	std::cout << "Animal Default Constructor Called" << std::endl;
}

Animal::~Animal()
{
	std::cout << "Animal Destructor Called" << std::endl;
}

Animal::Animal(Animal &other)
{
	*this = other;
}

Animal	&Animal::operator=(const Animal &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

void	Animal::makeSound() const
{
	std::cout << "Animal Sound" << std::endl;
}

std::string	Animal::getType() const
{
	return  this->type;
}
