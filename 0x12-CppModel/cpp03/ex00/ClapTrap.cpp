/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ClapTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/21 20:34:30 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/22 13:08:23 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"

ClapTrap::ClapTrap()
	: _name("Default"), _HitPoints(10), _EnergyPoints(10), _AttackDamage(0)
{
	std::cout << "ClapTrap : Default Constructor Called" << std::endl;
}

ClapTrap::ClapTrap(std::string name)
	: _name(name), _HitPoints(10), _EnergyPoints(10), _AttackDamage(0)
{
	std::cout << "ClapTrap : Constructor Called" << std::endl;
}

ClapTrap::ClapTrap(ClapTrap &other)
{
	*this = other;
}

ClapTrap	&ClapTrap::operator=(const ClapTrap &other)
{
	if (this != &other)
	{
		this->_AttackDamage = other._AttackDamage;
		this->_EnergyPoints = other._EnergyPoints;
		this->_HitPoints = other._HitPoints;
		this->_name = other._name;
	}
	return *this;
}

ClapTrap::~ClapTrap()
{
	std::cout << "ClapTrap : Destructor called" << std::endl;
}

void	ClapTrap::attack(const std::string& target)
{
	if (this->_EnergyPoints > 0 && this->_HitPoints > 0)
	{
		std::cout << "ClapTrap : " << this->_name << " attacks " << target << ", causing " << _AttackDamage << " points of damage!" << std::endl;
		this->_EnergyPoints--;
	}
	else
	{
		if (this->_EnergyPoints < 0)
			std::cout << "ClapTrap : " << this->_name << " you need energy points" << std::endl;
		else
			std::cout << "ClapTrap : The dead cannot attack" << std::endl;
	}
}

void	ClapTrap::takeDamage(unsigned int amount)
{
	if (this->_HitPoints > 0)
	{
		this->_HitPoints-= amount;
		std::cout << this->_name << " take " << amount << " damage points" << std::endl;
	}
	else
	{
		std::cout << "The dead cannot take damage" << std::endl;
	}
}

void	ClapTrap::beRepaired(unsigned int amount)
{
	if (this->_HitPoints > 0 && this->_EnergyPoints > 0)
	{
		std::cout << this->_name << " repaired " << amount << " hit points" << std::endl;
	}
	else
	{
		if (_HitPoints <= 0)
			std::cout << "The dead cannot repaired" << std::endl;
		else
			std::cout << "There is no energy point waiting for your dead" << std::endl;
	}
}
