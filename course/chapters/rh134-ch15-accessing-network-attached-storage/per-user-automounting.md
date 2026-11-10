---
layout: section
routeAlias: per-user-automounting
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
    - title: Per-User Automounting Exercise
      source: ./exercises/per-user-automounting-exercise.html
---

# Per-User Automounting

---

# Per-User Shares with Indirect Maps

- Combine a wildcard indirect map with group-owned directories
- Each user's `/nfs/username` mounts `servera:/srv/shares/username`
- The server's directory permissions decide who can read and write

```text [/etc/auto.master.d/shares.autofs]
/nfs  /etc/auto.shares
```

```text [/etc/auto.shares]
*  -rw,sync  servera:/srv/shares/&
```

<Callout>

The mount succeeds for everyone; the server's file permissions decide what each user can do. Point a user's home directory here and the same map serves home directories

</Callout>

---
layout: exercise
---

# Per-User Automounting

::goal::

Give each user an automounted directory of their own from one map entry

::environment::

**Hosts:** `servera` (server), `workstation` (client)

**Prerequisite exercises:** Configure an Indirect Map, UID-Based Access Control

::workflow::

1. On `servera`, create `/srv/usershares` with a directory for each user, owned by that user's group
2. Export the parent directory to the subnet
3. On `workstation`, confirm `con_john` and `dev_jane` have the same UIDs and GIDs as on `servera`
4. Configure a wildcard indirect map for `/nfs/usershares`
5. Restart `autofs`
6. As each user, verify your own directory mounts on access
7. Verify neither user can use the other's directory

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/per-user-automounting-exercise.cast?url";
</script>

# Per-User Automounting

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating a mode 770 directory for each user under /srv/usershares on servera and exporting it, confirming con_john and dev_jane have the same IDs on both hosts, adding a wildcard indirect map for /nfs/usershares on workstation, showing each user's own directory mount on access and the other user's directory refused, then removing the maps, users, groups, export, firewall services, and packages to return both hosts to the start of the week."
/>

::resources::

<a href="../resources/per-user-automounting-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Per-User Automounting exercise in a new tab">Written exercise</a>
