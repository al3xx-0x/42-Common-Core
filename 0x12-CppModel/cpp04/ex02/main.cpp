/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/24 14:51:36 by sbouabid          #+#    #+#             */
/*   Updated: 2024/07/25 08:46:24 by sbouabid         ###   ########.fr       */
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

int main()
{
	// atexit(f);

	Animal *a[20];

	for (int i = 0; i < 20; i++)
	{
		if (i < 10)
		{
			a[i] = new Dog;
		}
		else
		{
			a[i] = new Cat;
		}
	}


	for (int i = 0; i < 20; i++) {
		delete a[i];
	}

	// const Animal* j = new Dog();
	// const Animal* i = new Cat();
	// std::cout << j->getType() << " : ";
	// j->makeSound();
	// std::cout << i->getType() << " : ";
	// i->makeSound();
	// delete j;
	// delete i;

	return 0;
}

