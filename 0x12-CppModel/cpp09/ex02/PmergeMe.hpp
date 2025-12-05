/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PmergeMe.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/07 09:31:25 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/17 18:22:49 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PMERGEME_HPP
#define PMERGEME_HPP

#include <iostream>
#include <exception>
#include <vector>
#include <sstream>
#include <cctype>
#include <deque>
#include <utility>
#include <ctime>
#include <iomanip>

typedef std::string st;

class	PmergeMe
{
	private:
		int	saver;
		std::vector<st> vecString;
		std::vector<int> vec;
		std::deque<int> deq;
		double	durationVector;
		double	durationDeque;

		void	mergeDeque(std::deque<std::pair<int, int> >& deq, int left, int mid, int right);
		void	mergeSortDeque(std::deque<std::pair<int, int> >& deq, int left, int right);

		void	mergeVector(std::vector<std::pair<int, int> >& vec, int left, int mid, int right);
		void	mergeSortVector(std::vector<std::pair<int, int> >& vec, int left, int right);

		void	startParsing();
		void	sortVector();
		void	sortDeque();

	public:
		PmergeMe();
		PmergeMe(char **line);
		PmergeMe(const PmergeMe &old);
		PmergeMe&	operator=(const PmergeMe &other);
		~PmergeMe();

		void	run();

};

#endif