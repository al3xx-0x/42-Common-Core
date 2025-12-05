# LIBFT

a collection of useful c functions that will serve as a foundation for future projects.  the library includes reimplementations of standard c library functions and additional utility functions. 

## project requirements

- **coding standards**: must comply with the norm
- **memory management**: all heap-allocated memory must be properly freed
- **error handling**: no segfaults, bus errors, or double frees
- **compilation**: must compile with `-Wall -Wextra -Werror`

## structure

```
libft/
├── ft_*. c          # source files with ft_ prefix
├── libft.h         # header with function prototypes
└── Makefile        # compilation rules
```

## makefile rules

```bash
make          # compile library (libft.a)
make clean    # remove object files
make fclean   # remove object files and library
make re       # recompile from scratch
make bonus    # compile bonus functions
```

## part 1 - libc functions

reimplementation of standard c library functions with `ft_` prefix:

**character classification**: `ft_isalpha`, `ft_isdigit`, `ft_isalnum`, `ft_isascii`, `ft_isprint`

**string manipulation**: `ft_strlen`, `ft_strlcpy`, `ft_strlcat`, `ft_strchr`, `ft_strrchr`, `ft_strncmp`, `ft_strnstr`, `ft_strdup`

**memory manipulation**: `ft_memset`, `ft_bzero`, `ft_memcpy`, `ft_memmove`, `ft_memchr`, `ft_memcmp`, `ft_calloc`

**conversion**: `ft_atoi`, `ft_toupper`, `ft_tolower`

## part 2 - additional functions

utility functions not part of the standard library:

- `ft_substr` - extract substring from string
- `ft_strjoin` - concatenate two strings
- `ft_strtrim` - trim characters from string edges
- `ft_split` - split string into array by delimiter
- `ft_strmapi` - apply function to each character
- `ft_striteri` - apply function to each character with index
- `ft_itoa` - convert integer to string
- `ft_putchar_fd` - output character to file descriptor
- `ft_putstr_fd` - output string to file descriptor
- `ft_putendl_fd` - output string + newline to file descriptor
- `ft_putnbr_fd` - output integer to file descriptor

## bonus part

additional functions in `*_bonus.c` and `*_bonus.h` files.  compile with `make bonus`.

## compilation example

```bash
# compile library
make

# use in your project
gcc -Wall -Wextra -Werror main.c -L. -lft -o program
```

## testing

create test programs to verify function correctness. recommended for defense preparation.

## submission

submit to assigned git repository. only work in the repository will be graded. 

---

**good luck!** 🎯