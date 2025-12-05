/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MateriaSource.cpp                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 18:26:32 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 19:58:59 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "MateriaSource.hpp"
#include "AMateria.hpp"

MateriaSource::MateriaSource()
{
	std::cout << "MateriaSource Constructor Called" << std::endl;
	for (int i = 0; i < 4; i++) {
		slots[i] = nullptr;
	}
}

MateriaSource::MateriaSource(MateriaSource &other)
{
	*this = other;
}

MateriaSource	&MateriaSource::operator=(const MateriaSource &other)
{
	if (this != &other)
	{
		for (int i = 0; i < 4; i++)
		{
			if (other.slots[i])
				this->slots[i] = other.slots[i];
		}
	}
	return *this;
}

MateriaSource::~MateriaSource()
{
	std::cout << "MateriaSource Destructro Called" << std::endl;
	for (int i = 0; i < 4; i++)
	{
		delete slots[i];
	}
}

void	MateriaSource::learnMateria(AMateria *copy)
{
	if (copy == NULL)
		return ;
	for (int i = 0; i < 4; i++)
	{
		if (slots[i] == nullptr)
		{
			slots[i] = copy;
			break;
		}
	}
}

AMateria*	MateriaSource::createMateria(std::string const &type)
{
	for (int i = 0; i < 4; i++)
	{
		if (slots[i] != nullptr && slots[i]->getType() == type)
			return slots[i]->clone();
	}
	return nullptr;
}
