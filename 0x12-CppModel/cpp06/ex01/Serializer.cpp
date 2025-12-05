/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Serializer.cpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 08:27:11 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/20 13:35:19 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Serializer.hpp"
#include <sys/_types/_uintptr_t.h>

Serializer::Serializer() {}
Serializer::Serializer(Serializer &other) {
	*this = other;
}
Serializer	&Serializer::operator=(Serializer &other) {
	if (this != &other)
		return *this;
	return *this;
}
Serializer::~Serializer() {}

uintptr_t Serializer::serialize(Data *ptr)
{
	return reinterpret_cast<uintptr_t>(ptr);
}

Data*	Serializer::deserialize(uintptr_t raw)
{
	return reinterpret_cast<Data*>(raw);
}
