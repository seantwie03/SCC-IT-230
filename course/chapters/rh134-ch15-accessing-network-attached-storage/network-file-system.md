---
layout: section
routeAlias: network-file-system
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "15"
        title: Accessing Network-Attached Storage
    rhcsaCertGuide:
      - chapter: "24"
        title: Accessing Network Storage
---

# Network File System

---
vertical: center
---

# What Is Network File System (NFS)?

<IconGrid>
<IconGridItem icon="network-3">

A protocol for sharing directories over a network

</IconGridItem>
<IconGridItem icon="chip">

Built into the Linux kernel

</IconGridItem>
<IconGridItem icon="locked">

Uses native Linux permissions

</IconGridItem>
<IconGridItem icon="folder-shared">

The NFS server exports a directory

</IconGridItem>
<IconGridItem icon="folder-add">

The NFS client mounts it on a local path

</IconGridItem>
<IconGridItem icon="document">

The client reads and writes files normally

</IconGridItem>
</IconGrid>

---
horizontal: center
---

# NFS in the Lab

```mermaid {scale: 1.4}
flowchart LR
    subgraph S ["NFS server: servera"]
        E@{ icon: "carbon:folder-shared", form: "square", label: "Exports /srv/share", pos: "b" }
    end
    subgraph W ["NFS client: workstation"]
        M@{ icon: "carbon:folder", form: "square", label: "Mounts /nfs/share", pos: "b" }
    end
    E <-- "NFS, TCP 2049" --> M
    style S fill:#ffffff,stroke:#9aa4ad
    style W fill:#ffffff,stroke:#9aa4ad
    style E fill:#ffffff,stroke:#55555b
    style M fill:#ffffff,stroke:#55555b
```

| Role           | Machine       | Action                                                      |
| -------------- | ------------- | ----------------------------------------------------------- |
| NFS **server** | `servera`     | *Exports* a directory, making it available on the network   |
| NFS **client** | `workstation` | *Mounts* the exported directory on a local path             |
