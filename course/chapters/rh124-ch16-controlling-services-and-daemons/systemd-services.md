---
layout: section
routeAlias: systemd-services
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "16"
        title: Controlling Services and Daemons
    rhcsaCertGuide:
      - chapter: "11"
        title: Working with Systemd
  exercises:
    - title: A Robust Sync Service Exercise
      source: ./exercises/robust-sync-service-exercise.html
---

# Systemd Services

## The first process, and everything it starts

---
vertical: center
listSpacing: padded
---

# What Systemd Does

Systemd is <AccentText>PID 1</AccentText>, the first process the kernel starts

- Starts services
- Understands dependencies, so a service that needs the network waits for it
- Starts independent services <SuccessText>in parallel</SuccessText>, so boot is faster

<Callout>

A **daemon** is a process running in the background. A **service** is what systemd calls the unit that manages it.

</Callout>

---
layout: two-cols-header
leftWidth: 40
listSpacing: padded
---

# Everything Is a Unit

A unit is anything systemd knows how to manage

::left::

<TerminalWindow title="student@servera:~" :rows="8">

```bash-session {*}{lines:false}
student@servera:~$ systemctl -t help
Available unit types:
service
mount
socket
target
timer
path
```

</TerminalWindow>

::right::

- `.service` starts a process
- `.mount` mounts a file system
- `.socket` listens, then starts a service on demand
- `.target` groups other units
- `.timer` starts a unit on a schedule

---

# Where Units Live

<TerminalWindow title="root@servera:~" :rows="2">

```bash-session
root@servera:~# ls /usr/lib/systemd/system/crond.service
root@servera:~# ls /etc/systemd/system/
```

</TerminalWindow>

`/usr/lib/systemd/system/` belongs to the package, and an update <DangerText>overwrites it</DangerText>

`/etc/systemd/system/` is yours, and it <SuccessText>takes precedence</SuccessText>

<Callout type="warning">

Systemd does not notice edits on its own. Run `systemctl daemon-reload` after changing any unit file.

</Callout>

---

# Inside a Service Unit

<TerminalWindow title="student@servera:~" :rows="12">

