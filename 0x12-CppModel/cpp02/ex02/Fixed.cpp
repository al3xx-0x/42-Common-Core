/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/17 14:43:45 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/18 09:24:15 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Fixed.hpp"

const int Fixed::FixedPointBits = 8;

Fixed::Fixed(void)
{
	FixedPoint = 0;
}

Fixed::Fixed(const int nbr)
{
	FixedPoint = nbr << FixedPointBits;
}

Fixed::Fixed(const float nbr)
{
	FixedPoint = roundf(nbr * (1 << FixedPointBits));
}

Fixed::Fixed(const Fixed &old)
{
	*this = old;
}

Fixed::~Fixed()
{
}

Fixed	&Fixed::operator=(const Fixed &other)
{
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

bool	Fixed::operator>(Fixed &other)
{
	return (this->FixedPoint > other.FixedPoint);
}

bool	Fixed::operator<(Fixed &other)
{
	return (this->FixedPoint < other.FixedPoint);
}

bool	Fixed::operator>=(Fixed &other)
{
	return (this->FixedPoint >= other.FixedPoint);
}

bool	Fixed::operator<=(Fixed &other)
{
	return (this->FixedPoint <= other.FixedPoint);
}

bool	Fixed::operator==(Fixed &other)
{
	return (this->FixedPoint == other.FixedPoint);
}

bool	Fixed::operator!=(Fixed &other)
{
	return (this->FixedPoint != other.FixedPoint);
}

Fixed	Fixed::operator + (Fixed &other)	const
{

	return (this->toFloat() + other.toFloat());
}

Fixed	Fixed::operator-(Fixed &other)	const
{
	return (this->toFloat() - other.toFloat());
}

Fixed	Fixed::operator * (const Fixed& other)	const
{
	return (this->toFloat() * other.toFloat());
}


Fixed	Fixed::operator / (Fixed &other)	const
{
	return (this->toFloat() / other.toFloat());
}

Fixed	Fixed::operator++()
{
	this->FixedPoint += 1;
	return *this;
}

Fixed	Fixed::operator++(int)
{
	Fixed temp = *this;
	++FixedPoint;
	return temp;
}

Fixed	Fixed::operator--()
{
	this->FixedPoint -= 1;
	return *this;
}

Fixed	Fixed::operator--(int)
{
	Fixed temp = *this;
	--FixedPoint;
	return temp;
}

Fixed	&Fixed::min(Fixed &a, Fixed &b)
{
	if (a.FixedPoint < b.FixedPoint)
		return a;
	return b;
}

Fixed	&Fixed::min(const Fixed &a, const Fixed &b)
{
	if (a.FixedPoint < b.FixedPoint)
		return (Fixed &)a;
	return (Fixed &)b;
}

Fixed	&Fixed::max(Fixed &a, Fixed &b)
{
	if (a.FixedPoint > b.FixedPoint)
		return a;
	return b;
}

Fixed	&Fixed::max(const Fixed &a, const Fixed &b)
{
	if (a.FixedPoint > b.FixedPoint)
		return (Fixed &)a;
	return (Fixed &)b;
}
