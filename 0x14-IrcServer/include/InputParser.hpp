/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   InputParser.hpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:28 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/03 16:04:24 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once
#include <iostream>
#include <vector>
#include "String.hpp"
#include "Utils.hpp"
class InputParser {
	private:
		std::string	input;
		vectorString args;
	public:
		InputParser();
		InputParser(std::string &input);
		~InputParser();
		void						setArgs(std::string args);
		void						split();
		vectorString 				&getArgs();
		std::string					&getInput();
};
