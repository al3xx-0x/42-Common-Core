/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Zombie.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/08 09:23:27 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/08 12:04:02 by sbouabid         ###   ########.fr       */
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

Zombie* zombieHorde( int N, std::string name );

#endif
