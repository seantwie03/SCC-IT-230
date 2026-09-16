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

## Sorts messages into files

---
layout: two-cols-header
vertical: center
---

# Every Message Carries Two Labels


<br />

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

# Adding Rules in `/etc/rsyslog.d`

Before those rules, `/etc/rsyslog.conf` pulls in a drop-in directory

```bash [/etc/rsyslog.conf] {2}
# Include all config files in /etc/rsyslog.d/
include(file="/etc/rsyslog.d/*.conf" mode="optional")
```

Add your own rule as a file of your own there, named for what it routes

```bash [/etc/rsyslog.d/authpriv-info.conf]
authpriv.info /var/log/authpriv-info
```

<Callout type="warning">

The name has to end in `.conf`, or the include never picks the file up

</Callout>

---

# Writing and Reading

## Send a message with `logger`

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ logger -p authpriv.info "Houston, we have a problem."
```

</TerminalWindow>

`-p` sets the facility and priority

## Read a file with `tail` or `less`

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo tail -n5 /var/log/secure
student@servera:~$ sudo tail -f /var/log/messages
student@servera:~$ sudo less /var/log/cron
```

</TerminalWindow>

`tail -f` follows a file, and `less` does the same with `G` to jump to the end or `F` to follow

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
3. Send a test message with `logger` and read the file
4. Send higher priorities and confirm the same rule catches them

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/logging-authpriv-messages-exercise.cast?url";
</script>

# Logging authpriv.info Messages

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor adding a drop-in rsyslog rule that routes authpriv.info to its own file, restarting rsyslog and confirming the service came back, sending a test message with logger and reading the file that message created, then sending alert and emergency messages to show that one info rule catches every higher priority, and removing the rule again."
/>

::resources::

<a href="../resources/logging-authpriv-messages-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Logging authpriv.info Messages exercise in a new tab">Written exercise</a>
