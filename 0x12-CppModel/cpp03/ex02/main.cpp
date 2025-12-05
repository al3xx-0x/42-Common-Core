/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/21 20:34:25 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/22 09:59:36 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "FragTrap.hpp"

int	main()
{
	FragTrap	frag("finn");
	frag.highFivesGuys();
	frag.attack("lich");
	frag.beRepaired(50);
	frag.takeDamage(150);
	frag.beRepaired(100);
}
