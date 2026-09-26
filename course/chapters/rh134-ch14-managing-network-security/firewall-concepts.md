---
layout: section
routeAlias: firewall-concepts
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "14"
        title: Managing Network Security
    rhcsaCertGuide:
      - chapter: "23"
        title: Configuring a Firewall
---

# Firewalls

## Who can connect, and how

---
listSpacing: padded
---

# What a Firewall Does

Every firewall asks one question about a connection: <SuccessText>allow it</SuccessText>, or <DangerText>refuse it</DangerText>

- The answer comes from a list of rules
- A rule matches on what the connection looks like
  - Where it came <AccentText>from</AccentText>
  - Where it is going <AccentText>to</AccentText>
  - Which <AccentText>port</AccentText> it is asking for

<!--
Keep this abstract for one slide. The next two slides show the same idea from the two places a firewall runs, and the difference between them is the whole reason the table after that looks the way it does.
-->

---
layout: two-cols-header
leftWidth: 45
---

# A Network Firewall

::left::

Stands between two networks and asks

**<AccentText>Can this network talk to that network?</AccentText>**

Rules have to name both ends

Each direction needs its own rule

```text [Two rules, one per direction]
FROM             TO              PORT   ACTION
10.0.0.0/8       172.16.0.0/16   3306   allow
172.16.0.0/16    10.0.0.0/8      any    deny
```

::right::

```mermaid {scale: 0.5}
flowchart LR
    subgraph OFFICE ["172.16.0.0/16"]
        DB1@{ icon: "carbon:db2-database", form: "square", label: "172.16.25.10", pos: "b" }
        DB2@{ icon: "carbon:db2-database", form: "square", label: "172.16.25.11", pos: "b" }
    end
    R1@{ icon: "carbon:router", form: "square", label: "Router", pos: "b" }
    FW@{ icon: "carbon:firewall", form: "square", label: "Firewall", pos: "b" }
    R2@{ icon: "carbon:router", form: "square", label: "Router", pos: "b" }
    subgraph DC ["10.0.0.0/8"]
        S1@{ icon: "carbon:bare-metal-server", form: "square", label: "10.0.0.5", pos: "b" }
        S2@{ icon: "carbon:bare-metal-server", form: "square", label: "10.0.0.6", pos: "b" }
    end
    DB1 <--> R1
    DB2 <--> R1
    R1 <--> FW <--> R2
    R2 <--> S1
    R2 <--> S2
    style OFFICE fill:#ffffff,stroke:#9aa4ad
    style DC fill:#ffffff,stroke:#9aa4ad
    style DB1 fill:#ffffff,stroke:#55555b
    style DB2 fill:#ffffff,stroke:#55555b
    style R1 fill:#ffffff,stroke:#55555b
    style R2 fill:#ffffff,stroke:#55555b
    style FW fill:#fdecee,stroke:#c00023
    style S1 fill:#ffffff,stroke:#55555b
    style S2 fill:#ffffff,stroke:#55555b
```

---
layout: two-cols-header
leftWidth: 65
---

# A Server Firewall

Stands between the network and this host and asks:

**<AccentText>Can this network talk to me?</AccentText>**

::left::

Only sees traffic addressed to itself

```text [Host: 10.0.0.6]
FROM          TO    PORT    ACTION
10.0.0.0/8    me    3306    allow
```

```text [Host: 10.0.0.5]
FROM             TO    PORT    ACTION
172.16.0.0/16    me    443     allow
```

::right::

```mermaid {scale: 0.55}
flowchart LR
    R2@{ icon: "carbon:router", form: "square", label: "Router", pos: "b" }
    subgraph DC ["10.0.0.0/8"]
        subgraph HOST1 ["10.0.0.5"]
            FW1@{ icon: "carbon:firewall", form: "square", label: "firewalld", pos: "b" }
            SVC1@{ icon: "carbon:application-web", form: "square", label: "httpd :443", pos: "b" }
        end
        subgraph HOST2 ["10.0.0.6"]
            FW2@{ icon: "carbon:firewall", form: "square", label: "firewalld", pos: "b" }
            SVC2@{ icon: "carbon:db2-database", form: "square", label: "mysqld :3306", pos: "b" }
        end
    end
    R2 <--> FW1 <--> SVC1
    R2 <--> FW2 <--> SVC2
    style DC fill:#ffffff,stroke:#9aa4ad
    style HOST1 fill:#ffffff,stroke:#9aa4ad
    style HOST2 fill:#ffffff,stroke:#9aa4ad
    style R2 fill:#ffffff,stroke:#55555b
    style FW1 fill:#fdecee,stroke:#c00023
    style FW2 fill:#fdecee,stroke:#c00023
    style SVC1 fill:#ffffff,stroke:#55555b
    style SVC2 fill:#ffffff,stroke:#55555b
```

