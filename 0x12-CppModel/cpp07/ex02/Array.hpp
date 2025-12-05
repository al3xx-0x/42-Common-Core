/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Array.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/23 10:33:18 by sbouabid          #+#    #+#             */
/*   Updated: 2024/09/23 13:27:21 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ARRAY_HPP
#define ARRAY_HPP

#include <iostream>
#include <sys/types.h>

typedef unsigned int un_int;

template <class T>
class   Array
{
	private:
		size_t _size;
		T *arr;
	public:
		Array()
			: arr(nullptr), _size(0)
		{
			std::cout << "default constuctor called" << std::endl;
		}

		Array(un_int n)
			: _size(n)
		{
			std::cout << "constructor called" << std::endl;
			arr = new T[n];
		}

		Array(const Array<T>& other)
			: _size(0), arr(nullptr)
		{
			*this = other;
		}

		Array &operator=(const Array<T> &other)
		{
			if (this != &other)
			{
				delete [] arr;
				_size = other._size;
				if (other._size > 0)
				{
					arr = new T[other._size];
					for (un_int i = 0; i < other._size; i++)
					{
						arr[i] = other.arr[i];
					}
				}
				else {
					arr = nullptr;
				}
			}
			return *this;
		}

		class Above : public std::exception {
			public :
				const char *what() const throw(){
					return ("index is out of bounds");
				}
		};

		T& operator[](un_int n)
		{
			if (n >= _size)
			{
				throw Above();
			}
			return arr[n];
		}

		const T& operator[](un_int n) const
		{
			if (n >= _size)
			{
				throw Above();
			}
			return arr[n];
		}

		un_int size() const
		{
			return _size;
		}

		~Array()
		{
			std::cout << "destructor called" << std::endl;
			delete [] arr;
		}
};

#endif
