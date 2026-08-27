---
layout: section
routeAlias: ranges-and-quantifiers
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
    - title: Ranges and Quantifiers Exercise
      source: ./exercises/ranges-and-quantifiers-exercise.html
---

# Ranges and Quantifiers

## Describing *which* characters, and *how many*

---
layout: two-cols-header
vertical: center
---

# Ranges: One Character From a Set

`[...]` matches exactly <AccentText>one</AccentText> character out of everything listed inside

::left::

| Range     | Matches                |
| --------- | ---------------------- |
| `[a-z]`   | any lowercase letter   |
| `[A-Z]`   | any uppercase letter   |
| `[0-9]`   | any digit              |
| `[aeiou]` | any one of five vowels |

::right::

You have seen these brackets already tonight

As a <AccentText>glob</AccentText>, `[ac]` matched one character of a file name

As a <AccentText>regex</AccentText>, it means the same thing: one character from the set

<Callout>

Brackets are the one symbol that means the same thing in both

</Callout>

---
vertical: start
---

# Ranges: Letters and Digits

Three-letter words that begin with `c` and end with `t`, then three digits in a row

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ grep '^c[a-z]t$' /usr/share/dict/words
```
```bash-session
student@servera:~$ grep '^c[a-z]t$' /usr/share/dict/words
cat
cot
cut
student@servera:~$
```
```bash-session
student@servera:~$ grep '^c[a-z]t$' /usr/share/dict/words
cat
cot
cut
student@servera:~$ sudo grep 'systemd\[[0-9][0-9][0-9]\]' /var/log/messages | head -n2
```
```bash-session
student@servera:~$ grep '^c[a-z]t$' /usr/share/dict/words
cat
cot
cut
student@servera:~$ sudo grep 'systemd\[[0-9][0-9][0-9]\]' /var/log/messages | head -n2
Aug 26 00:47:59 servera systemd[958]: Startup finished in 74ms.
Aug 26 00:47:59 servera systemd[958]: Reached target Main User Target.
student@servera:~$
```
````

</TerminalWindow>

Three brackets in a row means three characters, one match per bracket

---
layout: two-cols-header
vertical: start
---

# The Wildcard `.` (Spot)

`.` matches <AccentText>any single character</AccentText>: letter, digit, symbol, or space

::left::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ grep '^c.t$' /usr/share/dict/words
cat
cot
cut
student@servera:~$
```

</TerminalWindow>

::right::

| Candidate | Result | Why                       |
| --------- | ------ | ------------------------- |
| `cat`     | match  | one character in the middle |
| `c@t`     | match  | a symbol is a character   |
| `c t`     | match  | a space is a character    |
| `coat`    | no match | two characters in the middle |
| `ct`      | no match | zero characters in the middle |

---
vertical: center
---

# When You Do Not Know How Many

You cannot type one `.` per character when the length varies

## `*` (Splat): the preceding item, zero or more times

`5[0-9]*` matches a `5` followed by any number of digits:

- `5`: zero digits after the five
- `50`: one digit
- `599`: two digits
- `52394723948729384`: as many as you like

---
vertical: center
---

# Putting the Two Together

## What does `.*` match?

<v-click>

- `.` is any character
- `*` is zero or more times

## `.*` matches <AccentText>anything at all</AccentText>

Including nothing, the regex equivalent of a shrug

</v-click>

---
layout: two-cols-header
---

# The Other Quantifiers

::left::

## `?` (What): at most once

Makes the preceding item optional

`colou?r` matches `color` and `colour`

## `+` (Intersection): one or more

`Go+gle` matches `Google` and `Gooooogle`, but <DangerText>not</DangerText> `Ggle`

::right::

## `{n}` and `{n,m}` (Embrace): an exact count

- `Go{2}gle`: exactly two `o`
- `Go{1,2}gle`: one or two `o`
- `[0-9]{1,3}`: one to three digits

<Callout>

`{1,3}` is how you say "an IP address octet" without typing three separate ranges

</Callout>

---
vertical: start
---

# Quantifier Reference

| Symbol  | Extended only? | INTERCAL name      | The preceding item is matched…      |
| :-----: | :------------: | ------------------ | ----------------------------------- |
|  `.`    | No             | Spot               | (any single character)              |
|  `*`    | No             | Splat              | zero or more times                  |
|  `?`    | **Yes**        | What               | at most once                        |
|  `+`    | **Yes**        | Intersection       | one or more times                   |
| `{n}`   | **Yes**        | Embrace            | exactly *n* times                   |
| `{n,m}` | **Yes**        | Embrace            | between *n* and *m* times           |

