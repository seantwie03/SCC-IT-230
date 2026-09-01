---
layout: section
routeAlias: for-loops
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "01"
        title: Shell Scripting and the Command Line
    rhcsaCertGuide:
      - chapter: "19"
        title: An Introduction to Automation with Bash Shell Scripting
  exercises:
    - title: Collecting Disk Data Exercise
      source: ./exercises/collecting-disk-data-exercise.html
---

# For Loops

## Administrators rarely manage one thing

---
layout: two-cols-header
vertical: center
---

# Anatomy of a `for` Loop

::left::

## Syntax

```bash {1,3}{lines:true}
for VARIABLE in LIST; do
    COMMAND VARIABLE
done
```

The variable takes each value in the list, one at a time

::right::


## Visualization

````md magic-move
```sh
for host in servera serverb serverc; do
    echo "$host"
done
```
```sh
for servera in serverb serverc; do
    echo "servera"
done
```
```sh
for serverb in serverc; do
    echo "serverb"
done
```
```sh
for serverc in ; do
    echo "serverc"
done
```
````


<v-click>

```bash [Output]
servera
serverb
serverc
```

</v-click>

---
layout: two-cols-header
---

# One Loop, Three Iterations

The loop is shorthand for writing the body out once per value

::left::

## The loop

```bash
for host in servera serverb serverc; do
    echo "$host"
done
```

::right::

## What it amounts to

```bash
host=servera
echo "$host"
host=serverb
echo "$host"
host=serverc
echo "$host"
```

---

# Watching It Iterate

<TerminalWindow title="student@servera:~/scripts">

````md magic-move
```bash-session
student@servera:~/scripts$ for host in servera serverb serverc; do echo "$host"; done
```
```bash-session
student@servera:~/scripts$ for host in servera serverb serverc; do echo "$host"; done
servera
```
```bash-session
student@servera:~/scripts$ for host in servera serverb serverc; do echo "$host"; done
servera
serverb
```
```bash-session
student@servera:~/scripts$ for host in servera serverb serverc; do echo "$host"; done
servera
serverb
serverc
student@servera:~/scripts$
```
````

</TerminalWindow>

The body runs once per item, and the loop ends when the list runs out

---
layout: two-cols-header
leftWidth: 38
---

# Why Bother?

Ping the first fifteen hosts on `172.25.250.0/24`

::left::

## By hand

```bash
ping -c1 -W1 172.25.250.1
ping -c1 -W1 172.25.250.2
ping -c1 -W1 172.25.250.3
ping -c1 -W1 172.25.250.4
...
```

Twelve more lines, and one typo away from a wrong answer

::right::

<v-click>

## With a loop

```bash
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
    ping -c1 -W1 172.25.250.$i
done
```

</v-click>

<v-click>

## With brace expansion

```bash
for i in {1..15}; do
    ping -c1 -W1 172.25.250.$i
done
```

</v-click>

---
layout: two-cols-header
---

# Looping Over Arguments

`"$@"` contains a list of all arguments passed into a script

A script can loop over this list directly

::left::

```bash [backup_file.sh]
#!/bin/bash
for arg in "$@"; do
    echo "Backing up $arg..."
    cp "$arg" "$arg.bak"
done
```

<Callout>

Always quote `"$@"` so file names containing spaces survive as single items

</Callout>

::right::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ./backup_file.sh data.txt image.jpg
Backing up data.txt...
Backing up image.jpg...
student@servera:~$
```

</TerminalWindow>

The same script handles one file or fifty

The caller decides

---
layout: two-cols-header
vertical: center
---

# Refresher: Running a Command on Another Host

::left::

## Interactive session

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ssh student@serverb
student@serverb:~$
```

</TerminalWindow>

You land on the remote host and stay there

::right::

## One command, then return

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ssh student@serverb "hostname -f"
serverb.lab.example.com
student@servera:~$
```

</TerminalWindow>

Perfect inside a loop, because the output comes back to you

---
layout: exercise
---

# Collecting Disk Data

::goal::

Gather disk information from every host named on the command line into one file per host

::environment::

**Hosts:** `servera` and `workstation`

::workflow::

1. Create a basic script file and run it with `bash`
2. Make it executable and run it with `./`
3. Loop over a fixed list of hosts and confirm the loop runs once per host
4. Get the disk commands working on one host, then move them into the loop
5. Replace the fixed list with `"$@"` so the caller chooses the hosts
6. Verify the collected files and remove them
