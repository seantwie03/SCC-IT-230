---
layout: section
routeAlias: mounting-nfs-exports
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "15"
        title: Accessing Network-Attached Storage
    rhcsaCertGuide:
      - chapter: "24"
        title: Accessing Network Storage
  exercises:
    - title: Mount NFS Exports Exercise
      source: ./exercises/mount-nfs-exports-exercise.html
---

# Mounting NFS Exports

---

# Install the `nfs-utils` Package

- Same package as the server
- Also provides the client tools to discover and mount NFS exports

| What    | Name        | Purpose                                       |
| ------- | ----------- | --------------------------------------------- |
| Command | `mount.nfs` | Mount helper that `mount -t nfs` runs for you |
| Command | `showmount` | Query a server's available exports            |

---

# Discover Available Exports

`showmount --exports` lists the directories a server exports, and who may mount them

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# showmount --exports servera
Export list for servera:
/srv/share 172.25.250.0/24
```

</TerminalWindow>

<Callout>

`showmount` asks over RPC, so the server's firewall must allow `mountd` and `rpc-bind`.

Without them it fails with `clnt_create: RPC: Unable to receive`

</Callout>

---
layout: two-cols-header
leftWidth: 55
---

# NFS Versions

RHEL 10 mounts with NFS 4.2 by default and still supports NFSv3

::left::

<div>

### NFSv3

- TCP or UDP
- Each export stands alone
- `rpcbind` tells clients where `mountd` listens
- `mountd` lists the exports (used by `showmount`)

</div>

::right::

<div>

### NFSv4

- TCP only
- Everything on port 2049
- One export tree holds every export

</div>

::bottom::

An NFSv4 mount needs only port 2049

`rpcbind` and `mountd` are there for `showmount` and NFSv3

---

# Browse the NFSv4 Export Tree

When `showmount` is blocked, mount the root of the server's export tree and look around

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# mount servera:/ /mnt
root@workstation:~# ls /mnt
srv
root@workstation:~# ls /mnt/srv
share
root@workstation:~# umount /mnt
root@workstation:~#
```

</TerminalWindow>

`servera:/` is the top of the export tree, not `servera`'s root file system

<Callout>

This only works with **NFSv4**

</Callout>

---

# Manually Mount an NFS Export

- For the current session only
- Does **not** survive a reboot
- Useful for testing an export before adding it to `/etc/fstab`

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# mkdir -p /nfs/share
root@workstation:~# mount -t nfs -o rw,sync servera:/srv/share /nfs/share
root@workstation:~# mount | grep /nfs/share
servera:/srv/share on /nfs/share type nfs4 (rw,relatime,sync,vers=4.2,rsize=262144,wsize=262144,namlen=255,hard,
proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=172.25.250.9,local_lock=none,addr=172.25.250.10)
```

</TerminalWindow>

`-t nfs` is optional, since the `server:/export` form implies it

---

# The Server Has the Final Say

A client's `-o rw` is only a request; an export marked `ro` wins

```text [/etc/exports on servera]
/srv/archive  172.25.250.0/24(ro)
```

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# mount -t nfs -o rw,sync servera:/srv/archive /nfs/archive
root@workstation:~# touch /nfs/archive/2026.txt
touch: cannot touch '/nfs/archive/2026.txt': Read-only file system
```

</TerminalWindow>

`mount` still says `rw`: the client cannot see the server's `ro` from its side

---

# Persistent Mount via /etc/fstab

An `/etc/fstab` line mounts the export at every boot

<TextExplainer
  :lines="['servera:/srv/share  /nfs/share  nfs  rw,sync,nofail  0 0']"
  :steps="[
    { text: 'servera:/srv/share', explanation: 'Device: the server and its export, in place of a UUID' },
    { text: '/nfs/share', explanation: 'Mount point: the local directory' },
    { text: 'nfs', occurrence: 2, explanation: 'Type: nfs' },
    { text: 'rw,sync', explanation: 'Options: read/write, with each write confirmed by the server' },
    { text: 'nofail', explanation: 'nofail: if servera is down, the boot carries on instead of waiting 90 seconds' },
    { text: '0 0', explanation: 'No dump, no fsck: servera checks its own file system' },
  ]"
/>

Apply it without rebooting

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# systemctl daemon-reload
root@workstation:~# mount /nfs/share
root@workstation:~#
```

</TerminalWindow>

---

# Unmount an NFS Export

<v-switch at="1">

<template #0>

`umount` detaches the share; the `/etc/fstab` line stays, so it mounts again at the next boot

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# umount /nfs/share
root@workstation:~#
```

</TerminalWindow>

</template>

<template #1>

**Device is busy:** a process has a file open, or a shell is inside the mount point

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# umount /nfs/share
umount.nfs4: /nfs/share: device is busy
```

</TerminalWindow>

</template>

<template #2>

**List open files:** `lsof` finds the process that is in the way

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# lsof /nfs/share
COMMAND  PID    USER   FD   TYPE DEVICE SIZE/OFF     NODE NAME
bash    4280 student  cwd    DIR   0,62       24 12960330 /nfs/share (servera:/srv/share)
```

</TerminalWindow>

</template>

</v-switch>

---
layout: exercise
---

# Mount NFS Exports

::goal::

Mount `servera`'s export on `workstation` by hand, then at every boot

::environment::

**Hosts:** `servera` (server), `workstation` (client)

**Prerequisite exercise:** Configure an NFS Server

::workflow::

1. On `workstation`, install `nfs-utils`
2. Verify `servera`'s export is visible with `showmount --exports`
3. Mount it on `/nfs/reports` and confirm `student` can write a file
4. Unmount the export
5. Add the export to `/etc/fstab` with `rw,sync,nofail` options
6. Mount it from `/etc/fstab` and verify it is mounted
7. Reboot `workstation` and confirm the export mounts automatically

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/mount-nfs-exports-exercise.cast?url";
</script>

# Mount NFS Exports

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing nfs-utils on workstation, listing servera's exports with showmount, mounting servera:/srv/reports on /nfs/reports and writing a file there as student, unmounting it, adding an /etc/fstab line with rw,sync,nofail and mounting from it, rebooting workstation and confirming the share mounted at boot, then removing the line, the mount, and the export."
/>

::resources::

<a href="../resources/mount-nfs-exports-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Mount NFS Exports exercise in a new tab">Written exercise</a>
