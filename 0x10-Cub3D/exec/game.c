/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/22 17:41:58 by touahman          #+#    #+#             */
/*   Updated: 2024/05/22 17:41:59 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

void	get_angle(t_mlx *mlx)
{
	char	c;

	c = mlx->cub3d->map[mlx->cub3d->p_y][mlx->cub3d->p_x];
	if (c == 'E')
		mlx->player->angle = 0;
	else if (c == 'S')
		mlx->player->angle = M_PI / 2;
	else if (c == 'W')
		mlx->player->angle = M_PI;
	else if (c == 'N')
		mlx->player->angle = M_PI * 1.5;
}

int	install_textures(t_mlx *mlx)
{
	mlx->text->no = mlx_load_png(mlx->cub3d->no);
	if (!mlx->text->no)
		return (printf("Wrong Texture\n"), 1);
	mlx->text->so = mlx_load_png(mlx->cub3d->so);
	if (!mlx->text->so)
		return (printf("Wrong Texture\n"), 1);
	mlx->text->we = mlx_load_png(mlx->cub3d->we);
	if (!mlx->text->we)
		return (printf("Wrong Texture\n"), 1);
	mlx->text->ea = mlx_load_png(mlx->cub3d->ea);
	if (!mlx->text->ea)
		return (printf("Wrong Texture\n"), 1);
	return (0);
}

int	init_player(t_mlx mlx)
{
	find_player(&mlx);
	mlx.player->plyr_x = mlx.cub3d->p_x * TILE_SIZE + TILE_SIZE / 2;
	mlx.player->plyr_y = mlx.cub3d->p_y * TILE_SIZE + TILE_SIZE / 2;
	get_angle(&mlx);
	mlx.player->fov_rd = (PI * FOV) / 180;
	if (install_textures(&mlx))
		return (1);
	return (0);
}

void	start_graphics(void *ml)
{
	t_mlx	*mlx;

	mlx = ml;
	mlx_delete_image(mlx->mlx_p, mlx->mlx_img);
	mlx->mlx_img = mlx_new_image(mlx->mlx_p, S_W, S_H);
	if (!mlx->mlx_img)
		ft_free(mlx);
	move_player(mlx, 0, 0);
	cast_rays(mlx);
	mlx_image_to_window(mlx->mlx_p, mlx->mlx_img, 0, 0);
}

void	start_gaming(t_cub3d *cub3d)
{
	t_mlx	mlx;

	mlx.cub3d = cub3d;
	mlx.player = ft_calloc(1, sizeof(t_player));
	mlx.ray = ft_calloc(1, sizeof(t_ray));
	mlx.text = ft_calloc(1, sizeof(t_tex));
	if (!mlx.player || !mlx.ray || !mlx.text)
		exit(EXIT_FAILURE);
	mlx.mlx_p = mlx_init(S_W, S_H, "Cub3D", 0);
	if (!mlx.mlx_p)
		ft_free(&mlx);
	if (init_player(mlx))
		ft_free(&mlx);
	mlx.mlx_img = mlx_new_image(mlx.mlx_p, S_W, S_H);
	mlx_key_hook(mlx.mlx_p, &key_handler, &mlx);
	mlx_loop_hook(mlx.mlx_p, start_graphics, &mlx);
	mlx_loop(mlx.mlx_p);
	ft_free(&mlx);
}
