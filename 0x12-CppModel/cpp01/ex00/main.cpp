/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 11:55:34 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 12:01:55 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"

int	main()
{
	Zombie z1;
	z1.setName("zombie 1");
	z1.announce();
	randomChump("zombie 2");
	Zombie *z3 = newZombie("zombie 3");
	z3->announce();
	delete z3;
}
