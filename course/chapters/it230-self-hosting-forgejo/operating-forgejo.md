---
layout: section
routeAlias: operating-forgejo
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "19"
        title: Comprehensive Review
  exercises:
    - title: Operate Forgejo Exercise
      source: ./exercises/operate-forgejo-exercise.html
---

# Operating Forgejo

## Keeping the application running and its data safe

---
horizontal: center
vertical: center
---

# Running an App in Production

<IconGrid>
<IconGridItem icon="data-backup">

**Backups** of all the data

</IconGridItem>
<IconGridItem icon="send-alt">

**Copies** kept off the host

</IconGridItem>
<IconGridItem icon="time">

**Scheduling** every night

</IconGridItem>
<IconGridItem icon="meter">

**Priority** below the users

</IconGridItem>
<IconGridItem icon="catalog">

**Logs** kept, rotated, and read

</IconGridItem>
</IconGrid>

---
layout: two-cols-header
vertical: center
horizontal: center
listSpacing: padded
---

# What to Back Up

::left::

<IconGrid>
<IconGridItem icon="data-base">

**The database**, with `pg_dump`

</IconGridItem>
</IconGrid>

- A consistent copy while PostgreSQL runs
- Plain SQL, compressed with `gzip`

::right::

<IconGrid>
<IconGridItem icon="folder">

**The files**, with `tar`

</IconGridItem>
</IconGrid>

- Repositories, uploads, and `app.ini`
- Not the search index, which Forgejo rebuilds

::bottom::

Both go in one dated directory per run, so every run is a complete backup

---

# The Backup Script

<TextExplainer
  size="sm"
  :lines="[
    '#!/bin/bash',
    'backup_dir=&quot;/var/backups/forgejo&quot;',
    'run_dir=&quot;${backup_dir}/forgejo_$(date --iso-8601=minutes)&quot;',
    'mkdir -p &quot;${run_dir}&quot;',
    'su - postgres -c &quot;pg_dump forgejo&quot; | gzip > &quot;${run_dir}/database.sql.gz&quot;',
    'tar -C /srv -czf &quot;${run_dir}/files.tar.gz&quot; --exclude=forgejo/indexers forgejo',
    'for old_run in $(ls -dt ${backup_dir}/forgejo_* | tail -n +8); do',
    '    rm -r &quot;${old_run}&quot;',
    'done',
    'rsync -av --delete &quot;${backup_dir}/&quot; servera:forgejo-backups/',
    'echo &quot;$(date) wrote ${run_dir}&quot;',
  ]"
  :steps="[
    { line: 3, text: 'forgejo_$(date --iso-8601=minutes)', explanation: 'Each run gets a directory named for the minute it ran' },
    { line: 5, text: 'pg_dump forgejo', explanation: 'Dump the database as postgres, while it runs' },
    { line: 6, text: '-C /srv', explanation: 'Work from /srv, so the archive holds forgejo/' },
    { line: 6, text: '--exclude=forgejo/indexers', explanation: 'Leave out the search index' },
    { line: 7, text: 'ls -dt', explanation: 'Run directories, newest first' },
    { line: 7, text: 'tail -n +8', explanation: 'Every one after the seventh' },
    { line: 10, text: 'rsync -av --delete', explanation: 'Mirror to servera, pruned runs included' },
    { line: 11, explanation: 'One line in the log per run' },
  ]"
/>

---
layout: two-cols-header
vertical: start
horizontal: center
---

# Keeping the Seven Newest

::left::

The last eight lines

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ seq 10 | tail -n 8
3
4
5
6
7
8
9
10
```

</TerminalWindow>

::right::

From the eighth line on

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ seq 10 | tail -n +8
8
9
10
```

</TerminalWindow>

::bottom::

Runs are listed newest first, so `tail -n +8` deletes all but the newest seven

---

# Getting Backups Off the Host

`rsync -av --delete` mirrors the backups to `servera`, deletions included

<TerminalWindow title="root@serverb:~">

```bash-session
root@serverb:~# ssh servera ls -lR forgejo-backups
forgejo-backups:
total 0
drwxr-xr-x. 2 root root 49 Nov 21 18:41 forgejo_2026-11-21T18:41+00:00

forgejo-backups/forgejo_2026-11-21T18:41+00:00:
total 40
-rw-r--r--. 1 root root 27537 Nov 21 18:41 database.sql.gz
-rw-r--r--. 1 root root  8789 Nov 21 18:41 files.tar.gz
```

