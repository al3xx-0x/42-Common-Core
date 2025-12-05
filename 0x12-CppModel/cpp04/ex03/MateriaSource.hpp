/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MateriaSource.hpp                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 18:26:34 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 18:41:54 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MATERIASOURCE_HPP
#define MATERIASOURCE_HPP

#include "AMateria.hpp"
#include "IMateriaSource.hpp"

class	MateriaSource : public IMateriaSource
{
	private:
		AMateria	*slots[4];
	public:
		MateriaSource();
		~MateriaSource();
		MateriaSource(MateriaSource &other);
		MateriaSource &operator=(const MateriaSource &other);

		void learnMateria(AMateria* copy);
		AMateria* createMateria(std::string const & type);
};

#endif
