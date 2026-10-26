---
layout: section
routeAlias: lvm-practice
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "11"
        title: Managing Storage with Logical Volume Manager
    rhcsaCertGuide:
      - chapter: "15"
        title: Managing Logical Volumes
  exercises:
    - title: Create LVM Storage Exercise
      source: ./exercises/create-lvm-storage-exercise.html
    - title: Extend LVM Storage Exercise
      source: ./exercises/extend-lvm-storage-exercise.html
    - title: Remove LVM Storage Exercise
      source: ./exercises/remove-lvm-storage-exercise.html
---

# LVM Practice

---
vertical: start
---

# Procedure: Create a Logical Volume

<v-switch at="1">

<template #0>

### Step 1: Create a partition

```bash
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary 1MiB 512MiB
parted /dev/sdb set 1 lvm on
udevadm settle
```

</template>

<template #1>

### Step 2: Create a <AccentText hue="blue">physical volume</AccentText> from the partition

```bash
pvcreate /dev/sdb1
pvdisplay /dev/sdb1
```

</template>

<template #2>

### Step 3: Create a <AccentText hue="teal">volume group</AccentText> from the <AccentText hue="blue">PV</AccentText>

```bash
vgcreate vg01 /dev/sdb1
vgdisplay vg01
```

</template>

<template #3>

### Step 4: Create a <AccentText hue="slate">logical volume</AccentText> in the <AccentText hue="teal">VG</AccentText>

```bash
lvcreate --name lv01 --size 300M vg01
lvdisplay /dev/vg01/lv01
```

</template>

<template #4>

### Step 5: Create a file system on the <AccentText hue="slate">LV</AccentText>

```bash
mkfs.xfs /dev/vg01/lv01
```

</template>

<template #5>

### Step 6: Mount it persistently

```bash
mkdir /data
echo "/dev/vg01/lv01 /data xfs defaults 0 0" >> /etc/fstab
systemctl daemon-reload
mount /data
```

</template>

<template #6>

### Step 7: Add swap space on an <AccentText hue="slate">LV</AccentText>

```bash
lvcreate --name swap01 --size 200M vg01
mkswap /dev/vg01/swap01
echo "/dev/vg01/swap01 swap swap defaults 0 0" >> /etc/fstab
systemctl daemon-reload
swapon -a
```

</template>

</v-switch>

---
layout: exercise
---

# Create LVM Storage

::goal::

Pool two blank disks into one <AccentText hue="teal">volume group</AccentText> that holds a file system and swap space

::environment::

**Host:** `servera`

**Prerequisite exercise:** Remove the LVM Setup

::workflow::

1. Create an `lvm` partition using all of `/dev/sdb`, and another using all of `/dev/sdc`
2. Initialize both as <AccentText hue="blue">physical volumes</AccentText> and create a <AccentText hue="teal">volume group</AccentText> named `vg_storage` from them
3. Create a 1 GiB <AccentText hue="slate">logical volume</AccentText> named `lv_swap`, and one named `lv_records` from the rest of the space
4. Format `lv_records` with XFS and persistently mount it on `/records`
5. Format `lv_swap` as swap space and persistently activate it
6. Verify with `lsblk`, `df`, and `swapon --show`

---
vertical: start
---

# Procedure: Extend a Logical Volume

<v-switch at="1">

<template #0>

### Step 1: Create a <AccentText hue="blue">PV</AccentText> on the new disk

- Skip steps 1 and 2 if the <AccentText hue="teal">VG</AccentText> already has enough free extents

```bash
parted /dev/sdc mklabel gpt
parted /dev/sdc mkpart primary 1MiB 256MiB
parted /dev/sdc set 1 lvm on
udevadm settle
pvcreate /dev/sdc1
```

</template>

<template #1>

### Step 2: Add the <AccentText hue="blue">PV</AccentText> to the <AccentText hue="teal">VG</AccentText>

```bash
vgextend vg01 /dev/sdc1
```

</template>

<template #2>

### Step 3: Extend the <AccentText hue="slate">LV</AccentText>

```bash
lvextend --size +100M /dev/vg01/lv01
```

</template>

<template #3>

### Step 4: Grow the file system

XFS: `xfs_growfs` takes the mount point

```bash
xfs_growfs /data
```

ext4: `resize2fs` takes the device

```bash
resize2fs /dev/vg01/lv01
```

</template>

<template #4>

### Step 4, alternative: Grow the file system with the <AccentText hue="slate">LV</AccentText>

```bash
lvextend --resizefs --size +100M /dev/vg01/lv01
```

</template>

<template #5>

### For a swap <AccentText hue="slate">LV</AccentText>: extend it with the swap off

```bash
swapoff /dev/vg01/swap01
lvextend --size +100M /dev/vg01/swap01
mkswap /dev/vg01/swap01
swapon /dev/vg01/swap01
```

</template>

</v-switch>

---
layout: exercise
---

# Extend LVM Storage

::goal::

Grow a file system and swap space onto a third disk

::environment::

**Host:** `servera`

**Prerequisite exercise:** Create LVM Storage

::workflow::

1. Create an `lvm` partition using all of `/dev/sdd` and add it to `vg_storage`
2. Extend `lv_swap` by 1 GiB
3. Extend `lv_records` with the rest of the free space and grow its file system
4. Verify with `vgs`, `df`, and `swapon --show`

---
vertical: start
---

# Procedure: Remove LVM

Teardown order: **Swap off and unmount → <AccentText hue="slate">LV</AccentText> → <AccentText hue="teal">VG</AccentText> → <AccentText hue="blue">PV</AccentText>**, the reverse of creation

<v-switch at="1">

<template #0>

### Step 1: Swap off, unmount, and remove the <AccentText hue="slate">LV</AccentText>s

```bash
swapoff /dev/vg01/swap01
umount /data
vim /etc/fstab    # Remove both entries
systemctl daemon-reload
lvremove /dev/vg01/lv01 /dev/vg01/swap01
```

</template>

<template #1>

### Step 2: Remove the <AccentText hue="teal">VG</AccentText> and <AccentText hue="blue">PV</AccentText>s

```bash
vgremove vg01
pvremove /dev/sdb1 /dev/sdc1
```

</template>

<template #2>

### Step 3: Wipe the disks

```bash
wipefs --all /dev/sdb /dev/sdc
```

</template>

</v-switch>

---
layout: exercise
---

# Remove LVM Storage

::goal::

Return all three disks to blank

::environment::

**Host:** `servera`

**Prerequisite exercise:** Extend LVM Storage

::workflow::

1. Deactivate the swap space and unmount `/records`
2. Remove both entries from `/etc/fstab`
3. Remove both <AccentText hue="slate">logical volumes</AccentText>, the <AccentText hue="teal">volume group</AccentText>, and the three <AccentText hue="blue">physical volumes</AccentText>
4. Wipe `/dev/sdb`, `/dev/sdc`, and `/dev/sdd`
