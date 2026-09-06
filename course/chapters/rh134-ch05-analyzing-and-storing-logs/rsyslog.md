---
layout: section
routeAlias: rsyslog
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "05"
        title: Analyzing and Storing Logs
    rhcsaCertGuide:
      - chapter: "13"
        title: Configuring Logging
  exercises:
    - title: Logging authpriv.info Messages Exercise
      source: ./exercises/logging-authpriv-messages-exercise.html
---

# Rsyslog

## Sorting messages into files by what they are and how bad they are

---
layout: two-cols-header
vertical: center
---

# Every Message Carries Two Labels

`rsyslog` decides where a message goes by reading both of them

::left::

## Facility

What kind of thing sent it

`cron`, `mail`, `authpriv`

::right::

## Priority

How bad it is

`emerg`, `err`, `info`

---

# Syslog Facilities

| Code | Facility | Messages from |
| --- | --- | --- |
| 0 | `kern` | The kernel |
| 2 | `mail` | The mail system |
| 3 | `daemon` | System daemons |
| 9 | `cron` | The clock daemon |
| 10 | `authpriv` | Logins, `sudo`, authentication |
| 16 to 23 | `local0` to `local7` | Whatever you assign them to |

---
layout: two-cols-header
vertical: center
---

# Syslog Priorities

Eight levels, lowest number most severe

::left::

## Something is wrong

| Code | Priority | Meaning |
| --- | --- | --- |
| 0 | `emerg` | System is unusable |
| 1 | `alert` | Act immediately |
| 2 | `crit` | Critical condition |
| 3 | `err` | Error |

::right::

## Everything else

| Code | Priority | Meaning |
| --- | --- | --- |
| 4 | `warning` | Warning |
| 5 | `notice` | Normal but significant |
| 6 | `info` | Informational |
| 7 | `debug` | Debugging detail |

---

# Routing Rules

```bash [/etc/rsyslog.conf] {3,6,12}
#### RULES ####
...output omitted...
*.info;mail.none;authpriv.none;cron.none                /var/log/messages

# The authpriv file has restricted access.
authpriv.*                                              /var/log/secure

# Log all the mail messages in one place.
mail.*                                                  -/var/log/maillog

# Everybody gets emergency messages
*.emerg                                                 :omusrmsg:*
```

Read each rule as `facility.priority` on the left and a destination on the right

A priority catches that level <AccentText>and everything above it</AccentText>, so `info` also catches `err` and `emerg`

---
layout: two-cols-header
vertical: center
---

# Writing and Reading

::left::

## Send a message with `logger`

<TerminalWindow title="student@servera:~" :rows="3">

```bash-session
student@servera:~$ logger -p authpriv.info "Houston, we have a problem."
```

</TerminalWindow>

`-p` sets the facility and priority

::right::

## Read a file with `tail` or `less`

<TerminalWindow title="student@servera:~" :rows="4">

```bash-session
student@servera:~$ sudo tail -n5 /var/log/secure
student@servera:~$ sudo tail -f /var/log/messages
student@servera:~$ sudo less /var/log/cron
```

</TerminalWindow>

`tail -f` follows a file, and `less` opens it with `F` to follow and `G` to jump to the end

---
layout: exercise
---

# Logging authpriv.info Messages

::goal::

Send authentication messages to a file of your own by adding a rule to rsyslog

::environment::

**Host:** `servera`

::workflow::

1. Add a rule that routes `authpriv.info` to its own file
2. Restart rsyslog so the rule takes effect
3. Send a test message with `logger`
4. Read the file and watch it fill as you authenticate
5. Send higher priorities and confirm the same rule catches them