---

# Firewall

| Source Network     | Ports      | Allowed / Blocked                  |
|--------------------|------------|------------------------------------|
| `192.168.1.0/24`   | 20, 21, 22 | <SuccessText>Allowed</SuccessText> |
| `100.200.225.0/22` | 80, 443    | <SuccessText>Allowed</SuccessText> |
| `100.200.225.18`   | 80, 443    | <SuccessText>Allowed</SuccessText> |
| Any                | 25, 587    | <SuccessText>Allowed</SuccessText> |
| **Any**            | **Any**    | <DangerText>Blocked</DangerText>   |

<Callout title="Deny by Default">

Anything not specifically allowed is denied

</Callout>

<!--
Default deny is the idea students carry into the zone material. Every zone but trusted works this way: a short allow list, and everything else rejected.

Port 25,587 = SMTP
-->

---
horizontal: center
---

# Why Multiple Firewalls?

If we have network Firewalls why do we also need firewalls on the server?


```mermaid {scale: 0.68}
flowchart LR
    NET@{ icon: "carbon:cloud", form: "square", label: "Internet", pos: "b" }
    FW@{ icon: "carbon:firewall", form: "square", label: "Edge firewall<br/>Allows: 443, 3306, 445", pos: "b" }
    SW@{ icon: "carbon:switch-layer-3", form: "square", label: "Switch", pos: "b" }
    A@{ icon: "carbon:application-web", form: "square", label: "Web server<br/>Allows: 443", pos: "b" }
    B@{ icon: "carbon:db2-database", form: "square", label: "Database server<br/>Allows: 3306", pos: "b" }
    C@{ icon: "carbon:folder", form: "square", label: "File server<br/>Allows: 445", pos: "b" }
    NET --> FW --> SW
    SW --> A
    SW --> B
    SW --> C
    style NET fill:#ffffff,stroke:#55555b
    style FW fill:#ffffff,stroke:#55555b
    style SW fill:#ffffff,stroke:#55555b
    style A fill:#fdecee,stroke:#c00023
    style B fill:#fdecee,stroke:#c00023
    style C fill:#fdecee,stroke:#c00023
```

Provide <AccentText>defense in depth</AccentText> and prevent <AccentText>lateral movement</AccentText>

---

# Ports on the Back of the Server

One server, two network interfaces, and each one can sit in a different zone

![Rear panel of a rack server: two hot-swap power supplies on the left, then an input and output panel carrying PS/2, serial, VGA, USB, and two RJ-45 network jacks](./assets/server-rear-panel.jpg)

Photograph by [ChrisDag](https://www.flickr.com/photos/8558461@N08/4524625686), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via Flickr

---
layout: two-cols-header
leftWidth: 60
---

# Traffic Flow

::left::

- Traffic arrives on an <AccentText>interface</AccentText>
    - enp1s0
    - enp2s0
- The interface belongs to a <AccentText>zone</AccentText>
    - public
    - internal
- The zone decides what is <AccentText>allowed</AccentText>
    - 22
    - 80 and 443
    - 3306
::right::

| Zone       | Allowed      |
|------------|--------------|
| `public`   | 443          |
| `internal` | 22, 80, 3306 |

<div class="flex justify-center">

```mermaid {scale: 0.66}
flowchart LR
    Internet --> enp2s0
    LAN --> enp1s0
    subgraph IZ ["public zone"]
        enp2s0
    end
    subgraph PZ ["internal zone"]
        enp1s0
    end
    enp2s0 --> Server([Server])
    enp1s0 --> Server
    classDef default fill:#fdecee,stroke:#c00023,color:#25252b
    style IZ fill:#ffffff,stroke:#9aa4ad
    style PZ fill:#ffffff,stroke:#9aa4ad
    style enp1s0 fill:#e62d42,stroke:#c00023,color:#ffffff
    style enp2s0 fill:#e62d42,stroke:#c00023,color:#ffffff
```

</div>

---
listSpacing: padded
---

# RHEL Firewall Components

- `firewalld`
  - The dynamic manager you configure, and the "front end"
- `nftables`
  - Classifies packets and applies the rules
- `netfilter`
  - The kernel framework that filters, translates, and forwards packets

