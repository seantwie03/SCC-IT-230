---
layout: section
routeAlias: partitions
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "10"
        title: Managing Basic Storage
    rhcsaCertGuide:
      - chapter: "14"
        title: Managing Storage
  exercises:
    - title: Create Two GPT Partitions Exercise
      source: ./exercises/create-two-gpt-partitions-exercise.html
    - title: Create Five MBR Partitions Exercise
      source: ./exercises/create-five-mbr-partitions-exercise.html
---

# Partitions

---

# Storage Device Names

The Linux kernel gives each storage device a file

| Disk type                                       | Device         | First partition  |
|-------------------------------------------------|----------------|------------------|
| SCSI, SATA, and USB disks, and VirtualBox disks | `/dev/sda`     | `/dev/sda1`      |
| Virtual disks in KVM virtual machines           | `/dev/vda`     | `/dev/vda1`      |
| NVMe solid-state drives                         | `/dev/nvme0n1` | `/dev/nvme0n1p1` |

The letter counts disks: `sda` is the first disk, `sdb` is the second disk, etc. (Except NVMe)


---
layout: two-cols-header
leftWidth: 59
---

# Partitions

::left::

Split a hard drive into sections

<v-click>

### <SuccessText>Pro:</SuccessText> Isolation

- The system will crash if the root (`/`) partition fills up
    - Prevent by putting `/var` on a separate partition
- Keep the OS files separate from user files

</v-click>

<v-click>

### <DangerText>Con:</DangerText> Inflexible

- Plan ahead: partitions are hard to resize later
- Space is wasted when a partition is sized too large

</v-click>

::right::

![An illustration of an open hard drive whose platter is divided into four colored sections](./assets/hard-drive-platter.webp)

---
layout: two-cols-header
vertical: start
horizontal: center
---

# Two Partition Types

::left::

## Master Boot Record (MBR)

The older standard

<div class="w-[270px]">

![The PhoenixBIOS Setup Utility on a laptop screen: keyboard-driven text menus in blue and grey](./assets/bios-setup-screen.jpg)

</div>

<div class="text-xs">

Photograph by [Ekrem Canli](https://commons.wikimedia.org/wiki/User:HylgeriaK), cropped, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gericom_1st_Supersonic_M6T_BIOS.jpg)

</div>

Used mostly with BIOS firmware

::right::

<v-click>

## GUID Partition Table (GPT)

The modern standard

<div class="w-[270px]">

![An ASUS UEFI BIOS Utility screen: a graphical interface with tabs, drop-down menus, a hardware monitor, and a mouse pointer](./assets/uefi-setup-screen.png)

</div>

<div class="text-xs">

Screenshot by 10kvsgp, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Precision_Boost_Overdrive_settings.png)

</div>

Used mostly with UEFI firmware

</v-click>

---
horizontal: center
---

# Master Boot Record (MBR)

<IconGrid
  :items="[
    { icon: 'time', caption: 'An older scheme, from 1983' },
    { icon: 'ruler', caption: 'Disks up to 2 TiB' },
    { icon: 'warning-alt', caption: 'One partition table, no copy' },
    { icon: 'chip', caption: 'Used with BIOS firmware' },
    { icon: 'partition-collection', caption: 'Only four primary partitions' },
    { icon: 'add-alt', caption: 'Extended partitions hold more' },
  ]"
/>

---

# Creating 6 Partitions on MBR

Partition 1-3 are <AccentText>Primary</AccentText> partitions

Partition 4 is a <AccentText>Extended</AccentText> partition

The <AccentText>Extended</AccentText> partition can contain several <AccentText>Logical</AccentText> partitions inside

```mermaid {scale: 1.1}
block-beta
  columns 12
  mbr["MBR"]:1
  p1["sdb1"]:2
  p2["sdb2"]:2
  p3["sdb3"]:2
  ext["sdb4 (extended)"]:4
  space:8
  l5["sdb5"]:2
  l6["sdb6"]:2
  space:1
  classDef table fill:#ebebed,stroke:#9aa4ad,color:#25252b
  classDef part fill:#e1edfb,stroke:#3584e4,color:#25252b
  classDef ext fill:#ffffff,stroke:#3584e4,stroke-dasharray:4 3,color:#25252b
  classDef free fill:#ffffff,stroke:#9aa4ad,stroke-dasharray:4 3,color:#55555b
  class mbr table
  class p1,p2,p3,l5,l6 part
  class ext ext
```

