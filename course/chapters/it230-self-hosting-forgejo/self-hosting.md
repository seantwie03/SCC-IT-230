---
layout: section
routeAlias: self-hosting-forgejo
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "19"
        title: Comprehensive Review
---

# Final Review

## Self-Hosting Forgejo

---

# What Is Self-Hosting?

## Running applications on hardware you control

---
layout: two-cols-header
vertical: center
horizontal: center
listSpacing: padded
---

# What Is Self-Hosting?

::left::

<IconGrid>
<IconGridItem icon="cloud">

**Hosted service**, such as <AccentText>GitHub</AccentText>

</IconGridItem>
</IconGrid>

- **Someone else** runs it
- **They** keep your data
- **They** set the rules

::right::

<IconGrid>
<IconGridItem icon="home">

**Self-hosted**, such as <AccentText>Forgejo</AccentText>

</IconGridItem>
</IconGrid>

- **You** run it on your own servers
- **You** keep your data
- **You** do the administration

---
horizontal: center
vertical: center
---

# Home Labs

<IconGrid>
<IconGridItem icon="virtual-machine">

Spare hardware or virtual machines

</IconGridItem>
<IconGridItem icon="application">

Services you run for yourself

</IconGridItem>
<IconGridItem icon="debug">

A safe place to break things

</IconGridItem>
<IconGridItem icon="education">

Skills that carry over to work

</IconGridItem>
<IconGridItem icon="view-off">

Keeps your data private

</IconGridItem>
</IconGrid>

---
horizontal: center
vertical: center
---

# N-Tier Architecture

```mermaid {scale: 1}
flowchart LR
    U@{ icon: "carbon:user-multiple", form: "square", label: "Users", pos: "b" }
    WEB["Web tier<br/>faces the users"]
    APP["App tier<br/>runs the code"]
    DATA["Data tier<br/>keeps the data"]
    U --> WEB --> APP --> DATA
    classDef web fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
    classDef app fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
    classDef data fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
    class WEB web
    class APP app
    class DATA data
    style U fill:#ffffff,stroke:#55555b
```

Each tier talks only to its neighbors

---

# Why Separate the Tiers

<IconGrid>
<IconGridItem icon="security">

Only the web tier accepts user connections

</IconGridItem>
<IconGridItem icon="locked">

Each tier is secured for its own job

</IconGridItem>
<IconGridItem icon="renew">

Update or replace one tier at a time

</IconGridItem>
<IconGridItem icon="search">

A failure stays in its own tier

</IconGridItem>
</IconGrid>

---
horizontal: center
---

# What Is Forgejo?

![Forgejo's website: "Forge great software with Forgejo", then "Take back control of your software development process, self-host your projects and get everyone involved in delivering quality software on the same page", above six features with orange icons: Simple software project management; Lightweight and performant; Self-hosted alternative to GitHub; Guaranteed 100% Free Software; Easy to install and maintain; and Beyond coding, we forge ahead](./assets/forgejo-product-page.png)

Pronounced <AccentText>for-JEH-yo</AccentText>, from the Esperanto word for forge

---
layout: two-cols-header
vertical: center
---

# Forgejo in Use

::left::

![Forgejo's own repository, forgejo/forgejo, on Codeberg: tabs for Code, Issues (1.7k), Pull requests (194), Projects, Releases, Packages, Activity, and Actions, then 26,160 commits, 33 branches, and 311 tags above the start of its file list](./assets/forgejo-codeberg-repo.png)

Codeberg hosts Forgejo's own code on Forgejo

::right::

![Fedora Forge's welcome page: "Welcome to Fedora Forge", "The Fedora Project's collaborative development platform", and "Fedora Forge is a git forge built on Forgejo", with Forgejo highlighted](./assets/fedora-forgejo.png)

The Fedora Project's forge is built on Forgejo

---
horizontal: center
vertical: center
---

# This Week's Architecture

```mermaid {scale: 0.8}
flowchart LR
    W@{ icon: "carbon:laptop", form: "square", label: "workstation", pos: "b" }
    subgraph A ["servera"]
        direction LR
        H@{ icon: "carbon:application-web", form: "square", label: "httpd (web tier)", pos: "b" }
        F@{ icon: "carbon:container-software", form: "square", label: "Forgejo (app tier)", pos: "b" }
        H -- "port 3000" --> F
    end
    subgraph B ["serverb"]
        direction LR
        D@{ icon: "carbon:data-base", form: "square", label: "PostgreSQL (data tier)", pos: "b" }
        N@{ icon: "carbon:folder-shared", form: "square", label: "Forgejo's files (data tier)", pos: "b" }
    end
    W -- "port 80" --> H
    F -- "port 5432" --> D
    F -- "NFS" --> N
    style A fill:#ffffff,stroke:#9aa4ad
    style B fill:#ffffff,stroke:#9aa4ad
    style W fill:#ffffff,stroke:#55555b
    style H fill:#d3e4f9,stroke:#3584e4
    style F fill:#e7d5ed,stroke:#9141ac
    style D fill:#f6dce9,stroke:#d56199
    style N fill:#f6dce9,stroke:#d56199
```

Only port 80 is open to other hosts; Forgejo's files are automounted from `serverb`

---
vertical: center
---

# Built in Four Exercises

| Exercise            | Hosts                | Reviews weeks             |
|---------------------|----------------------|---------------------------|
| Build the Data Tier | serverb              | 1, 4 to 7, 10, 11, and 13 |
| Build the App Tier  | servera              | 13 and 14                 |
| Build the Web Tier  | workstation, servera | 5 to 7 and 14             |
| Operate Forgejo     | serverb, servera     | 2 to 6                    |

Each one starts where the last one ended
