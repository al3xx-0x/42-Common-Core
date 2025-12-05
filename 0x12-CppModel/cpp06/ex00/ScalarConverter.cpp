/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScalarConverter.cpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/19 10:08:14 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/20 13:41:17 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScalarConverter.hpp"
#include <iostream>
#include <sstream>

string	strTrim(string s1)
{
	int len = static_cast<int>(s1.length());
	for (int i = 0; i < len; i++) {
		if (s1[i] != ' ')
		{
			s1 = s1.substr(i, len - i);
			break;
		}
	}
	for (int i = len - 1; i >= 0; i--) {
		if (s1[i] != ' ')
		{
			s1 = s1.substr(0, i + 1);
			break;
		}
	}
	return s1;
}

bool	checkIfInt(string value)
{
	int	i = 0;
	if (value[0] == '-' || value[1] == '+')
		i = 1;
	while (value[i])
	{
		if (!isdigit(value[i]))
			return false;
		i++;
	}
	return true;
}

bool	checkIfFloat(string	value)
{
	int	i = 0;
	int len = static_cast<int>(value.length());
	int	nbrOfPoint = 0;
	if (value == ".f" || value == ".F" || value == "-.f" || value == "-.F")
		return false;
	if (value[0] == '+' || value[0] == '-')
		i = 1;
	while (i < len - 1)
	{
		if (!isdigit(value[i]) && value[i] != '.')
			return false;
		else if (value[i] == '.')
			nbrOfPoint++;
		i++;
	}
	if ((value[value.length() - 1] == 'f' || value[value.length() - 1] == 'F') && nbrOfPoint < 2)
		return true;
	return false;
}

bool	checkIfDouble(string value)
{
	int	i = 0;
	int	nbrOfPoint = 0;
	if (value[0] == '+' || value[0] == '-')
		i = 1;
	while (value[i])
	{
		if (!isdigit(value[i]) && value[i] != '.')
			return false;
		else if (value[i] == '.')
			nbrOfPoint++;
		i++;
	}
	if (nbrOfPoint < 2)
		return true;
	return false;
}

TYPE	getType(string	value)
{
	if (value.size() == 1)
		return _CHAR;
	if (checkIfInt(value))
		return _INT;
	if (checkIfFloat(value))
		return _FLOAT;
	if (checkIfDouble(value))
		return _DOUBLE;
	if (value == "+inf" || value == "+inff")
		return _PINF;
	if (value == "-inf" || value == "-inff")
		return _NINF;
	if (value == "nan" || value == "nanf")
		return _NAN;
	return _STRING;
}

void	CastFromChar(string value)
{
	int	newValue = value[0];
	if (isdigit(value[0]))
	{
		std::cout <<"char: Non displayable" << std::endl;
		newValue = value[0] - '0';
	}
	else
		std::cout << "char: " << value << std::endl;
	std::cout << "int: " << newValue << std::endl;
	std::cout << "float: " << std::fixed << std::setprecision(1) << static_cast<float>(newValue) << "f" << std::endl;
	std::cout << "double: " << std::setprecision(1) << static_cast<double>(newValue) << std::endl;
}

void	CastFromInt(string	value)
{
	int	newValue;

	std::stringstream	ss(value);
	ss >> newValue;
	if (ss.fail())
	{
		std::cout << "There is a problem with the conversion." << std::endl;
		return;
	}

	if (newValue > -127 && newValue <= 127)
		if (std::isprint(newValue))
			std::cout <<"char: " << static_cast<char>(newValue) << std::endl;
		else
			std::cout <<"char: Non displayable" << std::endl;
	else
		std::cout << "char:  impossible" << std::endl;
	std::cout << "int: " << newValue << std::endl;
	std::cout << "float: " << std::fixed << std::setprecision(1) << static_cast<float>(newValue) << "f" << std::endl;
	std::cout << "double: " << std::setprecision(1) << static_cast<double>(newValue) << std::endl;
}

void	CastFromFloat(string value)
{
	value = value.substr(0, value.length() - 1);
	float	newValue;
	int	temp;

	std::stringstream ss(value);
	ss >> newValue;
	if (ss.fail())
	{
		std::cout << "There is a problem with the conversion." << std::endl;
		return;
	}
	temp = static_cast<int>(newValue);
	if (temp > -127 && temp <= 127)
		if (std::isprint(temp))
			std::cout <<"char: " << static_cast<char>(temp) << std::endl;
		else
			std::cout <<"char: Non displayable" << std::endl;
	else
		std::cout << "char:  impossible" << std::endl;
	std::cout << "int: " << static_cast<int>(newValue) << std::endl;
	std::cout << "float: " << std::fixed << std::setprecision(1)<< newValue << "f" << std::endl;
	std::cout << "double: " << std::setprecision(1) << static_cast<double>(newValue) << std::endl;
}

void	CastFromDouble(string value)
{
	double	newValue;
	int temp;
	std::stringstream ss(value);
	ss >> newValue;
	if (ss.fail())
	{
		std::cout << "There is a problem with the conversion." << std::endl;
		return;
	}
	temp = static_cast<int>(newValue);
	if (temp > -127 && temp <= 127)
		if (std::isprint(temp))
			std::cout <<"char: " << static_cast<char>(temp) << std::endl;
		else
			std::cout <<"char: Non displayable" << std::endl;
	else
		std::cout << "char:  impossible" << std::endl;
	std::cout << "int: " << static_cast<int>(newValue) << std::endl;
	std::cout << "float: " << std::fixed << std::setprecision(1) << static_cast<float>(newValue) << "f" << std::endl;
	std::cout << "double: " << std::fixed << std::setprecision(1) << newValue << std::endl;
}

void	CastFromNan(void)
{
	std::cout << "char: impossible" << std::endl;
	std::cout << "int: impossible" << std::endl;
	std::cout << "float: nanf" << std::endl;
	std::cout << "float: nan" << std::endl;
}

void	CastFromPinf(void)
{
	std::cout << "char: impossible" << std::endl;
	std::cout << "int: impossible" << std::endl;
	std::cout << "float: +inff" << std::endl;
	std::cout << "float: +inf" << std::endl;
}

void	CastFromNinf(void)
{
	std::cout << "char: impossible" << std::endl;
	std::cout << "int: impossible" << std::endl;
	std::cout << "float: -inff" << std::endl;
	std::cout << "float: -inf" << std::endl;
}

void	CastFromString(void)
{
	std::cout << "char: impossible" << std::endl;
	std::cout << "int: impossible" << std::endl;
	std::cout << "float: impossible" << std::endl;
	std::cout << "double: impossible" << std::endl;
}

void	ScalarConverter::convert(string value)
{
	value = strTrim(value);
	TYPE type = getType(value);
	switch (type) {
		case _CHAR:
			CastFromChar(value);
			break;
		case _INT:
			CastFromInt(value);
			break;
		case _FLOAT:
			CastFromFloat(value);
			break;
		case _DOUBLE:
			CastFromDouble(value);
			break;
		case _NINF:
			CastFromNinf();
			break;
		case _PINF:
			CastFromPinf();
			break;
		case _NAN:
			CastFromNan();
			break;
		case _STRING:
			CastFromString();
			break;
	}
}
