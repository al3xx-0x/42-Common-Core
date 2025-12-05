//
// Created by Aissam Abouqassime-Eledrissi on 10/31/24.
//

#ifndef IRC_STRING_H
#define IRC_STRING_H

#include <iostream>
#include <map>
#include <vector>
typedef unsigned char byte;

class String : virtual public std::string {
	public:
		String();

		String(const char *s);

		String(const std::string &s);

		String(const String &s);

		bool contains(char letter);

		bool contains(const char *letters);

		bool containsOnly(const char *letters);

		String &toUpperCase();

		String &toLowerCase();

		static const char *WHITESPACES;

		class InvalidInputException : public std::exception {
		public:
			InvalidInputException();

			const char *what() const throw();
		};

		class EmptyException : public std::exception {
		public:
			EmptyException();

			const char *what() const throw();
		};
};


#endif //IRC_STRING_H
