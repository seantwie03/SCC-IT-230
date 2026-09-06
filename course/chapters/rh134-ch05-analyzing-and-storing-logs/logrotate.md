---
layout: section
routeAlias: logrotate
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
    - title: Rotating a Log File by Size Exercise
      source: ./exercises/rotating-a-log-file-exercise.html
---

# Logrotate

## Prunes the logs

---

# Logrotate in Action

<TerminalWindow title="student@servera:~" :rows="4">

```bash-session
student@servera:~$ sudo ls -l /var/log/secure*
-rw-------. 1 root root 43073 Sep  6 16:44 /var/log/secure
-rw-------. 1 root root 27744 Sep  5 16:27 /var/log/secure-20260906
```

</TerminalWindow>

`logrotate` renames the current file, starts a fresh one, and eventually deletes the oldest

It runs from `logrotate.timer`, the same timer unit you read last week

---
layout: two-cols-header
leftWidth: 40
vertical: center
---

# Where the Rules Live

`/etc/logrotate.conf` sets the defaults, then pulls in one file per package

::left::

```bash [/etc/logrotate.conf]
weekly
rotate 4
create
dateext
include /etc/logrotate.d
```

::right::

```bash [/etc/logrotate.d/rsyslog]
/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/secure
/var/log/spooler
{
    missingok
    sharedscripts
    postrotate
        /usr/bin/systemctl reload rsyslog.service
    endscript
}
```

---
layout: two-cols-header
vertical: center
---

# Options Worth Knowing

::left::

## What to do

| Option | Effect |
| --- | --- |
| `rotate N` | Keep `N` old files |
| `compress` | gzip the old ones |
| `missingok` | Do not error if absent |
| `create` | Make a fresh empty file |
| `postrotate` | Run commands afterward |

::right::

## When to do it

| Option | Trigger |
| --- | --- |
| `daily` | Every day |
| `weekly` | Every week |
| `monthly` | Every month |
| `size 1k` | When it grows past a size |

No schedule given means the default in `/etc/logrotate.conf`, which is `weekly`

---
layout: exercise
---

# Rotating a Log File by Size

::goal::

Rotate a log file when it outgrows 1 KB, keeping only the two most recent copies

::environment::

**Host:** `servera`

::workflow::

1. Write a logrotate configuration for `/var/log/demo.log`
2. Fill the file past the size threshold
3. Run logrotate by hand rather than waiting for the timer
4. Repeat until more than two old copies would exist
5. Confirm the oldest was discarded
