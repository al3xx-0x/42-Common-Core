/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cast_rays.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/25 12:21:26 by touahman          #+#    #+#             */
/*   Updated: 2024/05/25 18:30:47 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

int	is_there_wall(float x, float y, t_mlx *mlx)
{
	int	map_x;
	int	map_y;

	if (x < 0 || y < 0)
		return (0);
	map_x = floor(x / TILE_SIZE);
	map_y = floor(y / TILE_SIZE);
	if ((map_y >= mlx->cub3d->map_rows || map_x >= mlx->cub3d->map_cols))
		return (0);
	if (mlx->cub3d->map[map_y]
		&& map_x <= (int)ft_strlen(mlx->cub3d->map[map_y]))
		if (mlx->cub3d->map[map_y][map_x] == '1')
			return (0);
	return (1);
}

int	ray_direct(float angle, float *inter, float *step, int horiz)
{
	if (horiz)
	{
		if (angle > 0 && angle < M_PI)
		{
			*inter += TILE_SIZE;
			return (0);
		}
		*step *= -1;
	}
	else
	{
		if (angle < 0.5 * M_PI || angle > 1.5 * M_PI)
		{
			*inter += TILE_SIZE;
			return (0);
		}
		*step *= -1;
	}
	return (1);
}

float	find_h_inter(t_mlx *mlx, float angle)
{
	float	xinter;
	float	yinter;
	float	xstep;
	float	ystep;
	int		pixel;

	angle = norm_angle(angle);
	ystep = TILE_SIZE;
	xstep = TILE_SIZE / tan(angle);
	yinter = floor(mlx->player->plyr_y / TILE_SIZE) * TILE_SIZE;
	pixel = ray_direct(angle, &yinter, &ystep, 1);
	xinter = mlx->player->plyr_x + (yinter - mlx->player->plyr_y) / tan(angle);
	if (((angle > M_PI / 2 && angle < 1.5 * M_PI) && xstep > 0)
		|| (!(angle > M_PI / 2 && angle < 1.5 * M_PI) && xstep < 0))
		xstep *= -1;
	while (is_there_wall(xinter, yinter - pixel, mlx))
	{
		xinter += xstep;
		yinter += ystep;
	}
	mlx->ray->h_inter_x = xinter;
	mlx->ray->h_inter_y = yinter;
	return (sqrt(pow(xinter - mlx->player->plyr_x, 2)
			+ pow(yinter - mlx->player->plyr_y, 2)));
}

float	find_v_inter(t_mlx *mlx, float angle)
{
	float	xinter;
	float	yinter;
	float	xstep;
	float	ystep;
	int		pixel;

	angle = norm_angle(angle);
	xstep = TILE_SIZE;
	ystep = TILE_SIZE * tan(angle);
	xinter = floor(mlx->player->plyr_x / TILE_SIZE) * TILE_SIZE;
	pixel = ray_direct(angle, &xinter, &xstep, 0);
	yinter = mlx->player->plyr_y + (xinter - mlx->player->plyr_x) * tan(angle);
	if (((angle > 0 && angle < M_PI) && ystep < 0)
		|| (!(angle > 0 && angle < M_PI) && ystep > 0))
		ystep *= -1;
	while (is_there_wall(xinter - pixel, yinter, mlx))
	{
		xinter += xstep;
		yinter += ystep;
	}
	mlx->ray->v_inter_x = xinter;
	mlx->ray->v_inter_y = yinter;
	return (sqrt(pow(xinter - mlx->player->plyr_x, 2)
			+ pow(yinter - mlx->player->plyr_y, 2)));
}

void	cast_rays(t_mlx *mlx)
{
	float	h_inter;
	float	v_inter;
	int		ray;

	ray = 0;
	mlx->ray->ray_ngl = mlx->player->angle - mlx->player->fov_rd / 2;
	while (ray < NUM_RAYS)
	{
		mlx->ray->flag = 0;
		h_inter = find_h_inter(mlx, mlx->ray->ray_ngl);
		v_inter = find_v_inter(mlx, mlx->ray->ray_ngl);
		if (v_inter <= h_inter)
		{
			mlx->ray->distance = v_inter;
		}
		else
		{
			mlx->ray->flag = 1;
			mlx->ray->distance = h_inter;
		}
		render_wall3d(mlx, ray);
		mlx->ray->ray_ngl += (mlx->player->fov_rd / NUM_RAYS);
		ray++;
	}
}
