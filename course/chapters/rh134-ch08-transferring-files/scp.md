---
layout: section
routeAlias: scp
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
    - title: Copying Files with scp Exercise
      source: ./exercises/scp-exercise.html
---

# `scp`

## Secure copy

---
vertical: center
---

# One Command You Already Know, Plus a Hostname

`scp` is part of the **OpenSSH** suite and rides on top of `ssh`.

- Installed by default on RHEL, macOS, and Windows 10 and later
- Available anywhere SSH is available — nothing extra to configure
- Authenticates exactly the way `ssh` does

<Callout>

If you can `ssh` to a host, you can `scp` to it.

</Callout>

---
layout: two-cols-header
vertical: start
---

# `cp` and `scp`

The difference is one letter in the command and one colon in the argument.

::left::

## Local copy

Copy `file.txt` into `/tmp` on this machine.

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ cp file.txt /tmp
student@workstation:~$
```

</TerminalWindow>

::right::

## Remote copy

Copy `file.txt` into `/tmp` on `servera`.

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ scp file.txt student@servera:/tmp
file.txt          100%  227     0.2KB/s   00:00
student@workstation:~$
```

</TerminalWindow>

---
layout: center
---

# Reading a Remote Path

<CommandExplainer
  command="scp file.txt student@servera:/tmp"
  :steps="[
    { active: 'file.txt', explanation: 'The source — an ordinary local path' },
    { active: 'student', explanation: 'The user to log in as on the far end' },
    { active: 'servera', explanation: 'The host to connect to' },
    { active: ':', explanation: 'The colon is what makes this a remote path' },
    { active: '/tmp', explanation: 'The destination directory on that host' },
  ]"
/>

---
vertical: start
---

# Direction Is Just Argument Order

Source first, destination second — same as `cp`.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ scp file.txt student@servera:/tmp
```
```bash-session
student@workstation:~$ scp file.txt student@servera:/tmp
file.txt          100%  227     0.2KB/s   00:00
student@workstation:~$
```
```bash-session
student@workstation:~$ scp file.txt student@servera:/tmp
file.txt          100%  227     0.2KB/s   00:00
student@workstation:~$ scp student@servera:/tmp/notes.txt ~
```
```bash-session
student@workstation:~$ scp file.txt student@servera:/tmp
file.txt          100%  227     0.2KB/s   00:00
student@workstation:~$ scp student@servera:/tmp/notes.txt ~
notes.txt         100%   84     0.1KB/s   00:00
student@workstation:~$
```
````

</TerminalWindow>

The first command <AccentText>uploads</AccentText>. The second <AccentText>downloads</AccentText>. Whichever argument carries the colon is the remote one.

---
vertical: center
---

# Copying a Whole Directory

`-r` walks into subdirectories, exactly as it does for `cp`.

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ scp -r Documents student@servera:/tmp
student@workstation:~$
```

</TerminalWindow>

<Callout type="warning">

`scp` copies. It does not compare, skip, or resume — every byte crosses the network every time.

</Callout>

---

# Exercise: Copying Files with `scp`

## Requirements

Hosts: your Windows VDI session and `servera`

Windows 10 and later ship with `scp` in Windows Terminal.

## Steps

1. Create a text file named after yourself and write your favorite text editor into it
2. Upload it to your home directory on `servera`
3. Connect to `servera` and confirm it arrived
4. Edit it there to add the last game, book, or movie you finished
5. Log out, download the edited file back, and confirm your addition survived
6. Create several files with different extensions, then upload only the text files with one command
7. From an empty directory, download those files back with a pattern matched on `servera`
