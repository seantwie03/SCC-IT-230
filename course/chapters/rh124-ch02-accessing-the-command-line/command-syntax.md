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

<TextExplainer
  :lines="['ls -l /home/student']"
  :steps="[
    { text: 'ls', explanation: 'The name of the command' },
    { text: '-l', explanation: 'Short option begins with a single dash' },
    { text: '/home/student', explanation: 'Arguments do not begin with a dash' },
  ]"
/>

---
layout: center
---

# Command Syntax: Short Options

<TextExplainer
  :lines="[
    'ls -l -a /home/student',
    'ls -la /home/student',
    'ls -al /home/student',
  ]"
  :steps="[
    { line: 1, text: '-a', explanation: 'Multiple options can be supplied' },
    { line: 2, text: '-la', explanation: 'Short options can be combined' },
    { line: 3, text: '-al', explanation: 'In any order' },
  ]"
/>

---
layout: center
---

# Command Syntax: Long Options

<TextExplainer
  :lines="[
    'ls --all /home/student',
    'ls --sort time /home/student',
    'ls --sort=time /home/student',
  ]"
  :steps="[
    { line: 1, text: '--all', explanation: 'Long options begin with a double dash' },
    { line: 2, text: '--sort time', explanation: 'Options can take arguments' },
    { line: 3, text: '--sort=time', explanation: 'Option arguments can use equal sign' },
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

<div class="mx-auto w-[620px]">

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
