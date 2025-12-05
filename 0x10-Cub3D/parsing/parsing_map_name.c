/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parsing_map_name.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/16 15:41:11 by sbouabid          #+#    #+#             */
/*   Updated: 2024/05/19 17:06:24 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

int	help_check_map(char *name, char *target)
{
	while (*target != '\0')
	{
		if (*target != *name)
			return (0);
		target++;
		name++;
	}
	if (*name == '\0' && *target == '\0')
		return (1);
	return (0);
}

void	check_map_name(char *name)
{
	char	*target;

	target = ".cub";
	while (*name)
	{
		if (*name == target[0])
		{
			if (help_check_map(name, target))
				return ;
		}
		name++;
	}
	ft_puterror("one file must be provided with <.cub> extension");
}
