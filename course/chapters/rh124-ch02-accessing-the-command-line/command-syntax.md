---
layout: section
---

# Command Syntax

---
---

# Anatomy of a Command

## Commands take options and arguments

```sh
ls -l --all /home/student
```

| Part            | Role                                      |
|-----------------|-------------------------------------------|
| `ls`            | The name of the command                   |
| `-l`            | A short option begins with a dash `-`     |
| `--all`         | A long option begins with two dashes `--` |
| `/home/student` | An argument does not begin with a dash    |

---
layout: center
---

# Command Syntax

<CommandExplainer
  command="ls -l /home/student"
  :steps="[
    { active: 'ls', explanation: 'The name of the command' },
    { active: '-l', explanation: 'Short option begins with a single dash' },
    { active: '/home/student', explanation: 'Arguments do not begin with a dash' },
    {
      command: 'ls -l -a /home/student',
      active: '-a',
      explanation: 'Multiple options can be supplied',
    },
    {
      command: 'ls -la /home/student',
      active: '-la',
      explanation: 'Short options can be combined',
    },
    {
      command: 'ls -al /home/student',
      active: '-al',
      explanation: 'In any order',
    },
    {
      command: 'ls --all /home/student',
      active: '--all',
      explanation: 'Long options begin with a double dash',
    },
    {
      command: 'ls --sort time /home/student',
      active: '--sort time',
      explanation: 'Options can take arguments',
    },
    {
      command: 'ls --sort=time /home/student',
      active: '--sort=time',
      explanation: 'Option arguments can use equal sign',
    },
  ]"
/>

---
---

# Combining and Writing Options

| Command                        | What it shows                          |
| ------------------------------- | ---------------------------------------- |
| `ls -l -a /home/student`        | Multiple short options                   |
| `ls -la /home/student`          | Short options can be combined            |
| `ls -al /home/student`          | Options can be combined in any order     |
| `ls --all /home/student`        | `--all` is the long form of `-a`         |
| `ls --sort time /home/student`  | Options can take arguments               |
| `ls --sort=time /home/student`  | Option arguments can use an equal sign   |


---
vertical: start
---

# Command Syntax

## What will this command do?

<TerminalWindow title="student@workstation:inventories">

````md magic-move
```bash-session
student@workstation:inventories$ ls -l
```
```bash-session
student@workstation:inventories$ ls -l
total 0
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2022-11-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2022-12-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-01-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-02-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-03-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-04-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-05-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-06-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-07-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-08-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-09-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-10-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-11-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-12-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2024-01-inventory.csv
```
````

</TerminalWindow>

---
---

# Demo: Command Syntax

<div class="mx-auto w-[650px]">

![Screen recording of the instructor running ls with several short and long option combinations in a terminal.](./assets/command_syntax.gif)

</div>

---
vertical: center
listSpacing: padded
---

# Command Syntax

## Best Practices

- Place options before arguments for consistency, though both orders work
- Group short options when possible: `-la` instead of `-l -a`
- Use long options (`--all`) in scripts for better readability
