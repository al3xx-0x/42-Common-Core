/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Span.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 15:38:31 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 16:21:43 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef	SPAN_HPP
#define SPAN_HPP

#include <iostream>
#include <vector>

typedef unsigned int un_int;

class Span
{
	private:
		un_int _N;
		std::vector<int> span;
	public:
		Span(un_int N);
		Span(const Span &other);
		Span& operator=(const Span &other);
		~Span();

		void	addNumber(int nbr);
		int		shortestSpan();
		int		longestSpan();

		class	errorMaxSpan : public std::exception
		{
			const char *what() const throw();
		};
		class	errorCalculateSpan : public std::exception
		{
			const char *what() const throw();
		};
};


#endif
