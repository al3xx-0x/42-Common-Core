# SoLong

a simple 2d game where the player collects all collectibles and reaches the exit.   introduces graphical programming using the minilibx library. 

## description

create a top-down 2d game where the player navigates through a map, collects items, and finds an exit.   teaches graphical programming, event handling, and game logic implementation.

**objectives**: collect all collectibles (`C`), navigate to exit (`E`), avoid walls (`1`), complete with minimum moves.

## features

**mandatory**: 2d top-down game, map parsing (`.ber` files), graphical rendering with minilibx, player movement (wasd/arrows), collectibles, move counter (terminal), exit handling (esc/close button), custom xpm sprites  

**game components**: player (`P`), collectibles (`C`), exit (`E`), walls (`1`), empty space (`0`)

## map requirements

- **file extension**: `.ber`
- **rectangular**: all rows same length
- **surrounded by walls**: outer border all `1`s
- **required elements**: exactly 1 player (`P`), at least 1 collectible (`C`), exactly 1 exit (`E`), empty spaces (`0`), walls (`1`)
- **path validation**: valid path from player to all collectibles and exit

**example map**:
```
1111111111
1P00C0001
100111001
1C00E0001
1111111111
```

## project structure

```
so_long/
├── SRC/
│   ├── main.c, so_long.h           # main program
│   ├── game1.c, move.c             # game logic & movement
│   ├── parsing1.c/2.c/3.c          # map validation & path checking
│   ├── list. c, utils.c, utils_game.c  # utilities
├── GNL/                            # get_next_line for map reading
├── textures/                       # xpm sprites (player, wall, coin, exit, background)
├── maps/                           # example . ber maps
└── Makefile
```

## compilation

```bash
make          # compile game
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

creates executable `so_long`. 

## usage

```bash
./so_long [path_to_map. ber]

# examples
./so_long maps/map.ber
./so_long path/to/your_map.ber
```

**controls**: `W/↑` (up), `A/←` (left), `S/↓` (down), `D/→` (right), `ESC` (exit)

**gameplay**: navigate with wasd/arrows → collect all coins → reach exit → move counter displays in terminal each move. 

## implementation details

**data structures**:
```c
typedef struct s_map { char *line; struct s_map *next; } t_map;  // map linked list
typedef struct s_player { int i, j, x, y, size, player, collectible, exit; } t_player;  // player info
typedef struct s_game { void *init, *window, *image; int width, height, y, x, coin; char **map; } t_game;  // game state
typedef struct s_image { void *wall, *player, *back_ground, *exit, *coin; } t_image;  // textures
```

**core functions**:
- **parsing**: `check_map()`, `check_map_name()`, `open_map()`, `check_line()`, `if_valid_map()`
- **game logic**: `start_game()`, `full_map_image()`, `handel_key()`, `move_forward/down/left/right()`
- **movement**: check wall → check exit (allow if all coins) → collect coin → update map → update coords → print move count

**rendering**: tile-based (60x60px), xpm textures via `mlx_xpm_file_to_image()`, redraws on each move

## key concepts

**minilibx basics**:
```c
mlx_init();                                          // initialize
mlx_new_window(mlx, w, h, title);                    // create window
mlx_xpm_file_to_image(mlx, path, &w, &h);            // load xpm
mlx_put_image_to_window(mlx, win, img, x, y);        // display image
mlx_key_hook(win, funct, param);                     // key events
mlx_loop(mlx);                                       // event loop
```

**map validation algorithm**:
1. check `. ber` extension
2. read map into linked list
3. verify rectangular shape
4. check wall borders
5. validate element counts (1 P, 1 E, ≥1 C)
6. flood fill to check all collectibles/exit reachable
7. convert to 2d array

**flood fill**: used to validate reachability - create map copy, start from player position, recursively mark reachable positions, verify all C and E marked. 

## testing

**valid minimal map**:
```
1111
1PE1
1C01
1111
```

**test cases**:
```bash
./so_long maps/map. ber               # valid map
./so_long maps/map.txt               # invalid extension (error)
./so_long                            # no arguments (error)
./so_long map1.ber map2.ber          # multiple arguments (error)
./so_long nonexistent.ber            # file not found (error)
```

**invalid map examples**: missing walls, no collectibles, multiple players, non-rectangular, unreachable elements

## error handling

displays to stderr and exits with `exit(1)` for: invalid file extension, file not found, invalid map format, missing elements, invalid characters, non-rectangular map, unreachable collectibles, image loading failure, mlx init failure. 

**error messages**: "error in name map", "error in map", "error in image", "error in init"

## common issues

**mlx not found**: ensure minilibx installed, update makefile with correct path (macos: `-framework OpenGL -framework AppKit`, linux: `-lmlx -lX11 -lXext`)  
**textures not loading**: check file paths, verify xpm files exist, check permissions  
**window not responding**: ensure `mlx_loop()` called, verify event hooks and window pointer  
**map validation fails**: check `. ber` extension, rectangular shape, wall borders, element counts

## requirements

- written in c, follows 42 norm, no memory leaks
- compilation: `-Wall -Wextra -Werror`
- platform: macos or linux with minilibx

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: january 5, 2024