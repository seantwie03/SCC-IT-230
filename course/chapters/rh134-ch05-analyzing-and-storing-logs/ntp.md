---
layout: section
routeAlias: ntp
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "05"
        title: Analyzing and Storing Logs
    rhcsaCertGuide:
      - chapter: "25"
        title: Configuring Time Services
  exercises:
    - title: Using a New NTP Source Exercise
      source: ./exercises/using-a-new-ntp-source-exercise.html
---

# Network Time Protocol

## Keeping the clock honest without touching it

---
vertical: center
---

# Stratum Is Distance From a Real Clock

A <AccentText>stratum 1</AccentText> server is attached to an atomic clock or GPS receiver

Each hop away adds one, so stratum 2 asks stratum 1, and so on

Lower is better, and most public internet servers are stratum 1 or 2

<Callout>

Accurate time is not cosmetic. Log correlation, certificate validation, and Kerberos all break when clocks drift.

</Callout>

---

# Chrony Does the Asking

`chronyd` is the NTP client RHEL ships, configured in `/etc/chrony.conf`

```bash [/etc/chrony.conf]
pool 2.rhel.pool.ntp.org iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
```

A `pool` line names a set of servers, and `iburst` makes the first sync fast

`timedatectl set-ntp true` turns synchronization on if it is off

---

# Checking the Sources

<TerminalWindow title="student@servera:~" :rows="6">

```bash-session {*}{lines:false}
student@servera:~$ chronyc sources -v
^+ wdc1.us.ntp.li                4   9   377   268  +3137us[+3137us] +/-   29ms
^- ntp1.dfw.us.hojmark.net       2  10   377   322  -5606us[-5781us] +/-   42ms
^* time.cloudflare.com           3  10   377   320  -2769us[-2945us] +/-   19ms
```

</TerminalWindow>

`^*` is the source currently being used, `^+` is an acceptable alternative, and `^-` was excluded

The number after the name is that source's stratum

---
layout: exercise
---

# Using a New NTP Source

::goal::

Point `servera` at a specific time source and confirm it synchronizes

::environment::

**Host:** `servera`

::workflow::

1. Confirm `chronyd` is installed, enabled, and running
2. Read the current sources and note which one is selected
3. Replace the pool with `time.google.com`
4. Restart `chronyd` so it reads the change
5. Confirm the new source is selected
