# MiniShell

a minimal unix shell implementation with command execution, pipes, redirections, environment variables, and built-in commands.   teaches system programming, process management, and parsing.

## description

simplified shell mimicking bash behavior.   creates a command-line interpreter that parses and executes commands, handles i/o redirections, manages environment variables, and implements built-in commands.

**core functionality**: command execution, custom prompt (`minishell::$`), command history (up/down arrows), path resolution, exit status (`$?`)

**redirections**: input `<`, output `>`, append `>>`, here document `<<`

**pipes**: pipe operator `|`, multiple pipes, pipeline execution

**environment variables**: expansion `$VAR`, exit status `$?`, full environment support

**built-ins**: `echo` (with `-n`), `cd`, `pwd`, `export`, `unset`, `env`, `exit`

**signals**: ctrl+c (interrupt, new prompt), ctrl+d (exit), ctrl+\ (ignored)

**quotes**: single `'` (prevent all interpretation), double `"` (allow `$` expansion), mixed quotes

## project structure

```
minishell/
├── includes/header.h                      # structures and prototypes
├── libft/                                 # libft utilities
├── parsing/
│   ├── main.c                            # entry point and main loop
│   ├── lexer.c, tokenizer.c, tokenizer2.c  # tokenization
│   ├── syntax.c                          # syntax validation
│   ├── expand.c, expand2.c, expand_redirect.c  # variable expansion
│   ├── fix_quotes.c, fix_quotes2.c, remove_quotes.c  # quote processing
│   ├── heredoc.c, redirect.c             # redirection and heredoc
│   ├── exec_line.c                       # execution preparation
│   ├── token_split.c, token_utils.c, list_utils.c  # utilities
│   ├── helper.c, helper2.c, handle_spaces.c  # helpers
│   └── signals.c                         # signal handling
├── exec/
│   ├── exc.c, exc2.c                     # execution logic
│   ├── builtins.c, builtins2.c           # built-in commands
│   ├── env.c, export.c, export2.c        # environment management
│   ├── path.c, conditions.c              # path resolution
└── Makefile
```

## compilation

```bash
make          # compile shell (minishell)
make clean    # remove object files
make fclean   # remove all generated files
make re       # recompile everything
```

**prerequisites**: gcc/clang, make, readline library (`brew install readline` on macos), macos/linux

## usage

```bash
./minishell
minishell::$
```

**basic commands**:
```bash
ls -la                          # execute command
cd /tmp && pwd                  # change directory
echo "hello world"              # echo
echo -n "no newline"            # echo without newline
exit / exit 42                  # exit shell
```

**environment variables**:
```bash
env                             # display environment
export MY_VAR=hello             # set variable
echo $MY_VAR                    # expand variable
unset MY_VAR                    # unset variable
echo $?                          # exit status
```

**redirections**:
```bash
echo "hello" > file.txt         # overwrite
echo "world" >> file.txt        # append
cat < file.txt                  # input
cat < in.txt > out.txt          # multiple redirections
```

**here document**:
```bash
cat << EOF                      # here document
> line 1
> line 2
> EOF
cat << EOF                      # with expansion
> hello $USER
> EOF
cat << 'EOF'                    # quoted delimiter (no expansion)
> $USER will not expand
> EOF
```

**pipes**:
```bash
ls | grep minishell             # simple pipe
cat file.txt | grep pattern | wc -l  # multiple pipes
cat < in.txt | grep word > out.txt   # pipe with redirections
```

**quotes**:
```bash
echo '$USER $PATH'              # single quotes (no expansion)
echo "$USER $PATH"              # double quotes (expansion)
echo "user: $USER" 'path: $PATH'  # mixed quotes
```

## implementation details

**data structures**:
```c
typedef enum e_token_type { COMMAND, ARG, STRING, PIPE, REDIN, REDOUT, APPEND, HERDOC, DELIMITER, INFILE, OUTFILE } t_token_type;
typedef struct s_env { char *name, *value; struct s_env *next; } t_env;
typedef struct s_pnode { t_token_type type; char *str; int fd_in, fd_out; struct s_pnode *prev, *next; } t_pnode;
```

**processing pipeline**: input reading (readline) → lexical analysis (add spaces around operators, handle quotes) → tokenization (split into tokens) → syntax validation → expansion (variables, `$? `) → quote removal → redirection setup (open files, set fds) → execution (fork, exec)

**built-ins**: echo, cd (update pwd/oldpwd), pwd, export, unset, env, exit

**redirection**: input `<` (open O_RDONLY, dup2 to stdin), output `>` (open O_WRONLY|O_CREAT|O_TRUNC, dup2 to stdout), append `>>` (open O_WRONLY|O_CREAT|O_APPEND, dup2 to stdout)

**pipe**: `pipe(fd)` → fork → child: dup2(fd[1], stdout), close fds, exec → parent: dup2(fd[0], stdin), close fds, continue

**here document**: create temp file in `/tmp`, read until delimiter, expand variables unless delimiter quoted, use fd as input, unlink after use

**signals**: sigint (ctrl+c) shows new prompt, sigquit (ctrl+\) ignored, eof (ctrl+d) exits shell

## testing

**commands**: `ls`, `pwd`, `echo hello`, `cat /etc/passwd`  
**built-ins**: `echo -n`, `cd /tmp && pwd`, `export VAR=value && echo $VAR`, `unset VAR`, `exit 42`  
**redirections**: `echo hello > file.txt`, `echo world >> file.txt`, `cat < file.txt`  
**pipes**: `ls | grep mini`, `cat file.txt | wc -l`, `ls -la | grep mini | wc -l`  
**quotes**: `echo 'hello $USER'`, `echo "hello $USER"`, `echo "hello" 'world' "$USER"`  
**errors**: `|`, `| ls`, `ls |`, `< >`, `nonexistentcommand`

## error handling

syntax error (exit 258), command not found (127), permission denied (126), file not found, invalid redirection, unclosed quotes (1)

## requirements

- written in c, follows 42 norm, no memory leaks, no segfaults
- compilation: `-Wall -Wextra -Werror`
- allowed functions: readline, printf, malloc, free, write, access, open, read, close, fork, wait*, signal*, exit, getcwd, chdir, stat*, unlink, execve, dup*, pipe, opendir, readdir, closedir, strerror, perror, isatty, tty*, ioctl, getenv, tc*, tget*, tgoto, tputs

## common issues

**readline not found**: `brew install readline`, update makefile with paths  
**memory leaks**: free readline input, clean environment list, close all fds, free all tokens/nodes  
**zombie processes**: always wait for children with waitpid/wait  
**broken pipe**: close all pipe ends properly, dup fds before closing

---

**grade**: validated ✅  
**developed by**: touahman & sbouabid  
**created**: march 2, 2024
