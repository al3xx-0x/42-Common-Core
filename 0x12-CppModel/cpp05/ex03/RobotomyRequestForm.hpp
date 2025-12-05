/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RobotomyRequestForm.hpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/12 15:17:00 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:37 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ROBOTOMYREQUESTFORM_HPP
#define ROBOTOMYREQUESTFORM_HPP

#include "AForm.hpp"
#include "Bureaucrat.hpp"

class	RobotomyRequestForm : public AForm
{
	private:
		string	_target;
	public:
	RobotomyRequestForm();
	RobotomyRequestForm(string target);
	RobotomyRequestForm(RobotomyRequestForm &other);
	RobotomyRequestForm &operator=(RobotomyRequestForm &other);
	~RobotomyRequestForm();
	void	execute(Bureaucrat const & executor) const;
};

#endif
