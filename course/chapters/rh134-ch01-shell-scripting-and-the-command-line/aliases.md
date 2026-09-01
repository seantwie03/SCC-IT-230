---
layout: section
routeAlias: aliases
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
    - title: Aliasing Away Typos Exercise
      source: ./exercises/aliasing-away-typos-exercise.html
---

# Aliases

## Shortcuts for long and frequently used commands

---
vertical: center
---

# Aliases

**<AccentText class='h3'>Aliases allow you to define shortcuts for long or frequently used commands</AccentText>**

<br />
<br />

<div>

## Common Examples

```bash
alias ls='ls --color=auto'
alias sl='ls'
alias ..='cd ..'
alias tf='podman run --rm -it -v $(pwd):/workspace:Z -w /workspace hashicorp/terraform:latest'
```

</div>

---
layout: center
---

# Aliases are created using the `alias` builtin

<CommandExplainer
  command="alias lt='ls -lAtr'"
  :steps="[
    { active: 'alias', explanation: 'The shell builtin that defines the shortcut' },
    { active: 'lt', explanation: 'The short name you will type instead' },
    { active: '\'ls -lAtr\'', explanation: 'The command it expands into.\nMust be quoted so the shell stores it intact' },
  ]"
/>

---
listSpacing: padded
---

# Where Aliases Apply

- Expanded only when the name is the <AccentText>first word</AccentText> of a command
- Defined in the shell itself
- Lives in the <AccentText>current shell only</AccentText> until you make it permanent

## Aliases you might define

```bash
alias sl='ls'
alias ..='cd ..'
alias rm='rm -i'
```

<Callout type="warning">

No spaces are allowed on either side of the equal sign.

</Callout>

---

# Listing Aliases

Run `alias` with no arguments to see every alias in the current shell

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ alias
alias grep='grep --color=auto'
alias l.='ls -d .* --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
...
student@servera:~$
```

</TerminalWindow>

RHEL predefines only a handful, mostly `--color` wrappers

---
---

# Bypassing and Removing an Alias

<v-switch at="0">

<template #0-2>

An alias may <AccentText>shadow</AccentText> a real command of the same name

<TerminalWindow title="student@servera:/tmp/at" :rows="12">

````md magic-move
```bash-session
#^ 1. An alias may shadow a real command of the same name
student@servera:/tmp/at$ alias grep='grep -i'
```
```bash-session {1-5}
#^ 1. An alias may shadow a real command of the same name
student@servera:/tmp/at$ alias grep='grep -i'
student@servera:/tmp/at$ grep alpha notes.txt
Alpha
alpha
```
````

</TerminalWindow>

</template>

<template #2>

Prefixing `\` runs the real command once

<TerminalWindow title="student@servera:/tmp/at" :rows="12">

```bash-session {6,7,8}
#^ 1. An alias may shadow a real command of the same name
student@servera:/tmp/at$ alias grep='grep -i'
student@servera:/tmp/at$ grep alpha notes.txt
Alpha
alpha
#^ 2. Bypass it once with a backslash
student@servera:/tmp/at$ \grep alpha notes.txt
alpha
```

</TerminalWindow>

</template>

<template #3>

The `unalias` command removes the shortcut entirely

<TerminalWindow title="student@servera:/tmp/at" :rows="12">

```bash-session {9,10,11,12}
#^ 1. An alias may shadow a real command of the same name
student@servera:/tmp/at$ alias grep='grep -i'
student@servera:/tmp/at$ grep alpha notes.txt
Alpha
alpha
#^ 2. Bypass it once with a backslash
student@servera:/tmp/at$ \grep alpha notes.txt
alpha
#^ 3. Remove it entirely with unalias
student@servera:/tmp/at$ unalias grep
student@servera:/tmp/at$ grep alpha notes.txt
alpha
```

</TerminalWindow>

</template>

</v-switch>

---
---

# Aliases Wrap Complex Commands

Run `terraform` from a container without installing it locally

```bash
podman run --rm -it -v $(pwd):/workspace:Z -w /workspace hashicorp/terraform:latest
```

Easy, right? Now type that ten to fifty times a day, every day

<v-click>

Or name it once

```bash
alias tf='podman run --rm -it -v $(pwd):/workspace:Z -w /workspace hashicorp/terraform:latest'
```

</v-click>

---

# Persisting Aliases

Aliases could go in `~/.bashrc`, but they are easier to find in a file of their own

<TerminalWindow title="student@workstation:~" :rows="7">

```bash-session
student@servera:~$ mkdir -p ~/.bashrc.d
student@servera:~$ echo "alias sl='ls'" >> ~/.bashrc.d/aliases
student@servera:~$ exit
student@workstation:~$ ssh servera
student@servera:~$ sl
scripts
```

</TerminalWindow>

No editing of `~/.bashrc` at all: that loop at the bottom loads the file for you

---
layout: exercise
---

# Aliasing Away Typos

::goal::

Turn a typo you keep making into a working command, in every shell from now on

::environment::

**Hosts:** `workstation`, then `servera`

::workflow::

1. List the aliases the shell already defines
2. Define an alias for a typo you make often and confirm it expands
3. Bypass the alias once without removing it
4. Confirm the alias is gone in a new session
5. Put it in `~/.bashrc.d/aliases` and confirm a new session loads it
