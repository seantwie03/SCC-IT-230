---
layout: section
routeAlias: installing-rhel
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "16"
        title: Installing Red Hat Enterprise Linux
    rhcsaCertGuide:
      - chapter: "01"
        title: Installing Red Hat Enterprise Linux
  exercises:
    - title: Install RHEL Manually Exercise
      source: ./exercises/install-rhel-manually-exercise.html
---

# Installing Red Hat Enterprise Linux (RHEL)

---
vertical: start
---

# Create the Virtual Machine

<v-switch at="1">

<template #0>

Name it `serverc` in `C:\Temp\VMs\IT-230\IT-230`, choose the DVD ISO, and leave **Proceed with Unattended Installation** unchecked

<div class="[&_img]:h-[300px] [&_img]:mx-auto">

![VirtualBox's New Virtual Machine wizard with the name serverc and the RHEL 10.0 DVD ISO selected](./assets/vm-name-and-iso.png)

</div>

</template>

<template #1>

Give it 2048 MB of memory and 2 CPUs, and leave **Use EFI** unchecked

<div class="[&_img]:h-[300px] [&_img]:mx-auto">

![The wizard's virtual hardware section, with the memory and CPU sliders and the Use EFI checkbox](./assets/vm-hardware.png)

</div>

</template>

<template #2>

Create a new 10 GB virtual hard disk

<div class="[&_img]:h-[300px] [&_img]:mx-auto">

![The wizard's virtual hard disk section, creating a new 10 GB VDI disk](./assets/vm-hard-disk.png)

</div>

</template>

<template #3>

In **Settings**, then **Network**, leave Adapter 1 on NAT and attach Adapter 2 to the Internal Network `intnet`

<div class="[&_img]:h-[300px] [&_img]:mx-auto">

![The Network settings for Adapter 2, attached to Internal Network with the name intnet](./assets/vm-adapter-2.png)

</div>

</template>

</v-switch>

---

# The Boot Menu

Select **Install Red Hat Enterprise Linux 10.0** now: it loads slowly on the VDI, so it runs while we go through the slides

![The RHEL 10.0 boot menu, with Install Red Hat Enterprise Linux 10.0 highlighted](./assets/boot-menu.png)

---
layout: two-cols-header
leftWidth: 55
---

# Download Installation Media

<https://developers.redhat.com/products/rhel/download>

::left::

### Boot ISO

- The installer only, much smaller
- Needs a network to download packages

### DVD ISO

- The installer and every package, about 8 GiB
- No network needed; use it for the lab

::right::

![](./assets/installation-disc.webp)

::bottom::

<Callout>

Write the ISO to a USB drive, or attach it to a virtual machine as a virtual CD-ROM

</Callout>

---
layout: two-cols-header
leftWidth: 62
---

# Installation Summary

::left::

![The Installation Summary screen, with Localization, Software, System, and User Settings items](./assets/installation-summary.png)

::right::

- The hub: every setting is reached from here
- A warning triangle marks an item you must complete
- Nothing is written to disk until <AccentText>Begin Installation</AccentText>

---

# The Installation Summary Hub

<div class="grid grid-cols-3 items-center gap-y-2 [&_img]:w-[130px] [&_img]:h-[82px] [&_img]:object-contain [&_img]:mx-auto [&_p]:my-1">

<div class="text-center">

![](./assets/time-and-date.png)

Time & Date

</div>

<div></div>

<div class="text-center">

![](./assets/network-host-name.png)

Network & Host Name

</div>

<div class="text-center">

![](./assets/software-selection.png)

Software Selection

</div>

<div class="text-center [&_img]:!w-[190px] [&_img]:!h-[142px]">

![Installation Summary](./assets/installation-summary.png)

</div>

<div class="text-center">

![](./assets/root-account.png)

Root Account

</div>

<div class="text-center">

![](./assets/installation-destination.png)

Installation Destination

</div>

<div></div>

<div class="text-center">

![](./assets/create-user.png)

User Creation

</div>

</div>

<div aria-hidden="true">

<Arrow x1="276" y1="130" x2="387" y2="245" two-way color="var(--it230-color-accent-fill)" />
<Arrow x1="276" y1="282" x2="387" y2="282" two-way color="var(--it230-color-accent-fill)" />
<Arrow x1="276" y1="419" x2="387" y2="337" two-way color="var(--it230-color-accent-fill)" />
<Arrow x1="593" y1="245" x2="704" y2="130" two-way color="var(--it230-color-accent-fill)" />
<Arrow x1="593" y1="282" x2="704" y2="282" two-way color="var(--it230-color-accent-fill)" />
<Arrow x1="593" y1="337" x2="704" y2="419" two-way color="var(--it230-color-accent-fill)" />

</div>

---

# Standard Partitions

**Automatic** storage uses LVM and picks the sizes; **Custom** lets you choose

| Mount point | Size     | File system |
|-------------|----------|-------------|
| biosboot    | 1 MiB    | BIOS Boot   |
| `/boot`     | 1 GiB    | xfs         |
| swap        | 1 GiB    | swap        |
| `/`         | The rest | xfs         |

---
layout: two-cols-header
leftWidth: 60
---

# Root Account

::left::

### RHEL 10 disables `root` by default

Admins use `sudo` instead

<v-click>

### Enable it for the lab

Select **Enable root account** and set the lab password, `redhat`

SSH refuses password logins as `root` unless you also select **Allow root SSH login with password**

</v-click>

<v-click>

### Best practice

In production, leave `root` disabled and use a `wheel` administrator

</v-click>

::right::

![The Root Account screen with Enable root account selected and Allow root SSH login with password checked](./assets/root-account.png)

---
layout: two-cols-header
leftWidth: 40
---

# Install Settings for `serverc`

::left::

| Virtual machine | Value                          |
|-----------------|--------------------------------|
| RAM             | 2048 MB                        |
| vCPUs           | 2                              |
| Disk            | 10 GB                          |
| Adapter 1       | NAT                            |
| Adapter 2       | Internal Network `intnet`      |

::right::

| Operating system | Value                                 |
|------------------|---------------------------------------|
| Software         | Minimal Install                       |
| Time zone        | UTC                                   |
| `enp0s8`         | `172.25.250.12/24`, no gateway or DNS |
| Host name        | `serverc`                             |
| `root`           | Enabled, password `redhat`            |
| User             | `student` / `student`, administrator  |

---

# Installation Complete

![The Installation Progress screen reporting Complete, with a Reboot System button](./assets/install-complete.png)

---
vertical: start
---

# Verify the Installation

<v-switch at="1">

<template #0>

Log in on the console as `student`; `hostname` prints `serverc`

<div class="[&_img]:h-[110px] [&_img]:mx-auto">

![The serverc console: logging in as student, then hostname printing serverc](./assets/verify-hostname.png)

</div>

</template>

<template #1>

`ip addr`: `172.25.250.12/24` on `enp0s8`, and `10.0.2.15/24` from VirtualBox's NAT on `enp0s3`

<div class="[&_img]:h-[300px] [&_img]:mx-auto">

![ip addr output listing lo, enp0s3 with 10.0.2.15/24, and enp0s8 with 172.25.250.12/24](./assets/verify-ip-addr.png)

</div>

</template>

<template #2>

`lsblk`: four standard partitions on `sda`, and no LVM

<div class="[&_img]:h-[220px] [&_img]:mx-auto">

![lsblk output: sda with sda1 1M, sda2 1G on /boot, sda3 1G as swap, and sda4 8G on /](./assets/verify-lsblk.png)

</div>

</template>

</v-switch>

---
layout: exercise
---

# Install RHEL on `serverc`

::goal::

Install RHEL 10 by hand with standard partitions

::environment::

**Host:** a new VirtualBox virtual machine, `serverc`, on your VDI

**Requirement:** the RHEL 10.0 DVD ISO, `C:\Temp\VMs\IT-230\rhel-10.0-x86_64-dvd.iso`

::workflow::

1. Create the `serverc` virtual machine in VirtualBox
2. Boot it from the RHEL 10.0 DVD
3. Set the time zone and software selection
4. Create standard partitions for `/boot`, swap, and `/`
5. Configure the network and host name
6. Enable `root` and create the `student` administrator
7. Begin the installation and reboot
8. Verify with `hostname`, `ip addr`, and `lsblk`
