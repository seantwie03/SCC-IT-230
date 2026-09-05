---
layout: section
routeAlias: system-cron-jobs
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
    - title: Backing Up /etc Nightly Exercise
      source: ./exercises/backing-up-etc-nightly-exercise.html
---

# Recurring System Jobs

## Do *this*, later, and on repeat, as a specified user

---

# System Crontabs

One field more than your own crontab: the <AccentText>user-name</AccentText> a job runs as

```bash [/etc/crontab] {14}
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
```

---
vertical: center
---

# Service Accounts

Applications run under their own accounts, not under yours

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session
student@servera:~$ grep chrony /etc/passwd
chrony:x:995:994:chrony system user:/var/lib/chrony:/sbin/nologin
student@servera:~$ sudo su - chrony
This account is currently not available.
```

</TerminalWindow>

A <AccentText>nologin</AccentText> shell refuses every interactive login, so `chrony` can never run `crontab -e` for itself

---

# Grouping Jobs in `/etc/cron.d`

`crond` reads every file in the directory as a crontab

Keep related jobs together in one named file

```bash [/etc/cron.d/web_server_maintenance]
0/15 * * * * apache /usr/bin/regenerate_static_web_content.sh # every 15 minutes starting a 0
0,30 * * * * apache /usr/bin/incremental_backup.sh # every 30 minutes
0 18 * * fri apache /usr/bin/full_backup.sh # Every Friday at 6p.m.
```

<Callout type="warning">

Put your jobs in `/etc/cron.d/`, never in `/etc/crontab`. A package update overwrites `/etc/crontab`.

</Callout>

---

# Did It Run?

```bash [/etc/cron.d/patch_checks]
0 6 * * *   root /usr/bin/check_updates.sh
0 7 * * mon root /usr/bin/report_pending_reboots.sh
```

<TerminalWindow title="student@servera:~" :rows="4">

```bash-session {*}{lines:false}
student@servera:~$ sudo grep check_updates /var/log/cron
Sep  5 16:19:01 servera CROND[12287]: (root) CMD (/usr/bin/check_updates.sh)
Sep  5 16:19:01 servera CROND[12286]: (root) CMDEND (/usr/bin/check_updates.sh)
```

</TerminalWindow>

The log says <AccentText>(root)</AccentText> instead of `(student)`, because the drop-in file named the user

---
layout: two-cols-header
vertical: center
---

# Same Job, Different Machine

A crontab entry only fires if the machine is awake at that moment

::left::

## Server

<SuccessText>Awake at 6 a.m.</SuccessText>

The update check runs on time

::right::

## Laptop

<DangerText>Asleep at 6 a.m.</DangerText>

The check never happens, and cron never looks back

---
vertical: center
---

# Anacron

Anacron asks *has this run lately?* instead of *is it 6 a.m. yet?*

Put `check_updates.sh` in one of these instead, as an executable script

- `/etc/cron.daily/`
- `/etc/cron.weekly/`
- `/etc/cron.monthly/`

If the machine was off when the job was due, anacron runs it once the machine is back

---

# What Anacron Costs You

<Callout type="warning" title="You give up three things">

You do not choose the hour. The job runs as `root`. On a laptop it is skipped while running on battery.

</Callout>

Anacron tracks each directory by date, so it knows when a daily job is overdue

Nothing runs while the job is up to date, however often the machine wakes up

---
layout: exercise
---

# Backing Up `/etc` Nightly

::goal::

Schedule the same backup two ways: on a server that is always on, and on a machine that is not

::environment::

**Hosts:** `servera`, then `workstation` standing in for a laptop

::workflow::

1. Write a short backup script on `servera` and make it executable
2. Schedule it in `/etc/cron.d/`, test it every minute, and set the real 10 p.m. time
3. Confirm in `/var/log/cron` that `root` ran it, and check the archive
4. Install the same script into `/etc/cron.daily/` on `workstation`
5. Convince anacron the machine was off for months, then let it catch up
6. Confirm the backup ran and clean up both hosts
