/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/26 09:41:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/26 09:41:52 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CAT_HPP
#define CAT_HPP

#include "Animal.hpp"


class	Cat : public Animal
{
	public:
		Cat();
		~Cat();
		Cat(Cat &other);
		Cat &operator=(const Cat &other);
		void	makeSound() const;
		std::string getType() const;
};

#endif
