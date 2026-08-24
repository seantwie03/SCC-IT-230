---
layout: section
routeAlias: quoting
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "07"
        title: Managing Files from the Command Line
    rhcsaCertGuide:
      - chapter: "04"
        title: Working with Text Files
  exercises:
    - title: Quoting Exercise
      source: ./exercises/quoting-exercise.html
---

# Quoting

## Protecting characters and arguments from Bash expansion

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

# Exercise: Quoting

## Requirements

Host: `servera`

## Steps

1. Protect an asterisk from shell expansion using single quotes, double quotes, and a backslash
2. Assign a variable with `name=value`, then print it inside single quotes and inside double quotes
3. Print a dollar sign inside double quotes without expanding the variable
4. Create a directory whose name contains a space — twice, using a different quoting/escaping technique each time
5. Verify with `ls -l`, then remove the directories and test files you created

---

# Exercise: Quoting

![Screen recording of the instructor demonstrating quoting and escaping: protecting asterisks, comparing single and double quotes with variables, and creating directories containing spaces.](./assets/globbing-and-quoting.gif)

<a href="https://asciinema.org/a/772135" target="_blank" rel="noopener noreferrer" aria-label="Watch the Quoting recording in a new tab">Watch the recording</a> · <a href="../resources/quoting-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Quoting exercise in a new tab">Read the written exercise</a>
