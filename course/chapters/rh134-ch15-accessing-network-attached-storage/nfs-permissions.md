---
layout: section
routeAlias: nfs-permissions
topicInfo:
  alignments:
    rhcsaCertGuide:
      - chapter: "24"
        title: Accessing Network Storage
      - chapter: "06"
        title: User and Group Management
    redHatAcademy:
      - course: RH124
        chapter: "10"
        title: Managing Local Users and Groups
  exercises:
    - title: UID-Based Access Control Exercise
      source: ./exercises/uid-based-access-control-exercise.html
    - title: Observe a UID Mismatch Exercise
      source: ./exercises/observe-uid-mismatch-exercise.html
---

# NFS Permissions

---
layout: two-cols-header
vertical: start
---

# NFS Trusts UIDs, Not Usernames

- When a user accesses an NFS share, the server receives the user's **UID and GID numbers**
- The server checks those numbers against the file permissions on disk

::left::

```text [Client]
alice  →  UID 1001
```

::right::

```text [Server]
alice  →  UID 1001
bob    →  UID 1007
```

::bottom::

<Callout>

NFS trusts the UID the client sends

</Callout>

---
listSpacing: padded
---

# UID Mismatch

- UIDs are assigned locally on each machine
    - There is no automatic synchronization
- The same username can have **different UIDs** on different machines
- A UID mismatch gives a user the wrong permissions on the server
    - Possibly access to someone else's files

---

# UID Mismatch

| Machine       | Username | UID  |
| ------------- | -------- | ---- |
| `servera`     | `alice`  | 1001 |
| `servera`     | `bob`    | 1002 |
| `workstation` | `bob`    | 1001 |
| `workstation` | `alice`  | 1002 |

When `bob` on `workstation` uses the NFS share, the server receives UID 1001

`bob` gets the access that `alice` should have

---
layout: two-cols-header
---

# Synchronizing UIDs

- Centralized accounts such as LDAP or Active Directory solve this
- Otherwise, create users and groups with **explicit IDs**:
    - `groupadd -g GID`
    - `useradd -u UID -g group`

::left::

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# groupadd -g 2000 developers
root@servera:~# useradd -u 2001 -g developers alice
root@servera:~# id alice
uid=2001(alice) gid=2000(developers)
groups=2000(developers)
```

</TerminalWindow>

::right::

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# groupadd -g 2000 developers
root@workstation:~# useradd -u 2001 -g developers alice
root@workstation:~# id alice
uid=2001(alice) gid=2000(developers)
groups=2000(developers)
```

</TerminalWindow>

::bottom::

Run the same commands on both machines: same username, same UID, same GID

---

# Change an Existing User's UID

<v-switch at="1">

<template #0>

`usermod -u` changes an existing account's UID and re-owns the files in its home directory

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# usermod -u 2002 alice
root@workstation:~# id alice
uid=2002(alice) gid=2000(developers) groups=2000(developers)
```

</TerminalWindow>

</template>

<template #1>

A UID that another account already has is refused; `-o` allows it anyway

<TerminalWindow title="root@workstation:~">

```bash-session {4-8}
root@workstation:~# usermod -u 2002 alice
root@workstation:~# id alice
uid=2002(alice) gid=2000(developers) groups=2000(developers)
root@workstation:~# usermod -u 2003 alice
usermod: UID '2003' already exists
root@workstation:~# usermod -o -u 2003 alice
root@workstation:~# id alice
uid=2003(alice) gid=2000(developers) groups=2000(developers)
```

</TerminalWindow>

`usermod` also refuses while any process runs under the account's old UID

</template>

</v-switch>

---

# What about the Superuser UID (0)?

- By default, NFS applies **`root_squash`** to every export
- If a client connects as `root` (UID 0), the server remaps that UID to `nobody`
- `nobody` is an unprivileged account with minimal permissions

| Option           | Behavior                                         |
| ---------------- | ------------------------------------------------ |
| `root_squash`    | Client `root` is remapped to `nobody` (default)  |
| `no_root_squash` | Client `root` acts as `root` on the server       |

<Callout>

`root_squash` limits what a compromised client can do on the server

</Callout>

---

# `root_squash` in Action

`root` on `workstation` is `nobody` on `servera`, and only `student` may write here

<TerminalWindow title="root@workstation:~">

```bash-session
root@workstation:~# ls -ld /nfs/share
drwxr-xr-x. 2 student student 24 Nov 10 12:54 /nfs/share
root@workstation:~# touch /nfs/share/rootfile
touch: cannot touch '/nfs/share/rootfile': Permission denied
```

</TerminalWindow>

---
layout: exercise
---

# UID-Based Access Control

::goal::

Give two users their own directories on one share and prove each reaches only their own

::environment::

**Hosts:** `servera` (server), `workstation` (client)

**Prerequisite exercise:** Configure an NFS Server

::workflow::

1. On `servera`, create two groups and two users with explicit UIDs and GIDs
2. Create a directory for each group, owned by it, that only its members can enter
3. Export the parent directory to the subnet
4. On `workstation`, create the same groups and users with the same UIDs and GIDs
5. Mount the export on `workstation`
6. As each user, verify you can use your own directory but not the other

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/uid-based-access-control-exercise.cast?url";
</script>

# UID-Based Access Control

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating the consultants and developers groups and the con_john and dev_jane users with explicit IDs on servera, giving each group a mode 770 directory under /srv/teams and exporting it, creating the same groups and users with the same IDs on workstation, mounting the share on /nfs/teams, and showing that each user can write in their own team's directory but cannot open the other."
/>

::resources::

<a href="../resources/uid-based-access-control-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written UID-Based Access Control exercise in a new tab">Written exercise</a>

---
layout: exercise
---

# Observe a UID Mismatch

::goal::

Break one user's UID on `workstation` and watch `servera` apply someone else's permissions

::environment::

**Hosts:** `servera` (server), `workstation` (client)

**Prerequisite exercise:** UID-Based Access Control

::workflow::

1. On `workstation`, give `con_john` the UID `dev_jane` has on `servera`
2. Without remounting, access the share as `con_john`
3. Note which files you can reach, and whose permissions apply
4. Restore `con_john`'s UID and verify his access is back to normal

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/observe-uid-mismatch-exercise.cast?url";
</script>

# Observe a UID Mismatch

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor giving con_john the UID of dev_jane on workstation with usermod -o -u, listing /nfs/teams with the consultants directory owned by a bare 1100, reading both dev_jane's notes and the consultants report as con_john, restoring con_john's UID and showing the notes denied again, then unmounting /nfs/teams and removing its export."
/>

::resources::

<a href="../resources/observe-uid-mismatch-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Observe a UID Mismatch exercise in a new tab">Written exercise</a>
