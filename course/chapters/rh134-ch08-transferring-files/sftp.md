---
layout: section
routeAlias: sftp
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
    - title: Downloading Files with sftp Exercise
      source: ./exercises/sftp-exercise.html
---

# `sftp`

## Secure File Transfer Protocol

---
vertical: center
---

# An Interactive Session Instead of One Command

`sftp` is also part of the **OpenSSH** suite and also rides on `ssh`.

Where `scp` runs once and exits, `sftp` drops you into its own prompt so you can look around before deciding what to move.

- Browse the remote directory tree
- Change directories on <AccentText>both</AccentText> ends
- Upload and download repeatedly in one connection

Graphical file managers and cross-platform clients speak this same protocol, so what you learn at the prompt applies there too.

---
vertical: start
---

# Connecting

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ sftp student@servera
```
```bash-session
student@workstation:~$ sftp student@servera
Connected to servera.
sftp>
```
````

</TerminalWindow>

The `sftp>` prompt replaces your shell prompt. Bash is not running here — only the commands `sftp` implements.

---
vertical: start
---

# `help` Lists Everything Available

<TerminalWindow title="student@workstation:~">

```bash-session {*}{lines:false}
sftp> help
Available commands:
cd path                                 Change remote directory to 'path'
exit                                    Quit sftp
get [-afpR] remote [local]              Download file
lcd path                                Change local directory to 'path'
lls [ls-options [path]]                 Display local directory listing
lmkdir path                             Create local directory
lpwd                                    Print local working directory
ls [-1afhlnrSt] [path]                  Display remote directory listing
mkdir path                              Create remote directory
put [-afpR] local [remote]              Upload file
pwd                                     Display remote working directory
rename oldpath newpath                  Rename remote file
rm path                                 Delete remote file
!command                                Execute 'command' in local shell
sftp>
```

</TerminalWindow>

---
layout: two-cols-header
vertical: start
---

# Two Machines, One Prompt

Look carefully at that list: several commands appear twice.

::left::

## Remote by default

Plain commands act on `servera`.

| Command | Acts on the remote |
| ------- | ------------------ |
| `cd`    | change directory   |
| `pwd`   | print directory    |
| `ls`    | list directory     |
| `mkdir` | create directory   |

::right::

## Local with a leading `l`

Prefix with `l` to act on `workstation`.

| Command  | Acts on the local |
| -------- | ----------------- |
| `lcd`    | change directory  |
| `lpwd`   | print directory   |
| `lls`    | list directory    |
| `lmkdir` | create directory  |

---
layout: center
---

# `get` and `put` Are Named From Your Side

<CommandExplainer
  command="sftp> get passwd"
  :steps="[
    { active: 'get', explanation: 'Download: bring the file from the remote host to the local one' },
    { active: 'passwd', explanation: 'Read from the remote working directory, written into the local working directory' },
  ]"
/>

<v-click>

`put` is the mirror image: it uploads from local to remote.

</v-click>

---
vertical: start
---

# Downloading

Set the directory on each side, then `get`.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
sftp> lcd /home/student/Downloads
sftp> cd /etc
```
```bash-session
sftp> lcd /home/student/Downloads
sftp> cd /etc
sftp> get passwd
```
```bash-session
sftp> lcd /home/student/Downloads
sftp> cd /etc
sftp> get passwd
Fetching /etc/passwd to passwd
passwd                                     100% 2374     2.3MB/s   00:00
sftp>
```
````

</TerminalWindow>

`lcd` chose where it landed. `cd` chose where it came from.

---
vertical: start
---

# Uploading

The same two commands, in the other direction.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
sftp> mkdir hostbackup
sftp> cd hostbackup
```
```bash-session
sftp> mkdir hostbackup
sftp> cd hostbackup
sftp> put /etc/hosts
```
```bash-session
sftp> mkdir hostbackup
sftp> cd hostbackup
sftp> put /etc/hosts
Uploading /etc/hosts to /home/student/hostbackup/hosts
/etc/hosts                                 100%  227     0.2KB/s   00:00
sftp>
```
````

</TerminalWindow>

<Callout>

`mkdir` created the directory on `servera`, because it has no leading `l`.

</Callout>

---
vertical: center
---

# Leaving

<TerminalWindow title="student@workstation:~">

```bash-session
sftp> bye
student@workstation:~$
```

</TerminalWindow>

`bye`, `exit`, and `quit` all close the session and return you to your shell.

---

# Exercise: Downloading Files with `sftp`

## Requirements

Local host: `workstation`, in `/home/student/Downloads`

Remote host: `servera`, in `/etc`

## Steps

1. From `workstation`, open an interactive transfer session to `servera`
2. Point the <AccentText>local</AccentText> side at your `Downloads` directory and confirm where you are
3. Point the <AccentText>remote</AccentText> side at `/etc` and confirm where you are
4. Confirm the `group` file exists on the remote side, then download it
5. List the local directory from inside the session to verify the download
6. Leave the session and read the downloaded file with `cat`
7. Remove the downloaded file