"Extended only" is the subject of the next slide

---
vertical: start
---

# Globs Are Not Regular Expressions

You met these at the start of class, when <AccentText>Bash</AccentText> used them to name files; only the brackets kept their meaning

| Symbol | As a glob, to Bash         | As a regex, to `grep`                  |
| :----: | -------------------------- | -------------------------------------- |
|  `*`   | any run of characters      | the preceding item, zero or more times |
|  `?`   | exactly one character      | the preceding item, at most once       |
| `[ab]` | one character from the set | one character from the set             |
|  `.`   | an ordinary dot            | any single character                   |

This is why every pattern tonight has been wrapped in <AccentText>single quotes</AccentText>

---
layout: two-cols-header
vertical: start
---

# Two Dialects

One of the most confusing things about regex is that there is more than one grammar

::left::

## Basic (BRE)

The default for `grep` and `sed`

`?`, `+`, and `{}` are <WarningText>ordinary text</WarningText> until you escape them

```bash
grep 'colou\?r' /some/file
```

::right::

## Extended (ERE)

What Python, JavaScript, and `grep -E` use

`?`, `+`, and `{}` are <SuccessText>special by default</SuccessText>

```bash
grep -E 'colou?r' /some/file
```

---
vertical: start
---

# The Same Question, Three Commands

| Command               | Matches `color` | Matches `colour` | Matches the literal `colou?r` |
| --------------------- | :-------------: | :--------------: | :---------------------------: |
| `grep 'colou?r'`      |       no        |        no        |              yes              |
| `grep 'colou\?r'`     |      yes        |       yes        |              no               |
| `grep -E 'colou?r'`   |      yes        |       yes        |              no               |

<Callout title="Rule of thumb">

Reach for `grep -E` whenever your pattern uses `?`, `+`, or `{}`

</Callout>

---
vertical: start
---

# Groups: A Real SELinux Pattern

This is how you label a directory <AccentText>and everything inside it</AccentText>

```bash
/website(/.*)?
```

<CommandExplainer
  command="/website(/.*)?"
  :steps="[
    { active: '/website', explanation: 'The literal directory name' },
    { active: '(/.*)', explanation: 'A group: a slash followed by anything at all, treated as one unit like parentheses in algebra' },
    { active: '?', explanation: 'Applies to the whole group, so the group is optional' },
  ]"
/>

<v-click>

So it matches `/website` on its own <AccentText>and</AccentText> `/website/css/style.css`

</v-click>

---
vertical: start
---

# Print Only the Match with `-o`

`grep` normally prints the whole line; `-o` prints just the part that matched

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
```
```bash-session
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
10.0.2.2
203.0.113.55
203.0.113.55
student@servera:~$
```
```bash-session
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
10.0.2.2
203.0.113.55
203.0.113.55
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' \
> | uniq -c
```
```bash-session
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
10.0.2.2
203.0.113.55
203.0.113.55
student@servera:~$ sudo grep 'Failed password' /var/log/secure \
> | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' \
> | uniq -c
      1 10.0.2.2
      2 203.0.113.55
student@servera:~$
```
````

</TerminalWindow>

That is the report from the beginning of the chapter

---
layout: exercise
---

# Ranges and Quantifiers

::goal::

Find structured values with regular-expression ranges and quantifiers

::environment::

**Host:** `servera`

::workflow::

1. Seed and verify failed-login entries
2. Extract and count the IP addresses
3. Create and match a sample directory tree

---
layout: exercise
variant: recording
---

# Ranges and Quantifiers

::recording::

![Screen recording of the instructor seeding failed-password entries with logger, extracting IP addresses from the authentication log with a quantified digit range, counting the unique addresses, then creating a website directory tree and filtering it with an extended group pattern](./assets/ranges-and-quantifiers.gif)

::resources::

<a href="https://asciinema.org/a/BLokJ1ZIVOfAMXA6" target="_blank" rel="noopener noreferrer" aria-label="Watch the Ranges and Quantifiers recording in a new tab">Asciinema recording</a><a href="../resources/ranges-and-quantifiers-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Ranges and Quantifiers exercise in a new tab">Written exercise</a>
