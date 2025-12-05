/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongCat.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 15:27:07 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 16:47:54 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "WrongCat.hpp"

WrongCat::WrongCat()
{
	type = "WrongCat";
	std::cout << "WrongCat Default Constructor Called" << std::endl;
}

WrongCat::~WrongCat()
{
	std::cout << "WrongCat Destructor Called" << std::endl;
}

WrongCat::WrongCat(WrongCat &other)
{
	*this = other;
}

WrongCat	&WrongCat::operator=(const WrongCat &other)
{
	if (this != &other)
	{
		this->type = other.type;
	}
	return *this;
}

void	WrongCat::makeSound() const
{
	std::cout << "WrongCat Sound: Meow Meow!" << std::endl;
}

std::string	WrongCat::getType() const
{
	return this->type;
}
