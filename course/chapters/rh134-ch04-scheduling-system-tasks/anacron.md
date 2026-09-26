---
layout: section
routeAlias: anacron
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
    - title: Backing Up a Laptop with Anacron Exercise
      source: ./exercises/backing-up-a-laptop-with-anacron-exercise.html
---

# Anacron

## The cron for desktops and laptops

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
vertical: center
---

# Where Anacron Keeps the Date

`/etc/anacrontab` lists each group: how many days between runs, how long to wait before starting, a name for the group, and the command

```bash [/etc/anacrontab]
#period in days   delay in minutes   job-identifier   command
1	5	cron.daily		nice run-parts /etc/cron.daily
7	25	cron.weekly		nice run-parts /etc/cron.weekly
@monthly 45	cron.monthly		nice run-parts /etc/cron.monthly
```

`run-parts` runs every executable in the directory, which is why your script needs `chmod a+x`

The <AccentText>job-identifier</AccentText> is also a file under `/var/spool/anacron/`, holding the date that group last ran

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# cat /var/spool/anacron/cron.daily
20260915
```

</TerminalWindow>

---
vertical: center
---

# Running It On Demand

Cron starts anacron every hour from `/etc/cron.hourly/0anacron`, and anacron then waits out the delay before running anything

Test it with <AccentText code>anacron -n</AccentText>, which runs whatever is due right now and ignores those delays

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# anacron -n
root@workstation:~#
```

</TerminalWindow>

No output, and no job, because today's date is already in `/var/spool/anacron/cron.daily`

---

# Anacron Tradeoffs

<Callout type="warning" title="You give up three things">

You do not choose the hour. The job runs as `root`. On a laptop it is skipped while running on battery.

</Callout>

Anacron tracks each directory by date, so it knows when a daily job is overdue

Nothing runs while the job is up to date, however often the machine wakes up

---
layout: exercise
---

# Backing Up a Laptop with Anacron

::goal::

Give a daily backup to anacron on a machine that is asleep at night, then watch it catch up

::environment::

**Host:** `workstation`, standing in for a laptop

::workflow::

1. Write a daily backup script in `/etc/cron.daily/` and make it executable
2. Read the date anacron recorded for the daily jobs
3. Ask anacron to run what is due, and see that nothing is
4. Backdate that record so the daily jobs are months overdue
5. Ask again, then confirm the backup ran and the recorded date caught up

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/backing-up-a-laptop-with-anacron-exercise.cast?url";
</script>

# Backing Up a Laptop with Anacron

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor writing a daily /etc backup script on workstation, checking the anacron date, backdating it to make the job overdue, and confirming the backup ran."
/>

::resources::

<a href="../resources/backing-up-a-laptop-with-anacron-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Backing Up a Laptop with Anacron exercise in a new tab">Written exercise</a>