```bash-session {*}{lines:false}
student@servera:~$ systemctl cat crond.service
# /usr/lib/systemd/system/crond.service
[Unit]
Description=Command Scheduler
After=auditd.service nss-user-lookup.target systemd-user-sessions.service

[Service]
ExecStart=/usr/sbin/crond -n $CRONDARGS
ExecReload=/bin/kill -URG $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

</TerminalWindow>

`[Unit]` says what and when, `[Service]` says how to run it, `[Install]` says where it belongs at boot

---
---

# A Target Is a Group of Units

A target is a named set of units the system brings up together

`multi-user.target` is the normal running state of a server

`WantedBy=multi-user.target` means <AccentText>start me when the system reaches that state</AccentText>

<Callout>

That is all you need for now. A later week digs into targets, boot order, and switching between them.

</Callout>

---

# Reading `systemctl status`

<TextExplainer
  :lines="[
    'student@servera:~$ systemctl status crond.service',
    '● crond.service - Command Scheduler',
    '     Loaded: loaded (/usr/lib/systemd/system/crond.service; enabled; preset: enabled)',
    '     Active: active (running) since Tue 2026-03-24 12:02:34 UTC; 5 months 13 days ago',
    '   Main PID: 853 (crond)',
    '     CGroup: /system.slice/crond.service',
    '             └─853 /usr/sbin/crond -n',
    'Sep 06 13:01:01 servera.lab.example.com anacron[12866]: Anacron started on 2026-09-06',
  ]"
  :steps="[
    { line: 3, text: '/usr/lib/systemd/system/crond.service', explanation: 'Which unit file, and that the package supplied it' },
    { line: 3, text: 'enabled', occurrence: 1, explanation: 'It will start at boot' },
    { line: 4, text: 'active (running)', explanation: 'It is running right now' },
    { line: 5, text: '853', explanation: 'The main process, matching the tree below' },
    { line: 8, explanation: 'The newest journal entries, without running a second command' },
  ]"
/>

---
layout: two-cols-header
vertical: center
---

# Running and Enabled?

::left::

## Is it running *now*?

<TerminalWindow title="student@servera:~" :rows="2">

```bash-session
student@servera:~$ systemctl is-active crond
active
```

</TerminalWindow>

`active` - Currently running

`inactive` - **Not** currently running

::right::

## Will it start at *boot*?

<TerminalWindow title="student@servera:~" :rows="2">

```bash-session
student@servera:~$ systemctl is-enabled crond
enabled
```

</TerminalWindow>

`enabled` - Started at boot

`disabled` - **Not** started at boot

---

# Start, Stop, Restart, Reload

<TerminalWindow title="root@servera:~" :rows="9">

```bash-session {*}{lines:false}
root@servera:~# systemctl show -p MainPID --value crond.service
853
root@servera:~# systemctl reload crond.service
root@servera:~# systemctl show -p MainPID --value crond.service
853
root@servera:~# systemctl restart crond.service
root@servera:~# systemctl show -p MainPID --value crond.service
13749
```

</TerminalWindow>

`reload` re-reads the config and keeps the same process

`restart` stops and starts a <AccentText>new</AccentText> one

---

# Start Now and at Boot

`systemctl enable {SERVICE} --now` is equivalent to

`systemctl start {SERVICE} && systemctl enable {SERVICE}`

<TerminalWindow title="root@servera:~" :rows="2">

```bash-session {*}{lines:false}
root@servera:~# systemctl enable crond.service
Created symlink '/etc/systemd/system/multi-user.target.wants/crond.service' → '/usr/lib/systemd/system/crond.service'.
```

</TerminalWindow>

Enabling creates a symlink into the target's `wants` directory specified in `WantedBy=`

---

# Masked Cannot Start

Masking points a unit at `/dev/null` so nobody can start it, on purpose or by accident

<TerminalWindow title="root@servera:~" :rows="6">

```bash-session {*}{lines:false}
root@servera:~# systemctl mask httpd.service
Created symlink '/etc/systemd/system/httpd.service' → '/dev/null'.
root@servera:~# systemctl start httpd.service
Failed to start httpd.service: Unit httpd.service is masked.
root@servera:~# systemctl unmask httpd.service
Removed '/etc/systemd/system/httpd.service'.
```

</TerminalWindow>

A <AccentText>disabled</AccentText> unit can be started manually

A <DangerText>masked</DangerText> unit will not start at all.

---
---

# Running Something First

`ExecStartPre` runs first, and if it fails then `ExecStart` never runs and the unit is marked <DangerText>failed</DangerText>

```ini [man-db-restart-cache-update.service]
ExecStartPre=/usr/bin/rm -rf /var/cache/man/*
ExecStart=/usr/bin/systemd-run /usr/bin/systemctl start man-db-cache-update.service
```

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session {*}{lines:false}
student@servera:~$ man systemd.directives
       ExecStart=
           systemd.service(5)
       ExecStartPre=
           systemd.service(5), systemd.socket(5)
       ExecStartPost=
           systemd.service(5), systemd.socket(5)
       ExecStop=
           systemd.service(5)
       ExecStopPost=
           systemd.service(5), systemd.socket(5)
```

</TerminalWindow>

Hundreds more, each naming the page that documents it

---
layout: exercise
---

# A Robust Sync Service

::goal::

Synchronize a directory when the remote host is reachable, or fail visibly when it is not

::environment::

**Hosts:** `servera` and `workstation`

::workflow::

1. Write a script that syncs `/etc` to `workstation` and run it by hand
2. Write a `.service` unit that runs the script
3. Reload systemd, start the unit, and read its status and journal
4. Point the check at an unreachable address and watch the unit fail
5. Find it with `systemctl --failed`, then restore the check

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/robust-sync-service-exercise.cast?url";
</script>

# A Robust Sync Service

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor writing a sync script, wrapping it in a systemd service unit with a connectivity check before it runs, starting the unit and reading its journal, breaking the check to watch systemd record the failure, and then restoring it."
/>

::resources::

<a href="../resources/robust-sync-service-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written A Robust Sync Service exercise in a new tab">Written exercise</a>
