/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cure.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 17:16:46 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 18:16:07 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cure.hpp"

Cure::Cure()
	: AMateria("cure")
{
	this->type = "cure";
	std::cout << "Cure Constructor Called" << std::endl;
}

Cure::Cure(Cure &other)
{
	this->type = other.type;
}

Cure	&Cure::operator=(const Cure &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

Cure::~Cure()
{
	std::cout << "Cure Destructer Called" << std::endl;
}

std::string	const &Cure::getType() const
{
	return this->type;
}

Cure	*Cure::clone() const
{
	return new Cure();
}


void	Cure::use(ICharacter& target)
{
	std::cout << "* heals " + target.getName() +"’s wounds *" << std::endl;
}
