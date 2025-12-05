# MiniTalk

client-server communication program using unix signals.  demonstrates inter-process communication (ipc) by transmitting strings between processes using only `SIGUSR1` and `SIGUSR2`. 

## description

creates a simple communication system where a server receives strings from clients by transmitting each character bit by bit using two signals.  teaches unix signal handling, bit manipulation, ipc, and binary conversion.

## features

**mandatory**:
- server displays pid and receives strings from multiple clients
- client sends string to server using server's pid
- uses only `SIGUSR1` and `SIGUSR2` signals
- transmits each character as 8 bits with 800μs delay

**bonus**:
- acknowledgment system (server confirms receipt to client)
- unicode support
- message completion confirmation

## how it works

1. server starts and displays pid
2. client takes server pid and string as arguments
3. client converts each character to binary (8 bits)
4.  for each bit: send `SIGUSR1` for `1`, `SIGUSR2` for `0`
5. server receives signals and reconstructs character
6. server prints character once all 8 bits received

**example - 'A' (ascii 65 = 01000001)**:
```
bit 7-0: SIGUSR2, SIGUSR1, SIGUSR2, SIGUSR2, SIGUSR2, SIGUSR2, SIGUSR2, SIGUSR1
```

## project structure

```
minitalk/
├── server.c / server_bonus.c          # server implementation
├── client. c / client_bonus.c          # client implementation
├── minitalk.h / minitalk_bonus.h      # headers
├── utils.c / utils_bonus.c            # helper functions
└── Makefile
```

## compilation

```bash
make          # compile mandatory (server, client)
make bonus    # compile bonus (server_bonus, client_bonus)
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

## usage

**mandatory**:
```bash
# terminal 1
./server
# output: PID : 12345

# terminal 2
./client 12345 "hello, minitalk!"
# server displays: hello, minitalk!
```

**bonus**:
```bash
./server_bonus
./client_bonus 12345 "hello with confirmation!"
# client output: Vu :✓✓
# server output: hello with confirmation!
```

**multiple clients**: server handles messages from multiple clients sequentially.

## implementation details

**server**:
- `main()` - displays pid, sets up signal handlers with `sigaction`, waits with `pause()`
- `handler(int signal, siginfo_t *info, void *context)` - receives signals, stores bits, tracks client pid, converts 8 bits to character
- `byte_to_decimal(char *byte)` - converts binary string to decimal and prints character

**client**:
- `main(int argc, char **argv)` - validates arguments, sends each character
- `send_bit(int value, int pid)` - converts character to 8 bits, sends each bit as signal, uses bit masking `1 << 7` to `1 << 0`, includes `usleep(800)` delay

**signal flow**:
```
client --SIGUSR1/SIGUSR2 (bits)--> server (store bits)--> convert to char --> print
```

**bonus acknowledgment**:
```
client --send character bits--> server --SIGUSR1 confirmation--> client (print "Vu :✓✓")
```

**helper functions**: `ft_atoi` (string to int), `ft_putchar`, `ft_putstr`, `ft_putnbr`

## key concepts

**unix signals**: software interrupts for asynchronous events (`SIGUSR1`, `SIGUSR2`, `kill(pid, signal)`, `sigaction()`)

**bit manipulation**:
```c
value |= (1 << position);        // set bit to 1
if (value & (1 << position))     // check if bit is 1
```

**binary to decimal**: `"10000001"` → `1*(1<<7) + 0 + ...  + 1*(1<<0)` = 129

## testing

```bash
./client [PID] "hello"                                              # simple message
./client [PID] "12345"                                              # numbers
./client [PID] "hello! @#$%"                                        # special chars
./client [PID] "this is a very long message..."                     # long message
./client_bonus [PID] "hello 世界 🌍"                                 # unicode (bonus)
./client [PID] "message 1" & ./client [PID] "message 2" &           # multiple clients
./client [PID] "$(python3 -c 'print("A"*1000)')"                    # stress test
```

## troubleshooting

**garbled messages**: increase `usleep()` delay  
**no reception**: check server pid, ensure server running, verify no signal blocking  
**bonus ack fails**: ensure client has signal handler, client sends null byte, use `pause()` to wait

## requirements

- written in c, follows 42 norm, no memory leaks
- compilation: `-Wall -Wextra -Werror`
- allowed functions: `write`, `signal`, `sigemptyset`, `sigaddset`, `sigaction`, `kill`, `getpid`, `malloc`, `free`, `pause`, `sleep`, `usleep`, `exit`

---

**grade**: validated ✅  
**developed by**: sbouabid  
**created**: december 9, 2023