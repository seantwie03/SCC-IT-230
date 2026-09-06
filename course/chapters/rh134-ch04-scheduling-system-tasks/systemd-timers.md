---
layout: section
routeAlias: systemd-timers
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "04"
        title: Scheduling System Tasks
    rhcsaCertGuide:
      - chapter: "12"
        title: Scheduling Tasks
  exercises:
    - title: Scheduling a Timer Unit Exercise
      source: ./exercises/scheduling-a-timer-unit-exercise.html
---

# Systemd Timers

## How RHEL schedules its own recurring work

---
layout: two-cols-header
vertical: center
---

# It Takes Two Units

A timer says <AccentText>when</AccentText> and its service says <AccentText>what</AccentText>

Matching names link them, so you enable the timer, never the service

::left::

## `logrotate.timer`

```ini
[Timer]
OnCalendar=daily
RandomizedDelaySec=1h
Persistent=true
```

::right::

## `logrotate.service`

```ini
[Service]
Type=oneshot
ExecStart=/usr/sbin/logrotate /etc/logrotate.conf
```

---

# Finding Timers

<TerminalWindow title="student@servera:~" :rows="10">

```bash-session {*}{lines:false}
student@servera:~$ systemctl list-units -t timer
  UNIT                         LOAD   ACTIVE SUB     DESCRIPTION
  dnf-makecache.timer          loaded active waiting dnf makecache --timer
  logrotate.timer              loaded active waiting Daily rotation of log files
  systemd-tmpfiles-clean.timer loaded active waiting Daily Cleanup of Temporary Directories
student@servera:~$ systemctl list-unit-files -t timer
UNIT FILE                      STATE    PRESET
insights-client.timer          disabled disabled
logrotate.timer                enabled  enabled
```

</TerminalWindow>

`list-units` shows what is loaded now, `list-unit-files` shows everything installed

---

# When Does It Fire Next?

<TerminalWindow title="student@servera:~" :rows="8">

```bash-session {*}{lines:false}
student@servera:~$ systemctl status logrotate.timer
● logrotate.timer - Daily rotation of log files
     Loaded: loaded (/usr/lib/systemd/system/logrotate.timer; enabled; preset: enabled)
     Active: active (waiting) since Tue 2026-03-24 12:02:33 UTC; 5 months 12 days ago
    Trigger: Sun 2026-09-06 00:14:56 UTC; 7h left
   Triggers: ● logrotate.service
```

</TerminalWindow>

**<AccentText>Trigger</AccentText>** is when it fires next, and <AccentText>Triggers</AccentText> is the service it will start

---
vertical: start
---

# Saying When

The `[Timer]` section answers *when*, and it can count from several starting points

| Option            | Counts from                                    |
| ----------------- | ---------------------------------------------- |
| `OnCalendar`      | a wall-clock date and time, such as `daily`     |
| `OnBootSec`       | when the machine booted                         |
| `OnStartupSec`    | when systemd itself started                     |
| `OnActiveSec`     | when the timer was activated                    |
| `OnUnitActiveSec` | the last time the service it triggers ran       |

---
vertical: center
---

# Timers Catch Up Too

`Persistent=true` records the last run on disk

If the machine was off when the timer was due, it fires once the machine is back

<Callout type="success" title="Sound familiar?">

This is what anacron does for `/etc/cron.daily`, except a timer does it per unit, without needing `root` and without the battery rule.

</Callout>

---

# Writing Your Own

Never edit a unit in `/usr/lib/systemd/system`, because a package update overwrites it

<TerminalWindow title="root@servera:~" :rows="6">

```bash-session
root@servera:~# vim /etc/systemd/system/etc-backup.service
root@servera:~# vim /etc/systemd/system/etc-backup.timer
root@servera:~# systemctl daemon-reload
root@servera:~# systemctl enable --now etc-backup.timer
```

</TerminalWindow>

`daemon-reload` makes systemd read your changes, and `--now` starts the timer as well as enabling it

---
layout: two-cols-header
vertical: center
---

# Which One Do I Reach For?

All three are worth knowing, and cron and timers are both on the RHCSA exam

::left::

## `at`

A job that runs <AccentText>once</AccentText>

## cron

A recurring job you are writing yourself

::right::

## systemd timer

What RHEL already ships its own jobs as

Also when you need a boot-relative schedule, or a unit dependency

---
layout: exercise
---

# Scheduling a Timer Unit

::goal::

Schedule a job with a timer, then make it survive the machine being switched off

::environment::

**Host:** `servera`

::workflow::

1. Write a script worth scheduling and run it once by hand
2. Write a `.service` unit that runs it
3. Write a matching `.timer` unit and enable it
4. Confirm it fires with `systemctl list-timers` and the journal
5. Add `Persistent=true` and reload, then check the timer again
