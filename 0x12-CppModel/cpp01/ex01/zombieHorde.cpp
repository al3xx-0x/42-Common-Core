/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   zombieHorde.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 09:23:32 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 12:05:51 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"

Zombie*	zombieHorde( int N, std::string name )
{
	Zombie	*zombozo;

	zombozo = new Zombie[N];
	for (int i = 0; i < N; i++)
	{
		zombozo[i].setName(name);
	}
	return zombozo;
}
