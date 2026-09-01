---
name: lab-verification
description: Verify IT-230 course commands, terminal output, and exit codes against the live RHEL lab before publishing them. Use when authoring, porting, or reviewing slide transcripts, exercise command files, or written exercises that show commands or their output.
---

# Lab Verification

Course material states facts about RHEL. Verify them against the lab instead of
trusting a source deck, an older RHEL release, or memory.

## The rule

Every command, transcript, exit code, and error string that ships in a fragment
or exercise gets executed on the lab first. `docs/course-authoring.md` requires
output to match RHEL 10.0, and ported material frequently does not.

Reproducing plausible-looking output is a correctness failure, not a style
problem. A student who types the command and sees something else loses trust in
the whole deck.

## Reaching the lab

Use the wrapper. Raw `ssh` is deliberately unapproved, because options such as
`-o ProxyCommand=...` and `-J` can redirect a connection to a host outside the
lab.

```sh
pnpm lab -- servera hostname -f
pnpm lab -- --tty servera set -o
```

Hosts: `workstation`, `servera`, `serverb`, `serverc`. The wrapper rejects
every other host, rejects options in the host position, and supplies its own
connection options.

By default the remote command reads no standard input. Pass `--tty` to allocate
a terminal and forward standard input, which is needed when piping a script into
an interactive shell.

Never add a password, key, or other credential to repository files. The wrapper
relies on the maintainer's existing SSH configuration.

### When the lab is unreachable

The VMs are not always running. Check before concluding that a command hangs:

```sh
ping -c1 -W2 servera.lab.example.com
```

If the host does not answer, stop and tell the maintainer the lab is down
rather than retrying or guessing at output.

## Rewrite prompts for the theme

The theme's `bash-session` grammar recognizes a prompt only when a line begins
with a complete `user@host:directory$` or `user@host:directory#` prompt. Red Hat
Academy material and older course decks use `[student@servera ~]$`, which the
grammar does not recognize, so the line renders as plain output.

Rewrite every transcript:

| Source form              | Theme form              |
| ------------------------ | ----------------------- |
| `[student@servera ~]$`   | `student@servera:~$`    |
| `[root@servera log]#`    | `root@servera:/var/log#` |

The rewritten prompt must still name the real user, host, and directory.

## Interactive and noninteractive output differ

Several commands report different values depending on how the shell was
started. Capture the form a student will actually see, which is interactive.

- `set -o` reports `emacs`, `histexpand`, `history`, and `monitor` as `off` in a
  noninteractive shell and `on` in an interactive one. Use
  `printf 'set -o\nexit\n' | pnpm lab -- --tty servera` to see real values.
- A failed command reports `-bash:` from a login shell and `bash:` from a shell
  started by typing `bash`. Match the prefix to the transcript's own context.
- An alias defined and used in the same noninteractive `bash -c` never expands,
  because aliases are resolved when a line is parsed. That is an artifact of the
  test, not the behavior a student will see.

## Verified RHEL 10.0 differences from RHEL 9

Older course material predates these. Recheck rather than assuming this list is
complete.

- There is no `ls`, `ll`, or `l.` alias. The predefined aliases are the `grep`
  family, `which`, and the `xz`/`z` compression wrappers.
- `PAGER` and `EDITOR` are unset. `man` falls back to `less` and editors fall
  back to `vi` on their own, so do not describe those as the variables' values.
- A successful `ping` summary omits the `0 errors` field that RHEL 9 printed.
- `~/.bash_aliases` does not exist and nothing reads it. An exercise that uses
  it must create it and source it explicitly.

## Verify exercise logic, not only transcripts

Run an exercise's script body on the lab before shipping it, including the
paths students hit by accident:

- the privilege guard, run both with and without `sudo`
- a second run, to confirm the script is safe to repeat
- the blank-line, missing-argument, and already-exists cases
- the cleanup steps, so the host returns to its starting state

## Boundary

Verify against the lab; never copy Red Hat Academy source material, guided
exercises, labs, or instructor-guide content into this repository.
`AGENTS.md` and `docs/course-authoring.md` govern what may be published.
