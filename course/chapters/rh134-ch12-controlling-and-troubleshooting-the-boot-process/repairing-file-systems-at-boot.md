---
layout: section
routeAlias: repairing-file-systems-at-boot
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "12"
        title: Controlling and Troubleshooting the Boot Process
    rhcsaCertGuide:
      - chapter: "18"
        title: Essential Troubleshooting Skills
  exercises:
    - title: Repair a File System at Boot Exercise
      source: ./exercises/repair-file-system-at-boot-exercise.html
---

# Repairing File Systems at Boot

---

# When the Boot Process Fails

A bad `/etc/fstab` entry can <AccentText>halt the boot</AccentText>

| Problem                            | What happens at boot                              |
| ---------------------------------- | ------------------------------------------------- |
| Device or UUID that does not exist | systemd waits 90 seconds for it, then gives up    |
| Damaged file system                | The mount may fail; `fsck` at boot repairs ext4, not XFS |

Then systemd opens an **emergency shell** and asks for the `root` password

<Callout>

A missing mount point does not stop the boot: systemd creates the directory

</Callout>

---

# What a Failed Boot Looks Like

<v-switch at="1">

<template #0>

systemd waits 90 seconds for the device with the mistyped UUID

![The servera console during boot. The last line reads: Job dev-disk-by\x2duuid-b688d484\x2d3d0c\x2d485a\x2d840c\x2d5653127e2837zzz.device/start running (27s / 1min 30s), with the zzz at the end of the UUID highlighted](./assets/boot-stalled-incorrect-uuid.placeholder.png)

</template>

<template #1>

Then it gives up and opens the emergency shell

![The servera console after the timeout. It reads: You are in emergency mode. After logging in, type "journalctl -xb" to view system logs, "systemctl reboot" to reboot, or "exit" to continue bootup. Give root password for maintenance (or press Control-D to continue):](./assets/emergency-mode.placeholder.png)

</template>

</v-switch>

---

# Remount Root Read/Write

Booted to `emergency.target` on purpose: `/` is mounted **read-only**

Dropped there by a failed mount: `/` is usually already **read/write**

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# mount | grep root
/dev/mapper/rhel_servera-root on / type xfs (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)
```

</TerminalWindow>

`ro` in the options means remount before editing `/etc/fstab`

```bash
mount -o remount,rw /
```

---

# Find the Failing Mount

`mount --all` mounts every `/etc/fstab` entry that is not already mounted

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# mount --all
mount: /boot: can't find UUID=5c381752-9fdd-458f-976f-240db85ec6a4zzz.
```

</TerminalWindow>

Each error names the mount point and the device it could not find

<Callout>

Fix the error, then run `mount --all` again: no output means every entry mounted

</Callout>

---

# Fix `/etc/fstab` and Reload

<v-switch at="1">

<template #0>

**Step 1:** Edit the bad entry

```bash
vim /etc/fstab
```

- Correct a typo in a UUID or device path; compare with `lsblk -fp`
- Create a missing mount point
- Comment out an entry for a device that no longer exists

</template>

<template #1>

**Step 2:** Reload systemd, then mount every entry

```bash
systemctl daemon-reload
mount --all
```

No errors? Reboot to confirm the system boots normally

```bash
systemctl reboot
```

</template>

</v-switch>

---
layout: two-cols-header
---

# Repairing a Corrupted File System

For damage inside a file system, not an `/etc/fstab` error, run its repair tool on the device

::left::

**XFS**

```bash
xfs_repair /dev/sdb1
```

`fsck.xfs` does nothing at boot

::right::

**ext4**

```bash
fsck.ext4 -p /dev/sdb2
```

`-p` repairs small problems without asking

::bottom::

<Callout type="warning">

Unmount the file system first; `xfs_repair` refuses a mounted one

</Callout>

---
layout: exercise
---

# Repair a File System at Boot

::goal::

Break the `/boot` entry in `/etc/fstab`, then repair it from the emergency shell

::environment::

**Host:** `servera`, with its VM console open

::workflow::

1. Break the UUID of the `/boot` entry in `/etc/fstab`
2. Reboot and log in to the emergency shell as `root`
3. Check that the root file system is read/write
4. Find the bad entry with `mount --all`
5. Correct the entry in `/etc/fstab`
6. Reload systemd and confirm `mount --all` succeeds
7. Reboot and confirm a normal boot
