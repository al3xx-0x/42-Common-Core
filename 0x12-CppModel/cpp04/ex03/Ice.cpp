/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Ice.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 16:59:41 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 18:49:37 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Ice.hpp"

Ice::Ice()
	: AMateria("ice")
{
	this->type = "ice";
	std::cout << "Ice Constructor Called" << std::endl;
}

Ice::Ice(Ice &other)
{
	this->type = other.type;
}

Ice	&Ice::operator=(const Ice &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

Ice::~Ice()
{
	std::cout << "Ice Destructer Called" << std::endl;
}

std::string	const &Ice::getType() const
{
	return this->type;
}

Ice	*Ice::clone() const
{
	return new Ice();
}

void	Ice::use(ICharacter& target)
{
	std::cout << "* shoots an ice bolt at " + target.getName() +" *" << std::endl;
}
