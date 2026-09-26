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

```bash [/etc/crontab]
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

<TerminalWindow title="student@servera:~" :rows="4">

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

`/etc/cron.d` is a drop-in directory (like `~/.bashrc.d`)

`crond` reads every file in the directory as a crontab

Keep related jobs together in one named file

```bash [/etc/cron.d/web_server_maintenance]
0/15 * * * * apache /usr/bin/regenerate_static_web_content.sh # every 15 minutes starting a 0
0,30 * * * * apache /usr/bin/incremental_backup.sh # every 30 minutes
0 18 * * fri apache /usr/bin/full_backup.sh # Every Friday at 6p.m.
```

<Callout type="warning">

Put your jobs in `/etc/cron.d/` instead of `/etc/crontab`

An update to the `crontabs` package update overwrites `/etc/crontab`.

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
layout: exercise
---

# Backing Up `/etc` Nightly

::goal::

Back up `/etc` every night as `root`, from a system crontab rather than your own

::environment::

**Hosts:** `servera`, with `workstation` holding the offsite copy

::workflow::

1. Write a short backup script on `servera` and make it executable
2. Schedule it in `/etc/cron.d/` and test it every minute
3. Find out why nothing ran, then correct the entry
4. Confirm in `/var/log/cron` that `root` ran it, and check the copy on `workstation`
5. Set the real 10 p.m. schedule and read the entry back

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/backing-up-etc-nightly-exercise.cast?url";
</script>

# Backing Up `/etc` Nightly

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor writing a backup script on servera that copies /etc to a timestamped directory on workstation, scheduling it in /etc/cron.d, discovering that cron's PATH does not include /usr/local/bin, correcting the entry, and setting the 10 p.m. schedule."
/>

::resources::

<a href="../resources/backing-up-etc-nightly-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Backing Up /etc Nightly exercise in a new tab">Written exercise</a>
