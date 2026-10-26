---
layout: section
routeAlias: removing-lvm
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "11"
        title: Managing Storage with Logical Volume Manager
    rhcsaCertGuide:
      - chapter: "15"
        title: Managing Logical Volumes
  exercises:
    - title: Remove the LVM Setup Exercise
      source: ./exercises/remove-lvm-setup-exercise.html
---

# Removing LVM

---

# Unmount a Logical Volume

`umount` detaches the file system; LVM refuses to remove an <AccentText hue="slate">LV</AccentText> that is still mounted

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# umount /data
root@servera:~# vim /etc/fstab
root@servera:~# systemctl daemon-reload
```

</TerminalWindow>

Delete the <AccentText hue="slate">LV</AccentText>'s line in `vim`

```text [/etc/fstab]
/dev/vg01/lv01 /data xfs defaults 0 0
```

<Callout type="warning">

A leftover entry makes the next boot stop in <DangerText>emergency mode</DangerText>

</Callout>

---

# Remove a Logical Volume

`lvremove` removes an <AccentText hue="slate">LV</AccentText> and frees its extents in the <AccentText hue="teal">VG</AccentText>

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# umount /dev/vg01/lv01
root@servera:~# lvremove /dev/vg01/lv01
Do you really want to remove active logical volume vg01/lv01? [y/n]: y
  Logical volume "lv01" successfully removed.
```

</TerminalWindow>

<Callout type="danger">

**Irreversible**: all data on the <AccentText hue="slate">LV</AccentText> is destroyed

</Callout>

---

# Remove a Volume Group

`vgremove` removes a <AccentText hue="teal">VG</AccentText> and releases its <AccentText hue="blue">PV</AccentText>s back to an unassigned state

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# vgremove vg01
  Volume group "vg01" successfully removed
```

</TerminalWindow>

<Callout type="warning">

`vgremove` asks before removing a <AccentText hue="teal">VG</AccentText> that still holds <AccentText hue="slate">LV</AccentText>s, and on `y` removes them too

</Callout>

---

# Remove a Physical Volume

`pvremove` removes the LVM label from a device

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# pvremove /dev/sdb1
  Labels on physical volume "/dev/sdb1" successfully wiped.
```

</TerminalWindow>

The partition itself is not deleted

---

# Wipe the Disk

`wipefs` erases the signatures that identify a file system, partition table, or LVM label

- The data stays on the disk, but nothing can find it

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# wipefs --all /dev/sdb
/dev/sdb: 8 bytes were erased at offset 0x00000200 (gpt): 45 46 49 20 50 41 52 54
/dev/sdb: 8 bytes were erased at offset 0x13ffffe00 (gpt): 45 46 49 20 50 41 52 54
/dev/sdb: 2 bytes were erased at offset 0x000001fe (PMBR): 55 aa
/dev/sdb: calling ioctl to re-read partition table: Success
```

</TerminalWindow>

---
layout: exercise
---

# Remove the LVM Setup

::goal::

Tear down the LVM stack in the reverse order of creation

::environment::

**Host:** `servera`

**Prerequisite exercise:** Extend a Logical Volume

::workflow::

1. Unmount `/data` and remove its `/etc/fstab` entry
2. Remove the <AccentText hue="slate">logical volume</AccentText>
3. Remove the <AccentText hue="teal">volume group</AccentText>
4. Remove the <AccentText hue="blue">physical volumes</AccentText> on `/dev/sdb1` and `/dev/sdc1`
5. Wipe the `/dev/sdb` and `/dev/sdc` disks

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/remove-lvm-setup-exercise.cast?url";
</script>

# Remove the LVM Setup

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor unmounting /data, deleting its line from /etc/fstab in vim, removing the mount point, removing lv_data with lvremove, vg_data with vgremove, and both physical volumes with pvremove, then wiping /dev/sdb and /dev/sdc with wipefs."
/>

::resources::

<a href="../resources/remove-lvm-setup-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Remove the LVM Setup exercise in a new tab">Written exercise</a>
