/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Span.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 15:38:28 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 16:01:07 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Span.hpp"

Span::Span(un_int N)
	: _N(N)
{
	std::cout << "Constructor Called" << std::endl;
	span.reserve(_N);
}

Span::Span(const Span &other)
	: _N(other._N)
{
	*this = other;
}

Span&	Span::operator=(const Span &other)
{
	if (this != &other)
	{
		this->_N = other._N;
		span.reserve(_N);
		for (size_t i = 0; i < other.span.size(); i++)
		{
			span[i] = other.span[i];
		}
	}
	return *this;
}

Span::~Span()
{
	std::cout << "Destructor Called" << std::endl;
}

const char * Span::errorMaxSpan::what() const throw()
{
	return "Span is full. Cannot add more numbers.";
}

const char * Span::errorCalculateSpan::what() const throw()
{
	return "Not enough numbers to calculate shortest span.";
}


void	Span::addNumber(int nbr)
{
	if (span.size() == _N)
	{
		throw errorMaxSpan();
	}
	span.push_back(nbr);
}


int	Span::longestSpan()
{
	if (span.size() < 2)
	{
		throw errorCalculateSpan();
	}
	std::sort(span.begin(), span.end());
	return (span[span.size() - 1] - span[0]);
}

int	Span::shortestSpan()
{
	int min = span[span.size() - 1];
	if (span.size() < 2)
	{
		throw errorCalculateSpan();
	}
	std::sort(span.begin(), span.end());
	for (size_t i = 0; i < span.size() - 1; i++)
	{
		if ((span[i + 1] - span[i]) < min)
		{
			min = span[i + 1] - span[i];
		}
	}
	return min;
}
