/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parsing_map_values.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/16 16:17:59 by sbouabid          #+#    #+#             */
/*   Updated: 2024/05/20 09:54:03 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	full_map(char *line, t_map **map, t_temp *temp, t_cub3d *cub)
{
	if (temp->c != 1 || temp->ea != 1 || temp->f != 1
		|| temp->no != 1 || temp ->so != 1 || temp->we != 1)
	{
		free(line);
		free_cub(cub);
		ft_puterror("check_for_vars::vars missing in the file");
	}
	if (check_if_valid(line, temp) == 1)
	{
		free(line);
		free_cub(cub);
		ft_puterror("check_for_map::invalid map");
	}
	if (check_if_empty(line) == 0)
		list_add(map, list_create(line));
}

void	pars_values_temp_1(int flag, t_cub3d *cub3d, t_temp *temp, char **new)
{
	if (flag == 1)
	{
		temp->no += 1;
		cub3d->no = ft_strtrim(new[1], "\n");
	}
	else if (flag == 2)
	{
		temp->so += 1;
		cub3d->so = ft_strtrim(new[1], "\n");
	}
	else if (flag == 3)
	{
		temp->we += 1;
		cub3d->we = ft_strtrim(new[1], "\n");
	}
	else if (flag == 4)
	{
		temp->ea += 1;
		cub3d->ea = ft_strtrim(new[1], "\n");
	}
}

void	pars_values_temp(t_cub3d *cub3d, t_temp *temp, char **new)
{
	if (ft_strcmp(new[0], "NO") == 0)
		pars_values_temp_1(1, cub3d, temp, new);
	else if (ft_strcmp(new[0], "SO") == 0)
		pars_values_temp_1(2, cub3d, temp, new);
	else if (ft_strcmp(new[0], "WE") == 0)
		pars_values_temp_1(3, cub3d, temp, new);
	else if (ft_strcmp(new[0], "EA") == 0)
		pars_values_temp_1(4, cub3d, temp, new);
	else if (ft_strcmp(new[0], "F") == 0)
	{
		temp->f += 1;
		cub3d->f = pars_color(new, temp);
	}
	else if (ft_strcmp(new[0], "C") == 0)
	{
		temp->c += 1;
		cub3d->c = pars_color(new, temp);
	}
	else if (new[0][0] == '1')
		temp->find_map = 1;
}

int	parsing_map_values(char *line, t_temp *temp, t_cub3d *cub3d)
{
	char	**new;

	if (line[0] == '\n' && temp->find_map == 1)
		return (1);
	if (line[0] == '\n')
		return (0);
	if (temp->find_map == 1)
		return (1);
	new = ft_split(line, ' ');
	if (new == NULL)
		return (0);
	if (size_arr(new) != 2 && new[0][0] != '1')
	{
		free(line);
		free_arr(new);
		ft_puterror("check_for_map::invalid map");
	}
	pars_values_temp(cub3d, temp, new);
	free_arr(new);
	return (temp->find_map);
}
