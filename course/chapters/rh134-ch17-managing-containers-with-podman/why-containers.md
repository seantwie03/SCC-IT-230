---
layout: section
routeAlias: why-containers
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "17"
        title: Managing Containers with Podman
  exercises:
    - title: Run Your First Container Exercise
      source: ./exercises/run-your-first-container-exercise.html
---

# Why Containers

---
layout: center
---

# What Is a Container?

A <AccentText>process</AccentText> packaged with <AccentText>everything it needs</AccentText> to run

---
layout: two-cols-header
vertical: center
---

# Why Containers?

::left::

- Dev installs Python 3.12
- Dev creates App3

::right::

```mermaid {scale: 1.4}
block-beta
  columns 3
  t1["Dev Laptop"]:3
  a3["App3"] space:2
  l1["Bins/Libs (Python 3.12)"]:3
  o1["Operating System (Windows)"]:3
  i1["Infrastructure (Laptop)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1 label
  class a3 app3
  class l1 libs
  class o1 os
  class i1 infra
```

---
layout: two-cols-header
vertical: center
---

# Why Containers?

::left::

- Developer's laptop
  - Python 3.12
- Server
  - Python 2.7

::right::

```mermaid {scale: 0.8}
block-beta
  columns 3
  t1["Dev Laptop"]:3
  a3["App3"] space:2
  l1["Bins/Libs (Python 3.12)"]:3
  o1["Operating System (Windows)"]:3
  i1["Infrastructure (Laptop)"]:3
  space:3
  t2["Server"]:3
  a1["App1"] a2["App2"] space
  l2["Bins/Libs (Python 2.7)"]:3
  o2["Operating System (RHEL 8)"]:3
  i2["Infrastructure (Virtual Machine)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1,t2 label
  class a1,a2 app
  class a3 app3
  class l1,l2 libs
  class o1,o2 os
  class i1,i2 infra
```

---
layout: two-cols-header
vertical: center
---

# Why Containers?

::left::

- Ops tries to deploy App3
- Server
  - Python 2.7
- Ops: "Doesn't work on server!"
- Dev: "Works on my machine!"

::right::

```mermaid {scale: 1.3}
block-beta
  columns 3
  t2["Server"]:3
  a1["App1"] a2["App2"] a3["App3 (fails)"]
  l2["Bins/Libs (Python 2.7)"]:3
  o2["Operating System (RHEL 8)"]:3
  i2["Infrastructure (Virtual Machine)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef fail fill:#fad1d5,stroke:#e62d42,stroke-width:2px,stroke-dasharray:5 3,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t2 label
  class a1,a2 app
  class a3 fail
  class l2 libs
  class o2 os
  class i2 infra
```

---
layout: two-cols-header
vertical: center
leftWidth: 65
---

# Why Containers?

::left::

- Manager: "All developers must use Python 2.7!"
- Dev: Rewrites App3 in Python 2.7
  - Not happy about it
- App3 becomes a big hit! Users love it.
- Later: Python 2.x goes End of Life

::right::

```mermaid {scale: 0.8}
block-beta
  columns 3
  t1["Dev Laptop"]:3
  a3["App3"] space:2
  l1["Bins/Libs (Python 2.7)"]:3
  o1["Operating System (Windows)"]:3
  i1["Infrastructure (Laptop)"]:3
  space:3
  t2["Server"]:3
  a1["App1"] a2["App2"] b3["App3"]
  l2["Bins/Libs (Python 2.7)"]:3
  o2["Operating System (RHEL 8)"]:3
  i2["Infrastructure (Virtual Machine)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1,t2 label
  class a1,a2 app
  class a3,b3 app3
  class l1,l2 libs
  class o1,o2 os
  class i1,i2 infra
```

---
layout: two-cols-header
leftWidth: 55
---

# Why Containers?

::left::

- Manager: "Please upgrade App3 to Python 3.12"
- Devs: "We can't, the server only has Python 2.7"
- Manager: "Get a new server"

```mermaid {scale: 1.2}
block-beta
  columns 3
  t2["Server"]:3
  a1["App1"] a2["App2"] a3["App3"]
  l2["Bins/Libs (Python 2.7)"]:3
  o2["Operating System (RHEL 8)"]:3
  i2["Infrastructure (Virtual Machine)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t2 label
  class a1,a2 app
  class a3 app3
  class l2 libs
  class o2 os
  class i2 infra
```

::right::

<br />
<br />
<br />
<br />
<br />
<br />

```mermaid {scale: 1.2}
block-beta
  columns 3
  t1["New Server"]:3
  l1["Bins/Libs (Python 3.12)"]:3
  o1["Operating System (RHEL 10)"]:3
  i1["Infrastructure (Virtual Machine)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1,t2 label
  class l1,l2 libs
  class o1,o2 os
  class i1,i2 infra
```

---
horizontal: center
---

# Why Containers?

Different VMs to isolate workloads

```mermaid {scale: 1.3}
block-beta
  columns 7
  t1["Server 1"]:3 space t2["Server 2"]:3
  a1["App1"] a2["App2"] space space a3["App3"] space:2
  l1["Bins/Libs (Python 2.7)"]:3 space l2["Bins/Libs (Python 3.12)"]:3
  o1["Operating System (RHEL 8)"]:3 space o2["Operating System (RHEL 10)"]:3
  i1["Infrastructure (CPU, RAM, Storage)"]:3 space i2["Infrastructure (CPU, RAM, Storage)"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1,t2 label
  class a1,a2 app
  class a3 app3
  class l1,l2 libs
  class o1,o2 os
  class i1,i2 infra
```

