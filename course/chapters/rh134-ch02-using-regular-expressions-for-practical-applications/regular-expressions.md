---
layout: section
routeAlias: regular-expressions
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
    - title: Line Anchors Exercise
      source: ./exercises/line-anchors-exercise.html
---

# Regular Expressions

## Also known as regexp, or just regex

---
vertical: start
---

# Saying These Symbols Out Loud

Regular expressions are built from punctuation, and punctuation is hard to talk about in a classroom

We will borrow names from **INTERCAL**, a parody programming language from 1972

- It was designed to be as unlike every other language as possible
- Its compiler wants you to write `PLEASE`, but gets annoyed if you overdo it
- Its reference manual has **Tonsils** instead of Appendices, because they wanted a different removable organ
- It renamed "asterisk" to **Splat**

<Callout>

The names are a memory aid, not standard terminology; the symbols are what matter

</Callout>

---
vertical: start
---

# Tonight's Two Anchors

| Symbol | Keyboard  | INTERCAL name | Matches                 |
| :----: | --------- | ------------- | ----------------------- |
|  `^`   | Shift + 6 | Shark fin     | The beginning of a line |
|  `$`   | Shift + 4 | Big money     | The end of a line       |

Neither one matches a character; each matches a <AccentText>position</AccentText>

<Callout>

Every pattern from here on is wrapped in single quotes, for the reason we saw earlier: `grep` should read it, not Bash

</Callout>

---
vertical: start
---

# Anchor to the Start of a Line with `^`

Without an anchor, `cat` matches anywhere on the line

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep 'cat' /usr/share/dict/words
```
```bash-session
student@servera:~$ grep 'cat' /usr/share/dict/words
Muscat
bobcat
cat
catalog
duplicate
scatter
student@servera:~$
```
```bash-session
student@servera:~$ grep 'cat' /usr/share/dict/words
Muscat
bobcat
cat
catalog
duplicate
scatter
student@servera:~$ grep '^cat' /usr/share/dict/words
```
```bash-session
student@servera:~$ grep 'cat' /usr/share/dict/words
Muscat
bobcat
cat
catalog
duplicate
scatter
student@servera:~$ grep '^cat' /usr/share/dict/words
cat
catalog
student@servera:~$
```
````

</TerminalWindow>

---
vertical: start
---

# Anchor to the End of a Line with `$`

Every account that cannot log in ends its line with `nologin`

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep 'nologin$' /etc/passwd
```
```bash-session
student@servera:~$ grep 'nologin$' /etc/passwd
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
student@servera:~$
```
````

</TerminalWindow>

The string `nologin` must be followed immediately by the end of the line

---
vertical: start
---

# Both Anchors Together

Anchoring both ends means the line contains that string and <AccentText>nothing else</AccentText>

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep '^cat$' /usr/share/dict/words
```
```bash-session
student@servera:~$ grep '^cat$' /usr/share/dict/words
cat
student@servera:~$
```
````

</TerminalWindow>

<v-click>

So what does `^$` match?

</v-click>

---
vertical: start
---

# The Empty Pattern `^$`

The start of the line, immediately followed by the end of the line: a <AccentText>blank line</AccentText>

Combine it with `-v` to strip the blank lines out of a configuration file

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep -v '^$' /etc/ssh/sshd_config | head -n4
```
```bash-session
student@servera:~$ grep -v '^$' /etc/ssh/sshd_config | head -n4
# To modify the system-wide sshd configuration, create a *.conf file under
#  /etc/ssh/sshd_config.d/ which will be automatically included below
Include /etc/ssh/sshd_config.d/*.conf
# If you want to change the port on a SELinux system, you have to tell
student@servera:~$
```
````

</TerminalWindow>

---
layout: two-cols-header
vertical: center
---

# A Practical Use: Reading `ls -l`

The first character of a long listing is the file type

::left::

Searching for `d` without an anchor matches every line that happens to contain the letter

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ls -l /etc | grep 'd'
drwxr-xr-x.  4 root root  4096 Jan  6 dconf
-rw-r--r--.  1 root root   483 Jan  6 gdbinit
lrwxrwxrwx.  1 root root    17 Jan  6 ld.so.conf
student@servera:~$
```

</TerminalWindow>

::right::

Anchoring to the start returns <SuccessText>only directories</SuccessText>

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ls -l /etc | grep '^d'
drwxr-xr-x.  4 root root  4096 Jan  6 cups
drwxr-xr-x.  2 root root  4096 Jan  6 ssh
drwxr-xr-x.  6 root root  4096 Jan  6 yum
student@servera:~$
```

</TerminalWindow>

---
vertical: center
---

# Escaping Inside the Pattern

`.` means "any character" to `grep`; to match a literal dot, escape it

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ ls -l /etc | grep '\.conf$' | head -n3
```
```bash-session
student@servera:~$ ls -l /etc | grep '\.conf$' | head -n3
-rw-r--r--.  1 root root  1362 Jan  6 dracut.conf
-rw-r--r--.  1 root root   969 Jan  6 libaudit.conf
-rw-r--r--.  1 root root   604 Jan  6 logrotate.conf
student@servera:~$
```
````

</TerminalWindow>

<Callout type="warning">

The single quotes protect the backslash from Bash so that `grep` receives `\.` intact

</Callout>

---

# Exercise: Line Anchors

## Requirements

Host: `servera`

Privileges: `sudo` access to install the `words` package

## Steps

1. Install the dictionary and search without anchors
2. Compare start, end, and exact-line anchors
3. Use a start anchor to identify directories
4. Use an end anchor to identify configuration files

---

# Exercise: Line Anchors

![Screen recording of the instructor anchoring grep patterns: searching the system dictionary for a word with no anchors, then with a leading caret, then with a trailing dollar sign, then with both; and filtering a long listing of /etc down to directories and then to .conf file names](./assets/line-anchors.gif)

<a href="https://asciinema.org/a/773029" target="_blank" rel="noopener noreferrer" aria-label="Watch the Line Anchors recording in a new tab">Asciinema recording</a> · <a href="../resources/line-anchors-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Line Anchors exercise in a new tab">Written exercise</a>
