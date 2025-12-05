/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Weapon.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 17:13:28 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 17:17:57 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Weapon.hpp"

Weapon::Weapon(std::string str)
	: type(str){}

Weapon::~Weapon(){}

const std::string	&Weapon::getType() const
{
	return type;
}

void	Weapon::setType(std::string str)
{
	type = str;
}
