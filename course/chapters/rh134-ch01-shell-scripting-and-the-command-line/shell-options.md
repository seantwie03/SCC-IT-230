---
layout: section
routeAlias: shell-options
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "01"
        title: Shell Scripting and the Command Line
  exercises:
    - title: Preventing Clobber Exercise
      source: ./exercises/preventing-clobber-exercise.html
---

# Shell Options

## Switches that change how Bash behaves

---

# Toggling Bash Options with `set`

<TerminalWindow title="student@servera:~" :rows="11">

```bash-session
student@servera:~$ set -o
allexport      	off
braceexpand    	on
emacs          	on
errexit        	off
histexpand     	on
history        	on
interactive-comments	on
monitor        	on
noclobber      	off
...
```

</TerminalWindow>

`set -o <option>` turns one on and `set +o <option>` turns it back off

---

# The `noclobber` Option

<v-switch at="0">

<template #0-3>

`noclobber` stops `>` from silently overwriting a file that already exists

<TerminalWindow title="student@servera:~" :rows="8">

````md magic-move
```bash-session
#^ 1. noclobber refuses to overwrite an existing file
student@servera:~$ echo "Important Data" > file.txt
student@servera:~$ set -o noclobber
student@servera:~$
```
```bash-session
#^ 1. noclobber refuses to overwrite an existing file
student@servera:~$ echo "Important Data" > file.txt
student@servera:~$ set -o noclobber
student@servera:~$ echo "New Data" > file.txt
```
```bash-session
#^ 1. noclobber refuses to overwrite an existing file
student@servera:~$ echo "Important Data" > file.txt
student@servera:~$ set -o noclobber
student@servera:~$ echo "New Data" > file.txt
-bash: file.txt: cannot overwrite existing file
```
````

</TerminalWindow>

</template>

<template #3-4>

Appending with `>>` still works, and `>|` still overwrites on purpose

<TerminalWindow title="student@servera:~" :rows="8">

````md magic-move
```bash-session {5-7}
#^ 1. noclobber refuses to overwrite an existing file
student@servera:~$ echo "Important Data" > file.txt
student@servera:~$ set -o noclobber
student@servera:~$ echo "New Data" > file.txt
-bash: file.txt: cannot overwrite existing file
#^ 2. Appending and forcing still work
student@servera:~$ echo "New Data" >> file.txt
```
```bash-session {6-8}
#^ 1. noclobber refuses to overwrite an existing file
student@servera:~$ echo "Important Data" > file.txt
student@servera:~$ set -o noclobber
student@servera:~$ echo "New Data" > file.txt
-bash: file.txt: cannot overwrite existing file
#^ 2. Appending and forcing still work
student@servera:~$ echo "New Data" >> file.txt
student@servera:~$ echo "Force it" >| file.txt
```
````

</TerminalWindow>

</template>

</v-switch>

---
vertical: center
---

# Persisting Shell Options

To make the setting persistent, save it in `~/.bashrc`

```bash [~/.bashrc]
set -o noclobber
```

---
layout: exercise
---

# Preventing Clobber

::goal::

Protect an existing file from being overwritten, in this shell and in every shell

::environment::

**Hosts:** `workstation`, then `servera`

::workflow::

1. Create a file holding data you care about
2. Enable `noclobber` and attempt to overwrite the file with `>`
3. Add to the file with `>>`, then overwrite it deliberately with `>|`
4. Confirm the option is off again in a new session
5. Persist `noclobber` in `~/.bashrc` and confirm it applies at next login
