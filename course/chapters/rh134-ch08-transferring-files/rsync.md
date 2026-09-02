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

## Fast, versatile, remote (and local) file-synchronization

---
layout: two-cols-header
vertical: evenly
---

# Copying Versus Synchronizing

::left::

## `scp` copies

Every byte crosses the network, every time

Copy a 4 GB directory; 4 GB is sent

Copy the same 4 GB directory; 4 GB is sent

<Callout type="success">

`scp` is installed with `ssh`

Nearly all linux machiens will have it

</Callout>

::right::

## `rsync` synchronizes

It compares the two sides

Sends only what differs

The first run costs the same as `scp`

Every run after that is <SuccessText>dramatically faster</SuccessText>

<Callout type="warning">

`rsync` must be installed on <DangerText>both</DangerText> machines

It is not part of a minimal installation

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

Same shape as `scp`: source first, destination second, a colon marks the remote side

---
layout: two-cols-header
leftWidth: 45
vertical: start
---

# Three Options Worth Knowing

`rsync` has **many** options. These three are the most important

::left::

| Option | Meaning                                                                       |
|--------|-------------------------------------------------------------------------------|
| `-a`   | **a**rchive mode: recurse and preserve permissions, ownership, and timestamps |
| `-v`   | **v**erbose: name each file as it transfers                                   |
| `-n`   | dry ru**n**: change nothing, report what would happen                         |

::right::

## Typical Usage

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ rsync -avn servera:/etc/ /tmp/etc/
student@workstation:~$ rsync -av servera:/etc/ /tmp/etc/
```

</TerminalWindow>

Run it with `-n` first

Read the list

Then run it again without `-n`

---
layout: center
---

# Reading an `rsync` Command

<CommandExplainer
  command="rsync -av servera:/var/log /tmp"
  :steps="[
    { active: 'rsync', explanation: 'File Synchronization tool' },
    { active: '-av', explanation: 'Archive mode,  with verbose output' },
    { active: 'servera:', explanation: 'Pull from this host. The colon marks the remote side, same as scp' },
    { active: '/var/log', explanation: 'The source directory on servera' },
    { active: '/tmp', explanation: 'The destination directory on local' },
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

Change one file, then synchronize again

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

Only `notes.txt` moved.

The other files were already identical on both sides

</v-click>

---
layout: two-cols-header
vertical: start
---

# Mind the Trailing Slash

This is the mistake everyone makes exactly once

::left::

## With a trailing slash

```bash
rsync -av ~/Documents/ servera:/tmp/backup/
```

Copies the **contents** of `Documents`

Result: `/tmp/backup/notes.txt`

::right::

## Without a trailing slash

```bash
rsync -av ~/Documents servera:/tmp/backup/
```

Copies the **directory itself**

Result: `/tmp/backup/Documents/notes.txt`

<Callout type="danger">

A trailing slash changes what gets created. Use `-n` if unsure

</Callout>

---
layout: exercise
---

# Synchronizing with `rsync`

::goal::

Preview and synchronize directory changes between two systems

::environment::

**Hosts:** `workstation` and `servera`

::workflow::

1. Install rsync on both machines
2. Preview and run the first synchronization
3. Generate changes and synchronize again
4. Verify the synchronized changes
