/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 09:08:51 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/20 13:32:24 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Serializer.hpp"

int	main()
{
	Data *ptr_data = new Data;

	ptr_data->value = 55;
	uintptr_t un_ptr = Serializer::serialize(ptr_data);
	Data *ptr_data2 = Serializer::deserialize(un_ptr);
	std::cout << ptr_data2->value << std::endl;

}
