/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RPN.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/05 14:59:46 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/18 10:58:05 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "RPN.hpp"
#include <stdexcept>

ReversePolishNotation::ReversePolishNotation() {}
ReversePolishNotation::ReversePolishNotation(const ReversePolishNotation &old) {
	*this = old;
}

ReversePolishNotation&	ReversePolishNotation::operator=(const ReversePolishNotation &other) {
	if (this != &other)
	{
		this->line = other.line;
		this->stack = other.stack;
	}
	return *this;
}

ReversePolishNotation::~ReversePolishNotation() {}


ReversePolishNotation::ReversePolishNotation(st line)
{
	this->line = line;
}


void	ReversePolishNotation::rpn()
{
	int	i = 0;

	if (line == "")
	{
		throw std::runtime_error("empty argument");
	}

	while (line[i]) {
		if (std::isdigit(line[i]) && std::isdigit(line[i+1]))
		{
			throw std::runtime_error("find more than one number without leaving a space between them");
		}
		else if (std::isdigit(line[i]))
		{
			int nbr = line[i] - '0';
			stack.push(nbr);
		}
		else if (checkIfOperation(line[i]) != 0)
		{
			if (stack.size() > 1)
			{
				double value1;
				double value2;
				double result;

				value1 = stack.top();
				stack.pop();
				value2 = stack.top();
				stack.pop();

				if (checkIfOperation(line[i]) == 1)
				{
					result = value2 + value1;
					stack.push(result);
				}
				else if (checkIfOperation(line[i]) == 2)
				{
					result = value2 - value1;
					stack.push(result);
				}
				else if (checkIfOperation(line[i]) == 3)
				{
					result = value2 * value1;
					stack.push(result);
				}
				else if (checkIfOperation(line[i]) == 4)
				{
					if (value1 != 0)
					{
						result = value2 / value1;
						stack.push(result);
					}
					else {
						throw std::runtime_error("ZeroDivisionError");
					}
				}
			}
			else {
				throw std::runtime_error("Error");
			}
		}
		i++;
	}
	if (stack.size() != 1)
	{
		throw std::runtime_error("Error");
	}
	else {
		std::cout << stack.top() << std::endl;
	}

}

int	ReversePolishNotation::checkIfOperation(char o)
{
	if (o == '+')
		return 1;
	if (o == '-')
		return 2;
	if (o == '*')
		return 3;
	if (o == '/')
		return 4;
	return 0;
}