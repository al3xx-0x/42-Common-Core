#include "../include/String.hpp"
#include "Utils.hpp"

const char *String::WHITESPACES = " \t\v\f\r\n";

bool String::contains(char letter) {
	char *str = (char *) this->c_str();
	while (str && *str) {
		if (*str == letter)
			return true;
		str++;
	}
	return false;
}

bool String::contains(const char *letters) {
	char *str = (char *) this->c_str();
	while (str && *str) {
		if (strchr (letters, *str) != NULL)
			return true;
		str++;
	}
	return false;
}

String &String::toUpperCase() {
	char *string = (char *) this->c_str();
	size_t length = strlen(string);
	for (size_t n = 0; n < length; n++) {
		if (isalpha(string[n]) && islower(string[n])) {
			string[n] = string[n] - 32;
		}
	}
	return *this;
}

String &String::toLowerCase() {
	char *string = (char *) this->c_str();
	size_t length = strlen(string);
	for (size_t n = 0; n < length; n++) {
		if (isalpha(string[n]) && isupper(string[n])) {
			string[n] = string[n] + 32;
		}
	}
	return *this;
}

String::String() : std::string("") {

}


String::String(const char *s) : std::string(s) {

}

String::String(const std::string &s) : std::string(s) {

}

String::String(const String &s) : std::string(s) {

}

String::InvalidInputException::InvalidInputException() {

}

const char *String::InvalidInputException::what() const throw() {
	return ("Ma Input Ma Ta L3ba");
}

String::EmptyException::EmptyException() {

}

const char *String::EmptyException::what() const throw() {
	return ("Input 3ndek Khawi Am3lem");
}

bool String::containsOnly(const char *letters) {
	char *str = (char *) this->c_str();
	bool 	charDetected = false;
	if (letters && this->length() < strlen(letters))
		return false;
	while (str && *str) {
		if (strchr (letters, *str) == NULL)
			charDetected = true;
		str++;
	}
	return charDetected == false;
}
