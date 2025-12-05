/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/17 11:59:02 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/17 12:15:58 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FIXED_HPP
#define FIXED_HPP

#include <iostream>

class	Fixed
{
	private:
		int FixedPoint;
		static const int FixedPointBits;
	public:
		Fixed(void);
		Fixed(Fixed &old);
		Fixed &operator=(Fixed &other);
		~Fixed();
		int	getRawBits(void);
		void	setRawBits(int const raw);
};

#endif
