/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RPN.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/05 14:59:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/18 10:58:18 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef RPN
#define RPN

#include <iostream>
#include <stack>

typedef std::string st;

class	ReversePolishNotation
{
	private:
		st	line;
		std::stack<double> stack;
		int		checkIfOperation(char o);
	public:
		ReversePolishNotation();
		ReversePolishNotation(st line);
		ReversePolishNotation(const ReversePolishNotation &old);
		ReversePolishNotation& operator=(const ReversePolishNotation &other);
		~ReversePolishNotation();

		void	rpn();

};


#endif
