---
layout: section
routeAlias: logical-volume-manager
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "11"
        title: Managing Storage with Logical Volume Manager
    rhcsaCertGuide:
      - chapter: "15"
        title: Managing Logical Volumes
---

# Logical Volume Manager (LVM)

---
layout: two-cols-header
leftWidth: 60
listSpacing: padded
---

# What Is LVM?

::left::

**Logical Volume Manager** is a storage abstraction layer

<div>

### Why use LVM?

- Resize volumes **without downtime**
- **Combine** several disks into one mount point
- **Replace** a failing disk without downtime
- Consistent storage device names across servers

</div>

::right::

![](./assets/lvm-storage-illustration.placeholder.jpg)

---
layout: two-cols-header
vertical: center
listSpacing: padded
leftWidth: 60
---

# LVM: Three Layers

::left::

- <AccentText hue="blue">Physical Volume (PV)</AccentText>
    - A storage device initialized for LVM
- <AccentText hue="teal">Volume Group (VG)</AccentText>
    - A storage pool built from one or more <AccentText hue="blue">PVs</AccentText>
- <AccentText hue="slate">Logical Volume (LV)</AccentText>
    - A flexible slice of a <AccentText hue="teal">VG</AccentText> that you format and mount

::right::

```mermaid {scale: 0.72}
%%{init: {"flowchart": {"rankSpacing": 24, "nodeSpacing": 24}}}%%
flowchart BT
    D1@{ icon: "carbon:vmdk-disk", form: "square", label: "Disk", pos: "b" }
    D2@{ icon: "carbon:vmdk-disk", form: "square", label: "Disk", pos: "b" }
    D3@{ icon: "carbon:vmdk-disk", form: "square", label: "Disk", pos: "b" }
    PV1[(Physical Volume)]
    PV2[(Physical Volume)]
    PV3[(Physical Volume)]
    VG[("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Volume Group&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")]
    LV1[(Logical Volume)]
    LV2[(Logical Volume)]
    FS1[("File system<br/>/home")]
    FS2[("File system<br/>/")]
    D1 --- PV1
    D2 --- PV2
    D3 --- PV3
    PV1 --- VG
    PV2 --- VG
    PV3 --- VG
    VG --- LV1
    VG --- LV2
    LV1 --- FS1
    LV2 --- FS2
    classDef disk fill:#ffffff,stroke:#55555b
    classDef other fill:#ffffff,stroke:#9aa4ad,color:#25252b
    classDef pv fill:#d3e4f9,stroke:#3584e4,stroke-width:2px,color:#25252b
    classDef vg fill:#cee7eb,stroke:#2190a4,stroke-width:2px,color:#25252b
    classDef lv fill:#dfe4e8,stroke:#6f8396,stroke-width:2px,color:#25252b
    class D1,D2,D3 disk
    class FS1,FS2 other
    class PV1,PV2,PV3 pv
    class VG vg
    class LV1,LV2 lv
```

---
horizontal: center
---

# LVM Commands

These commands manage each layer in the LVM stack

| Layer                                                    | Create     | Summary | Details     | Remove     |
|----------------------------------------------------------|------------|---------|-------------|------------|
| <AccentText hue="blue">Physical volume (PV)</AccentText> | <AccentText hue="blue" code normal>pvcreate</AccentText> | <AccentText hue="blue" code normal>pvs</AccentText> | <AccentText hue="blue" code normal>pvdisplay</AccentText> | <AccentText hue="blue" code normal>pvremove</AccentText> |
| <AccentText hue="teal">Volume group (VG)</AccentText>    | <AccentText hue="teal" code normal>vgcreate</AccentText> | <AccentText hue="teal" code normal>vgs</AccentText> | <AccentText hue="teal" code normal>vgdisplay</AccentText> | <AccentText hue="teal" code normal>vgremove</AccentText> |
| <AccentText hue="slate">Logical volume (LV)</AccentText> | <AccentText hue="slate" code normal>lvcreate</AccentText> | <AccentText hue="slate" code normal>lvs</AccentText> | <AccentText hue="slate" code normal>lvdisplay</AccentText> | <AccentText hue="slate" code normal>lvremove</AccentText> |

Type <AccentText hue="blue" code>pv</AccentText>, <AccentText hue="teal" code>vg</AccentText>, or <AccentText hue="slate" code>lv</AccentText> and press <kbd>Tab</kbd> twice to list the rest

---
horizontal: center
vertical: center
clicks: 2
---

# LVM Commands

<div class="h-[1lh] overflow-hidden text-4xl leading-[1.3]" aria-hidden="true">
<div v-motion :initial="{ y: '0%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-1="{ y: '-33.3333%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-2="{ y: '-66.6667%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }">
<div><AccentText hue="blue">Physical Volume</AccentText></div>
<div><AccentText hue="teal">Volume Group</AccentText></div>
<div><AccentText hue="slate">Logical Volume</AccentText></div>
</div>
</div>

<div class="grid grid-cols-3 gap-x-16 gap-y-2 mt-8 text-center">
<div aria-hidden="true">Create</div>
<div aria-hidden="true">Details</div>
<div aria-hidden="true">Remove</div>
<div aria-hidden="true"><div class="text-5xl leading-[1.3] font-mono font-bold"><span class="inline-block h-[1lh] overflow-hidden align-bottom"><span class="flex flex-col" v-motion :initial="{ y: '0%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-1="{ y: '-33.3333%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-2="{ y: '-66.6667%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }"><AccentText hue="blue" code>pv</AccentText><AccentText hue="teal" code>vg</AccentText><AccentText hue="slate" code>lv</AccentText></span></span>create</div></div>
<div aria-hidden="true"><div class="text-5xl leading-[1.3] font-mono font-bold"><span class="inline-block h-[1lh] overflow-hidden align-bottom"><span class="flex flex-col" v-motion :initial="{ y: '0%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-1="{ y: '-33.3333%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-2="{ y: '-66.6667%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }"><AccentText hue="blue" code>pv</AccentText><AccentText hue="teal" code>vg</AccentText><AccentText hue="slate" code>lv</AccentText></span></span>display</div></div>
<div aria-hidden="true"><div class="text-5xl leading-[1.3] font-mono font-bold"><span class="inline-block h-[1lh] overflow-hidden align-bottom"><span class="flex flex-col" v-motion :initial="{ y: '0%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-1="{ y: '-33.3333%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }" :click-2="{ y: '-66.6667%', transition: { type: 'tween', duration: 500, ease: 'easeInOut' } }"><AccentText hue="blue" code>pv</AccentText><AccentText hue="teal" code>vg</AccentText><AccentText hue="slate" code>lv</AccentText></span></span>remove</div></div>
<p class="sr-only">Physical volumes: pvcreate, pvdisplay, pvremove. Volume groups: vgcreate, vgdisplay, vgremove. Logical volumes: lvcreate, lvdisplay, lvremove. Only the first two letters change.</p>
</div>

