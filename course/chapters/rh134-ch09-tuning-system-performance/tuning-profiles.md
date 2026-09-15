---
layout: section
routeAlias: tuning-profiles
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "09"
        title: Tuning System Performance
    rhcsaCertGuide:
      - chapter: "10"
        title: Managing Processes
  exercises:
    - title: Activating a Tuning Profile Exercise
      source: ./exercises/activating-a-tuning-profile-exercise.html
---

# Tuning System Performance

## Telling the kernel what this machine is for

---
vertical: center
---

# What Does Better Performance Mean?

It depends entirely on the job

- A game wants <AccentText>low latency</AccentText>, so input feels immediate
- A web server wants <AccentText>throughput</AccentText>, so it serves more requests
- A laptop wants <AccentText>power savings</AccentText>, so the battery lasts

You cannot maximize all three, so tuning is choosing which one to favor

---

# Tuned Picks the Settings For You

`tuned` runs in the background and applies a profile of kernel settings

| Profile | Tuned for |
| --- | --- |
| `balanced` | A compromise between power saving and performance |
| `throughput-performance` | Maximum throughput |
| `network-latency` | Deterministic low-latency networking |
| `powersave` | Lowest power consumption |
| `virtual-guest` | Running as a virtual machine |

`virtual-guest` is what the lab machines use, because they are VMs

---
layout: two-cols-header
vertical: center
---

# Working With Profiles

::left::

## Components

Service: `tuned.service`

Command: `tuned-adm`

Profiles: `/usr/lib/tuned/profiles/`

Log: `/var/log/tuned/tuned.log`

::right::

## Commands

<TerminalWindow title="student@servera:~" :rows="6">

```bash-session
student@servera:~$ tuned-adm active
Current active profile: virtual-guest
student@servera:~$ tuned-adm list
student@servera:~$ sudo tuned-adm profile network-latency
student@servera:~$ tuned-adm verify
```

</TerminalWindow>

---
layout: exercise
---

# Activating a Tuning Profile

::goal::

Switch `servera` to the network-latency profile and confirm it took effect

::environment::

**Host:** `servera`

::workflow::

1. Install `tuned` and start its service
2. Find out which profile is active now
3. Read what the `network-latency` profile actually changes
4. Activate it
5. Verify it took effect
6. Put the original profile back

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/activating-a-tuning-profile-exercise.cast?url";
</script>

# Activating a Tuning Profile

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing tuned and enabling it at boot, finding virtual-guest active because the lab machines are virtual, reading what the network-latency profile includes and adds on top, activating it, verifying it once and again after a reboot to show the profile comes back on its own, then restoring virtual-guest and removing the package."
/>

::resources::

<a href="../resources/activating-a-tuning-profile-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Activating a Tuning Profile exercise in a new tab">Written exercise</a>
