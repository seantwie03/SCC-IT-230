---
layout: section
routeAlias: shell-prompt
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "01"
        title: Shell Scripting and the Command Line
  exercises:
    - title: Customizing the Prompt Exercise
      source: ./exercises/customizing-the-prompt-exercise.html
---

# The Shell Prompt

## Configuring the `PS1` Variable

---

# PS1 Variable

What is displayed in your Bash prompt is configurable by changing the `PS1` variable

<TerminalWindow title="student@servera:~" :rows="3">

````md magic-move
```bash-session
student@servera:~$ PS1='> '
>
```
```bash-session
student@servera:~$ PS1='> '
> echo "Hello World"
```
```bash-session
student@servera:~$ PS1='> '
> echo "Hello World"
Hello World
>
```
```bash-session
student@servera:~$ PS1='> '
> echo "Hello World"
Hello World
> PS1='servera '
```
```bash-session
student@servera:~$ PS1='> '
> echo "Hello World"
Hello World
> PS1='servera: '
servera:
```
````

</TerminalWindow>

---
layout: center
---

# Dynamic Content in `PS1` Variable

Bash provides special character sequences. The ones below build the prompt you have been using

**<AccentText>student@workstation:~$</AccentText>**

<CommandExplainer
  command="PS1='\u@\h:\W\$'"
  :steps="[
    { active: '\\u', explanation: 'The current username' },
    { active: '@', explanation: 'A literal @ sign' },
    { active: '\\h', explanation: 'The hostname, short form' },
    { active: ':', explanation: 'A literal colon :' },
    { active: '\\W', explanation: 'The working directory, shortened' },
    { active: '\\$', explanation: 'A # for root and a $ for everyone else' },
  ]"
/>

---

# Shortening the Working Directory

The default is `\W` which only shows the last segment in the current working directory

Change it to `\w` for the full path

<TerminalWindow title="student@servera:/var/log" :rows="6">

````md magic-move
```bash-session
student@servera:log$ pwd
/var/log
student@servera:log$
```
```bash-session {3-5}
student@servera:log$ pwd
/var/log
student@servera:log$ echo $PS1
\u@\h:\W\$
student@servera:log$
```
```bash-session {3-5}
student@servera:log$ pwd
/var/log
student@servera:log$ echo $PS1
\u@\h:\W\$
student@servera:log$ PS1='\u@\h:\w\$ '
```
```bash-session {5-6}
student@servera:log$ pwd
/var/log
student@servera:log$ echo $PS1
\u@\h:\W\$
student@servera:log$ PS1='\u@\h:\w\$ '
student@servera:/var/log$
```
````

</TerminalWindow>

| Sequence | Working directory |
| :------: | ----------------- |
|   `\w`   | Full path         |
|   `\W`   | Basename only     |

---
vertical: center
---

# Finding Every Sequence

There are many more. Search the **PROMPTING** section of the Bash manual

```bash
man bash
/PROMPTING
```

```
...
\h     the hostname up to the first `.'
\H     the hostname
\j     the number of jobs currently managed by the shell
\t     the current time in 24-hour HH:MM:SS format
\T     the current time in 12-hour HH:MM:SS format
\@     the current time in 12-hour am/pm format
\u     the username of the current user
\v     the version of bash (e.g., 2.00)
\W     the basename of $PWD, with $HOME abbreviated with a tilde
\!     the history number of this command
...
```

---

# Settings Do Not Persist After Logout

Setting variables with `PS1=...` syntax does not survive a logout and back in

`PS1` and many other variables are set in configuration files

When you login, those files are read and variables are set to whatever value they contain

<TerminalWindow title="student@servera:/var/log" :rows="5">

````md magic-move
```bash-session
student@workstation:log$ ssh servera
student@servera:~$ PS1='> '
>
```
```bash-session
student@workstation:log$ ssh servera
student@servera:~$ PS1='> '
> exit
```
```bash-session
student@workstation:log$ ssh servera
student@servera:~$ PS1='> '
> exit
student@workstation:log$
```
```bash-session
student@workstation:log$ ssh servera
student@servera:~$ PS1='> '
> exit
student@workstation:log$ ssh servera
```
```bash-session
student@workstation:log$ ssh servera
student@servera:~$ PS1='> '
> exit
student@workstation:log$ ssh servera
student@servera:~$
```
````

</TerminalWindow>

To persist the changes you must add them to a configuration file

---
---

# Persisting Changes

`~/.bashrc` is that file

Bash reads it every time you open a new terminal

Shell customizations you want to keep should be saved in `~/.bashrc`

```bash [~/.bashrc]
PS1='\u@\h:\w\$ '
```

---
layout: exercise
---

# Customizing the Prompt

::goal::

Change your prompt for one shell, then keep the change

::environment::

**Hosts:** `workstation`, then `servera`

::workflow::

1. Read the current value of `PS1`
2. Change `\W` to `\w` to show the full working directory
3. Move into a deeply nested directory and judge the result
4. Confirm the change disappears in a new session
5. Persist the prompt you prefer in `~/.bashrc`
