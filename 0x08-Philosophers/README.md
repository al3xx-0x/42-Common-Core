# Philosophers

a multithreading and synchronization project solving the classic dining philosophers problem.    teaches concurrent programming, thread management, and deadlock prevention.

## description

simulates the dining philosophers problem by edsger dijkstra.    manages multiple threads (philosophers) sharing limited resources (forks) while avoiding deadlock, race conditions, and starvation. 

**scenario**: philosophers sit at round table → alternate eating, thinking, sleeping → need 2 forks to eat (one left, one right) → must not starve or die.

**states**: 🍴 taking fork, 🍝 eating (requires 2 forks), 💤 sleeping, 🤔 thinking, 💀 died

## problem statement

**challenges**: resource sharing (limited forks), mutual exclusion (one fork per philosopher), deadlock prevention (all waiting indefinitely), starvation prevention (all must eat), race conditions (shared data access), timing precision (death detected within 10ms). 

## project structure

```
philosophers/
├── philo. h              # structures and prototypes
├── main.c               # entry point and validation
├── parsing.c            # input validation
├── started_life.c       # thread creation and initialization
├── rotine.c             # philosopher routine (eat, sleep, think)
├── died.c               # death detection and monitoring
├── utils.c              # utilities (time, sleep, messages)
└── Makefile
```

## compilation

```bash
make          # compile program (philo)
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

## usage

```bash
./philo number_of_philosophers time_to_die time_to_eat time_to_sleep [number_of_times_each_philosopher_must_eat]
```

**arguments**: `number_of_philosophers` (int), `time_to_die` (ms), `time_to_eat` (ms), `time_to_sleep` (ms), `[meal_limit]` (optional int)

**examples**:
```bash
./philo 5 800 200 200           # 5 philosophers, no one should die
./philo 5 800 200 200 7         # stops when all eat 7 times
./philo 1 800 200 200           # 1 philosopher (should die)
./philo 4 410 200 200           # should not die
./philo 200 800 200 200         # stress test (many philosophers)
```

## implementation details

**data structures**:
```c
typedef struct s_data { int nbr_of_philo; long time_to_die, time_to_eat, time_to_sleep, nbr_of_times_eat, time; } t_data;
typedef struct s_philo { int id, nbr_of_philo, *die; long time, time_to_die, time_to_eat, time_to_sleep, nbr_of_times_eat, count_die; pthread_mutex_t *left_fork, *right_fork, *checkdeath, *msg, *died, *times; } t_philo;
typedef struct s_allocate { t_philo *philo; pthread_t *philos; pthread_mutex_t *forks, *msg, *checkdeath, *died, *times; } t_allocate;
```

**philosopher routine**:
```c
void *find_your_self(void *arg) {
    if (odd-numbered) wait_briefly;  // prevent deadlock
    if (no_meal_limit) loop_forever: eat → think → sleep;
    else loop_until_meal_count: eat → think → sleep;
}
```

**eating process**: pick right fork (lock) → pick left fork (lock) → update last meal time → decrement meal counter → print "is eating" → sleep for time_to_eat → release forks (unlock)

**death detection**: continuously check if (time since last meal > time_to_die) → set death flag → print death → exit.   also check if all ate required times. 

**synchronization**: mutexes for forks (one per philosopher), message printing, death check, death flag, meal counter.  **deadlock prevention**: odd philosophers delay, right fork first then left, quick fork release.

## key concepts

**threading**:
```c
pthread_create(&thread, NULL, function, arg);  // create
pthread_join(thread, NULL);                    // wait for finish
pthread_detach(thread);                        // detach (no join needed)
```

**mutexes**:
```c
pthread_mutex_init(&mutex, NULL);              // initialize
pthread_mutex_lock(&mutex);                    // lock (wait if locked)
pthread_mutex_unlock(&mutex);                  // unlock
pthread_mutex_destroy(&mutex);                 // destroy
```

**timing**: use `gettimeofday()` for millisecond precision, precise sleep with small `usleep(100)` loops.

**output format**: `timestamp_in_ms philosopher_id action` (e.g., `0 1 has taken a fork`, `200 1 is eating`, `410 2 died`)

## testing

**should not die**: `./philo 4 410 200 200`, `./philo 5 800 200 200`, `./philo 2 800 200 200`  
**should die**: `./philo 1 800 200 200`, `./philo 4 200 205 200`  
**with meal limit**: `./philo 5 800 200 200 7`, `./philo 4 410 200 200 10`  
**data race detection**: compile with `-fsanitize=thread`, run tests (should show no warnings)  
**performance**: test precision (10ms margin), many threads (200 philosophers), long simulations

## error handling

displays "invalid input" to stderr and exits with status 1 for: wrong argument count, non-numeric arguments, negative/zero values, invalid philosopher count. 

## common issues

**dies immediately**: check `time_to_die > time_to_eat`, verify fork release, check death logic  
**deadlock**: add delay for odd philosophers, check fork order, verify mutex unlocking  
**data race**: protect all shared variables with mutexes, use consistent lock ordering  
**interleaved messages**: protect printf with mutex, print complete message in one call  
**doesn't end with meal limit**: check counter decrement, verify all reach zero, synchronize counter checks

## requirements

- written in c, follows 42 norm, no memory leaks, no data races
- compilation: `-Wall -Wextra -Werror`, test with `-fsanitize=thread`
- allowed functions: `memset`, `printf`, `malloc`, `free`, `write`, `usleep`, `gettimeofday`, `pthread_*`
- **death detection**: within 10ms, **scalability**: handle 200 philosophers

## tips

start with 2-3 philosophers, use thread sanitizer, add strategic delays, protect all shared data, test edge cases (1, 2, 200 philosophers), monitor death detection, clean exit. 

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: january 24, 2024