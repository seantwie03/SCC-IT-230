---
layout: section
---

# Man(ual) Pages

---
listSpacing: padded
---

# Manual (man) Pages

- <AccentText>Amazing documentation!</AccentText>
  - There is a man page for practically every command
  - And a lot of configuration files also have man pages!
- `man {COMMAND-NAME}`
- `man {CONFIG-FILE-NAME}`
- Opens in the `less` program by default

## Examples

```bash
man ls
man grep
man cut
man dnf.conf
```

---
vertical: start
---

# Man Pages

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ man ls
```
```bash-session
student@workstation:~$ man ls
LS(1)                                         User Commands                                               LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List  information  about the FILEs (the current directory by default).  Sort entries alphabetically if...

       -a, --all
              do not ignore entries starting with .

       -A, --almost-all
              do not list implied . and ..

       --block-size=SIZE
              with -l, scale sizes by SIZE when printing them; e.g., '--block-size=M'; see SIZE format below
```
````

</TerminalWindow>

---
---

# SYNOPSIS

```
SYNOPSIS
       ls [OPTION]... [FILE]...
```

| Syntax             | Meaning                                             |
| :----------------- | :--------------------------------------------------- |
| **bold text**       | Type exactly as shown.                               |
| _italic text_       | Replace with appropriate argument.                   |
| `[-abc]`            | Any or all arguments within `[ ]` are optional.      |
| `-a \| -b`          | Options delimited by `\|` cannot be used together.   |
| `argument ...`      | Argument is repeatable.                              |
| `[expression] ...`  | Entire expression within `[ ]` is repeatable.        |

---
vertical: start
---

# Search Man Pages with `-k`

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ man -k conf
```
```bash-session
student@workstation:~$ man -k conf
chrony.conf (5)      - chronyd configuration file
selinux_config (5)   - The SELinux sub-system configuration file.
crontabs (4)         - configuration and scripts for running periodical jobs
dir_colors (5)       - configuration file for dircolors(1)
dnf.conf (5)         - DNF Configuration Reference
firewalld.conf (5)   - firewalld configuration file
grub2-mkconfig (8)   - generate a GRUB configuration file
journald.conf (5)    - Journal service configuration files
logind.conf (5)      - Login manager configuration files
logrotate.conf (5)   - rotates, compresses, and mails system logs
lvm.conf (5)         - Configuration file for LVM2
manpath (5)          - format of the /etc/man_db.conf file
ssh_config (5)       - OpenSSH client configuration file
sshd_config (5)      - OpenSSH daemon configuration file
sudo.conf (5)        - configuration for sudo front-end
systemd.service (5)  - Service unit configuration
systemd.target (5)   - Target unit configuration
systemd.timer (5)    - Timer unit configuration
systemd.unit (5)     - Unit configuration
```
````

</TerminalWindow>

---
---

# `less` — the Pager Program

- `less` is a program called a `pager`
- It allows you to view a long document page-by-page
- The developer of `less` was creating a replacement for a pager called `more` (1984)
  - "**less is more, but more than more**"
- `less` is used "behind the scenes"
  - Viewing `man` pages
  - Viewing journald
  - Viewing `git log`
- `less` shares many keyboard shortcuts with `vim`

---
---

# `less` Keyboard Shortcuts

| Shortcut           | Description                                |
| :------------------ | :------------------------------------------ |
| `q`                 | Quit the less program                       |
| `f` or `Spacebar`   | Scroll forward one full screen              |
| `b`                 | Scroll back one full screen                 |
| `/`                 | Search forward                              |
| `?`                 | Search backward                             |
| `n`                 | Repeat search (next match)                  |
| `N`                 | Repeat search in reverse (previous match)   |

---
---

# Demo: Man Pages

![Screen recording of the instructor opening, navigating, and searching man pages with less.](./assets/man_pages.gif)

---
listSpacing: padded
---

# Memorize All These Commands?

<v-click>

<div class="flex justify-around items-center">

<div class="flex flex-col">

Do you need to memorize every champion to play LoL?

No, you can look them up in the Wiki

But, if you are constantly Alt-Tabbed reading the Wiki

**You will lose lane**

And be stuck in <AccentText>Silver League</AccentText>

</div>

<div class="w-[210px]">

![image of several MOBA champions](./assets/it230-champions.jpeg)

</div>

</div>

</v-click>

---
listSpacing: padded
---

# Your Goal Is Not to "Use the `ls` Command"

Your goal is to:

- Install and configure the web server
- Add a new entry to the DNS zone
- Bring a new VM online
- Etc.

You will need to use many commands to accomplish these goals.

---
listSpacing: padded
---

# General Guidance

## Do not set a goal to "Memorize every command"

<Callout>

Learn commands <AccentText>as you encounter them</AccentText>

</Callout>

When you encounter an unfamiliar command:

1. Take a couple minutes to scan the man page for the new command.
2. Take a couple more minutes to test out a few of the options and arguments.

This is a more natural way to learn commands, <AccentText>as you need them</AccentText>
