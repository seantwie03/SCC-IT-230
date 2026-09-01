---
layout: section
routeAlias: shell-environment
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
    - title: Putting Scripts on the PATH Exercise
      source: ./exercises/putting-scripts-on-path-exercise.html
---

# The Shell Environment

## A closer look at the `bashrc`

---
listSpacing: padded
---

# A Closer Look at `~/.bashrc`

The `~/.bashrc` file is loaded every time a new shell is launched

The `bashrc` contains `shell` code

A `bashrc` file will typically contain:

- Source declarations (imports)
- Variables
- Aliases
- Custom Functions

---

# Sourcing other Files

Typically the first thing a `bashrc` does is import the settings from `/etc/bashrc`

```bash [~/.bashrc] {3}
# Source global definitions
if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi
```

The `.` is a synonym for the `source` command

The command `. /etc/bashrc` means:

- Execute all the code from `/etc/bashrc` as if it was typed here

---
---

# Propagating System Settings

Since every user's `~/.bashrc` starts by sourcing `/etc/bashrc`

Customizations in that file end up being applied to all users

| File          | Applies to |
| ------------- | ---------- |
| `/etc/bashrc` | every user |
| `~/.bashrc`   | you alone  |

---
---

# `bashrc` Also Sets Your `PATH`

<TerminalWindow title="student@servera:~" :rows="3">

```bash-session
student@servera:~$ echo $PATH
/home/student/.local/bin:/home/student/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin
student@servera:~$
```

</TerminalWindow>

`PATH` is a list of directories separated by a colon `:`

When you type `ls` Bash searches the `PATH` directories from <AccentText>left to right</AccentText>

The first one holding an executable named `ls` wins

---

# The `PATH` Variable

```bash [~/.bashrc] {4}
...
# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]; then
    PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
export PATH
...
```

The highlighted line is why `/home/student/bin` is on your `PATH`

`export PATH` is there so every program you run inherits it

<Callout>

Don't worry about the `if` yet, we will learn that tonight!

</Callout>

---

# Adding a Directory for This Shell

<v-switch at="0">

<template #0-2>

`$PATH` on the right keeps what was already there

<TerminalWindow title="student@workstation:~" :rows="10">

````md magic-move
```bash-session
#^ 1. Append a directory, keeping what was already there
student@servera:~$ mkdir -p ~/scripts
student@servera:~$ PATH=$PATH:~/scripts
```
```bash-session {4,5}
#^ 1. Append a directory, keeping what was already there
student@servera:~$ mkdir -p ~/scripts
student@servera:~$ PATH=$PATH:~/scripts
student@servera:~$ echo $PATH
/home/student/.local/bin:...:/usr/sbin:/home/student/scripts
```
````

</TerminalWindow>

</template>

<template #2>

The change is not persisted when you open a new session

<TerminalWindow title="student@workstation:~" :rows="10">

```bash-session {6,7,8,9,10}
#^ 1. Append a directory, keeping what was already there
student@servera:~$ mkdir -p ~/scripts
student@servera:~$ PATH=$PATH:~/scripts
student@servera:~$ echo $PATH
/home/student/.local/bin:...:/usr/sbin:/home/student/scripts
#^ 2. Log out and back in and the change is gone
student@servera:~$ exit
student@workstation:~$ ssh servera
student@servera:~$ echo $PATH
/home/student/.local/bin:/home/student/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin
```

</TerminalWindow>

</template>

</v-switch>

---

# Splitting Settings Into Multiple Files

The default `~/.bashrc` contains this block of code

It will automatically source any file from the `~/.bashrc.d` directory

```bash [~/.bashrc]
if [ -d ~/.bashrc.d ]; then
    for rc in ~/.bashrc.d/*; do
        if [ -f "$rc" ]; then
            . "$rc"
        fi
    done
fi
unset rc
```


<Callout type="warning">

You cannot read this yet. By the end of today you will: it is a loop, two tests, and the `.` you just met.

</Callout>

---
layout: exercise
---

# Putting Scripts on the `PATH`

::goal::

Give yourself a scripts directory that every new session can find

::environment::

**Hosts:** `workstation`, then `servera`

::workflow::

1. Inspect the current `PATH` and find where it is already set in `~/.bashrc`
2. Create a `scripts` directory and append it to `PATH` for this shell only
3. Confirm it disappears in a new session
4. Add the same line to `~/.bashrc`
5. Confirm a new session now finds the directory
