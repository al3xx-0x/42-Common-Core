/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/17 13:32:11 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/17 14:40:46 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Fixed.hpp"

const int Fixed::FixedPointBits = 8;

Fixed::Fixed(void)
{
	std::cout << "Default constructor called" << std::endl;
	FixedPoint = 0;
}

Fixed::Fixed(const int nbr)
{
	std::cout << "Int constructor called" << std::endl;
	FixedPoint = nbr << FixedPointBits;
}

Fixed::Fixed(const float nbr)
{
	std::cout << "Float constructor called" << std::endl;
	FixedPoint = roundf(nbr * (1 << FixedPointBits));
}

Fixed::Fixed(const Fixed &old)
{
	std::cout << "Copy constructor called" << std::endl;
	*this = old;
}

Fixed::~Fixed()
{
	std::cout << "Destructor called" << std::endl;
}

Fixed	&Fixed::operator=(const Fixed &other)
{
	std::cout << "Copy assignment operator called" << std::endl;
	if (this != &other)
		this->FixedPoint = other.FixedPoint;
	return *this;
}

int	Fixed::toInt(void) const
{
	return (FixedPoint >> FixedPointBits);
}

float Fixed::toFloat(void) const
{
	return ((float)FixedPoint / (1 << FixedPointBits));
}

std::ostream &operator<<(std::ostream &os, const Fixed &obj)
{
	os << obj.toFloat();
	return os;
}
