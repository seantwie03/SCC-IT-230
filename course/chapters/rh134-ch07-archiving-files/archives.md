---
layout: section
routeAlias: archives
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "07"
        title: Archiving Files
    rhcsaCertGuide:
      - chapter: "03"
        title: Essential File Management Tools
  exercises:
    - title: Creating and Extracting Archives Exercise
      source: ./exercises/archives-exercise.html
---

# Archives

## Many files in, one file out

---
layout: two-cols-header
vertical: start
---

# Why Bundle Files at All?

::left::

## Simpler handling

One file is easier to back up, move, and keep track of than ten thousand.

## Preserved characteristics

An archive keeps the directory structure, ownership, permissions, and timestamps that a plain copy can lose.

::right::

## Room for compression

A single stream of data compresses far better than each file on its own.

<Callout>

Bundling and compressing are two separate jobs. `tar` does the first and can call a compressor for the second.

</Callout>

---
layout: two-cols-header
leftWidth: 55
vertical: center
---

# `tar` — Tape ARchive

::left::

## What is an archive?

- One file that contains many files
- The Unix ancestor of the `.zip` file you know from Windows

## Why the odd name?

`tar` was written to write data to magnetic **tape**, one file after another, in a single continuous stream.

::right::

![A reel of magnetic data tape mounted on a tape drive, the storage medium that tar was originally written for.](./assets/data-tape.jpg)

Photograph by [Robert Jacek Tomczak](https://commons.wikimedia.org/wiki/User:Rjt), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?curid=94360)

---
layout: center
---

# Creating an Archive

<CommandExplainer
  command="tar -cvf /tmp/etc-backup.tar /etc"
  :steps="[
    { active: 'tar', occurrence: 1, explanation: 'The archiving program' },
    { active: '-c', explanation: 'create a new archive' },
    { active: 'v', explanation: 'verbose — list each file as it is added' },
    { active: 'f', explanation: 'file — the next argument names the archive' },
    { active: '/tmp/etc-backup.tar', explanation: 'The archive to write' },
    { active: '/etc', occurrence: 2, explanation: 'What to put inside it' },
  ]"
/>

---
vertical: start
---

# Creating an Archive

<TerminalWindow title="root@servera:~">

````md magic-move
```bash-session
root@servera:~# tar -cvf /tmp/etc-backup.tar /etc
```
```bash-session
root@servera:~# tar -cvf /tmp/etc-backup.tar /etc
tar: Removing leading `/' from member names
/etc/
/etc/fstab
/etc/crypttab
/etc/mtab
...
root@servera:~#
```
```bash-session
root@servera:~# tar -cvf /tmp/etc-backup.tar /etc
tar: Removing leading `/' from member names
/etc/
/etc/fstab
/etc/crypttab
/etc/mtab
...
root@servera:~# ls -lh /tmp/etc-backup.tar
```
```bash-session
root@servera:~# tar -cvf /tmp/etc-backup.tar /etc
tar: Removing leading `/' from member names
/etc/
/etc/fstab
/etc/crypttab
/etc/mtab
...
root@servera:~# ls -lh /tmp/etc-backup.tar
-rw-r--r--. 1 root root 41M Jan  6 13:04 /tmp/etc-backup.tar
root@servera:~#
```
````

</TerminalWindow>

<Callout type="warning">

`tar` strips the leading `/` so the archive cannot overwrite `/etc` when someone extracts it somewhere else.

</Callout>

---
vertical: center
---

# Listing What Is Inside

Read the contents without unpacking anything.

<CommandExplainer
  command="tar -tf /tmp/etc-backup.tar"
  :steps="[
    { active: '-t', explanation: 'lisT — show the member names' },
    { active: 'f', explanation: 'File — the archive to inspect' },
  ]"
/>

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# tar -tf /tmp/etc-backup.tar | head -n4
etc/
etc/fstab
etc/crypttab
etc/mtab
root@servera:~#
```

</TerminalWindow>

---
vertical: start
---

# Extracting an Archive

`tar` unpacks into the <DangerText>current working directory</DangerText>, so change into an empty one first.

<TerminalWindow title="root@servera:~">

````md magic-move
```bash-session
root@servera:~# mkdir -p /tmp/etc-extract
root@servera:~# cd /tmp/etc-extract
```
```bash-session
root@servera:~# mkdir -p /tmp/etc-extract
root@servera:~# cd /tmp/etc-extract
root@servera:/tmp/etc-extract# tar -xf /tmp/etc-backup.tar
```
```bash-session
root@servera:~# mkdir -p /tmp/etc-extract
root@servera:~# cd /tmp/etc-extract
root@servera:/tmp/etc-extract# tar -xf /tmp/etc-backup.tar
root@servera:/tmp/etc-extract# ls
etc
root@servera:/tmp/etc-extract#
```
````

</TerminalWindow>

`-x` is e**x**tract; `-f` names the archive, exactly as before.

---
vertical: center
---

# Extracting One File

Name the member you want, exactly as `-t` printed it.

<TerminalWindow title="root@servera:/tmp/etc-extract">

````md magic-move
```bash-session
root@servera:/tmp/etc-extract# tar -xf /tmp/etc-backup.tar etc/hosts
```
```bash-session
root@servera:/tmp/etc-extract# tar -xf /tmp/etc-backup.tar etc/hosts
root@servera:/tmp/etc-extract# ls etc
hosts
root@servera:/tmp/etc-extract#
```
````

</TerminalWindow>

<Callout>

Use `etc/hosts`, not `/etc/hosts` — the archive stores the path without its leading slash.

</Callout>

---
vertical: start
---

# The Three Operations

| Option | Name    | What it does                          |
| :----: | ------- | ------------------------------------- |
|  `-c`  | create  | build a new archive from files        |
|  `-t`  | lis**t**| show what is inside an archive        |
|  `-x`  | e**x**tract | unpack an archive into the current directory |

`-f` always names the archive file, and `-v` always makes the operation verbose.

<Callout type="danger">

`-c` overwrites its target without asking, exactly like the `>` operator.

</Callout>

---

# Exercise: Creating and Extracting Archives

## Requirements

Host: `servera`

Reading all of `/etc` requires administrative privileges.

## Steps

1. Become `root`
2. Bundle the entire `/etc` directory into one uncompressed archive under `/tmp`
3. Check the size of the archive you produced
4. Read the archive's contents without unpacking it
5. Unpack the archive into an empty directory of its own
6. Confirm the extracted tree looks like the original
