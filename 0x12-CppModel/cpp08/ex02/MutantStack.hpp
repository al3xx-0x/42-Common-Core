/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MutantStack.hpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/26 17:39:51 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/26 18:56:37 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MUTANTSTACK_HPP
#define MUTANTSTACK_HPP

#include <stack>
#include <iostream>

template <typename T>
class	MutantStack : public std::stack<T>
{
	public:
		typedef typename std::stack<T>::container_type::iterator iterator;
		typedef typename std::stack<T>::container_type::reverse_iterator reverse_iterator;
		MutantStack()
			: std::stack<T>()
		{
			std::cout << "Contructor Called" << std::endl;
		}

		MutantStack(const MutantStack &other)
			: std::stack<T>(other)
			{}

		MutantStack&	operator=(const MutantStack &other)
		{
			if (this != &other)
			{
				std::stack<T>::operator=(other);
			}
			return *this;
		}

		~MutantStack()
		{
			std::cout << "Destructor Called" << std::endl;
		}

		iterator begin() {
			return this->c.begin();
		}

		iterator end() {
			return this->c.end();
		}

		reverse_iterator	rbegin()
		{
			return this->c.rbegin();
		}

		reverse_iterator	rend()
		{
			return this->c.rend();
		}
};

#endif

