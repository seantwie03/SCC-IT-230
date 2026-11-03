---
layout: section
routeAlias: systemd-targets
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "12"
        title: Controlling and Troubleshooting the Boot Process
    rhcsaCertGuide:
      - chapter: "17"
        title: Managing and Understanding the Boot Procedure
      - chapter: "18"
        title: Essential Troubleshooting Skills
  exercises:
    - title: Switch systemd Targets Exercise
      source: ./exercises/switch-systemd-targets-exercise.html
---

# systemd Targets

---
vertical: center
---

# What Is a systemd Target?

A **target** is a named group of units the system starts to reach a state

<IconGrid
  :items="[
    { icon: 'application', caption: 'Decides which services start at boot' },
    { icon: 'tree-view', caption: 'Can contain other targets' },
    { icon: 'terminal', caption: 'Servers boot to text logins only' },
    { icon: 'tools', caption: 'Rescue and emergency targets for repairs' },
    { icon: 'renew', caption: 'Switch targets without a reboot' },
    { icon: 'star', caption: 'One target is the boot default' },
  ]"
/>

---

# Common Boot Targets

| Target              | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `graphical.target`  | Multi-user, with a graphical login                        |
| `multi-user.target` | Multi-user, text logins only                              |
| `rescue.target`     | Single-user repair shell; local file systems read/write   |
| `emergency.target`  | Minimal repair shell; root file system read-only          |

Both repair shells ask for the `root` password

Targets nest: `graphical.target` includes `multi-user.target`, which includes `basic.target`

---

# Target Dependencies

`systemctl list-dependencies` shows the units a target pulls in

<TerminalWindow title="root@servera:~">

```bash-session {3,5}
root@servera:~# systemctl list-dependencies graphical.target
graphical.target
○ ├─display-manager.service
○ ├─systemd-update-utmp-runlevel.service
● └─multi-user.target
○   ├─audit-rules.service
●   ├─auditd.service
...output omitted...
●   ├─basic.target
...output omitted...
```

</TerminalWindow>

`graphical.target` adds a display manager on top of everything `multi-user.target` starts

<Callout>

● marks an active unit and ○ an inactive one; `servera` has no display manager

</Callout>

---
layout: two-cols-header
---

# View Default Boot Target

`systemctl get-default` shows the target the system boots into

::left::

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# systemctl get-default
multi-user.target
```

</TerminalWindow>

A server: text logins only

::right::

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# systemctl get-default
graphical.target
```

</TerminalWindow>

A desktop: a graphical login

---

# Change Default Boot Target

`systemctl set-default` changes the default by replacing a symlink

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# systemctl set-default graphical.target
Removed '/etc/systemd/system/default.target'.
Created symlink '/etc/systemd/system/default.target' → '/usr/lib/systemd/system/graphical.target'.
```

</TerminalWindow>

The running system keeps its current target until the next boot

---

# Switch Targets at Runtime

`systemctl isolate` switches the running system to another target, with no reboot

```bash
systemctl isolate multi-user.target
```

- Stops every unit the new target does not need
- Starts the units it needs that are not running
- Lasts until the next boot; the default does not change

<Callout>

Only targets with `AllowIsolate=yes` in their unit file can be isolated

</Callout>

---

# Boot to a Specific Target

<v-switch at="1">

<template #0>

`systemd.unit=` on the kernel command line picks the target for one boot

**Step 1:** Open the GRUB2 editor

1. Reboot and stop the countdown
2. Press `e` to edit the default entry
3. Move to the line that starts with `linux`

</template>

<template #1>

`systemd.unit=` on the kernel command line picks the target for one boot

**Step 2:** Append the target

Press `End`, then type a space and the argument

```text
systemd.unit=rescue.target
```

Press `Ctrl`+`X` to boot

</template>

<template #2>

Which repair shell?

|                  | `rescue.target`                       | `emergency.target`                       |
| ---------------- | ------------------------------------- | ---------------------------------------- |
| **File systems** | Local file systems, read/write        | Root only, read-only                     |
| **Services**     | Logging and devices; no network       | Almost none                              |
| **Use when**     | A service breaks the normal boot      | `rescue.target` fails, as with a bad `/etc/fstab` line |

Type `exit` or press `Ctrl`+`D` to leave the shell and continue the normal boot

</template>

</v-switch>

---
vertical: center
---

# systemd Target Commands

| Command                                  | Action                            |
| ---------------------------------------- | --------------------------------- |
| `systemctl list-dependencies TARGET`     | Show the units a target pulls in  |
| `systemctl list-units --type target`     | Show the active targets           |
| `systemctl get-default`                  | Show the default target           |
| `systemctl set-default TARGET`           | Change the default target         |
| `systemctl isolate TARGET`               | Switch to a target now            |

At the GRUB2 menu, `systemd.unit=TARGET` picks the target for one boot

---
layout: exercise
---

# Switch systemd Targets

::goal::

Switch `workstation` between targets now, by default, and for a single boot

::environment::

**Host:** `workstation`, with its VM console open

::workflow::

1. Make the GRUB2 menu appear on every boot
2. Inspect the default target and its dependencies
3. Switch to `multi-user.target` without rebooting
4. Make `multi-user.target` the default and reboot to confirm
5. Restore `graphical.target` as the default
6. Boot once into `rescue.target` from the GRUB2 menu
7. Confirm the root file system is read/write, then continue the boot

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/switch-systemd-targets-exercise.cast?url";
</script>

# Switch systemd Targets

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor unsetting menu_auto_hide on workstation, checking the default target with systemctl get-default and its dependencies with systemctl list-dependencies, switching to multi-user.target with systemctl isolate and checking both targets with systemctl is-active, making multi-user.target the default with systemctl set-default and rebooting to confirm, restoring graphical.target as the default, then rebooting with workstation's console on screen, appending systemd.unit=rescue.target to the linux line at the GRUB2 menu, logging in to the rescue shell as root, confirming with mount that the root file system is read/write, continuing the boot with exit, checking that graphical.target is active, and hiding the menu again with grub2-editenv."
/>

::resources::

<a href="../resources/switch-systemd-targets-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Switch systemd Targets exercise in a new tab">Written exercise</a>
