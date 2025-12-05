/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 09:23:16 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 13:11:42 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"

int	main()
{
	Zombie *zombozo;
	int N = 10;
	zombozo = zombieHorde(N, "zombozo");
	for (int i = 0; i < N; i++)
	{
		zombozo[i].announce();
	}
	delete [] zombozo;
}
