/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DiamondTrap.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/22 10:04:40 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/22 12:11:42 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "DiamondTrap.hpp"

DiamondTrap::DiamondTrap()
{
	this->_name = "Default";
	ClapTrap::_name = "Default_clap_name";
	this->_HitPoints = 100;
	this->_EnergyPoints = 50;
	this->_AttackDamage = 30;
	std::cout << "DiamondTrap : Default Constructor Called" << std::endl;
}

DiamondTrap::DiamondTrap(std::string name)
	: ClapTrap(name + "_clap_name")
{
	this->_name = name;
	this->_HitPoints = 100;
	this->_EnergyPoints = 50;
	this->_AttackDamage = 30;
	std::cout << "DiamondTrap : Constructor Called" << std::endl;
}

DiamondTrap::DiamondTrap(DiamondTrap &other)
{
	*this = other;
}

DiamondTrap::~DiamondTrap()
{
	std::cout << "DiamondTrap : Destructor Called" << std::endl;
}

DiamondTrap	&DiamondTrap::operator=(const DiamondTrap &other)
{
	if (this != &other)
	{
		this->_name = other._name;
		this->_AttackDamage = other._AttackDamage;
		this->_EnergyPoints = other._EnergyPoints;
		this->_HitPoints = other._HitPoints;
	}
	return *this;
}

void	DiamondTrap::attack(const std::string& target)
{
	ScavTrap::attack(target);
}


void	DiamondTrap::whoAmI()
{
	std::cout << "Diamond Name : " << this->_name << " ClapTrap Name : " << ClapTrap::_name << std::endl;
}
