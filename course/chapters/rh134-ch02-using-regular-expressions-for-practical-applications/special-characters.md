---
layout: section
routeAlias: special-characters
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
    - title: Special Characters in the Shell Exercise
      source: ./exercises/special-characters-exercise.html
---

# Special Characters in the Shell

## What Bash does to your command before the command ever sees it

---
vertical: center
---

# Bash Reads Your Command First

You type a command. <AccentText>Bash reads it before anything runs.</AccentText>

Characters such as `*`, `?`, `[`, `$`, and `\` mean something <DangerText>to Bash</DangerText>.

Tonight we will do two things with them:

- Use them deliberately, to name groups of files
- Hide them from Bash, so another program receives them intact

---
vertical: start
---

# Pathname Expansion

Bash replaces a pattern with the names of the files that match it, <AccentText>before</AccentText> running the command.

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ ls
filea.txt  fileb.md  filec.sh
student@servera:~$ echo *
```
```bash-session
student@servera:~$ ls
filea.txt  fileb.md  filec.sh
student@servera:~$ echo *
filea.txt fileb.md filec.sh
student@servera:~$
```
````

</TerminalWindow>

<v-click>

`echo` never received a `*`. It received three file names.

This is called <AccentText>globbing</AccentText>.

</v-click>

---
layout: two-cols-header
vertical: start
---

# The Three Glob Patterns

::left::

| Pattern | Matches                          |
| ------- | -------------------------------- |
| `*`     | any run of characters, including none |
| `?`     | exactly one character            |
| `[ab]`  | one character from the set       |

A glob matches <AccentText>whole file names</AccentText>, so `*.txt` means "anything, then `.txt`".

::right::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ls
filea.txt  fileb.md  filec.sh
student@servera:~$ ls *.txt
filea.txt
student@servera:~$ ls file?.md
fileb.md
student@servera:~$ ls file[ac].*
filea.txt  filec.sh
student@servera:~$
```

</TerminalWindow>

---
layout: two-cols-header
---

# Three Ways to Protect a Character

::left::

## Single quotes `'...'`

Everything inside is <SuccessText>literal</SuccessText>. Bash expands nothing.

## Double quotes `"..."`

Bash still expands variables (`$HOSTNAME`) and command substitutions (`$(...)`).

## Backslash `\`

Protects exactly <AccentText>one</AccentText> following character.

::right::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ echo *
filea.txt fileb.md filec.sh
student@servera:~$ echo '*'
*
student@servera:~$ echo "*"
*
student@servera:~$ echo \*
*
student@servera:~$
```

</TerminalWindow>

Three different techniques, one result: `echo` receives a literal asterisk.

---
vertical: start
---

# Variables: A Preview of Next Week

Assign with `name=value` — <WarningText>no spaces around the equals sign</WarningText>.

Read the value back by prefixing the name with `$`.

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ host=servera
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo $host
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo $host
servera
student@servera:~$
```
````

</TerminalWindow>

We will build on this during the shell scripting class. For now it is the clearest way to see what quotes actually do.

---
vertical: start
---

# Same Command, Three Quoting Styles

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
Checking $host
student@servera:~$
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
Checking $host
student@servera:~$ echo "Checking $host"
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
Checking $host
student@servera:~$ echo "Checking $host"
Checking servera
student@servera:~$
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
Checking $host
student@servera:~$ echo "Checking $host"
Checking servera
student@servera:~$ echo "Checking ${host}.lab.example.com"
```
```bash-session
student@servera:~$ host=servera
student@servera:~$ echo 'Checking $host'
Checking $host
student@servera:~$ echo "Checking $host"
Checking servera
student@servera:~$ echo "Checking ${host}.lab.example.com"
Checking servera.lab.example.com
student@servera:~$
```
````

</TerminalWindow>

Single quotes print the name. Double quotes print the value. Braces mark where the name ends.

---
vertical: center
---

# Escaping Inside Double Quotes

A backslash still works inside double quotes, so you can keep expansion available and still print one literal character.

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ echo "The variable is named \$host"
The variable is named $host
student@servera:~$
```

</TerminalWindow>

<Callout>

`\$` tells Bash to hand the dollar sign through untouched.

</Callout>

---
vertical: start
---

# Spaces Separate Arguments

`mkdir My Files` creates <DangerText>two</DangerText> directories, not one.

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ mkdir My Files
student@servera:~$ ls
Files  My
student@servera:~$
```
```bash-session
student@servera:~$ mkdir My Files
student@servera:~$ ls
Files  My
student@servera:~$ mkdir 'My Files'
student@servera:~$ ls
Files  My  My Files
student@servera:~$
```
```bash-session
student@servera:~$ mkdir My Files
student@servera:~$ ls
Files  My
student@servera:~$ mkdir 'My Files'
student@servera:~$ ls
Files  My  My Files
student@servera:~$ mkdir One\ Argument
student@servera:~$ ls
Files  My  My Files  One Argument
student@servera:~$
```
````

</TerminalWindow>

Quote the whole name, or escape each space. Both produce one argument.

---
layout: center
---

# Remember This Later Tonight

## When you hand a pattern to another program, wrap it in <AccentText>single quotes</AccentText>.

Bash reads your command first. Unquoted, it expands the pattern into file names, and the program never sees what you typed.

---

# Exercise: Special Characters in the Shell

## Requirements

Host: `servera`

Create three files with different names and extensions to match against.

## Steps

1. List your files using a pattern that matches only one of the extensions
2. List them again using a pattern that matches exactly one character in the name
3. List them a third time using a pattern that matches a set of characters
4. Show what Bash does to an unquoted `*`, then protect it three different ways
5. Assign a variable, then print it inside single quotes and inside double quotes
6. Print a dollar sign inside double quotes without expanding the variable
7. Create a directory whose name contains a space — twice, using a different technique each time
8. Verify with `ls -l`, then remove everything you created

---

# Exercise: Special Characters in the Shell

![Screen recording of the instructor working with shell special characters: an unquoted asterisk expands to file names, quoted and backslash-escaped asterisks print literally, a variable prints its name inside single quotes and its value inside double quotes, and directory names containing spaces are created with quotes and with escapes.](./assets/special-characters.gif)

<a href="https://asciinema.org/a/772135" target="_blank" rel="noopener noreferrer" aria-label="Watch the Special Characters in the Shell recording in a new tab">Watch the recording</a> · <a href="../resources/special-characters-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Special Characters in the Shell exercise in a new tab">Read the written exercise</a>
