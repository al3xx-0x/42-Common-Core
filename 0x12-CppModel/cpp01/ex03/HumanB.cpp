/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HumanB.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 17:30:03 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 18:09:17 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "HumanB.hpp"

HumanB::HumanB(std::string Name, Weapon *wp)
	: weapon(wp), name(Name) {}


HumanB::~HumanB(){}

void	HumanB::attack()
{
	if (weapon == nullptr)
		std::cout << "There is no weapon :(" << std::endl;
	else
		std::cout << name << " attacks with their " << weapon->getType() << std::endl;
}

void	HumanB::setWeapon(Weapon wp)
{
	weapon = &wp;
}
