/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parsing_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/18 17:58:42 by sbouabid          #+#    #+#             */
/*   Updated: 2024/05/20 10:12:14 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	check_first_and_last(t_cub3d *cub)
{
	int	i;
	int	j;

	i = 0;
	while (cub->map[0][i])
	{
		if (cub->map[0][i] != ' ' && cub->map[0][i] != '1')
		{
			free_cub(cub);
			ft_puterror("check_for_map::invalid map");
		}
		i++;
	}
	j = size_arr(cub->map);
	i = 0;
	while (cub->map[j - 1][i])
	{
		if (cub->map[j - 1][i] != ' ' && cub->map[j - 1][i] != '1')
		{
			free_cub(cub);
			ft_puterror("check_for_map::invalid map");
		}
		i++;
	}
}

int	temp_check_player(t_temp *temp)
{
	if (temp->n > 1 || temp->s > 1 || temp->e > 1 || temp->w > 1)
		return (1);
	if (temp->n == 1 && (temp->s == 1 || temp->e == 1 || temp->w == 1))
		return (1);
	if (temp->s == 1 && (temp->e == 1 || temp->w == 1 || temp->n == 1))
		return (1);
	if (temp->e == 1 && (temp->s == 1 || temp->n == 1 || temp->w == 1))
		return (1);
	if (temp->w == 1 && (temp->s == 1 || temp->n == 1 || temp->e == 1))
		return (1);
	if (temp->w == 0 && temp->s == 0 && temp->n == 0 && temp->e == 0)
		return (1);
	return (0);
}

int	check_player(char **map)
{
	t_temp	temp;

	ft_memset(&temp, 0, sizeof(t_temp));
	while (map[temp.i])
	{
		temp.j = 0;
		while (map[temp.i][temp.j])
		{
			if (map[temp.i][temp.j] == 'N')
				temp.n += 1;
			else if (map[temp.i][temp.j] == 'S')
				temp.s += 1;
			else if (map[temp.i][temp.j] == 'E')
				temp.e += 1;
			else if (map[temp.i][temp.j] == 'W')
				temp.w += 1;
			temp.j++;
		}
		temp.i++;
	}
	return (temp_check_player(&temp));
}

void	temp_check_if_valid_map(int i, int j, int valid, t_cub3d *cub)
{
	while (cub->map[i][j])
	{
		if (cub->map[i][j] == ' ' || cub->map[i][j] == '1')
			j++;
		else
		{
			if (j > 0 && (cub->map[i][j - 1] == ' ' || cub->map[i][j + 1]
				== ' ' || cub->map[i][j + 1] == '\0' ))
				valid = 0;
			if (j == 0 && cub->map[i][j + 1] == '\0')
				valid = 0;
			if (cub->map[i + 1][j] == ' ' || cub->map[i - 1][j] == ' '
				|| cub->map[i + 1][j] == '\0' || cub->map[i - 1][j] == '\0' )
				valid = 0;
			if (!valid)
			{
				free_cub(cub);
				ft_puterror("check_for_map::invalid map");
			}
			j++;
		}
	}
}

void	check_if_valid_map(t_cub3d *cub)
{
	int	i;
	int	j;
	int	valid;

	if (size_arr(cub->map) < 3)
	{
		free_cub(cub);
		ft_puterror("check_for_map::invalid map");
	}
	if (check_player(cub->map) == 1)
	{
		free_cub(cub);
		ft_puterror("check_for_map::invalid map");
	}
	check_first_and_last(cub);
	i = 1;
	while (cub->map[i + 1] != NULL)
	{
		j = 0;
		valid = 1;
		temp_check_if_valid_map(i, j, valid, cub);
		i++;
	}
}
