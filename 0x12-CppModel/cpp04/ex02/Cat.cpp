/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:33:53 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 17:36:30 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cat.hpp"
#include "Brain.hpp"

Cat::Cat()
{
	type = "Cat";
	brain = new Brain();
	std::cout << "Cat Default Constructor Called" << std::endl;
}

Cat::~Cat()
{
	delete brain;
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
		this->brain = new Brain(*other.brain);
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
