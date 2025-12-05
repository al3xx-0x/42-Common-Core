/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/09 09:05:31 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/09 15:32:55 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>
#include <fstream>

std::string replaceString(std::string line, std::string s1, std::string s2)
{
	int	index = line.find(s1);
	std::string	newline;
	newline = line.substr(0, index);
	newline += s2;
	line = line.substr(index + s1.length(), line.length());
	while (1)
	{
		index = line.find(s1);
		if (index == -1)
			break;
		newline += line.substr(0, index);
		newline += s2;
		line = line.substr(index + s1.length(), line.length());
	}
	newline += line;
	return newline;
}

int	main(int ac, char **av)
{
	if (ac != 4)
	{
		std::cout << "The program takes three parameters <filename> <s1> <s2>" << std::endl;
		return (0);
	}
	std::string	filename(av[1]);
	std::string	s1(av[2]);
	std::string	s2(av[3]);

	std::fstream	file1(filename);
	if (!file1.is_open())
	{
		std::cout << "invalid file name" << std::endl;
		return (0);
	}
	std::fstream	file2(filename + ".replace", std::ios::out);
	std::string	temp;
	std::string	line;

	while (1)
	{
		getline(file1, temp);
		line += temp;
		if (!file1.eof())
			line += "\n";
		else
			break;
	}
	if (line.find(s1) == std::string::npos)
	{
		file2 << line;
		return (0);
	}
	file2 << replaceString(line, s1, s2);
}