</TerminalWindow>

Here the data host pushes; many sites have the backup host pull, so the data host holds no key to its own backups

---

# Every Night, Quietly

A line in `/etc/cron.d` runs the script every night at 2:00, as `root`

```text [/etc/cron.d/forgejo_backup (last line)]
0 2 * * * root nice -n 10 /usr/local/bin/forgejo_backup.sh >> /var/log/forgejo_backup.log 2>&1
```

`nice -n 10` lowers its priority, and `2>&1` sends its errors to the same log

```text [/etc/logrotate.d/forgejo_backup]
/var/log/forgejo_backup.log {
    weekly
    rotate 4
    compress
    missingok
}
```

---

# Reading the Access Log

httpd writes one line per request to `/var/log/httpd/access_log`

<TextExplainer
  size="sm"
  :lines="['::1 - - [21/Nov/2026:18:03:53 +0000] &quot;GET / HTTP/1.1&quot; 503 299 &quot;-&quot; &quot;curl/8.9.1&quot;']"
  :steps="[
    { text: '::1', explanation: 'The client: servera itself' },
    { text: '[21/Nov/2026:18:03:53 +0000]', explanation: 'When' },
    { text: '&quot;GET / HTTP/1.1&quot;', explanation: 'The request, in quotes' },
    { text: '503', explanation: 'The status: 5xx is a server error' },
    { text: '299', explanation: 'Bytes sent' },
  ]"
/>

`grep -E '" 5[0-9]{2} '` finds every 5xx, and `-o` with `sort | uniq -c` counts each status

---
vertical: center
---

# Security, Tier by Tier

| Tier             | Listens on                                     | Who gets in                           |
|------------------|------------------------------------------------|---------------------------------------|
| Web: httpd       | Port 80 on `servera`                           | Anyone, through the firewall's `http` |
| App: Forgejo     | Ports 3000 and 2222, closed by the firewall    | httpd, on `servera` itself            |
| Data: PostgreSQL | Port 5432 on `serverb`                         | `forgejo`, from `servera` only        |
| Data: NFS        | Port 2049 on `serverb`, sharing `/srv/forgejo` | `servera` only                        |

SELinux enforces on both servers, and Forgejo runs rootless as its own user

---
vertical: center
---

# This Week's Operations

| Consideration | In Operate Forgejo                                    | Weeks        |
|---------------|-------------------------------------------------------|--------------|
| Backups       | A script with `pg_dump` and `tar`, keeping seven runs | 3, 6, and 15 |
| Copies        | `rsync` to `servera`, over `root`'s key               | 2 and 4      |
| Scheduling    | A line in `/etc/cron.d`                               | 4            |
| Priority      | `nice -n 10`                                          | 5            |
| Logs          | The backup's own log, rotated by `logrotate`          | 5 and 15     |
| Logs          | httpd's access log, searched with `grep`              | 2 and 5      |

---
layout: exercise
---

# Operate Forgejo

::goal::

Back up Forgejo every night, and read the web tier's log

::environment::

**Hosts:** `serverb` and `servera`

**Prerequisite exercise:** Build the Web Tier

::workflow::

1. Install `rsync` on `serverb` and `servera`
2. Write a script that backs up the database and files, keeps the seven newest, and copies them to `servera`
3. Run it by hand under `nice`, and check the copy on `servera`
4. Schedule it nightly in `/etc/cron.d`
5. Rotate the backup's log with `logrotate`
6. Search `servera`'s access log for errors

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/operate-forgejo-exercise.cast?url";
</script>

# Operate Forgejo

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing rsync on serverb and servera; writing /usr/local/bin/forgejo_backup.sh, which dumps the database and archives Forgejo's files into a dated directory, keeps the seven newest, and copies them to servera with rsync; running it under nice and listing the copy on servera; adding a nightly line to /etc/cron.d; rotating its log with logrotate; and searching servera's access log for server errors and counting each status code."
/>

::resources::

<a href="../resources/operate-forgejo-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Operate Forgejo exercise in a new tab">Written exercise</a>
