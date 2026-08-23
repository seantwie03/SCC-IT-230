---
layout: section
routeAlias: rsync
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "08"
        title: Transferring Files
    rhcsaCertGuide:
      - chapter: "05"
        title: Connecting to Red Hat Enterprise Linux
  exercises:
    - title: Synchronizing Directories with rsync Exercise
      source: ./exercises/rsync-exercise.html
---

# `rsync`

## A fast, versatile, remote (and local) file-copying tool

---
layout: two-cols-header
vertical: start
---

# Copying Versus Synchronizing

::left::

## `scp` copies

Every byte crosses the network, every time you run it.

Copy a 4 GB directory twice and you have moved 8 GB.

::right::

## `rsync` synchronizes

It compares the two sides first and sends only what differs.

The first run costs the same as `scp`. Every run after that is <SuccessText>dramatically faster</SuccessText>.

<Callout type="warning">

`rsync` must be installed on <DangerText>both</DangerText> machines. It is not part of a minimal installation.

</Callout>

---
vertical: start
---

# Synopsis

<TerminalWindow title="student@workstation:~">

```bash-session {*}{lines:false}
student@workstation:~$ man rsync
NAME
       rsync - a fast, versatile, remote (and local) file-copying tool

SYNOPSIS
       Local:
           rsync [OPTION...] SRC... [DEST]

       Access via remote shell:
           Pull:
               rsync [OPTION...] [USER@]HOST:SRC... [DEST]
           Push:
               rsync [OPTION...] SRC... [USER@]HOST:DEST
```

</TerminalWindow>

Same shape as `scp`: source first, destination second, a colon marks the remote side.

---
layout: two-cols-header
leftWidth: 45
vertical: start
---

# Three Options Worth Knowing

`man rsync` lists dozens. These three cover nearly everything you will do.

::left::

| Option | Meaning                                    |
| ------ | ------------------------------------------ |
| `-a`   | **a**rchive mode — recurse and preserve permissions, ownership, and timestamps |
| `-v`   | **v**erbose — name each file as it transfers |
| `-n`   | dry ru**n** — report what would happen, change nothing |

::right::

## The habit to build

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ rsync -avn servera:/etc/ /tmp/etc/
```

</TerminalWindow>

Run it with `-n` first. Read the list. Then run it again without `-n`.

---
layout: center
---

# Reading an `rsync` Command

<CommandExplainer
  command="rsync -av servera:/var/log /tmp"
  :steps="[
    { active: '-av', explanation: 'Archive mode, and name each file as it goes' },
    { active: 'servera:', explanation: 'Pull from this host — the colon marks the remote side, exactly as in scp' },
    { active: '/var/log', explanation: 'The source directory on servera' },
    { active: '/tmp', explanation: 'The destination directory on workstation' },
  ]"
/>

---
vertical: start
---

# The First Run Copies Everything

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ rsync -av student@servera:~/Documents/ ~/Documents/
```
```bash-session
student@workstation:~$ rsync -av student@servera:~/Documents/ ~/Documents/
receiving incremental file list
./
notes.txt
projects/roadmap.md
projects/budget.csv

sent 92 bytes  received 4,412 bytes  9,008.00 bytes/sec
total size is 4,102  speedup is 0.91
student@workstation:~$
```
````

</TerminalWindow>

---
vertical: start
---

# The Second Run Sends Almost Nothing

Change one file, then synchronize again.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ echo "one more line" >> ~/Documents/notes.txt
student@workstation:~$ rsync -av ~/Documents/ student@servera:~/Documents/
```
```bash-session
student@workstation:~$ echo "one more line" >> ~/Documents/notes.txt
student@workstation:~$ rsync -av ~/Documents/ student@servera:~/Documents/
sending incremental file list
notes.txt

sent 285 bytes  received 41 bytes  652.00 bytes/sec
total size is 4,116  speedup is 12.63
student@workstation:~$
```
````

</TerminalWindow>

<v-click>

Only `notes.txt` moved. The other files were already identical on both sides.

</v-click>

---
layout: two-cols-header
vertical: start
---

# Mind the Trailing Slash

This is the mistake everyone makes exactly once.

::left::

## With a trailing slash

```bash
rsync -av ~/Documents/ servera:/tmp/backup/
```

Copies the **contents** of `Documents` into `backup`.

Result: `/tmp/backup/notes.txt`

::right::

## Without a trailing slash

```bash
rsync -av ~/Documents servera:/tmp/backup/
```

Copies the **directory itself** into `backup`.

Result: `/tmp/backup/Documents/notes.txt`

<Callout type="danger">

A slash on the source changes what gets created. Use `-n` when you are unsure.

</Callout>

---

# Exercise: Synchronizing Directories with `rsync`

## Requirements

Local host: `workstation`, using `/tmp`

Remote host: `servera`, using `/var/log`

## Steps

1. Make sure the tool is installed on <AccentText>both</AccentText> machines
2. Preview what a synchronization of the remote log directory into `/tmp` would transfer, without transferring it
3. Run it for real and note how long the first pass takes
4. Cause `servera` to write some new log entries
5. Synchronize a second time and compare how much data moved
6. Verify that the new entries are present in your local copy