---
horizontal: center
---

# GUID Partition Table (GPT)

<IconGrid
  :items="[
    { icon: 'partition-collection', caption: 'Up to 128 partitions' },
    { icon: 'ruler', caption: 'Disks up to 8 ZiB' },
    { icon: 'copy', caption: 'Two copies of the partition table' },
    { icon: 'chip', caption: 'Works with UEFI firmware' },
    { icon: 'fingerprint-recognition', caption: 'A Globally Unique ID (GUID) for each disk and partition' },
  ]"
/>

```mermaid {scale: 1.1}
block-beta
  columns 12
  pgpt["Primary GPT"]:2
  g1["sdb1"]:1
  g2["sdb2"]:1
  g3["sdb3"]:1
  g4["sdb4"]:1
  g5["sdb5"]:1
  free1["free"]:3
  bgpt["Backup GPT"]:2
  classDef table fill:#ebebed,stroke:#9aa4ad,color:#25252b
  classDef part fill:#e1edfb,stroke:#3584e4,color:#25252b
  classDef free fill:#ffffff,stroke:#9aa4ad,stroke-dasharray:4 3,color:#55555b
  class pgpt,bgpt table
  class g1,g2,g3,g4,g5 part
  class free1 free
```

---
horizontal: center
---

# Why Two Sets of Units

<IconGrid
  clicks
  :items="[
    { icon: 'data-base', caption: 'Decimal: 1 KB is 1000 bytes, the way drive makers count' },
    { icon: 'chip', caption: 'Binary: 1 KB is 1024 bytes, the power of 2 closest to 1000' },
    { icon: 'warning-alt', caption: 'The same names, KB, MB, and GB, for two different sizes' },
  ]"
/>

<v-click>

In 1998 the binary units got names of their own

| Binary prefix | kibi        | mebi        | gibi        | tebi        |
|---------------|-------------|-------------|-------------|-------------|
| Short for     | kilo binary | mega binary | giga binary | tera binary |
| Symbol        | KiB         | MiB         | GiB         | TiB         |

</v-click>

---
vertical: center
---

# Disk Size Units

| Decimal      |             Bytes | Binary        |             Bytes | Power of 2 |
|--------------|------------------:|---------------|------------------:|-----------:|
| KB, kilobyte |             1,000 | KiB, kibibyte |             1,024 |        2¹⁰ |
| MB, megabyte |         1,000,000 | MiB, mebibyte |         1,048,576 |        2²⁰ |
| GB, gigabyte |     1,000,000,000 | GiB, gibibyte |     1,073,741,824 |        2³⁰ |
| TB, terabyte | 1,000,000,000,000 | TiB, tebibyte | 1,099,511,627,776 |        2⁴⁰ |

---

# Partitioning Tools

`lsblk` lists block devices: every disk, partition, and mount point

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ lsblk -p
NAME                              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
/dev/sda                            8:0    0   10G  0 disk
├─/dev/sda1                         8:1    0    1M  0 part
├─/dev/sda2                         8:2    0    1G  0 part /boot
└─/dev/sda3                         8:3    0    9G  0 part
  ├─/dev/mapper/rhel_servera-root 253:0    0    8G  0 lvm  /
  └─/dev/mapper/rhel_servera-swap 253:1    0    1G  0 lvm  [SWAP]
