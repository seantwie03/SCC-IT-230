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

<IconGrid
  :items="[
    { icon: 'network-3', caption: 'A protocol for sharing directories over a network' },
    { icon: 'chip', caption: 'Built into the Linux kernel' },
    { icon: 'locked', caption: 'Uses native Linux permissions' },
    { icon: 'folder-shared', caption: 'The NFS server exports a directory' },
    { icon: 'folder-add', caption: 'The NFS client mounts it on a local path' },
    { icon: 'document', caption: 'The client reads and writes files normally' },
  ]"
/>

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
