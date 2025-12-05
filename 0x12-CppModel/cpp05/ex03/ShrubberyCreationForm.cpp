/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ShrubberyCreationForm.cpp                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/12 14:43:51 by sbouabid          #+#    #+#             */
/*   Updated: 2024/08/13 09:28:32 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ShrubberyCreationForm.hpp"

ShrubberyCreationForm::ShrubberyCreationForm()
	: AForm("Default", 145, 137), _target("Default")
	{
		std::cout << "ShrubberyCreationForm: Default Constructor Called\n";
	}

ShrubberyCreationForm::ShrubberyCreationForm(string target)
	: AForm(target, 145, 137), _target(target)
	{
		std::cout << "ShrubberyCreationForm: Constructor Called\n";
	}

ShrubberyCreationForm::ShrubberyCreationForm(ShrubberyCreationForm &other)
{
	*this = other;
}

ShrubberyCreationForm	&ShrubberyCreationForm::operator=(ShrubberyCreationForm &other)
{
	if (this != &other)
		_target = other._target;
	return *this;
}

ShrubberyCreationForm::~ShrubberyCreationForm()
{
	std::cout << "ShrubberyCreationForm: Destructor Called\n";
}

void ShrubberyCreationForm::execute(Bureaucrat const & executor) const
{
	if (!this->isSigned() && executor.getGrade() > this->getGrade())
		throw AForm::GradeTooLowException();
	string tree =
	"              _{\\ _{\\{\\/}/}/}__\n"
	"             {/{/\\}{/{/\\}(\\}{/\\} _\n"
	"            {/{/\\}{/{/\\}(_)\\}{/{/\\}  _\n"
	"         {\\{/\\}\\}{/{/\\}\\}{/){/\\}\\} /\\}\n"
	"        {/{/(_)\\}{\\{/\\)}{\\(_){/}/}/}/}\n"
	"       _{\\{/{/{\\{/{/(_)\\}/}/}{\\(/}/}/}\n"
	"      {/{/{\\{\\{\\(/}{\\{\\/}/}{\\}(_){\\/}\\}\n"
	"      _{\\{/{\\{/(_)\\}/}{/{/{/\\}\\})\\}{/\\}\n"
	"     {/{/{\\{\\(/}{/{\\{\\{\\/})/}{\\(_)/}/}\\}\n"
	"      {\\{\\/}(_){\\{\\{\\/}/}(_){\\/}{\\/}/})/}\n"
	"       {/{\\{\\/}{/{\\{\\{\\/}/}{\\{\\/}/}\\}(_)\n"
	"      {/{\\{\\/}{/){\\{\\{\\/}/}{\\{\\(/}/}\\}/}\n"
	"       {/{\\{\\/}(_){\\{\\{\\(/}/}{\\(_)/}/}\\}\n"
	"         {/({/{\\{/{\\{\\/}(_){\\/}/}\\}/}(\\}\n"
	"          (_) {/{\\/}{\\{\\/}/}{\\{\\)/}/}(_)\n"
	"            {/{/{\\{\\/}{/{\\{\\{(_)}/}\n"
	"             {/{\\{\\{\\/}/}{\\{\\\\}/}\n"
	"              {){/ {\\/}{\\/} \\}\\}\n"
	"              (_)  \\.-'.-/\n"
	"          __...--- |'-.-'| --...__\n"
	"   _...--\"   .-'   |'-.-'|  ' -.  \"\"--..__\n"
	" -\"    ' .  . '    |.'-._| '  . .  '   jro\n"
	" .  '-  '    .--'  | '-.'|    .  '  . '\n"
	"          ' ..     |'-_.-|\n"
	"  .  '  .       _.-|-._ -|-._  .  '  .\n"
	"              .'   |'- .-|   '.\n"
	"  ..-'   ' .  '.   `-._.-�   .'  '  - .\n"
	"   .-' '        '-._______.-'     '  .\n"
	"        .      ~,\n"
	"    .       .     .   .    ' '-.\n";


	std::ofstream	MyFile(_target + "_shrubbery");
	if (!MyFile.is_open())
	{
		std::cout << "open filed!\n";
		return;
	}
	MyFile << tree ;
	MyFile.close();
}
