/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Contact.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 10:51:08 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/06 17:38:14 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CONTACT_HPP
#define CONTACT_HPP

#include <iostream>


class Contact
{
	private:
		std::string	_FirstName;
		std::string	_LastName;
		std::string	_NickName;
		std::string	_PhoneNumber;
		std::string	_DarkestSecret;
		void	addSpace(std::string str);
		int		CheckIfEmpty(std::string str);
		int		CheckIfNumbers(std::string str);
	public:
		int		setFirstName();
		int		setLastName();
		int		setNickName();
		int		setPhoneNumber();
		int		setDarkestSecret();
		void	printTableInfo(int index);
		void	printFullInfo();
};


#endif
