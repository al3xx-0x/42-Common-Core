/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/17 13:32:08 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/17 14:44:10 by sbouabid         ###   ########.fr       */
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
};

std::ostream &operator<<(std::ostream &os, const Fixed &obj);

#endif