/dev/sdb                            8:16   0    5G  0 disk
/dev/sdc                            8:32   0    5G  0 disk
/dev/sdd                            8:48   0    5G  0 disk
/dev/sr0                           11:0    1 1024M  0 rom
/dev/sr1                           11:1    1  7.9G  0 rom  /mnt/dvd
```

</TerminalWindow>

---
layout: two-cols-header
listSpacing: padded
---

# Partitioning Tools

`parted`, the partition editor

::left::

- Create and manage partitions
  - Add, delete, and resize
- Supports both MBR (`msdos`) and GPT
- Two modes
  - Interactive mode
  - Command mode

::right::

![](./assets/partitioned-disk.webp)

---

# `parted` Command Mode

Create an MBR partition table and 1 partition in command mode

<TerminalWindow title="root@servera:~" :rows="15">

````md magic-move
```bash-session
root@servera:~# parted /dev/sdb mklabel msdos
Information: You may need to update /etc/fstab.
```
```bash-session
root@servera:~# parted /dev/sdb mklabel msdos
Information: You may need to update /etc/fstab.

root@servera:~# parted /dev/sdb mkpart primary xfs 1MiB 1GiB
Information: You may need to update /etc/fstab.
```
```bash-session
root@servera:~# parted /dev/sdb mklabel msdos
Information: You may need to update /etc/fstab.

root@servera:~# parted /dev/sdb mkpart primary xfs 1MiB 1GiB
Information: You may need to update /etc/fstab.

root@servera:~# parted /dev/sdb print
Model: ATA QEMU HARDDISK (scsi)
Disk /dev/sdb: 5369MB
Sector size (logical/physical): 512B/512B
Partition Table: msdos
Disk Flags:

Number  Start   End     Size    Type     File system  Flags
 1      1049kB  1074MB  1073MB  primary
```
````

</TerminalWindow>

---

# `parted` Interactive Mode

Create an MBR partition table and 1 partition in interactive mode

<TerminalWindow title="root@servera:~" :rows="13">

````md magic-move
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted)
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type?
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted)
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended?
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]?
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start?
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
End?
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
End? 1GiB
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
End? 1GiB
(parted)
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
End? 1GiB
(parted) quit
```
```bash-session
root@servera:~# parted /dev/sdb
GNU Parted 3.6
Using /dev/sdb
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel
New disk label type? msdos
(parted) mkpart
Partition type?  primary/extended? primary
File system type?  [ext2]? xfs
Start? 1MiB
End? 1GiB
(parted) quit
Information: You may need to update /etc/fstab.
```
````

</TerminalWindow>

---
layout: exercise
---

# Create Two GPT Partitions on `/dev/sdb`

::goal::

Partition a blank disk with a GPT label

::environment::

**Host:** `servera`

::workflow::

1. Inspect the storage device `/dev/sdb`
2. Create a `gpt` disk label
3. Create two partitions, 1 GiB each
4. Verify the partitions

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/create-two-gpt-partitions-exercise.cast?url";
</script>

# Create Two GPT Partitions on `/dev/sdb`

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor inspecting the blank /dev/sdb with lsblk and parted print, creating a gpt disk label in interactive parted, creating two 1 GiB partitions named data1 and data2, and verifying with lsblk that the partitions exist but have no file systems yet."
/>

::resources::

<a href="../resources/create-two-gpt-partitions-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Create Two GPT Partitions on /dev/sdb exercise in a new tab">Written exercise</a>

---
layout: exercise
---

# Create Five MBR Partitions on `/dev/sdc`

::goal::

Use an extended partition to get past MBR's four-partition limit

::environment::

**Host:** `servera`

::workflow::

1. Inspect the storage device `/dev/sdc`
2. Create an `msdos` disk label
3. Create three primary partitions, 500 MiB each
4. Create an extended partition in the remaining space
5. Create a 1 GiB logical partition inside it
6. Verify the partitions

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/create-five-mbr-partitions-exercise.cast?url";
</script>

# Create Five MBR Partitions on `/dev/sdc`

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating an msdos disk label on /dev/sdc in interactive parted, adding three 500 MiB primary partitions, an extended partition across the remaining space, and a 1 GiB logical partition inside it, verifying with lsblk that the logical partition is numbered 5, then wiping the partition table with wipefs."
/>

::resources::

<a href="../resources/create-five-mbr-partitions-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Create Five MBR Partitions on /dev/sdc exercise in a new tab">Written exercise</a>
