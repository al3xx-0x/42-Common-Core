/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   render_wall.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/26 16:39:18 by touahman          #+#    #+#             */
/*   Updated: 2024/05/26 16:39:19 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

double	offset_x(t_mlx *mlx, mlx_texture_t *texture)
{
	double	texture_ox;
	double	wall_hit;

	if (mlx->ray->flag == 1)
	{
		wall_hit = mlx->ray->h_inter_x * (texture->width / TILE_SIZE);
		texture_ox = (int)wall_hit % texture->width;
	}
	else
	{
		wall_hit = mlx->ray->v_inter_y * (texture->width / TILE_SIZE);
		texture_ox = (int)wall_hit % texture->width;
	}
	return (texture_ox);
}

mlx_texture_t	*get_texture(t_mlx *mlx)
{
	mlx->ray->ray_ngl = norm_angle(mlx->ray->ray_ngl);
	if (mlx->ray->flag)
	{
		if (mlx->ray->ray_ngl > 0 && mlx->ray->ray_ngl < M_PI)
			return (mlx->text->so);
		else
			return (mlx->text->no);
	}
	else
	{
		if (mlx->ray->ray_ngl > M_PI / 2 && mlx->ray->ray_ngl < 1.5 * M_PI)
			return (mlx->text->we);
		else
			return (mlx->text->ea);
	}
}

void	draw_floor_ceiling(t_mlx *mlx, int t_pixel, int b_pixel)
{
	int	i;

	i = 0;
	while (i < t_pixel)
	{
		mlx_put_pixel(mlx->mlx_img, mlx->ray->ray, i, mlx->cub3d->c);
		i++;
	}
	i = b_pixel;
	while (i < S_H)
	{
		mlx_put_pixel(mlx->mlx_img, mlx->ray->ray, i, mlx->cub3d->f);
		i++;
	}
}

void	draw_wall(t_mlx *mlx, int t_pixel, int b_pixel, double wall_height)
{
	mlx_texture_t	*texture;
	uint32_t		*arr;
	double			texture_ox;
	double			texture_oy;
	double			factor;

	texture = get_texture(mlx);
	arr = (uint32_t *)texture->pixels;
	factor = ((double)texture->height / wall_height);
	texture_ox = offset_x(mlx, texture);
	if (texture_ox < 0)
		texture_ox = 0;
	texture_oy = (t_pixel + (wall_height / 2) - (S_H / 2)) * factor;
	if (texture_oy < 0)
		texture_oy = 0;
	while (t_pixel < b_pixel)
	{
		mlx_put_pixel(mlx->mlx_img, mlx->ray->ray, t_pixel, reverse_bytes
			(arr[(texture->width * (int)texture_oy) + (int)texture_ox]));
		texture_oy += factor;
		t_pixel++;
	}
}

void	render_wall3d(t_mlx	*mlx, int ray)
{
	float	dis_from_pp;
	float	wall_height;
	float	top_pixel;
	float	bot_pixel;

	mlx->ray->distance *= cos(norm_angle
			(mlx->ray->ray_ngl - mlx->player->angle));
	dis_from_pp = (S_W / 2) / tan(mlx->player->fov_rd / 2);
	wall_height = (TILE_SIZE / mlx->ray->distance) * dis_from_pp;
	top_pixel = (S_H / 2) - (wall_height / 2);
	if (top_pixel < 0)
		top_pixel = 0;
	bot_pixel = (S_H / 2) + (wall_height / 2);
	if (bot_pixel > S_H)
		bot_pixel = S_H;
	mlx->ray->ray = ray;
	draw_floor_ceiling(mlx, top_pixel, bot_pixel);
	draw_wall(mlx, top_pixel, bot_pixel, wall_height);
}
