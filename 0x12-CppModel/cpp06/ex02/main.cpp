/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/20 14:39:44 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/20 16:38:23 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Base.hpp"
#include "A.hpp"
#include "B.hpp"
#include "C.hpp"
#include <typeinfo>

Base*	generate(void)
{
	std::srand(std::time(nullptr));
	int randomNum = std::rand() % 3;
	if (randomNum == 0)
		return new A;
	else if (randomNum == 1)
		return new B;
	else
		return new C;
}

void	identify(Base* p)
{
	if (dynamic_cast<A*>(p))
		std::cout << "A" << std::endl;
	else if (dynamic_cast<B*>(p))
		std::cout << "B" << std::endl;
	else if (dynamic_cast<C*>(p))
		std::cout << "C" << std::endl;

}

void	identify(Base& p)
{
	try {
		A a = dynamic_cast<A&>(p);
		std::cout << "A" << std::endl;
	} catch (std::bad_cast &e) {}
	try {
		B b = dynamic_cast<B&>(p);
		std::cout << "B" << std::endl;
	} catch (std::bad_cast &e) {}
	try {
		C c = dynamic_cast<C&>(p);
		std::cout << "C" << std::endl;
	} catch (std::bad_cast &e) {}
}

int	main()
{
	B * b = new B;
	Base * base = dynamic_cast<Base*>(b);
	identify(base);

	Base * base2 = dynamic_cast<Base*>(generate());
	identify(base2);

	Base * base3 =dynamic_cast<Base*>(generate());
	identify(*base3);


}
