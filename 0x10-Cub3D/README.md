# cub3d

a 3d maze exploration game inspired by **wolfenstein 3d**, the first-ever fps.    uses raycasting to create dynamic 3d perspective from a 2d map, teaching computer graphics and game development fundamentals.

## description

realistic 3d graphical representation of a maze from first-person perspective using **ray-casting**.    introduces ray-casting algorithms, texture mapping, player movement/rotation, collision detection, and 3d perspective rendering from 2d data using **mlx42** graphics library.

**core functionality**: first-person 3d view, smooth wasd movement, arrow key rotation, realistic rendering (wall height based on distance), texture mapping (n/s/e/w walls), floor/ceiling colors (rgb)

**graphics**: ray-casting engine, dda algorithm (digital differential analysis), distance correction (fish-eye removal), texture sampling, 1920x1080 resolution

**map features**: `. cub` file format, wall collision, multiple spawn directions (n/s/e/w), flexible layout (closed map with `1` walls and `0` spaces)

## project structure

```
cub3d/
├── include/header.h                      # structures and prototypes
├── libft/                                # utilities (atoi, calloc, split, etc.)
├── gnl/                                  # get_next_line for file reading
├── parsing/
│   ├── start_parsing.c                  # main parsing
│   ├── parsing_map.c, parsing_map_name.c, parsing_map_color.c, parsing_map_values.c, parsing_map_utils.c
│   ├── list. c, utils.c                  # utilities
├── exec/
│   ├── main.c, game. c                   # entry point and game loop
│   ├── cast_rays.c, render_wall.c       # ray-casting and rendering
│   ├── move_player.c, key_handle.c      # movement and input
│   ├── utils.c, free. c                  # utilities and cleanup
├── MLX42/                               # graphics library
├── texture/                             # wall texture pngs
├── maps/                                # example . cub maps
└── Makefile
```

## compilation

```bash
make          # compile game (cub3D)
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

**prerequisites**: macos/linux, gcc/clang, make, glfw (`brew install glfw`), cmake (for mlx42)

**build mlx42** (if needed):
```bash
cd MLX42 && cmake -B build && cmake --build build && cd .. 
```

## usage

```bash
./cub3D maps/map. cub
```

**controls**: `W` (forward), `A` (strafe left), `S` (backward), `D` (strafe right), `←/→` (rotate), `ESC` (exit)

**map file format (`. cub`)**:
```
NO texture/north. png          # north wall texture
SO texture/south.png          # south wall texture
WE texture/west.png           # west wall texture
EA texture/east.png           # east wall texture
F 60,179,110                  # floor color (r,g,b)
C 255,200,160                 # ceiling color (r,g,b)

111111111111
101000000001
101011111001
100010001001
111110101101
100000100001
101111101111
10N000000001          # N/S/E/W = player start position and direction
111111111111
```

**map components**: `1` (wall), `0` (walkable space), `N/S/E/W` (player start/direction), must be surrounded by walls

## implementation details

**data structures**:
```c
typedef struct s_cub3d { char **map, *no, *so, *we, *ea; int f, c, p_x, p_y, map_cols, map_rows; } t_cub3d;
typedef struct s_player { int plyr_x, plyr_y, rot, l_r, u_d; double angle; float fov_rd; } t_player;
typedef struct s_ray { float ray_ngl, distance, v_inter_x, v_inter_y, h_inter_x, h_inter_y; int ray, flag; } t_ray;
```

**ray-casting algorithm**:
1. cast rays for each screen column (1920 rays) at angle: `player_angle - (fov/2) + (i * fov/s_w)`
2. find horizontal and vertical wall intersections (dda algorithm)
3. calculate distances: `distance = sqrt(pow(x2-x1, 2) + pow(y2-y1, 2))`
4. choose closest intersection (horizontal flag=1, vertical flag=0)
5. apply fish-eye correction: `corrected_distance = distance * cos(ray_angle - player_angle)`
6. calculate wall height: `wall_height = (tile_size / corrected_distance) * projection_distance`

**texture mapping**:
1. determine texture (n/s/e/w based on ray direction)
2. calculate texture x offset: `texture_x = (int)(hit_pos * texture_width / tile_size) % texture_width`
3.  calculate texture y for each pixel: `texture_y = (y - top_pixel) * (texture_height / wall_height)`
4. sample color and render: `color = texture[texture_y * width + texture_x]`

**movement & collision**:
```c
new_x = player_x + move_x * cos(angle) + move_y * sin(angle);
new_y = player_y + move_x * sin(angle) - move_y * cos(angle);
if (! is_wall(new_x, new_y)) { player_x = new_x; player_y = new_y; }
```

## key concepts

**ray-casting**: simplified 3d technique (one horizontal ray per column, fast, no shadows/reflections) vs **ray-tracing** (photorealistic, rays bounce, accurate lighting, expensive)

**fov**: `fov_rad = (pi * 60) / 180`, `ray_angle = player_angle - (fov_rad/2) + (i * fov_rad/s_w)`

**fish-eye correction**: use perpendicular distance, not euclidean: `corrected = distance * cos(ray_angle - player_angle)`

**angle normalization**: `angle = fmod(angle, 2*pi); if (angle < 0) angle += 2*pi;`

**constants**: `s_w=1920`, `s_h=1080`, `tile_size=64`, `fov=60`, `rotation_speed=0.030`, `player_speed=6`, `pi=3.1415926535`

## testing

**valid maps**: `./cub3D maps/map.cub`, `./cub3D maps/map1.cub`  
**errors**: invalid extension (`. txt`), missing file, open map (not enclosed), invalid texture path, invalid rgb (0-255), multiple/no players, invalid characters  
**movement**: test wasd, arrow keys, wall collision, corner navigation

## error handling

displays error and exits for: wrong file extension, file not found, invalid texture path, missing map elements, invalid rgb (must be 0-255), open map, multiple/no players, invalid characters, empty map

## common issues

**textures not loading**: check paths in `.cub`, verify pngs exist in `texture/`, check permissions  
**glfw not found**: `brew install glfw`, update makefile paths  
**fish-eye effect**: use perpendicular distance: `distance * cos(ray_angle - player_angle)`  
**gaps between walls**: increase dda precision, check wall height calculation  
**memory leaks**: free all textures (`mlx_delete_texture`), images (`mlx_delete_image`), terminate mlx (`mlx_terminate`)

## requirements

- written in c, follows 42 norm, no memory leaks
- compilation: `-Wall -Wextra -Werror -O3 -ffast-math`
- allowed functions: `open`, `close`, `read`, `write`, `printf`, `malloc`, `free`, `perror`, `strerror`, `exit`, math library (`-lm`), all mlx42 functions

---

**grade**: validated ✅  
**developed by**: touahman & sbouabid  
**created**: may 22, 2024  
*"the first fps that changed gaming forever - now yours to recreate!"* 🎮