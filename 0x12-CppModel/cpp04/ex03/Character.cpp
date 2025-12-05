/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Character.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 18:10:27 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 20:04:09 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Character.hpp"


Character::Character()
{
	this->name = "Default";
	for (int i = 0; i < 4; i++)
	{
		slots[i] = nullptr;
	}
	std::cout << "Character Default Constructor Called" << std::endl;
}

Character::Character(std::string name)
{
	this->name = name;
	for (int i = 0; i < 4; i++)
	{
		slots[i] = nullptr;
	}
	std::cout << "Character Constructor Called" << std::endl;
}

Character::Character(Character &other)
{
	for (int i = 0; i < 4; i++)
	{
		if (other.slots[i])
			this->slots[i] = other.slots[i]->clone();
	}
	this->name = other.name;
}

Character	&Character::operator=(const Character &other)
{
	if (this != &other)
	{
		for (int i = 0; i < 4; i++)
		{
			if (other.slots[i] != nullptr)
				this->slots[i] = other.slots[i]->clone();
		}
		this->name = other.name;
	}
	return *this;
}

Character::~Character()
{
	std::cout << "Character Destructor Called" << std::endl;
	for (int i = 0; i < 4; i++)
	{
		delete slots[i];
	}
}

void	Character::equip(AMateria* m)
{
	for (int i = 0; i < 4; i++)
	{
		if (slots[i] == nullptr)
		{
			slots[i] = m;
			break ;
		}
	}
}

void	Character::unequip(int idx)
{
	if (idx >= 0 && idx < 4)
	{
		slots[idx] = nullptr;
	}
}

std::string	const &Character::getName() const
{
	return name;
}


void	Character::use(int idx, ICharacter& target)
{
	if (idx >= 0 && idx < 4)
	{
		if (slots[idx] != nullptr)
		{
			this->slots[idx]->use(target);
		}
	}
	else
		std::cout << "materia index: " << idx << " is empty" << std::endl;
}