---
vertical: center
horizontal: center
---

# VM as the Unit of Isolation

```mermaid {scale: 1.3}
block-beta
  columns 11
  t1["Server 1"]:3 space t2["Server 2"]:3 space t3["Server 3"]:3
  a1["App1"] space:2 space a2["App2"] space:2 space a3["App3"] space:2
  l1["Python 2.7"]:3 space l2["Python 2.7"]:3 space l3["Python 3.12"]:3
  o1["RHEL 8"]:3 space o2["RHEL 8"]:3 space o3["RHEL 10"]:3
  i1["CPU, RAM, Storage"]:3 space i2["CPU, RAM, Storage"]:3 space i3["CPU, RAM, Storage"]:3
  classDef label fill:none,stroke:none,color:#25252b
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class t1,t2,t3 label
  class a1,a2 app
  class a3 app3
  class l1,l2,l3 libs
  class o1,o2,o3 os
  class i1,i2,i3 infra
```

<br />

Every app carries a whole operating system

---
layout: two-cols-header
vertical: center
horizontal: center
---

# Containerized Apps

```mermaid {scale: 1.5}
block-beta
  columns 3
  block:ctrs:3
    columns 3
    block:c1
      columns 1
      a1["App1"]
      l1["Python 2.7"]
    end
    block:c2
      columns 1
      a2["App2"]
      l2["Python 2.7"]
    end
    block:c3
      columns 1
      a3["App3"]
      l3["Python 3.12"]
    end
  end
  block:base:3
    columns 1
    e["Container Engine (Docker/Podman)"]
    o["Operating System (RHEL 8/9/10/+)"]
    i["Hardware"]
  end
  classDef box fill:#ffffff,stroke:#6f8396,stroke-width:2px,stroke-dasharray:5 3
  classDef plain fill:none,stroke:none
  classDef app fill:#ffffff,stroke:#55555b,stroke-width:2px,color:#25252b
  classDef app3 fill:#f6dce9,stroke:#d56199,stroke-width:2px,color:#25252b
  classDef libs fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
  classDef engine fill:#dfe4e8,stroke:#6f8396,stroke-width:2px,color:#25252b
  classDef os fill:#e7d5ed,stroke:#9141ac,stroke-width:2px,color:#25252b
  classDef infra fill:#ebebed,stroke:#9aa4ad,stroke-width:2px,color:#25252b
  class c1,c2,c3 box
  class base,ctrs plain
  class a1,a2 app
  class a3 app3
  class l1,l2,l3 libs
  class e engine
  class o os
  class i infra
```

---

# Containers and Virtual Machines

|              | Virtual machine                       | Container                    |
| ------------ | ------------------------------------- | ---------------------------- |
| Runs on      | A hypervisor                          | A container engine           |
| Carries      | A whole OS: boot loader, kernel, init | The app and its libraries    |
| Kernel       | Its own                               | The host's                   |
| Size         | Gigabytes                             | Megabytes                    |
| Starts by    | Booting an operating system           | Starting a process           |

At scale, Kubernetes and Red Hat OpenShift run containers across many hosts

---
layout: center
---

# What Is a Container?

A <AccentText>process</AccentText> packaged with <AccentText>everything it needs</AccentText> to run

---
horizontal: center
---

# How Containers Are Isolated

Containers make use of Linux kenel features for isolation

<IconGrid>
<IconGridItem icon="view-off">

Namespaces: a private view of the system

</IconGridItem>
<IconGridItem icon="dashboard">

cgroups: limits on CPU and memory

</IconGridItem>
<IconGridItem icon="security">

SELinux: a label that confines it

</IconGridItem>
<IconGridItem icon="locked">

seccomp: fewer kernel calls allowed

</IconGridItem>
</IconGrid>


---
layout: two-cols-header
leftWidth: 55
vertical: center
---

# Container Engines

::left::

- Docker
  - 2013
  - Client and server, with a daemon
- Podman
  - 2019, from Red Hat
  - Fork and exec, no daemon
  - Runs like a regular Linux process
- Both run standard images
  - OCI: Open Container Initiative

::right::

![](./assets/shipping-containers.webp)

<div class="text-xs">

Photograph by [Alf van Beem](https://commons.wikimedia.org/wiki/User:Alfvanbeem), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Different_colored_containers_pic2.JPG)

</div>

---

# Installing Podman and Running a Container

```bash
sudo dnf install -y podman
```

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ podman -v
podman version 5.4.0
student@servera:~$ podman run registry.access.redhat.com/ubi10/ubi echo Hello
Trying to pull registry.access.redhat.com/ubi10/ubi:latest...
Getting image source signatures
Checking if image destination supports signatures
Copying blob 6cbfcbeb6614 done   |
Copying config 7474288886 done   |
Writing manifest to image destination
Storing signatures
Hello
```

</TerminalWindow>

The first run downloads the image, and the container stops when its command ends

---
layout: exercise
---

# Run Your First Container

::goal::

See what a container brings with it and what it shares with its host

::environment::

**Host:** `servera`

::workflow::

1. Install Podman
2. Check the Podman version
3. Compare the RHEL release in a UBI 10 container and on `servera`
4. Compare the kernel in a UBI 10 container and on `servera`

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/run-your-first-container-exercise.cast?url";
</script>

# Run Your First Container

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing podman on servera with dnf, checking its version, running cat /etc/redhat-release in a UBI 10 container and on servera to compare their releases, and running uname -r in both to show the container uses servera's kernel."
/>

::resources::

<a href="../resources/run-your-first-container-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Run Your First Container exercise in a new tab">Written exercise</a>
