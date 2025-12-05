/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   move_player.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/25 16:30:12 by touahman          #+#    #+#             */
/*   Updated: 2024/05/25 16:30:13 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	player_view(t_mlx *mlx, int i)
{
	if (i == 1)
	{
		mlx->player->angle += ROTATION_SPEED;
		mlx->player->angle = norm_angle(mlx->player->angle);
	}
	else
	{
		mlx->player->angle -= ROTATION_SPEED;
		mlx->player->angle = norm_angle(mlx->player->angle);
	}
}

void	change_playerxy(t_mlx *mlx, double move_x, double move_y)
{
	int		map_y;
	int		map_x;
	int		new_x;
	int		new_y;

	new_x = roundf(mlx->player->plyr_x + move_x);
	new_y = roundf(mlx->player->plyr_y + move_y);
	map_x = floor(new_x / TILE_SIZE);
	map_y = floor(new_y / TILE_SIZE);
	if ((map_y > 0 && map_y < (mlx->cub3d->map_rows))
		&& (map_x > 0 && map_x < (int)ft_strlen(mlx->cub3d->map[map_y]))
		&& mlx->cub3d->map[map_y][map_x] != '1' \
		&& mlx->cub3d->map[mlx->player->plyr_y / TILE_SIZE][map_x] != '1'
		&& mlx->cub3d->map[map_y][mlx->player->plyr_x / TILE_SIZE] != '1')
	{
		mlx->player->plyr_y = new_y;
		mlx->player->plyr_x = new_x;
	}
}

void	move_player(t_mlx *mlx, double h_velocity, double v_velocity)
{
	if (mlx->player->rot == 1)
		player_view(mlx, 1);
	if (mlx->player->rot == -1)
		player_view(mlx, 0);
	if (mlx->player->l_r == 1)
	{
		h_velocity = PLAYER_SPEED * -sin(mlx->player->angle);
		v_velocity = PLAYER_SPEED * cos(mlx->player->angle);
	}
	if (mlx->player->l_r == -1)
	{
		h_velocity = PLAYER_SPEED * sin(mlx->player->angle);
		v_velocity = PLAYER_SPEED * -cos(mlx->player->angle);
	}
	if (mlx->player->u_d == 1)
	{
		h_velocity = PLAYER_SPEED * cos(mlx->player->angle);
		v_velocity = PLAYER_SPEED * sin(mlx->player->angle);
	}
	if (mlx->player->u_d == -1)
	{
		h_velocity = PLAYER_SPEED * -cos(mlx->player->angle);
		v_velocity = PLAYER_SPEED * -sin(mlx->player->angle);
	}
	change_playerxy(mlx, h_velocity, v_velocity);
}
