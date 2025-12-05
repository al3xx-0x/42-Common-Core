/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: touahman <touahman@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/22 17:15:52 by touahman          #+#    #+#             */
/*   Updated: 2024/05/29 17:02:28 by touahman         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/header.h"

int	main(int ac, char **av)
{
	t_cub3d	cub3d;

	cub3d.ea = NULL;
	cub3d.no = NULL;
	cub3d.so = NULL;
	cub3d.we = NULL;
	cub3d.map = NULL;
	if (ac != 2)
	{
		ft_puterror("one file must be provided with <.cub> extension");
	}
	start_parsing(av[1], &cub3d);
	start_gaming(&cub3d);
}
