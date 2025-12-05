# Printf

custom implementation of the c standard library `printf()` function as part of the 42 school curriculum. 

## description

recreating the behavior of `printf()` with support for variadic functions, format parsing, and type conversion.

## supported format specifiers

| specifier | description | output |
|-----------|-------------|--------|
| `%c` | character | single character |
| `%s` | string | string of characters |
| `%p` | pointer | pointer address in hexadecimal (prefixed with `0x`) |
| `%d` / `%i` | decimal/integer | signed decimal integer |
| `%u` | unsigned | unsigned decimal integer |
| `%x` / `%X` | hexadecimal | unsigned hexadecimal (lowercase/uppercase) |
| `%%` | percent | literal `%` character |

**special handling**: null strings print as `(null)`, null pointers as `0x0`, handles `INT_MIN` correctly.

## project structure

```
ft_printf/
├── ft_printf.c         # main printf implementation
├── ft_printf. h         # header file
├── ft_putchar.c        # character output
├── ft_putstr.c         # string output
├── ft_putnbr.c         # signed integer output
├── ft_putunsigned.c    # unsigned integer output
├── ft_puthex_lower.c   # lowercase hex output
├── ft_puthex_upper.c   # uppercase hex output
├── ft_putptr.c         # pointer address output
└── Makefile            # build automation
```

## compilation

```bash
make          # compile library (libftprintf.a)
make clean    # remove object files
make fclean   # remove object files and library
make re       # recompile from scratch
```

## usage

```c
#include "ft_printf.h"

int main(void)
{
    int count;
    
    count = ft_printf("hello, %s!\n", "world");
    ft_printf("character: %c\n", 'a');
    ft_printf("decimal: %d, hex: %x\n", 42, 255);
    ft_printf("unsigned: %u\n", 123456);
    
    int num = 42;
    ft_printf("pointer: %p\n", &num);
    ft_printf("chars printed: %d\n", count);
    
    return 0;
}
```

**compile your program**:
```bash
make
gcc -Wall -Wextra -Werror your_program.c -L. -lftprintf -o your_program
./your_program
```

## implementation details

**core function**: `int ft_printf(const char *str, ...)` - parses format string, handles specifiers using `va_arg`, returns character count. 

**helper functions**: all take `int *len` to track character count:
- `ft_putchar`, `ft_putstr`, `ft_putnbr`, `ft_putunsigned`, `ft_puthex_lower`, `ft_puthex_upper`, `ft_putptr`

## learning objectives

- variadic functions using `<stdarg.h>`
- format specifier implementation
- type and base conversion (decimal, hexadecimal)
- modular and reusable code design
- 42 school norm compliance

## notes

- uses only `write()` system call for output
- compilation flags: `-Wall -Wextra -Werror`
- no buffer management like original `printf()`

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: november 9, 2023