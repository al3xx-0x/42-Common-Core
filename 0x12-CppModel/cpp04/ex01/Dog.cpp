/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:24:22 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 17:42:10 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Dog.hpp"
#include "Brain.hpp"

Dog::Dog()
{
	this->type = "Dog";
	brain = new Brain();
	std::cout << "Dog Default Constructor Called" << std::endl;
}

Dog::~Dog()
{
	delete brain;
	std::cout << "Dog Destructor Called" << std::endl;
}

Dog::Dog(Dog &other)
{
	*this = other;
}

Dog	&Dog::operator=(const Dog &other)
{
	if (this != &other)
	{
		this->type = other.type;
		this->brain = new Brain(*other.brain);
	}
	return *this;
}


void Dog::makeSound() const
{
	std::cout << "Dog sound: Woof Woof!" << std::endl;
}

std::string	Dog::getType() const
{
	return  this->type;
}
