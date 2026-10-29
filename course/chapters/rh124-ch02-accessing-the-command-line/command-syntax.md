---
layout: section
routeAlias: command-syntax
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "02"
        title: Accessing the Command Line
    rhcsaCertGuide:
      - chapter: "02"
        title: Using Essential Tools
  exercises:
    - title: Explore Files with ls Options Exercise
      source: ./exercises/explore-files-with-ls-options-exercise.html
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
layout: exercise
---

# Explore Files with ls Options

::goal::

Use options and arguments to change what `ls` reports

::environment::

**Host:** `servera`

::workflow::

1. Reveal the hidden files in your home directory
2. List the files in `/var/log` by size, largest first
3. List the files in `/var/log` by time, newest last

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/explore-files-with-ls-options-exercise.cast?url";
</script>

# Explore Files with ls Options

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor running ls -l in an apparently empty home directory, revealing its hidden files with ls -la and ls -l --all, then listing /var/log sorted by size with --sort=size and by time with --sort time and --reverse."
/>

::resources::

<a href="../resources/explore-files-with-ls-options-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Explore Files with ls Options exercise in a new tab">Written exercise</a>

---
vertical: center
listSpacing: padded
---

# Command Syntax

## Best Practices

- Place options before arguments for consistency, though both orders work
- Group short options when possible: `-la` instead of `-l -a`
- Use long options (`--all`) in scripts for better readability
