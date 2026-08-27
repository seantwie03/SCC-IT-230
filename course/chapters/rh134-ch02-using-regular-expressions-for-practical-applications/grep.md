---
layout: section
routeAlias: grep
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "02"
        title: Using Regular Expressions for Practical Applications
    rhcsaCertGuide:
      - chapter: "04"
        title: Working with Text Files
  exercises:
    - title: Searching Log Files with grep Exercise
      source: ./exercises/grep-exercise.html
---

# `grep`

## Global · Regular Expression · Print

---
vertical: center
---

# `Ctrl + F` on Steroids

A regular expression describes a <AccentText>pattern</AccentText> instead of one exact string

- Find the error messages buried in a log file
- Pull every IP address out of that log file
- Check that a password has an uppercase letter and a digit
- Find and replace across a whole project in Vim or VS Code

<Callout>

If you have ever run `grep`, you have already used a regular expression

</Callout>

---
vertical: start
---

# A Real-World Scenario

**The task:** your manager wants every unique address that failed to log in over SSH

**The evidence:** `/var/log/secure`

```text {*}{lines:false}
Jan 12 10:30:01 servera sshd[1188]: Failed password for user from 10.0.2.2
Jan 12 10:30:08 servera sshd[1192]: Accepted password for student from 172.25.250.9
Jan 12 10:30:15 servera sshd[1204]: Failed password for root from 203.0.113.55
Jan 12 10:30:20 servera sshd[1209]: Failed password for root from 203.0.113.55
```

**The report:** one line per address, with a count

```text {*}{lines:false}
      1 10.0.2.2
      2 203.0.113.55
```

By the end of this chapter you will be able to write that one-liner yourself

---
vertical: center
---

# `grep`: Global · Regular Expression · Print

Written by <AccentText>Ken Thompson</AccentText> at Bell Labs and first released in <AccentText>1973</AccentText>

Prints every <AccentText>line</AccentText> of its input that matches a pattern

<CommandExplainer
  command="grep PATH ~/.bashrc"
  :steps="[
    { active: 'grep', explanation: 'Print matching lines' },
    { active: 'PATH', explanation: 'The pattern: here, the simplest possible regular expression, an exact string' },
    { active: '~/.bashrc', explanation: 'The file to search' },
  ]"
/>

<!-- Who remembers what the PATH variable is used for? -->

<!-- "String" is just programmer-speak for a run of characters. No knitting involved. -->

---

# Searching a File

## What will this command do?

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep student /etc/passwd
```
```bash-session
student@servera:~$ grep student /etc/passwd
student:x:1000:1000:Student:/home/student:/bin/bash
student@servera:~$
```
````

</TerminalWindow>

<v-click>

It prints every line of `/etc/passwd` that contains the string `student`

</v-click>

---

# Searching a Pipe

`grep` reads standard input when you give it no file

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ ps -aux | grep systemd
```
```bash-session
student@servera:~$ ps -aux | grep systemd
root         607  0.0  0.5  22460  9088 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-journald
root         619  0.0  0.6  34508 12476 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-udevd
root         719  0.0  0.6  20424 11296 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-logind
student      958  0.0  0.7  22360 13532 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd --user
student     1719  0.0  0.1   6408  2176 pts/0    S+   00:55   0:00 grep --color=auto systemd
student@servera:~$
```
````

</TerminalWindow>

<v-click>

The output of `ps -aux` becomes the input to `grep`

</v-click>

---
vertical: start
---

# `grep` Finds Itself

<WarningText>The last line is the `grep` command you just ran</WarningText>

It was in the process table when `ps` looked, and it contains the word `systemd`

<TerminalWindow title="student@servera:~">

```bash-session {6}
student@servera:~$ ps -aux | grep systemd
root         607  0.0  0.5  22460  9088 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-journald
root         619  0.0  0.6  34508 12476 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-udevd
root         719  0.0  0.6  20424 11296 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-logind
student      958  0.0  0.7  22360 13532 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd --user
student     1719  0.0  0.1   6408  2176 pts/0    S+   00:55   0:00 grep --color=auto systemd
student@servera:~$
```

</TerminalWindow>

---
vertical: start
---

# Invert the Match with `-v`

`-v` prints every line that <DangerText>does not</DangerText> match

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ ps -aux | grep systemd | grep -v grep
```
```bash-session
student@servera:~$ ps -aux | grep systemd | grep -v grep
root         607  0.0  0.5  22460  9088 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-journald
root         619  0.0  0.6  34508 12476 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-udevd
root         719  0.0  0.6  20424 11296 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-logind
student      958  0.0  0.7  22360 13532 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd --user
student@servera:~$
```
````

</TerminalWindow>

The stray `grep --color=auto systemd` line is gone

---
vertical: start
---

# Several Patterns with `-e`

Match `systemd` <AccentText>or</AccentText> `sshd`; give `-e` once per pattern

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ ps -aux | grep -e systemd -e sshd | grep -v grep
```
```bash-session
student@servera:~$ ps -aux | grep -e systemd -e sshd | grep -v grep
root         607  0.0  0.5  22460  9088 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-journald
root         619  0.0  0.6  34508 12476 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-udevd
root         719  0.0  0.6  20424 11296 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd-logind
root         765  0.0  0.5  15852  9212 ?        Ss   00:47   0:00 sshd: /usr/sbin/sshd -D [listener]
root         819  0.0  0.6  18820 11464 ?        Ss   00:47   0:00 sshd: student [priv]
student      958  0.0  0.7  22360 13532 ?        Ss   00:47   0:00 /usr/lib/systemd/systemd --user
student     1055  0.0  0.3  19024  7008 ?        S    00:47   0:00 sshd: student@pts/0
student@servera:~$
```
````

</TerminalWindow>

---
vertical: start
---

# Ignore Case with `-i`

Without `-i`, `Finished` and `finished` are different patterns

<TerminalWindow title="student@servera:~">

```bash-session {2-4,6|5,7}
student@servera:~$ sudo grep -i finished /var/log/messages
Aug 26 00:47:59 servera systemd[1]: Finished Record Runlevel Change in UTMP.
Aug 26 00:47:59 servera systemd[1]: Finished User Runtime Directory /run/user/1000.
Aug 26 00:47:59 servera systemd[958]: Finished Create User's Volatile Files and Directories.
Aug 26 00:47:59 servera systemd[958]: Startup finished in 74ms.
Aug 26 00:47:59 servera systemd[1]: Finished Crash recovery kernel arming.
Aug 26 00:47:59 servera systemd[1]: Startup finished in 1.299s (kernel) + 1.274s (initrd) + 2.308s (userspace).
```

</TerminalWindow>

Capital `Finished` on the first click, lowercase `finished` on the second; only `-i` returns both

---
layout: two-cols-header
vertical: start
---

# Context Around the Match

A matching line is rarely the whole story; three options print its neighbors

::left::

| Option | Prints                    |
| ------ | ------------------------- |
| `-B3`  | 3 lines before the match  |
| `-A3`  | 3 lines after the match   |
| `-C3`  | 3 lines on both sides     |

Each has a long form: `--before-context=3`, `--after-context=3`, `--context=3`

::right::

## Choosing one

- You have an <AccentText>error code</AccentText> and want the message that follows: use `-A`
- You have a <AccentText>symptom</AccentText> and want what led to it: use `-B`
- You want the <AccentText>whole neighborhood</AccentText>: use `-C`


---
layout: exercise
---

# Searching Log Files with `grep`

::goal::

Search log data and refine the surrounding context of each match

::environment::

**Host:** `servera`

::workflow::

1. Find matching log entries
2. Show context around matches
3. Refine results with grep options
