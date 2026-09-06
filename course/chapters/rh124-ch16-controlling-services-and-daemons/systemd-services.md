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
    - title: A Service That Checks Before It Runs Exercise
      source: ./exercises/checking-before-running-exercise.html
---

# Systemd Services

## The first process, and everything it starts

---
vertical: center
---

# What Systemd Does

Systemd is <AccentText>PID 1</AccentText>, the first process the kernel starts

- Starts services, and keeps starting them at boot
- Starts independent services <SuccessText>in parallel</SuccessText>, so boot is faster
- Understands dependencies, so a service that needs the network waits for it

<Callout>

A **daemon** is a process running in the background. A **service** is what systemd calls the unit that manages it.

</Callout>

---
layout: two-cols-header
leftWidth: 45
vertical: center
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

<TerminalWindow title="root@servera:~" :rows="4">

```bash-session
root@servera:~# ls /usr/lib/systemd/system/crond.service
root@servera:~# ls /etc/systemd/system/
```

</TerminalWindow>

`/usr/lib/systemd/system/` belongs to the package, and an update <DangerText>overwrites it</DangerText>

`/etc/systemd/system/` is yours, and it <SuccessText>wins</SuccessText> when both define the same unit

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
vertical: center
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

<TerminalWindow title="student@servera:~" :rows="9">

```bash-session {*}{lines:false}
student@servera:~$ systemctl status crond.service
● crond.service - Command Scheduler
     Loaded: loaded (/usr/lib/systemd/system/crond.service; enabled; preset: enabled)
     Active: active (running) since Tue 2026-03-24 12:02:34 UTC; 5 months 13 days ago
   Main PID: 853 (crond)
     CGroup: /system.slice/crond.service
             └─853 /usr/sbin/crond -n
Sep 06 13:01:01 servera.lab.example.com anacron[12866]: Anacron started on 2026-09-06
```

</TerminalWindow>

`Loaded` names the unit file and whether it starts at boot, `Active` says what it is doing right now

---
layout: two-cols-header
vertical: center
---

# Two Questions, Two Answers

These are <DangerText>separate</DangerText> questions, and mixing them up causes most systemd confusion

::left::

## Is it running *now*?

<TerminalWindow title="student@servera:~" :rows="3">

```bash-session
student@servera:~$ systemctl is-active crond
active
```

</TerminalWindow>

`active` or `inactive`, changed by `start` and `stop`

::right::

## Will it start at *boot*?

<TerminalWindow title="student@servera:~" :rows="3">

```bash-session
student@servera:~$ systemctl is-enabled crond
enabled
```

</TerminalWindow>

`enabled` or `disabled`, changed by `enable` and `disable`

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

`reload` re-reads the config and keeps the same process, `restart` stops and starts a <AccentText>new</AccentText> one

---

# Enable Is Not Start

`start` affects now, `enable` affects the next boot, and `enable --now` does both

<TerminalWindow title="root@servera:~" :rows="4">

```bash-session {*}{lines:false}
root@servera:~# systemctl enable crond.service
Created symlink '/etc/systemd/system/multi-user.target.wants/crond.service' → '/usr/lib/systemd/system/crond.service'.
```

</TerminalWindow>

Enabling is just a symlink into the target's `wants` directory, which is how `WantedBy=` gets honored

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

A <AccentText>disabled</AccentText> unit will not start itself, but you still can. A <DangerText>masked</DangerText> unit will not start at all.

---
layout: exercise
---

# A Service That Checks Before It Runs

::goal::

Write a service unit that copies files to another host, and refuses to run when that host is unreachable

::environment::

**Hosts:** `servera` and `workstation`

::workflow::

1. Write a script that syncs `/etc` to `workstation` and run it by hand
2. Write a `.service` unit that runs the script
3. Reload systemd, start the unit, and read its status and journal
4. Try to enable it, and work out why systemd refuses
5. Point the check at an unreachable address and watch the run be skipped
