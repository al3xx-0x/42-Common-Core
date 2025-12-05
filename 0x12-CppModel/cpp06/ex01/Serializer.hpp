/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Serializer.hpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 08:27:08 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/20 13:20:52 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SERIALIZER
#define SERIALIZER

#include <iostream>

struct	Data
{
	int value;
};

class	Serializer
{
	private:
		Serializer();
		Serializer(Serializer &other);
		Serializer	&operator=(Serializer &other);
		~Serializer();
	public:
		static	uintptr_t	serialize(Data* ptr);
		static	Data* deserialize(uintptr_t raw);
};

#endif
