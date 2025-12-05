/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ShrubberyCreationForm.hpp                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/12 14:43:49 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:24 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SHRUBBERYCREATIONFORM_HPP
#define SHRUBBERYCREATIONFORM_HPP

#include "AForm.hpp"
#include "Bureaucrat.hpp"
#include <fstream>

class	ShrubberyCreationForm : public	AForm
{
	private:
		string _target;
	public:
		ShrubberyCreationForm();
		ShrubberyCreationForm(string target);
		ShrubberyCreationForm(ShrubberyCreationForm &other);
		ShrubberyCreationForm &operator=(ShrubberyCreationForm &other);
		~ShrubberyCreationForm();
		void	execute(Bureaucrat const & executor) const;
};

#endif
