---
layout: section
routeAlias: environment-variables
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "01"
        title: Shell Scripting and the Command Line
    rhcsaCertGuide:
      - chapter: "02"
        title: Using Essential Tools
  exercises:
    - title: Changing the Pager and Editor Exercise
      source: ./exercises/changing-pager-and-editor-exercise.html
---

# Shell Variables

## Values with a Name

---
---

# Variables Explained


<v-switch at="0">

<template #0-2>

A variable is a <AccentText>name</AccentText> holding a <AccentText>value</AccentText>

Assign with `name=value`, then read it back with `$name`

<TerminalWindow title="student@servera:~" :rows="7">

````md magic-move
```bash-session
#^ 1. Assign a value, then read it back
student@servera:~$ course=IT-230
```
```bash-session {3,4}
#^ 1. Assign a value, then read it back
student@servera:~$ course=IT-230
student@servera:~$ echo $course
IT-230
```
````

</TerminalWindow>

</template>

<template #2>

No spaces are allowed around the `=`

<TerminalWindow title="student@servera:~" :rows="7">

```bash-session {5,6,7}
#^ 1. Assign a value, then read it back
student@servera:~$ course=IT-230
student@servera:~$ echo $course
IT-230
#^ 2. No spaces are allowed around the =
student@servera:~$ course = IT-230
bash: course: command not found
```

</TerminalWindow>

<Callout type="warning">

With spaces Bash reads `course` as a command name, and `=` and `IT-230` as its arguments.

</Callout>

</template>

</v-switch>

---
---

# The Environment

`env` lists the variables that are available to <AccentText>every executable you run</AccentText>

<TerminalWindow title="student@servera:~" :rows="10">

```bash-session
student@servera:~$ env
HOME=/home/student
LANG=en_US.UTF-8
LOGNAME=student
PATH=/home/student/.local/bin:/home/student/bin:/usr/local/bin:/usr/bin
PWD=/home/student
SHELL=/bin/bash
USER=student
...
```

</TerminalWindow>

These are called <AccentText>Environment Variables</AccentText> because they are <AccentText>exported</AccentText> to subshells

---

# Exported Variables

<v-switch at="0">

<template #0>

A variable you assign is <AccentText>local</AccentText>, so it exists only in the shell that created it

<TerminalWindow title="student@servera:~" :rows="14">

```bash-session
#^ 1. A variable you assign is local
student@servera:~$ course=IT-230
student@servera:~$ echo "$course"
IT-230
```

</TerminalWindow>

</template>

<template #1>

If you open a subshell by running the `bash` command, your variable is not there

<TerminalWindow title="student@servera:~" :rows="14">

```bash-session {5,6,7,8,9}
#^ 1. A variable you assign is local
student@servera:~$ course=IT-230
student@servera:~$ echo "$course"
IT-230
#^ 2. A subshell does not have it
student@servera:~$ bash
student@servera:~$ echo "$course"

student@servera:~$ exit
```

</TerminalWindow>

</template>

<template #2>

To make your variable available in subshells, you must `export` it

<TerminalWindow title="student@servera:~" :rows="14">

```bash-session {10,11,12,13,14}
#^ 1. A variable you assign is local
student@servera:~$ course=IT-230
student@servera:~$ echo "$course"
IT-230
#^ 2. A subshell does not have it
student@servera:~$ bash
student@servera:~$ echo "$course"

student@servera:~$ exit
#^ 3. export makes it available to subshells
student@servera:~$ export course
student@servera:~$ bash
student@servera:~$ echo "$course"
IT-230
```

</TerminalWindow>

</template>

</v-switch>

---
---

# Each Executable runs in a SubShell

Every executable is ran from a subshell

If you want a variable to be available when executables are ran, <AccentText>they must be exported</AccentText>

Over time some programs have begun to rely on certain variables being exported

Two common ones are `PAGER` and `EDITOR`

---
layout: two-cols-header
---

# `PAGER` and `EDITOR`

::left::

## `PAGER`

Which program is used to display long output

Used by:

- `man`
- `git log`
- `systemctl status`

```bash
export PAGER=cat
man ls
```

::right::

## `EDITOR`

Which program is used to edit text

Used by:

- `crontab -e`
- `visudo`
- `sudoedit`

```bash
export EDITOR=nano
sudoedit /etc/hosts
```

---
layout: exercise
---

# Changing the Pager and Editor

::goal::

Choose which programs open your manual pages and your text

::environment::

**Hosts:** `workstation`, then `servera`

::workflow::

1. Confirm that neither `PAGER` nor `EDITOR` is set
2. Export `PAGER` so that `man` prints straight to the terminal
3. Install `nano` and export `EDITOR` so it opens instead of `vi`
4. Confirm both are gone in a new session
