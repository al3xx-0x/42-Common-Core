/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:24:24 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 17:09:44 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef  DOG_HPP
#define DOG_HPP

#include "Animal.hpp"
#include "Brain.hpp"

class	Dog : public Animal
{
	private:
		Brain	*brain;
	public:
		Dog();
		~Dog();
		Dog(Dog &other);
		Dog &operator=(const Dog &other);
		void	makeSound() const;
		std::string getType() const;
};

#endif
