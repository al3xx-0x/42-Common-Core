/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/22 17:42:27 by touahman          #+#    #+#             */
/*   Updated: 2024/05/22 17:42:30 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

float	norm_angle(float angle)
{
	if (angle < 0)
		angle += (2 * M_PI);
	if (angle > (2 * M_PI))
		angle -= (2 * M_PI);
	return (angle);
}

int	reverse_bytes(int argb)
{
	unsigned int	rgba;

	rgba = 0;
	rgba |= (argb & 0xFF) << 24;
	rgba |= (argb & 0xFF00) << 8;
	rgba |= (argb & 0xFF0000) >> 8;
	rgba |= (argb & 0xFF000000) >> 24;
	return (rgba);
}

int	count_rows(char **map)
{
	int	i;

	i = 0;
	while (map[i])
		i++;
	return (i);
}

void	find_player(t_mlx *mlx)
{
	int	i;
	int	j;

	i = 0;
	while (mlx->cub3d->map[i])
	{
		j = 0;
		while (mlx->cub3d->map[i][j])
		{
			if (mlx->cub3d->map[i][j] == 'N' || mlx->cub3d->map[i][j] == 'S'
				|| mlx->cub3d->map[i][j] == 'W' || mlx->cub3d->map[i][j] == 'E')
			{
				mlx->cub3d->p_x = j;
				mlx->cub3d->p_y = i;
			}
			j++;
		}
		i++;
	}
	mlx->cub3d->map_rows = count_rows(mlx->cub3d->map);
	mlx->cub3d->map_cols = ft_strlen(mlx->cub3d->map[0]);
}
