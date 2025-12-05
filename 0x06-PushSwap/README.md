# PushSwap

a sorting algorithm project that sorts a stack of integers using limited operations with minimum moves.   teaches algorithm optimization, complexity analysis, and data structure manipulation.

## description

sort data on a stack with a limited set of instructions using the smallest number of moves.   receives a list of integers and sorts them using two stacks (a and b) with specific operations.

**operation targets**:
- **3 numbers**: max 3 operations
- **5 numbers**: max 12 operations
- **100 numbers**: <700 (5pts), <900 (4pts), <1100 (3pts), <1300 (2pts), <1500 (1pt)
- **500 numbers**: <5500 (5pts), <7000 (4pts), <8500 (3pts), <10000 (2pts), <11500 (1pt)

## features

**mandatory**: `push_swap` outputs smallest instruction list to sort stack a, optimized algorithm, input validation, error handling  
**bonus**: `checker` verifies if operations correctly sort the stack, reads operations from stdin

## available operations

| operation | description | action |
|-----------|-------------|--------|
| `sa`/`sb`/`ss` | swap | swap first 2 elements (a/b/both) |
| `pa`/`pb` | push | take first element from b→a or a→b |
| `ra`/`rb`/`rr` | rotate | shift all up by 1 (first→last, a/b/both) |
| `rra`/`rrb`/`rrr` | reverse rotate | shift all down by 1 (last→first, a/b/both) |

## project structure

```
push_swap/
├── SRC/
│   ├── main.c, push_swap.h         # main program
│   ├── ft_algo.c, ft_sort3.c       # sorting algorithms
│   ├── ft_a.c, ft_b.c, ft_ab.c     # stack operations
│   ├── ft_stack.c, ft_main_stack.c # stack management
│   ├── ft_handler.c, ft_atoi.c     # validation & utils
│   └── ft_split.c, index.c         # utilities
├── BONUS/                          # checker program
├── GTN/                            # get_next_line for bonus
└── Makefile
```

## compilation

```bash
make          # compile push_swap
make bonus    # compile checker
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

## usage

**push_swap**:
```bash
./push_swap 2 1 3                    # output: sa
./push_swap 5 4 3 2 1                # outputs operations
./push_swap "3 2 1"                  # single string argument
./push_swap 4 67 3 87 23 | wc -l     # count operations
```

**checker (bonus)**:
```bash
./checker 3 2 1
sa
rra
# ctrl+d → output: OK or KO

ARG="4 67 3 87 23"; ./push_swap $ARG | ./checker $ARG  # output: OK
ARG=$(seq 1 100 | shuf); ./push_swap $ARG | ./checker $ARG
```

## algorithm explanation

**indexed chunking approach**:

1. **indexing**: assign index to each number (0 for smallest, n-1 for largest)
   ```
   original:  5  2  8  1  4
   indices:   2  1  4  0  3
   ```

2. **push to b (chunking)**: divide stack a into chunks (3 chunks for 100 numbers, 11 for 500), push elements to b strategically

3. **push back to a (sorted)**: find largest index in b, optimize moves, push to a, rotate if needed

**special cases**:
- **2 elements**: swap if needed
- **3 elements**: max 2 operations using specific algorithm
- **5 elements**: push 2 smallest to b, sort 3 in a, push back

**data structures**:
```c
typedef struct s_stack {
    int x;                  // actual value
    int index;              // sorted position index
    struct s_stack *next;   // linked list
} t_stack;
```

**optimization techniques**: indexing, chunking, strategic rotation, combined operations (rr, ss, rrr)

## testing

```bash
# generate random numbers
ARG=$(seq 1 100 | shuf | tr '\n' ' '); ./push_swap $ARG | wc -l
ARG=$(seq 1 500 | shuf | tr '\n' ' '); ./push_swap $ARG | wc -l

# test with checker
ARG=$(seq 1 100 | shuf | tr '\n' ' '); ./push_swap $ARG | ./checker $ARG

# edge cases
./push_swap 1 2 3 4 5        # already sorted
./push_swap 5 4 3 2 1        # reverse sorted
./push_swap 1 2 2 3          # duplicates (error)
./push_swap 1 2 abc 3        # non-integer (error)
./push_swap 1 2147483648 3   # out of range (error)
./push_swap -5 -1 -3 -2 -4   # negative numbers
./push_swap                  # empty input
./push_swap 42               # single number
```

## performance benchmarks

**typical results**: 3 nums (0-3 ops), 5 nums (0-12 ops), 100 nums (400-700 ops), 500 nums (3500-5500 ops)

**complexity**: time O(n log n) average, space O(n)

## error handling

displays "error\n" to stderr for: non-integer arguments, out of range numbers (int_min to int_max), duplicates, invalid syntax, empty strings

## requirements

- written in c, follows 42 norm, no memory leaks
- compilation: `-Wall -Wextra -Werror`
- allowed functions: `write`, `read`, `malloc`, `free`, `exit`

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: december 20, 2023