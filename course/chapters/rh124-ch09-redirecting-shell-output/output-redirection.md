---
layout: section
---

# Output Redirection

## Redirecting and Appending

---
vertical: start
---

# Output Redirection Operator `>`

**<AccentText>Redirects Standard Output (stdout) to a file</AccentText>**

<br />

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ ls -l
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
student@workstation:~$ ls -l
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
-rw-r--r--. 1 student student 31 Aug 16 10:22 long_listing.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
-rw-r--r--. 1 student student 31 Aug 16 10:22 long_listing.txt
student@workstation:~$ cat long_listing.txt
```
```bash-session
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$ ls -l > long_listing.txt
student@workstation:~$ ls -l
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
-rw-r--r--. 1 student student 31 Aug 16 10:22 long_listing.txt
student@workstation:~$ cat long_listing.txt
-rw-r--r--. 1 student student 18 Aug 16 09:14 notes.txt
-rw-r--r--. 1 student student 27 Aug 16 09:14 servers.txt
student@workstation:~$
```
````

</TerminalWindow>

---
layout: two-cols-header
leftWidth: 70
---

# A New Way to Lose Your Work!

::left::
### The Scenario

1. You spend all week writing `thesis.txt` (10,000 words).
2. You decide to add one final thought.
3. You type: `echo "The End" > thesis.txt`

### The Result

<AccentText>Congratulations!</AccentText>

Your 10,000-word thesis has been successfully <AccentText>overwritten</AccentText>

Your file now <AccentText>contains exactly two words:</AccentText> `The End`.

What you meant to use was the append operator `>>`.

::right::

![student losing work due to redirect operator](./assets/dangerous-redirect.jpeg)

---
---

# Appending with `>>`

Use `>>` to append output to the end of an existing file.

```bash
ls -l /tmp > listing.txt
ls -l /etc >> listing.txt
```

`listing.txt` contains the `/tmp` listing followed by the `/etc` listing.

---
layout: two-cols-header
vertical: center
---

# Comparison

::left::

## Using `>`

<TerminalWindow title="student@workstation:~">

````md magic-move {lines: false}
```bash-session
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ cat greet1.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ echo "Hello Class" > greet1.txt
student@workstation:~$ cat greet1.txt
Hello Class
student@workstation:~$
```
````

</TerminalWindow>

::right::

## Using `>>`

<TerminalWindow title="student@workstation:~">

````md magic-move {lines: false}
```bash-session
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ cat greet2.txt
```
```bash-session
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ echo "Hello Class" >> greet2.txt
student@workstation:~$ cat greet2.txt
Hello Class
Hello Class
Hello Class
student@workstation:~$
```
````

</TerminalWindow>

---
vertical: start
---

# Redirect

## What will this output to the screen?

<TerminalWindow title="student@workstation:inventories">

````md magic-move
```bash-session
student@workstation:inventories$ ls > inventories
```
```bash-session
student@workstation:inventories$ ls > inventories
student@workstation:inventories$
```
```bash-session
student@workstation:inventories$ ls > inventories
student@workstation:inventories$ cat inventories
```
```bash-session
student@workstation:inventories$ ls > inventories
student@workstation:inventories$ cat inventories
2022-11-inventory.csv
2022-12-inventory.csv
2023-01-inventory.csv
2023-02-inventory.csv
2023-03-inventory.csv
2023-04-inventory.csv
2023-05-inventory.csv
2023-06-inventory.csv
2023-07-inventory.csv
2023-08-inventory.csv
...
student@workstation:inventories$
```
````

</TerminalWindow>

<v-click>

The output is redirected to a file. Nothing is shown on screen.

<!-- Redirecting `ls` into a file named `inventories` prints nothing to the screen. `cat inventories` then shows the directory listing that was captured before the new file existed. -->

</v-click>

---
vertical: center
---

# The Null Device

## What will this command output?

<TerminalWindow title="student@workstation:/inventories">

````md magic-move
```bash-session
student@workstation:/inventories$ ls > /dev/null
```
```bash-session
student@workstation:/inventories$ ls > /dev/null
student@workstation:/inventories$
```
````

</TerminalWindow>

<v-click>

`/dev/null` is like a black hole.

No information can escape

The command produces nothing on the screen.

</v-click>

---
---

# Exercise: Output Redirection vs Append

![Screen recording of the instructor comparing the > and >> redirection operators in a terminal.](./assets/output_redirection.gif)
