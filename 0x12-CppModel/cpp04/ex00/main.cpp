/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:51:36 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/24 16:31:55 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Animal.hpp"
#include "Dog.hpp"
#include "Cat.hpp"
#include "WrongAnimal.hpp"
#include "WrongCat.hpp"

// void	f()
// {
// 	system("leaks Animal");
// }

int	main()
{
	Animal *a = new Animal;
	Animal *b = new Cat;
	Animal *c = new Dog;

	// atexit(f);

	std::cout << a->getType() << " : ";
	a->makeSound();
	std::cout << b->getType() << " : ";
	b->makeSound();
	std::cout << c->getType() << " : ";
	c->makeSound();

	delete a;
	delete b;
	delete c;

	std::cout << "\n=================\n\n";

	WrongAnimal *wa = new WrongAnimal;
	WrongAnimal *wb = new WrongCat;
	std::cout << wa->getType() << " : ";
	wa->makeSound();
	std::cout << wb->getType() << " : ";
	wb->makeSound();

	delete wa;
	delete wb;
}
