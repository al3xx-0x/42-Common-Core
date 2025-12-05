# GetNextLine

a function that reads a line from a file descriptor, one line at a time.  part of the 42 school curriculum focusing on file i/o, static variables, and memory management. 

## description

reads and returns a single line from a file descriptor. each successive call returns the next line until eof. includes bonus support for multiple file descriptors simultaneously.

## features

- **line-by-line reading**: returns one line at a time, including `\n` (except last line if no trailing newline)
- **static variable**: maintains state between function calls
- **configurable buffer size**: defined at compilation time
- **multiple file descriptors** (bonus): handles multiple fds concurrently
- **error handling**: handles invalid fds and memory allocation failures

## function prototype

```c
char *get_next_line(int fd);
```

**parameters**: `fd` - file descriptor to read from  
**return value**: line read from fd (including `\n` if present), or `NULL` on eof/error

## project structure

```
get_next_line/
├── get_next_line.c               # main implementation
├── get_next_line. h               # header file
├── get_next_line_utils. c         # helper functions
├── get_next_line_bonus.c         # multi-fd support
├── get_next_line_bonus. h         # bonus header
└── get_next_line_utils_bonus.c   # bonus helper functions
```

## compilation

```bash
# default buffer_size (19)
gcc -Wall -Wextra -Werror get_next_line.c get_next_line_utils. c -o gnl_test

# custom buffer_size
gcc -Wall -Wextra -Werror -D BUFFER_SIZE=42 get_next_line.c get_next_line_utils. c -o gnl_test

# bonus version (multiple file descriptors)
gcc -Wall -Wextra -Werror -D BUFFER_SIZE=42 get_next_line_bonus.c get_next_line_utils_bonus.c -o gnl_test
```

## usage

**basic example**:
```c
#include "get_next_line.h"
#include <fcntl.h>

int main(void)
{
    int fd = open("test.txt", O_RDONLY);
    char *line;
    
    while ((line = get_next_line(fd)) != NULL)
    {
        printf("%s", line);
        free(line);  // must free! 
    }
    close(fd);
    return (0);
}
```

**reading from stdin**:
```c
char *line;
while ((line = get_next_line(0)) != NULL)
{
    printf("you entered: %s", line);
    free(line);
}
```

**bonus - multiple file descriptors**:
```c
int fd1 = open("file1.txt", O_RDONLY);
int fd2 = open("file2.txt", O_RDONLY);

line1 = get_next_line(fd1);  // read from file1
line2 = get_next_line(fd2);  // read from file2
line1 = get_next_line(fd1);  // read next line from file1
```

## implementation details

**core functions**:
- `get_next_line(int fd)` - main function, uses static variable to preserve data between calls
- `read_buffer(int fd, char *tmp)` - reads in chunks of `BUFFER_SIZE` until newline or eof
- `read_line(char *tmp)` - extracts single line from buffer
- `next_line(char *tmp)` - updates static buffer for next call

**helper functions**: `ft_strlen`, `ft_strchr`, `ft_strjoin`, `ft_substr`, `ft_strdup`

**static variables**:
- mandatory: `static char *tmp` - single static buffer
- bonus: `static char *tmp[OPEN_MAX]` - array of buffers for multiple fds

## key concepts

- **buffer size**: determines bytes read per `read()` call (smaller = more calls, larger = more memory)
- **memory management**: caller must free returned line; internal cleanup on eof/error
- **allowed functions**: `read`, `malloc`, `free` only

## edge cases handled

empty files, files without final newline, very long lines, multiple consecutive newlines, invalid fds, read errors, memory allocation failures, edge `BUFFER_SIZE` values. 

## testing

```bash
# test different buffer sizes
gcc -D BUFFER_SIZE=1 get_next_line.c get_next_line_utils.c      # one char at a time
gcc -D BUFFER_SIZE=10000 get_next_line.c get_next_line_utils. c  # large buffer
```

test with: empty files, single line with/without `\n`, multiple lines, very long lines, only newlines. 

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: november 17, 2023