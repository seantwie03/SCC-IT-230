---
layout: section
routeAlias: swap-space
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "10"
        title: Managing Basic Storage
    rhcsaCertGuide:
      - chapter: "14"
        title: Managing Storage
  exercises:
    - title: Create Persistent Prioritized Swap Space Exercise
      source: ./exercises/create-persistent-prioritized-swap-exercise.html
---

# Swap Space

---
horizontal: center
---

# Swap Space

Swap is a <AccentText>backup plan</AccentText> for when RAM is full: the kernel moves idle memory pages to disk

<IconGrid
  :items="[
    { icon: 'dashboard', caption: 'Used when RAM is full' },
    { icon: 'checkmark-outline', caption: 'Keeps the system from crashing' },
    { icon: 'face-dissatisfied', caption: 'Much slower than RAM' },
  ]"
/>

Swap is <DangerText>not a substitute</DangerText> for enough RAM

---

# How Much Swap Do I Need?

It depends. Red Hat's recommendation:

| RAM                    | Swap space    | Swap space if allowing for hibernation |
|------------------------|---------------|----------------------------------------|
| 2 GB or less           | Twice the RAM | Three times the RAM                    |
| Between 2 GB and 8 GB  | Same as RAM   | Twice the RAM                          |
| Between 8 GB and 64 GB | At least 4 GB | 1.5 times the RAM                      |
| More than 64 GB        | At least 4 GB | Hibernation is not recommended         |

Hibernation saves the contents of RAM to swap before powering off

---
vertical: start
---

# Swap Space Components

<v-switch at="1">

<template #0>

### 1. Partition type `linux-swap`

Marks the partition's purpose when you create it in `parted`

### 2. `mkswap`

Writes the swap signature to the partition

</template>

<template #1>

### 3. `swapon`

Activates swap space now, until the next reboot

### 4. `/etc/fstab`

Activates swap space at every boot

</template>

<template #2>

### 5. `free -h` and `swapon --show`

`free -h` shows memory and swap use; `swapon --show` lists each swap space and its priority

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# free -h
               total        used        free      shared  buff/cache   available
Mem:           1.7Gi       352Mi       1.2Gi        14Mi       249Mi       1.3Gi
Swap:          1.0Gi          0B       1.0Gi
root@servera:~# swapon --show
NAME      TYPE       SIZE USED PRIO
/dev/dm-1 partition 1024M   0B   -2
```

</TerminalWindow>

</template>

</v-switch>

---
vertical: start
---

# Swap Space Workflow

<v-switch at="1">

<template #0>

Steps 1 and 2: create a `linux-swap` partition, then format it as swap

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# parted /dev/sdb mkpart swap1 linux-swap 2GiB 3GiB
Information: You may need to update /etc/fstab.

root@servera:~# udevadm settle
root@servera:~# mkswap /dev/sdb3
Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)
no label, UUID=114d5f7e-dfeb-47c1-be7a-7de8a283134b
```

</TerminalWindow>

</template>

<template #1>

Step 3: activate it now; `swapoff` turns it off again

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# swapon /dev/sdb3
root@servera:~# swapon --show
NAME      TYPE       SIZE USED PRIO
/dev/dm-1 partition 1024M   0B   -2
/dev/sdb3 partition 1024M   0B   -3
root@servera:~# swapoff /dev/sdb3
```

</TerminalWindow>

Step 4: add it to `/etc/fstab`

```text [/etc/fstab]
UUID=114d5f7e-dfeb-47c1-be7a-7de8a283134b swap swap pri=5 0 0
```

Step 5: Run `systemctl daemon-reload` and `swapon -a`

</template>

</v-switch>

---

# Swap Priority

Several swap spaces can have different <AccentText>priorities</AccentText>, and the higher priority is used first

Set it with `pri=` in the options field

```text [/etc/fstab]
UUID=114d5f7e-dfeb-47c1-be7a-7de8a283134b swap swap pri=5 0 0
```

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# swapon --show
NAME      TYPE       SIZE USED PRIO
/dev/dm-1 partition 1024M   0B   -2
/dev/sdb3 partition 1024M   0B    5
```

</TerminalWindow>

---
layout: exercise
---

# Create Persistent Prioritized Swap Space

::goal::

Add a swap partition that is used before the system's own

::environment::

**Host:** `servera`

**Prerequisite exercise:** Create Two GPT Partitions

::workflow::

1. Create a partition on `/dev/sdb` suitable for swap
2. Format `/dev/sdb3` as swap space
3. Activate the swap space temporarily
4. Deactivate it
5. Persistently activate it with priority 5
6. Verify the persistent swap
7. Reboot to verify

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/create-persistent-prioritized-swap-exercise.cast?url";
</script>

# Create Persistent Prioritized Swap Space

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating a 1 GiB linux-swap partition on /dev/sdb with parted, formatting it with mkswap, activating it with swapon and comparing priorities with swapon --show, deactivating it, appending its UUID to /etc/fstab and completing a swap line with pri=5 in vim, activating it with swapon -a, rebooting to confirm it returns at priority 5, then removing the swap and /records lines, the partitions, and the mount points."
/>

::resources::

<a href="../resources/create-persistent-prioritized-swap-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Create Persistent Prioritized Swap Space exercise in a new tab">Written exercise</a>
