---
layout: section
routeAlias: journald
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
    - title: Reading the Journal Exercise
      source: ./exercises/reading-the-journal-exercise.html
---

# Systemd Journal

## Searchable record of systemd unit logs

---
vertical: center
---

# The Journal Is Structured, Not Just Text

`systemd-journald` writes a binary journal, so every entry carries labelled fields

That is what lets you ask for one unit, one time range, or one priority instead of grepping

<Callout type="warning">

By default the journal lives in `/run/log/journal/`, which is memory. A reboot loses it.

</Callout>

---

# Reading One Unit

`journalctl -u` is the command you will reach for most

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session {*}{lines:false}
student@servera:~$ journalctl -u crond.service
Sep 06 16:01:01 servera.lab.example.com CROND[14616]: (root) CMD (run-parts /etc/cron.hourly)
Sep 06 16:01:01 servera.lab.example.com CROND[14615]: (root) CMDEND (run-parts /etc/cron.hourly)
```

</TerminalWindow>

It opens in `less`, oldest first, so `G` jumps to the newest entries

---

# Narrowing by Time

```bash
journalctl --since "30 minutes ago"
journalctl --until "1 hour ago"
journalctl --since "2026-09-01 00:00:00" --until "2026-09-06 23:59:59"
```

Both options take the same human phrasing, documented in `systemd.time(7)`

Combine them with `-u` to ask about one unit during one window

---
layout: two-cols-header
vertical: center
---

# Narrowing by Field

Because entries are structured, you can filter on any field they carry

::left::

## Ask what exists

```bash
journalctl --fields
journalctl -F PRIORITY
journalctl -F _SYSTEMD_UNIT
```

::right::

## Then filter by it

```bash
journalctl PRIORITY=0
journalctl _SYSTEMD_UNIT=crond.service
journalctl SYSLOG_IDENTIFIER=sshd
```

---

# Making the Journal Survive a Reboot

Create the directory, and journald starts using it

<TerminalWindow title="root@servera:~" :rows="6">

```bash-session
root@servera:~# mkdir /var/log/journal
root@servera:~# journalctl --flush
root@servera:~# ls -d /var/log/journal
/var/log/journal
```

</TerminalWindow>

Storage moves from `/run/log/journal/` to `/var/log/journal/`, and past boots are kept

---

# Reading an Earlier Boot

Only possible once the journal is persistent

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session {*}{lines:false}
student@servera:~$ journalctl --list-boots
IDX BOOT ID                          FIRST ENTRY                 LAST ENTRY
  0 6436f91ff7104b3a8240049c3aa75f5d Fri 2026-09-04 11:34:19 UTC Sun 2026-09-06 16:44:33 UTC
```

</TerminalWindow>

A volatile journal only ever lists boot `0`, which is the one you are in

`journalctl -b -1` reads the boot before this one, which is where you look after a crash

---
layout: exercise
---

# Reading the Journal

::goal::

Find entries by unit and by time, then make the journal survive a reboot

::environment::

**Host:** `servera`

::workflow::

1. Read the journal for one service
2. Narrow the same question to a time window
3. Confirm only one boot is listed, and work out why
4. Make the journal persistent and flush it to disk
5. Reboot, then read the boot before the reboot
