/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PmergeMe.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/07 09:31:23 by sbouabid          #+#    #+#             */
/*   Updated: 2024/12/18 14:35:26 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PmergeMe.hpp"
#include <cstddef>
#include <ctime>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <utility>
#include <vector>

PmergeMe::PmergeMe() {}

PmergeMe::PmergeMe(char **line)
{
	saver = -1;
	int i = 1;

	while (line[i]) {
		st str = line[i];
		vecString.push_back(str);
		i++;
	}
}

PmergeMe::PmergeMe(const PmergeMe &old)
{
	*this = old;
}

PmergeMe&	PmergeMe::operator=(const PmergeMe &other)
{
	if (this != &other)
	{
		this->saver = other.saver;
		this->durationVector = other.durationVector;
		this->durationDeque = other.durationDeque;

		this->vecString = other.vecString;
		this->vec = other.vec;
		this->deq = other.deq;
	}
	return *this;
}

PmergeMe::~PmergeMe() {}


/* sart Vector Part*/

void	PmergeMe::mergeVector(std::vector<std::pair<int, int> >& vec, int left, int mid, int right) {
	int n1 = mid - left + 1;
	int n2 = right - mid;
	std::vector<std::pair<int, int> > L(n1), R(n2);
	for (int i = 0; i < n1; i++)
		L[i] = vec[left + i];
	for (int j = 0; j < n2; j++)
		R[j] = vec[mid + 1 + j];
	int i = 0, j = 0, k = left;
	while (i < n1 && j < n2) {
		if (L[i].first <= R[j].first) {
			vec[k] = L[i];
			i++;
		} else {
			vec[k] = R[j];
			j++;
		}
		k++;
	}
	while (i < n1) {
		vec[k] = L[i];
		i++;
		k++;
	}
	while (j < n2) {
		vec[k] = R[j];
		j++;
		k++;
	}
}

void	PmergeMe::mergeSortVector(std::vector<std::pair<int, int> >& vec, int left, int right) {
	if (left < right) {
		int mid = left + (right - left) / 2;
		mergeSortVector(vec, left, mid);
		mergeSortVector(vec, mid + 1, right);
		mergeVector(vec, left, mid, right);
	}
}


void	PmergeMe::sortVector()
{
	std::vector<std::pair<int, int> > vecPair;
	int x;
	if (vec.size() % 2 != 0)
	{
		x = vec.size() -1;
		saver = vec[vec.size() - 1];
	}
	else {
		x = vec.size();
	}
	for (int i = 0; i < x; i+=2) {
		vecPair.push_back(std::make_pair(vec[i], vec[i + 1]));
	}

	for (size_t i = 0; i < vecPair.size(); i++) {
		if (vecPair[i].first < vecPair[i].second)
		{
			std::swap(vecPair[i].first, vecPair[i].second);
		}
	}

	mergeSortVector(vecPair, 0, vecPair.size() - 1);

	vec.clear();
	vec.push_back(vecPair[0].second);
	for (size_t i = 0; i < vecPair.size(); i++)
	{
		vec.push_back(vecPair[i].first);
	}
	for (size_t i = 1; i < vecPair.size(); i++) {
		vec.insert(std::lower_bound(vec.begin(), vec.end(), vecPair[i].second), vecPair[i].second);
	}
	if (saver != -1)
	{
		vec.insert(std::lower_bound(vec.begin(), vec.end(), saver), saver);
	}
}

/* End Vector Part */

/*=====================================================*/

/* Start Deque Part */


void	PmergeMe::mergeDeque(std::deque<std::pair<int, int> >& deq, int left, int mid, int right) {
	int n1 = mid - left + 1;
	int n2 = right - mid;
	std::deque<std::pair<int, int> > L(n1), R(n2);
	for (int i = 0; i < n1; i++)
		L[i] = deq[left + i];
	for (int j = 0; j < n2; j++)
		R[j] = deq[mid + 1 + j];
	int i = 0, j = 0, k = left;
	while (i < n1 && j < n2) {
		if (L[i].first <= R[j].first) {
			deq[k] = L[i];
			i++;
		} else {
			deq[k] = R[j];
			j++;
		}
		k++;
	}
	while (i < n1) {
		deq[k] = L[i];
		i++;
		k++;
	}
	while (j < n2) {
		deq[k] = R[j];
		j++;
		k++;
	}
}

void	PmergeMe::mergeSortDeque(std::deque<std::pair<int, int> >& deq, int left, int right) {
	if (left < right) {
		int mid = left + (right - left) / 2;
		mergeSortDeque(deq, left, mid);
		mergeSortDeque(deq, mid + 1, right);
		mergeDeque(deq, left, mid, right);
	}
}


void	PmergeMe::sortDeque()
{
	std::deque<std::pair<int, int> > deqPair;
	int x;
	if (deq.size() % 2 != 0)
	{
		x = deq.size() -1;
		saver = deq[deq.size() - 1];
	}
	else {
		x = deq.size();
	}
	for (int i = 0; i < x; i+=2) {
		deqPair.push_back(std::make_pair(deq[i], deq[i + 1]));
	}

	for (size_t i = 0; i < deqPair.size(); i++) {
		if (deqPair[i].first < deqPair[i].second)
		{
			std::swap(deqPair[i].first, deqPair[i].second);
		}
	}

	mergeSortDeque(deqPair, 0, deqPair.size() - 1);

	deq.clear();
	deq.push_back(deqPair[0].second);
	for (size_t i = 0; i < deqPair.size(); i++)
	{
		deq.push_back(deqPair[i].first);
	}
	for (size_t i = 1; i < deqPair.size(); i++) {
		deq.insert(std::lower_bound(deq.begin(), deq.end(), deqPair[i].second), deqPair[i].second);
	}
	if (saver != -1)
	{
		deq.insert(std::lower_bound(deq.begin(), deq.end(), saver), saver);
	}
}


/* End Deque Part */


void	PmergeMe::run()
{
	startParsing();
	std::cout << "Before : ";
	for (size_t i = 0; i < vec.size(); i++) {
		std::cout << vec[i] << " ";
	}
	std::cout << std::endl;
	clock_t startVec = clock();
	sortVector();
	clock_t endVec = clock();
	durationVector = static_cast<double>(endVec - startVec) / CLOCKS_PER_SEC;

	clock_t startDec = clock();
	sortDeque();
	clock_t endDec = clock();
	durationDeque = static_cast<double>(endDec - startDec) / CLOCKS_PER_SEC;
	std::cout << "After : ";
	for (size_t i = 0; i < vec.size(); i++) {
		std::cout << vec[i] << " ";
	}
	std::cout << std::endl;
	std::cout << std::fixed << std::setprecision(5);
	std::cout << "Time to process a range of " << vec.size() << " elements with std::vector : " << durationVector << " us"<< std::endl;
	std::cout << "Time to process a range of " << deq.size() << " elements with std::deque : " << durationDeque << " us"<< std::endl;
}

void	PmergeMe::startParsing()
{
	std::vector<st>::iterator it = vecString.begin();
	while (it != vecString.end()) {
		int i = 0;
		st str = *it;
		while (str[i]) {
			if (std::isdigit(str[i]))
				i++;
			else
				throw std::runtime_error("The program should take numbers, not strings.");
		}
		it++;
	}
	it = vecString.begin();
	while (it != vecString.end()) {
		int caster;
		std::stringstream ss(*it);
		ss >> caster;
		if (ss.fail())
		{
			throw std::runtime_error("Enter a number in the range of integer");
		}
		vec.push_back(caster);
		deq.push_back(caster);
		it++;
	}
}
