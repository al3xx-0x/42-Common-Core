/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/21 20:34:25 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/22 10:36:44 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "DiamondTrap.hpp"

int	main()
{
	DiamondTrap diamond("finn");

	diamond.whoAmI();
	diamond.attack("ice king");
	diamond.takeDamage(50);
	diamond.beRepaired(100);
}
