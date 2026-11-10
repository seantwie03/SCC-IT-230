---
layout: section
routeAlias: nfs-server
topicInfo:
  alignments:
    rhcsaCertGuide:
      - chapter: "24"
        title: Accessing Network Storage
  exercises:
    - title: Configure an NFS Server Exercise
      source: ./exercises/configure-nfs-server-exercise.html
---

# NFS Server

---

# Install the `nfs-utils` Package

One package provides the NFS server and the tools to mount NFS exports

```bash
dnf install nfs-utils
```

| What    | Name         | Purpose                                         |
| ------- | ------------ | ----------------------------------------------- |
| Service | `nfs-server` | The NFS daemon, which serves exports to clients |
| Command | `exportfs`   | Apply and inspect active exports                |
| Command | `showmount`  | Query a server's available exports              |
| Command | `mount.nfs`  | Mount helper that `mount -t nfs` runs for you   |

---

# The /etc/exports File

Each line exports one directory to the clients that may mount it

```text [/etc/exports]
/path  client(options)
```

| Field     | Meaning                                       | Example           |
| --------- | --------------------------------------------- | ----------------- |
| `/path`   | Directory to export                           | `/srv/share`      |
| `client`  | Who may mount it: a subnet, host name, or `*` | `172.25.250.0/24` |
| `options` | Comma-separated export options                | `rw,sync`         |

```text [/etc/exports]
/srv/share  172.25.250.0/24(rw,sync)
```

---

# Common Export Options

```text [/etc/exports]
/srv/share  172.25.250.0/24(rw,sync)
```

| Option        | Default | Meaning                                              |
| ------------- | :-----: | ---------------------------------------------------- |
| `rw`          |         | Client can read and write                            |
| `ro`          |    ✓    | Client can only read                                 |
| `sync`        |    ✓    | Server confirms writes are on disk before replying   |
| `root_squash` |    ✓    | Client `root` is treated as `nobody` on the server   |

View `man exports` for full list of options. Available after installing `nfs-utils`

---

# Enable the NFS Server

`systemctl enable nfs-server --now` starts the NFS daemon now and at every boot

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# systemctl enable nfs-server --now
Created symlink
'/etc/systemd/system/multi-user.target.wants/nfs-server.service' → '/usr/lib/systemd/system/nfs-server.service'.
```

</TerminalWindow>

`nfs-server` also starts its Systemd dependencies like `rpcbind` and `nfs-mountd`
<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# systemctl list-dependencies nfs-server
nfs-server.service
...output omitted...
● ├─nfs-mountd.service
● ├─nfsdcld.service
● ├─rpcbind.socket
● └─network-online.target
```

</TerminalWindow>

---

# Configure the Firewall for NFS

| Service    | Purpose                                                   |
| ---------- | --------------------------------------------------------- |
| `nfs`      | NFS data transfer (TCP 2049)                              |
| `rpc-bind` | Tells clients where `mountd` is listening (TCP/UDP 111)   |
| `mountd`   | Handles mount requests from clients (TCP/UDP 20048)       |


<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# firewall-cmd --add-service=nfs --add-service=rpc-bind --add-service=mountd
success
root@servera:~# firewall-cmd --runtime-to-permanent
success
```

</TerminalWindow>

---

# Manage Exports with `exportfs`

<v-switch at="1">

<template #0>

`exportfs -r` re-reads `/etc/exports` and applies any changes

- Does not restart the NFS server
- Active connections are kept
- Also reads files ending in `.exports` in `/etc/exports.d/`

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# exportfs -r
root@servera:~#
```

</TerminalWindow>

</template>

<template #1>

`exportfs -v` lists the active exports with every option, defaults included

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# exportfs -v
/srv/share      172.25.250.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
```

</TerminalWindow>

`rw` and `sync` as written, and `root_squash` by default

</template>

</v-switch>

---

# No Space Before the Options

One stray space gives the subnet read-only access and everyone else read/write

```text [/etc/exports]
/srv/share  172.25.250.0/24 (rw,sync)
```

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# exportfs -r
exportfs: No options for /srv/share 172.25.250.0/24: suggest 172.25.250.0/24(sync) to avoid warning
exportfs: No host name given with /srv/share (rw,sync), suggest *(rw,sync) to avoid warning
root@servera:~# exportfs -v
/srv/share      172.25.250.0/24(ro,sync,wdelay,hide,no_subtree_check,sec=sys,secure,root_squash,no_all_squash)
/srv/share      <world>(rw,sync,wdelay,hide,no_subtree_check,sec=sys,secure,root_squash,no_all_squash)
```

</TerminalWindow>

`exportfs` only warns, so check `exportfs -v` after every edit

---
layout: exercise
---

# Configure an NFS Server

::goal::

Share a directory on `servera` with the lab network

::environment::

**Host:** `servera`

::workflow::

1. Install `nfs-utils`
2. Create `/srv/reports` and give it to `student`
3. Export it read/write to `172.25.250.0/24`
4. Enable and start the `nfs-server` service
5. Open the firewall for NFS
6. Verify the export with `exportfs -v`

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/configure-nfs-server-exercise.cast?url";
</script>

# Configure an NFS Server

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing nfs-utils on servera, creating /srv/reports and giving it to student, adding an /etc/exports line that exports it read/write to 172.25.250.0/24, enabling and starting nfs-server, opening the nfs, rpc-bind, and mountd firewall services and keeping them permanently, and checking the export and its default options with exportfs -v."
/>

::resources::

<a href="../resources/configure-nfs-server-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Configure an NFS Server exercise in a new tab">Written exercise</a>
