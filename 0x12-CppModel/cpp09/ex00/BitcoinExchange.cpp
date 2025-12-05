/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BitcoinExchange.cpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/02 11:03:41 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/18 14:31:40 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "BitcoinExchange.hpp"

BitcoinExchange::BitcoinExchange()
{
	std::cout << "Constructor Called" << std::endl;
}

BitcoinExchange::BitcoinExchange(char *file)
{
	this->file = file;
	dataFile.open("data.csv");
	if (!dataFile.is_open())
	{
		throw std::runtime_error("could not open data file");
	}
	inputFile.open(file);
	if (!inputFile.is_open())
	{
		dataFile.close();
		throw std::runtime_error("could not open data file");
	}
}

BitcoinExchange::BitcoinExchange(const BitcoinExchange &old)
{
	*this = old;
}

BitcoinExchange&	BitcoinExchange::operator=(const BitcoinExchange &other)
{
	if (this != &other)
	{
		this->file = other.file;
		this->Data = other.Data;
		this->dataFile.open("data.csv");
		if (other.dataFile.is_open()) {
			this->dataFile.open("data.csv");
		}
		if (other.inputFile.is_open()) {
			this->inputFile.open(this->file);
		}
	}
	return *this;
}

BitcoinExchange::~BitcoinExchange()
{
	dataFile.close();
	inputFile.close();
}

/*-----------------------------------------------------------------------------*/

void	BitcoinExchange::readDataFile()
{
	st	key;
	st	value;
	st	line;
	double	caster;

	getline(dataFile, line);
	while (getline(dataFile, line)) {
		size_t commaPos = line.find(',');
		if (commaPos != st::npos)
		{
			key = line.substr(0, commaPos);
			value = line.substr(commaPos + 1);
			std::stringstream stm(value);
			stm >> caster;
			Data.insert(std::make_pair(key, caster));
		}
	}
}

void	BitcoinExchange::readInputFile()
{
	st	line;
	getline(inputFile, line);
	if (line != "date | value")
	{
		throw std::runtime_error("this file must use the following format: \"date | value\".");
	}
	while (getline(inputFile, line)) {
		try {
			parsInputFile(line);
		} catch (std::exception &e) {
			std::cerr << "Error: "<< e.what() << std::endl;
		}
	}
}

void	BitcoinExchange::parsInputFile(st line)
{
	st	key;
	st	value;
	size_t pipPos = line.find('|');
	if (pipPos == st::npos)
	{
		throw std::runtime_error("bad input => " + line);
	}
	key = line.substr(0, pipPos);
	value = line.substr(pipPos + 1);
	pipPos = value.find('|');
	if (pipPos != st::npos)
	{
		throw std::runtime_error("bad input => " + line);
	}
	parsKey(key, line);
	parsValue(value, line);
	key = key.substr(0, key.length() - 1);
	value = value.substr(1);
	searchInMap(key, value);
}

void	BitcoinExchange::parsKey(st key, st line)
{
	varTemp temp;

	size_t	Pos = key.find(' ');
	if (Pos == st::npos || key[Pos + 1] != '\0')
		throw std::runtime_error("bad input => " + line);
	Pos = key.find('-');
	if (Pos != st::npos)
		temp.year = key.substr(0, Pos);
	else
	 	throw std::runtime_error("bad input => " + line);
	key = key.substr(Pos + 1);
	Pos = key.find('-');
	if (Pos != st::npos)
		temp.month = key.substr(0, Pos);
	else
		throw std::runtime_error("bad input => " + line);
	key = key.substr(Pos + 1);
	Pos = key.find('-');
	if (Pos != st::npos)
		throw std::runtime_error("bad input => " + line);
	Pos = key.find(' ');
	temp.day = key.substr(0, Pos);
	if (temp.year.length() != 4 || temp.month.length() != 2 || temp.day.length() != 2)
		throw std::runtime_error("bad input => " + line);
	if (isDigits(temp.year) != 1 || isDigits(temp.month) != 1 || isDigits(temp.day) != 1)
		throw std::runtime_error("bad input => " + line);
	fullVarTempValues(temp, line);
}

int	BitcoinExchange::isDigits(st value)
{
	int i = 0;
	while (value[i]) {
		if (!(value[i] >= '0' && value[i] <= '9'))
			return -1;
		i++;
	}
	return 1;
}

void	BitcoinExchange::fullVarTempValues(varTemp &temp, st line)
{
	temp.ss << temp.year;
	temp.ss >> temp.cast_year;
	temp.ss.str("");
	temp.ss.clear();

	temp.ss << temp.month;
	temp.ss >> temp.cast_month;
	temp.ss.str("");
	temp.ss.clear();

	temp.ss << temp.day;
	temp.ss >> temp.cast_day;

	if (temp.cast_year < 2009 || temp.cast_year > 2022)
		throw std::runtime_error("bitcoin not available at this time");
	if (temp.cast_month > 12 || temp.cast_month < 1)
		throw std::runtime_error("bad input => " + line);
	if (temp.cast_day < 1 || temp.cast_day > 31)
		throw std::runtime_error("bad input => " + line);
}

void	BitcoinExchange::parsValue(st value, st line)
{
	if (value[0] != ' ')
		throw std::runtime_error("bad input => " + line);
	value = value.substr(1);
	if (isFloat(value) == -1)
		throw std::runtime_error("bad input => " + line);
	if (value[0] == '-')
		throw std::runtime_error("not a positive number.");
	if (std::isdigit(value[0]) == 0 && std::isdigit(value[1]) == 0)
		throw std::runtime_error("bad input => " + line);
}

int	BitcoinExchange::isFloat(st value)
{
	int i = 0;
	int	checker = 0;
	if (value[i] == '-')
		i++;
	while (value[i])
	{
		if (value[i] >= '0' && value[i] <= '9')
			i++;
		else if (value[i] == '.')
		{
			if (checker == 0)
				checker++;
			else
			 	return -1;
			i++;
		}
		else
			return -1;
	}
	return 1;
}

void	BitcoinExchange::searchInMap(st key, st value)
{
	double cast;
	double val;
	std::stringstream ss(value);
	ss >> cast;
	if (ss.fail()) {
		throw std::runtime_error("too large a number.");
	}
	if (cast == 0)
	{
		throw std::runtime_error("0 is neither positive nor negative.");
	}
	if (cast > 1000)
	{
		throw std::runtime_error("too large a number.");
	}
	std::map<st, double>::iterator it = Data.lower_bound(key);
	if (it->first != key && it != Data.begin())
	{
		it--;
	}
	val = cast * it->second;
	std::cout << it->first << " => " << value << " = " << val << std::endl;
}