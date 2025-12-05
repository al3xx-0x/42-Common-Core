/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parsing_map_utils.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: sbouabid <sbouabid@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/19 19:04:20 by sbouabid          #+#    #+#             */
/*   Updated: 2024/05/19 19:04:53 by sbouabid         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	draw_map(t_cub3d *cub, t_map **map)
{
	int		i;
	int		size;
	t_map	*current;

	i = 0;
	size = list_size(*map);
	cub->map = malloc((size + 1) * sizeof(char *));
	if (!cub->map)
		return ;
	current = *map;
	while (i < size && current != NULL)
	{
		cub->map[i] = ft_strtrim(current->line, "\n");
		current = current->next;
		i++;
	}
	cub->map[i] = NULL;
	list_clean(map);
}

int	check_if_empty(char	*line)
{
	int	i;

	i = 0;
	while (line[i] != '\0' && (line[i] == ' ' || line[i] == '\n'))
	{
		i++;
	}
	if (line[i] == '\0')
	{
		return (1);
	}
	return (0);
}

int	check_if_valid(char	*line, t_temp *temp)
{
	int	i;

	i = 0;
	while (line[i])
	{
		if (line[i] != '1' && line[i] != '0' && line[i] != ' ' && line[i] != 'N'
			&& line[i] != 'S' && line[i] != 'E' && line[i] != 'W'
			&& line[i] != '\n')
			return (1);
		if ((line[i] == '1' || line[i] == '0' || line[i] == 'N'
				|| line[i] == 'S' || line[i] == 'E' || line[i] == 'W')
			&& temp->find_new_line == 1)
			return (1);
		i++;
	}
	if (check_if_empty(line))
		temp->find_new_line = 1;
	return (0);
}
