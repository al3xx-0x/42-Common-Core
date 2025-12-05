/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PresidentialPardonForm.hpp                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/13 09:00:32 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:48 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PRESIDENTIALPARDONFORM_HPP
#define PRESIDENTIALPARDONFORM_HPP

#include "AForm.hpp"

class	PresidentialPardonForm : public AForm
{
	private:
		string	_target;
	public:
		PresidentialPardonForm();
		PresidentialPardonForm(string target);
		PresidentialPardonForm(PresidentialPardonForm &other);
		PresidentialPardonForm &operator=(PresidentialPardonForm &other);
		~PresidentialPardonForm();
		void	execute(Bureaucrat const & executor) const;
};

#endif
