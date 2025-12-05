/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/17 14:43:58 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/18 08:55:27 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FIXED_HPP
#define FIXED_HPP

#include <iostream>
#include <cmath>

class Fixed
{
	private:
		int FixedPoint;
		static const int FixedPointBits;
	public:
		Fixed(void);
		Fixed(int nbr);
		Fixed(float nbr);
		Fixed(const Fixed &old);
		Fixed &operator=(const Fixed &other);
		~Fixed();

		int toInt(void) const;
		float toFloat(void) const;

		bool	operator>(Fixed &other);
		bool	operator<(Fixed &other);
		bool	operator>=(Fixed &other);
		bool	operator<=(Fixed &other);
		bool	operator==(Fixed &other);
		bool	operator!=(Fixed &other);

		Fixed	operator + (Fixed &other)	const;
		Fixed	operator - (Fixed &other)	const;
		Fixed	operator * (const Fixed&)	const;
		Fixed	operator / (Fixed &other)	const;

		Fixed	operator++();
		Fixed	operator++(int);
		Fixed	operator--();
		Fixed	operator--(int);

		static	Fixed	&min(Fixed &a, Fixed &b);
		static	Fixed	&min(const Fixed &a, const Fixed &b);
		static	Fixed	&max(Fixed &a, Fixed &b);
		static	Fixed	&max(const Fixed &a, const Fixed &b);


};

std::ostream &operator<<(std::ostream &os, const Fixed &obj);

#endif
