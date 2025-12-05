/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   InputParser.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mait-elk <mait-elk@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/08 14:29:26 by mait-elk          #+#    #+#             */
/*   Updated: 2024/12/09 11:38:20 by mait-elk         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/InputParser.hpp"
#include "../include/Utils.hpp"

InputParser::InputParser(std::string &input) {
	this->input = input;
}
InputParser::InputParser() {
	this->input = "";
}
InputParser::~InputParser() {

}
void InputParser::setArgs(std::string args) {
	this->input = args;
}

void InputParser::split() {
	std::string part;
	bool in_space_mode = false;
	char 	*ptr = NULL;
	size_t wc = 0;

	for (size_t i = 0; i < this->input.length(); i++) {
		bool found_word = false;
		if (this->input[i] == ':')
		{
			if (strchr(this->input.c_str(), '\r'))
				ptr = (char *) strchr(this->input.c_str(), '\r');
			else if (strchr(this->input.c_str(), '\n') != NULL)
				ptr = (char *) strchr(this->input.c_str(), '\n');
			if (ptr)
				*ptr = '\0';
			std::string msg = &this->input[i + 1];
			if (msg.length() != 0) {
				args.push_back(&this->input.c_str()[i + 1]);
			}
			break;
		}
		if (strchr(String::WHITESPACES, this->input[i]) == NULL) {
			part.append(1, this->input[i]);
			in_space_mode = false;
		} else if (!in_space_mode && !part.empty()) {
			found_word = true;
			in_space_mode = true;
		}
		if (i == this->input.length() - 1 && !part.empty())
			found_word = true;
		if (found_word) {
			wc++;
			args.push_back(part);
			part = "";
		}
	}
	this->input = "";
}

vectorString	&InputParser::getArgs() {
	return this->args;
}

std::string	&InputParser::getInput() {
	return this->input;
}