/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Zombie.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 11:39:22 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 11:45:11 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ZOMBIE_HPP
#define ZOMBIE_HPP

#include <iostream>

class	Zombie
{
	private:
		std::string _name;

	public:
		Zombie(void);
		~Zombie();
		void	setName(std::string name);
		void	announce(void);
};

Zombie*	newZombie(std::string name );
void	randomChump( std::string name );


#endif
