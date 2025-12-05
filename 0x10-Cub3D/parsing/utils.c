/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/16 15:41:38 by sbouabid          #+#    #+#             */
/*   Updated: 2024/05/19 19:03:40 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	free_arr(char **values)
{
	int	i;

	if (!values || !*values)
		return ;
	i = 0;
	while (values[i] != NULL)
	{
		free(values[i]);
		i++;
	}
	free(values);
}

void	ft_puterror(char *msg)
{
	int	i;

	i = 0;
	write(2, "Error\n", 7);
	while (msg[i])
	{
		write(2, &msg[i], 1);
		i++;
	}
	write(2, "\n", 1);
	exit(1);
}

int	size_arr(char **arr)
{
	int	i;

	i = 0;
	while (arr[i])
	{
		i++;
	}
	return (i);
}

void	free_cub(t_cub3d *cub)
{
	free(cub->no);
	free(cub->so);
	free(cub->we);
	free(cub->ea);
	free_arr(cub->map);
}
