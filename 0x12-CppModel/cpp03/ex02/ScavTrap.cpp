/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScavTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/21 21:18:59 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/21 21:42:19 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScavTrap.hpp"

ScavTrap::ScavTrap()
	: ClapTrap()
{
	this->_HitPoints = 100;
	this->_EnergyPoints = 50;
	this->_AttackDamage = 20;
	std::cout << "ScavTrap : Default Constructor Called" << std::endl;
}

ScavTrap::ScavTrap(std::string name)
	: ClapTrap(name)
{
	this->_HitPoints = 100;
	this->_EnergyPoints = 50;
	this->_AttackDamage = 20;
	std::cout << "ScavTrap : Constructor Called" << std::endl;
}

ScavTrap::ScavTrap(ScavTrap &other)
{
	*this = other;
}

ScavTrap	&ScavTrap::operator=(const ScavTrap &other)
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

ScavTrap::~ScavTrap()
{
	std::cout << "ScavTrap : Destructor Called" << std::endl;
}

void	ScavTrap::attack(const std::string& target)
{
	if (this->_EnergyPoints > 0 && this->_HitPoints > 0)
	{
		std::cout << "ScavTrap : " << this->_name << " attacks " << target << ", causing " << _AttackDamage << " points of damage!" << std::endl;
		this->_EnergyPoints--;
	}
	else
	{
		if (this->_EnergyPoints < 0)
			std::cout << "ScavTrap : " << this->_name << " you need energy points" << std::endl;
		else
			std::cout << "ScavTrap : The dead cannot attack" << std::endl;
	}
}

void	ScavTrap::guardGate()
{
	std::cout << "ScavTrap is now in Gate keeper mode" << std::endl;
}
