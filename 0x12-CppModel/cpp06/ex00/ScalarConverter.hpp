/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScalarConverter.hpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/19 10:03:04 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/19 14:35:44 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SCALARCONVERTER_HPP
#define SCALARCONVERTER_HPP

#include <iostream>
#include <sstream>
#include <iomanip>

typedef std::string string;

enum	TYPE
{
	_CHAR,
	_INT,
	_FLOAT,
	_DOUBLE,
	_STRING,
	_PINF,
	_NINF,
	_NAN
};

class	ScalarConverter
{
	private:
		ScalarConverter();
		ScalarConverter(ScalarConverter &other);
		ScalarConverter	&operator=(ScalarConverter &other);
		~ScalarConverter();
	public:
		static	void	convert(string value);
};

#endif
