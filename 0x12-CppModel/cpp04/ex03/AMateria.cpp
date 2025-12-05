/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AMateria.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 16:45:32 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 18:16:29 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "AMateria.hpp"

AMateria::AMateria()
{
	this->type = "Default";
	std::cout << "AMateria Default Constructor Called" << std::endl;
}

AMateria::AMateria(std::string const &type)
{
	this->type = type;
	std::cout << "AMateria Constructor Called" << std::endl;
}

AMateria::AMateria(AMateria &other)
{
	this->type = other.type;
}

AMateria	&AMateria::operator=(const AMateria &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

AMateria::~AMateria()
{
	std::cout << "AMateria Destructer Called" << std::endl;
}

std::string	const &AMateria::getType() const
{
	return this->type;
}

void AMateria::use(ICharacter& target)
{
	std::cout << "AMateria abstractly used on " << target.getName() << std::endl;
}
