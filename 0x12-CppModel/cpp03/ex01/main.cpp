/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/21 20:34:25 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/21 21:44:42 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScavTrap.hpp"

int	main()
{
	ScavTrap clap("finn");

	clap.attack("lich");
	clap.takeDamage(10);
	clap.beRepaired(200);
	clap.attack("Ice King");
	clap.takeDamage(400);
	clap.guardGate();
}
