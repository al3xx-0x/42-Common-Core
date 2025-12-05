/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RPN.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/10 09:22:59 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/10 09:35:02 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


#pragma once

#include <iostream>
#include <stack>
#include <sstream>

typedef std::string st;

class	ReversePolishNotation
{
	private:
		st	line;
		std::stack<int> stack;
	public:
		ReversePolishNotation();
		ReversePolishNotation(st line);
		// ~ReversePolishNotation();
		void	rpn();
		int		checkIfOperation(char o);

};

