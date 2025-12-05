/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BitcoinExchange.hpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/02 11:02:20 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/18 11:26:29 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef	BITCOINEXCHANGE
#define BITCOINEXCHANGE

#include <fstream>
#include <iostream>
#include <map>
#include <exception>
#include <sstream>

typedef std::string st;

struct varTemp
{
	st	year;
	st	month;
	st	day;

	int	cast_year;
	int	cast_month;
	int	cast_day;

	std::stringstream	ss;
};

class	BitcoinExchange
{
	private:
		std::ifstream dataFile;
		std::ifstream inputFile;
		char	*file;
		std::map<st, double> Data;

		void	parsInputFile(st line);
		void	parsKey(st key, st line);
		void	parsValue(st value, st line);
		void	fullVarTempValues(varTemp &temp, st line);
		void	searchInMap(st key, st value);
		int		isDigits(st value);
		int		isFloat(st value);

	public:
		BitcoinExchange();
		BitcoinExchange(char *file);
		BitcoinExchange(const BitcoinExchange &old);
		BitcoinExchange&	operator=(const BitcoinExchange &other);
		~BitcoinExchange();

		void	readDataFile();
		void	readInputFile();
};

#endif