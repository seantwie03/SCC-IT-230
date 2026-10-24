# W11 - Port

## Prompt

Port w11 from `~/s/IT-230/w11` with the week-porting skill: read the Slidev
deck, the LibreOffice deck, the lesson plan, and the demonstrations, and
produce this plan. Nothing is built until the plan is approved.

## Answer in brief

**Eight topic fragments** in one chapter directory, **eight exercises**, and a
deck of **54 slides**: 41 from the source (39 content slides plus the cover and
VM reminder), 5 added slides (1.3a, 1.3b, 2.2a, 5.1a, and the new exercise
slide 7.3), and 8 recording slides that wait on the casts.

| # | Fragment                    | Section title                  | Slides | Exercises |
|--:|-----------------------------|--------------------------------|-------:|----------:|
| 1 | `logical-volume-manager.md` | Logical Volume Manager (LVM)   |      5 |         0 |
| 2 | `physical-volumes.md`       | Physical Volumes               |      7 |         1 |
| 3 | `volume-groups.md`          | Volume Groups                  |      8 |         1 |
| 4 | `logical-volumes.md`        | Logical Volumes                |      9 |         1 |
| 5 | `extending-lvm.md`          | Extending LVM                  |      6 |         1 |
| 6 | `removing-lvm.md`           | Removing LVM                   |      8 |         1 |
| 7 | `lvm-swap-space.md`         | Swap Space on Logical Volumes  |      4 |         1 |
| 8 | `lvm-practice.md`           | LVM Practice                   |      5 |         2 |
|   | Entry file                  |                                |      2 |           |
|   | **Total**                   |                                | **54** |     **8** |

Slide counts include the recording slides. The fragments follow the Slidev
deck's eight sections one for one. The LibreOffice deck contributes two concept
slides, a command table, and its disk icons and mount points in the rebuilt
layers diagram. Its second half, Stratis, is RHEL 9 material that RHEL 10's
RH134 no longer teaches, and is not ported (Decision 8).

Three things to know before approving:

1. **Exercise 6 stops at a question.** Exercise 5's teardown leaves the old
   ext4 signature on the disk, so exercise 6's `lvcreate` asks "Wipe it?
   [y/n]" (verified). The command file answers `y`, and the written exercise
   explains why. The source's other facts checked out; see "Verification".
2. **One unsourced image.** The isometric storage illustration on the ODP's
   "Logical Volume Management" slide has no recorded source and looks
   AI-generated. It goes in as a placeholder and is replaced before
   publication (Decision 10). The layers diagram is rebuilt as our own Mermaid
   diagram (Decision 9).
3. **Exercise 1 asks for a partition flag no slide teaches.** Addition 2.2a,
   accepted on 2026-10-24, introduces it (Decision 11).

## Scope

The lesson plan's agenda is one line, "Manage Advanced Storage with LVM". It
assigns RHA chapter 11 section 07 and SCC Lab chapter 11 lab 01, and the
optional *RHCSA Cert Guide* chapter 15.

The source material is in `~/s/IT-230/w11/slides/`:

- **Slidev Markdown:** `slides.md` (cover and VM reminder) and
  `managing_storage_with_lvm.md` (39 slides, eight sections, seven exercise
  slides, no demo slides). It is this year's conversion, with command output
  on the single-command slides and commands only on the procedure slides.
- **LibreOffice deck:** `ManageStorageStack.odp` (24 slides), last year's deck
  as taught. Slides 1 to 13 are LVM: two drawn flow diagrams, two command
  tables on a stock-photo background, two exercises, and their asciinema links
  and GIFs. Slides 14 to 24 are Stratis. It has no command slides and no
  presenter notes beyond slide numbers.
- **`slides/public/installing_rhel/`** holds w10's installer screenshots. The
  w11 deck does not reference them.

The demonstrations are seven `kitty-demo` command files in
`demonstrations/managing_storage_with_lvm/`, one per Slidev exercise slide.

The curriculum is RH134 chapter 11, *Managing Storage with Logical Volume
Manager*, and *RHCSA Cert Guide* chapter 15, *Managing Logical Volumes*.
Nothing from either is copied. Three RH134 topics have no source slide and no
proposed addition, to save time: replacing a physical volume (`pvmove` and
`vgreduce`), extending a swap logical volume, and `fsadm`. The Cert Guide's
objectives for chapter 15 (create and remove PVs, assign PVs to VGs, create
and delete LVs, extend LVs) are all covered.

## Port fidelity

Source slides are numbered by file. **L1 to L39** are
`managing_storage_with_lvm.md` in order, and **O1 to O24** are
`ManageStorageStack.odp`. Planned slides are numbered by fragment, such as 3.4,
following the Slidev deck. A slide this repository adds carries a letter, such
as 2.2a, so the source numbering never moves.

The source order is kept slide for slide. Nothing is split, merged, reordered,
or dropped in this plan except where a heading says "propose", and each
proposal is listed again under "Decisions".

Every em dash in the source copy is rewritten.

## Combining the two source decks

Proposed (Decision 7), following what w10 settled on 2026-10-17:

- **The Slidev deck supplies the sequence, the command slides, and all seven
  exercises.** Its sections become the fragments.
- **The ODP supplies concept slides.** Its "LVM Components - Create" table
  becomes 1.3a, the twelve create, inspect, and remove commands at once,
  followed by an animation (1.3b) showing they are one pattern. Its
  "Extend Logical Volume" diagram and "LVM Components - Extend" table become
  5.1a, the section intro the Slidev deck's Extending section lacks. Its
  "Layers" slide adds disks under the physical volumes and mount points over
  the file systems, which the rebuilt diagram carries (1.3).
- **The ODP's two exercises are not ported.** They used `vg1`, `lv1`,
  `/dev/sdc1`, `/dev/sdd1`, and `/mnt/evidence`; the Slidev deck's seven
  exercises cover the same ground in smaller steps.
- **Stratis is not ported** (O14 to O24, Decision 8). It was the second half of
  RHEL 9's RH134 chapter 8, *Manage Storage Stack* (`~/s/IT-230/9.3/`). RHEL
  10's chapter 11 is LVM only, and the RHEL 10 Cert Guide has no Stratis
  section (one practice-exam item still names it).

Forced changes, not choices:

- **Images that cannot be published as they are.** See "Third-party images".
- **Output that is not real.** L13's output carries hand-written comments and
  an inserted blank line. Every transcript is recaptured.
- **Theme expression.** The source's `<br />` spacers, `image-right` layout,
  `[[root@servera ~]#]` fence titles, and logo footer give way to the theme's
  layouts, `TerminalWindow`, plain `bash` fences, and footer.

## Sequencing and framing

- **W11 starts from the lab snapshot.** The instructor lab is reverted to its
  post-configuration snapshot between weeks, so it starts with blank `sdb`,
  `sdc`, and `sdd` and no LVM leftovers. Students start from w10's cleanups,
  which wipe `sdb` and `sdc`.
- **The exercises form one chain on `sdb` and `sdc`**: exercises 1 to 4 build
  and grow one stack, exercise 5 tears it down, exercises 6 and 7 build a
  second stack across both disks, and exercise 7's cleanup returns the disks
  and `/etc/fstab` to the week's starting state. See "Exercises".
- **Teardown leaves old signatures behind.** `pvremove` wipes only the LVM
  label and `wipefs --all` on the disk only the partition table, so the
  file system a removed LV held is still on the sectors. A new LV created
  over them makes `lvcreate` ask "Wipe it? [y/n]" (verified). Exercise 6 hits
  this after exercise 5, and students need to know the question is expected.
- **W10 taught "use the UUID, not the device file" for `/etc/fstab`.** This
  week's slides and exercises write `/dev/vg01/lv01` and `/dev/vg_data/lv_data`
  into `/etc/fstab`, as RH134 does. That is correct, because an LV path is a
  name the administrator chose and does not change between reboots, but
  students will notice the contradiction. Slide 4.5 says why (Decision 16).
- **W10 taught `swap` as the mount point field of a swap line** (Decision 32
  there). The source here writes `none`. Proposed: follow w10 (Decision 20).
- **W12 is the boot process.** Nothing in w11 depends on it. Exercise 7
  reboots, as w10's swap exercise did.

## Deck-level decisions

- **Entry file:** `course/w11-draft.md`, renamed to `course/w11.md` at
  publication.
- **Accent:** `purple` (Decision 3). Cool, which suits a Bash-heavy deck, and
  used once, in w03. Used so far: teal (w01, w06), blue (w02, w10), purple
  (w03), green (w04), slate (w05), pink (w07), yellow (w08). `red` is reserved
  for the Final; `orange` is unused but warm.
- **Title:** "Managing Storage with LVM", the source's own (Decision 4).
- **Cover agenda:** seven lines, one per fragment from 1 to 7 (Decision 5,
  accepted 2026-10-24). "LVM Practice" is left off the cover; the week page's
  agenda still lists it, since that comes from the topics.
- **Cover summary:**

  ```yaml
  courseInfo:
    summary: >-
      This week we will pool disks with the Logical Volume Manager, carve
      logical volumes from the pool, grow them while they stay mounted, put
      swap space on one, and take it all apart again.
  ```

- **VM reminder:** "Start `workstation` and `servera` on your VDI", as in w10
  (Decision 6). The source says "Start your VDI" and "Start Up the `servera`
  VM".
- **Chapter directory:**
  `course/chapters/rh134-ch11-managing-storage-with-logical-volume-manager/`.
- **Alignments:** every fragment aligns to RH134 chapter `"11"`, *Managing
  Storage with Logical Volume Manager*, and cert guide chapter `"15"`,
  *Managing Logical Volumes* (Decision 26). Fragment 7 is swap space, which w10
  aligned to chapter 10, but RH134 covers swap on an LV in chapter 11.

## Source-to-fragment map

From `managing_storage_with_lvm.md`:

| Source | Title                                     | Goes to |
|-------:|-------------------------------------------|---------|
|     L1 | Section: Managing Storage with LVM        | 1.1     |
|     L2 | What is LVM?                              | 1.2     |
|     L3 | LVM: Three Layers                         | 1.3     |
|     L4 | Section: Physical Volumes                 | 2.1     |
|     L5 | Physical Volumes (PVs)                    | 2.2     |
|     L6 | Initialize a Physical Volume              | 2.3     |
|     L7 | Inspect Physical Volumes                  | 2.4     |
|     L8 | Exercise: Initialize a Physical Volume    | 2.5     |
|     L9 | Section: Volume Groups                    | 3.1     |
|    L10 | Volume Groups (VGs)                       | 3.2     |
|    L11 | Create a Volume Group                     | 3.3     |
|    L12 | Inspect Volume Groups                     | 3.4     |
|    L13 | PE Fields from `pvdisplay`                | 3.5     |
|    L14 | Extend a Volume Group                     | 3.6     |
|    L15 | Exercise: Create a Volume Group           | 3.7     |
|    L16 | Section: Logical Volumes                  | 4.1     |
|    L17 | Logical Volumes (LVs)                     | 4.2     |
|    L18 | Create a Logical Volume                   | 4.3     |
|    L19 | Specifying LV Size                        | 4.4     |
|    L20 | LV Device Paths                           | 4.5     |
|    L21 | Inspect Logical Volumes                   | 4.6     |
|    L22 | Exercise: Create a Logical Volume         | 4.7     |
|    L23 | Procedure: Create a Logical Volume        | 4.8     |
|    L24 | Section: Extending LVM                    | 5.1     |
|    L25 | Extend a Logical Volume                   | 5.2     |
|    L26 | Aside: `dd`                               | 5.3     |
|    L27 | Exercise: Extend a Logical Volume         | 5.4     |
|    L28 | Section: Removing LVM                     | 6.1     |
|    L29 | Remove a Logical Volume                   | 6.2     |
|    L30 | Remove a Volume Group                     | 6.3     |
|    L31 | Remove a Physical Volume                  | 6.4     |
|    L32 | Removing LVM Components                   | 6.5     |
|    L33 | Wipe the Disk                             | 6.6     |
|    L34 | Exercise: Remove the LVM Setup            | 6.7     |
|    L35 | Section: Swap Space on Logical Volumes    | 7.1     |
|    L36 | Creating Swap Space on a Logical Volume   | 7.2     |
|    L37 | Section: Practice                         | 8.1     |
|    L38 | Exercise: Large LV Spanning Two Disks     | 8.2     |
|    L39 | Exercise: Persistent Swap on an LV        | 8.3     |

From `ManageStorageStack.odp`:

| Source   | Title                                 | Goes to             |
|---------:|---------------------------------------|---------------------|
|       O1 | Title: Manage Storage Stack           | the cover           |
|       O2 | Logical Volume Management (LVM)       | 1.2                 |
|       O3 | Layers                                | 1.3                 |
|       O4 | Create Logical Volume (flow diagram)  | not ported          |
|       O5 | LVM Components - Create (table)       | 1.3a, 1.3b, new     |
|       O6 | Exercise: Create a Logical Volume     | not ported          |
|   O7, O8 | Demo link and GIF                     | not ported          |
|       O9 | Extend Logical Volume (flow diagram)  | 5.1a, new           |
|      O10 | LVM Components - Extend (table)       | 5.1a, new           |
|      O11 | Exercise: Extend Logical Volume lv1   | not ported          |
| O12, O13 | Demo link and GIF                     | not ported          |
| O14..O24 | Stratis                               | not ported          |

O4's flow (device, PV, VG, LV, mount) is what 1.3's diagram and 4.8's steps
already show, so it is not proposed as a slide of its own. Say if you want it
back; it would sit before 4.8 as a Mermaid flowchart.

Slides with no source row: 1.3a, 1.3b, 2.2a, and 5.1a (additions), 7.3 (the swap
exercise the instructor asked for), and the eight recording slides 2.5a, 3.7a,
4.7a, 5.4a, 6.7a, 7.3a, 8.2a, and 8.3a.

## File inventory

New, under
`course/chapters/rh134-ch11-managing-storage-with-logical-volume-manager/`:

| File                        | Slides | Exercises |
|-----------------------------|-------:|----------:|
| `logical-volume-manager.md` |      5 |         0 |
| `physical-volumes.md`       |      7 |         1 |
| `volume-groups.md`          |      8 |         1 |
| `logical-volumes.md`        |      9 |         1 |
| `extending-lvm.md`          |      6 |         1 |
| `removing-lvm.md`           |      8 |         1 |
| `lvm-swap-space.md`         |      4 |         1 |
| `lvm-practice.md`           |      5 |         2 |

Plus `exercises/` with eight `.sh` command files, eight `.html` written
exercises, and eight `.cast` recordings, and `assets/` holding the one
placeholder (`lvm-storage-illustration.placeholder.jpg`) until it is replaced.

Also new: `course/w11-draft.md`. At publication, `tests/site.test.mjs` gains
`"w11"` in its published-week list.

Theme change (Decision 31): `AccentText` takes an optional `hue` naming a
palette hue, validated by `resolveHueTextColor` in `setup/accent.ts`, with
`tests/accent-text-hue.test.mjs`, a gallery line in `example.md`, and a
"Giving recurring terms a hue" section in `docs/design-system.md`. A separate
`HueText` component was built first and folded into `AccentText` at the
instructor's suggestion. Dev servers started before a theme component is
added must be restarted to see it.

## Third-party images

The Slidev deck references one image four times. The ODP embeds eleven
pictures. None is copied across as it stands.

**`lvm_layers_diagram.png` (L3, L5, L10, L17; also O3), no recorded source,
rebuild.** Three physical volumes, a volume group, two logical volumes, and
two file systems as grey cylinders joined by blue lines. It is neither RH134's
Figure 11.1 (a workflow SVG) nor the Cert Guide's Figure 15-1 (a cloud for the
volume group). Proposed (Decision 9): rebuild it as our own Mermaid
`flowchart BT` with cylinder nodes, adding O3's disks under the physical
volumes (Carbon icon shapes) and its mount points, `/home` and `/`, over the
file systems. No placeholder is needed. The same diagram then serves 1.3, 2.2,
3.2, and 4.2, with the layer each slide is about in its hue from the week's
color key (Decision 31) and the others white, so students see where they are
in the stack. 1.3 shows all three layers in their hues.

**`lvm_storage_illustration.png` and O2's 1024 by 1024 JPEG, no recorded
source, replace.** The same isometric illustration of coloured disk stacks
with garbled labels, which suggests an AI image generator; the PNG is a crop
of the JPEG. O15 (Stratis) reuses it. Proposed (Decision 10): a placeholder on
1.2, beside the "Why use LVM" list, replaced before publication by one of:

- an image the instructor generates with Gemini from a prompt written once the
  box is measured (decorative, empty alt text, no credit line), for example
  several small drives pouring into one large pool;
- a Wikimedia Commons image under CC BY or CC BY-SA, with a credit line;
- nothing, in which case 1.2 becomes a text slide or an `IconGrid` of the four
  reasons.

**`hard_drive_icon.png` (O3, O4, O9, and the Stratis slides), no recorded
source, not ported.** Carbon icon shapes in the Mermaid diagrams replace it.

**The molecule background (O5, O10), not ported.** A stock render used as
LibreOffice slide artwork.

**The paperwork photograph (O21), not ported** with the Stratis slides.

**GIFs and asciinema links (O7, O8, O12, O13, O19, O20, O23, O24), not
ported.** Casts replace them, per `docs/course-authoring.md`.

## Topic fragments

Each fragment opens with its `layout: section` slide, which carries the
`routeAlias` and `topicInfo`. A "fixed" `TerminalWindow` shows a transcript that
never changes and takes no `rows`. Every prompt takes the theme form,
`root@servera:~#`. Every transcript comes from one slide chain on `servera`
(see "Verification"), so device names, sizes, extent counts, and UUIDs agree
from slide to slide.

Slides use the generic names `vg01`, `lv01`, and `swap01`; exercises use
`vg_data`, `lv_data`, `vol_group1`, `srv_vol`, and `swap_vol`, as the source
does.

Where the source shows output, the slide shows recaptured output in a
`TerminalWindow`. Where it shows commands only, which is every procedure slide
(4.8, 5.2, 6.5, 7.2), the slide keeps a plain `bash` fence of commands, since
`docs/course-authoring.md` forbids a transcript that implies a command printed
nothing when its output was only left out (Decision 13). Two exceptions are
proposed under Decision 14.

### 1. `logical-volume-manager.md` (5 slides), built 2026-10-24

`routeAlias: logical-volume-manager`. Alignments: RH134 chapter 11, cert guide
chapter 15. No exercise. Built after the instructor accepted Decisions 9 to 11,
and checked with `check:entry` and `check:slides`; each slide was also
captured at 1920x1080. The entries below describe what shipped, and it waits on
the instructor's review.

##### 1.1 Logical Volume Manager (LVM)

Source L1 ("Managing Storage with Logical Volume Manager (LVM)"), shortened to
the noun (Decision 2). Section slide carrying the `topicInfo` alignments.

Components: `section`.

##### 1.2 What Is LVM?

Sources L2 and O2. Left column: "**Logical Volume Manager** is a storage
abstraction layer between physical devices and file systems", then "Why use
LVM?" over L2's four reasons: resize volumes **without downtime**;
**combine** several disks into one mount point; **replace** a failing disk
without downtime; consistent LV names across servers ("LV" in slate,
Decision 31). Right column: O2's
illustration as `assets/lvm-storage-illustration.placeholder.jpg` (Decision
10), with empty alt text as a decorative image, filling the column height.
`check:slides`: 38.45px clearance.

Components: `two-cols-header` with `leftWidth: 60` and `vertical: center`.
`center` keeps "Why use LVM?" near its list; the default spreads the three
items evenly and leaves the heading floating between them.

##### 1.3 LVM: Three Layers

Sources L3 and O3. Left column, a padded list with each term in bold and its
definition nested under it: **Physical Volume (PV)**, a storage device
initialized for LVM; **Volume Group (VG)**, a storage pool built from one or
more PVs; **Logical Volume (LV)**, a flexible slice of a VG that you format
and mount. The source's heading-and-paragraph pairs were tried first and read
wrongly: the theme leaves 24px under an `h3` and 16px under a paragraph, so
each definition sat closer to the next term than to its own.

Right column, the rebuilt layers diagram (Decision 9), bottom to top: three
disks (Carbon `vmdk-disk` icons labelled "Disk"), three PVs, one VG, two LVs,
and two file systems labelled "File system /home" and "File system /". The
three LVM layers use the week's color key (Decision 31): PVs blue, the VG
teal, LVs slate, each a 2px stroke in the hue's fill with a 22% fill; the file
systems and disks are white. The terms on the left, and "PVs" and "VG" in the
definitions, are `AccentText` in the same hues. A first version put
`/home` and `/` on nodes of their own above the file systems and overflowed
the slide by a whole row; folding them into the labels, setting Mermaid's
`rankSpacing` and `nodeSpacing` to 24 with an `init` directive, and a `scale`
of 0.72 left 28.84px of clearance with room for the icons to load.

Components: `two-cols-header` with `vertical: center` and `listSpacing:
padded`, Mermaid `flowchart BT` with cylinder nodes, Carbon icon shapes, and
`classDef` colours from the table in `docs/design-system.md`, and
`AccentText` with `hue`.

##### 1.3a LVM Commands

**Addition, from O5** (Decision 11, accepted 2026-10-24). The full table
comes first on purpose (instructor, 2026-10-24): twelve commands at once look
like a lot to remember, and 1.3b then shows that they are one pattern.
"These commands manage each layer in the LVM stack" (the instructor's wording),
over a table with a row per layer ("Physical volume (PV)", "Volume group
(VG)", "Logical volume (LV)") and a column per action (create, summary,
details, remove), holding the twelve commands from `pvcreate` to `lvremove`.
Each row, label and commands, is in its layer's hue (Decision 31). Closing line from the Cert Guide's tip: "Type `pv`,
`vg`, or `lv` and press Tab twice to list the rest". It previews the week:
fragments 2 to 4 create and inspect, fragment 6 removes. O5 arranged the same
twelve commands in three coloured rows. `check:slides`: 39.98px clearance.

Components: default layout with `horizontal: center`, Markdown table,
`<kbd>`, `AccentText` with `hue` on the layer names, on the commands (with
`code normal`, so they keep inline code's weight), and on the `pv`, `vg`, and
`lv` prefixes in the closing line.

##### 1.3b LVM Commands

**Addition, from O5, at the instructor's request (2026-10-24).** The relief
after 1.3a's table: an animation showing that the twelve commands are one
pattern, layer prefix plus action. The instructor first asked for it in place
of the table, which they called an eye test as a first view, then put the
table back first so the animation answers it. The layer name rolls at the top in its hue
("Physical Volume", "Volume Group", "Logical Volume"). Beneath it, three
columns headed Create, Details, and Remove each show a large command whose
prefix rolls (`pv`, `vg`, `lv`, in the same hues) while the ending stays still
(`create`, `display`, `remove`). Two clicks, one per layer; all four strips
move together in a 500 ms ease. The visible strips are hidden from screen
readers, and one sentence inside the grid gives them all nine commands and
says that only the first two letters change. `check:slides`: 218.14px
clearance in each click state. The endings first used UnoCSS `font-mono`, which
is the system monospace stack rather than the theme's Cascadia Mono, and with
`gap-x-16` the 244px columns were narrower than `pvdisplay` (253px in Cascadia
Mono), so the middle column wrapped. They now take `font-family:
var(--it230-font-mono)`, `whitespace-nowrap`, and `gap-x-8` (fixed 2026-10-24).

How it is built, since the theme has no component for it: each strip is a
column of three items inside a one-line window with `overflow: hidden`, moved
by `v-motion` with `:initial` at `y: '0%'` and `:click-1` and `:click-2` at
`-33.3333%` and `-66.6667%`, each with a `tween` transition. The slide sets
`clicks: 2`, because `v-motion` click states respond to clicks but do not
create them. A `v-switch` with `unmount` and a transition was tried first and
dropped: Slidev stops animating it after the first leave.

Components: default layout with `horizontal: center`, `vertical: center`,
and `clicks: 2`; `AccentText` with `hue`; UnoCSS utility classes for the
windows, the grid, and the sizes (`text-4xl` and `text-5xl`, each with
`leading-[1.3]`); `v-motion`; an `sr-only` paragraph.

### 2. `physical-volumes.md` (7 slides)

`routeAlias: physical-volumes`. Alignments: RH134 chapter 11, cert guide
chapter 15. Exercise: Initialize a Physical Volume Exercise.

##### 2.1 Physical Volumes

Source L4. Section slide.

Components: `section`.

##### 2.2 Physical Volumes (PVs)

Source L5. A block device (a partition, a whole disk, or RAID) initialized for
LVM use. "Why PVs are needed": LVM cannot use raw storage directly; creating a
PV gives the device a **UUID** and lets it join a volume group. On the right,
the layers diagram with the PV layer in blue and the others white (Decision
31). "PV" in the text is blue too.

Components: `two-cols-header`, Mermaid diagram.

##### 2.2a Prepare a Partition for LVM

**Addition, accepted 2026-10-24** (Decision 11). Exercise 1's first step asks
for "a 256 MiB GPT partition with the `lvm` flag", and no source slide shows
the flag until the procedure recap, 4.8, two sections later. W10 never showed
`parted`'s `set` command. The instructor chose to introduce flags here, on
their own terms, with no reference back to w10. "The `lvm` flag marks a
partition for LVM", then a
fixed `TerminalWindow`: `parted /dev/sdb set 1 lvm on` and `parted /dev/sdb
print`, whose Flags column reads `lvm` on both partitions (captured in round 1).
Closing line: the flag is a label, not a requirement; use it so people and
tools can see what the partition holds (Cert Guide chapter 15).

Verified: on GPT the flag changes the partition type from "Linux filesystem"
to "Linux LVM" (`lsblk -o PARTTYPENAME`), and `pvcreate` accepts an unflagged
partition without complaint. Interactive `parted`, as exercise 1 uses it,
asks `Partition number?`, `Flag to Invert?`, and `New state?  [on]/off?`
after `set`.

Components: default layout, fixed `TerminalWindow`.

##### 2.3 Initialize a Physical Volume

Source L6. "`pvcreate` creates a physical volume", over `pvcreate /dev/sdb1`
and its output; then "Create several at once" over `pvcreate /dev/sdb1
/dev/sdb2` as a command.

Components: default layout, fixed `TerminalWindow`, `bash` fence.

##### 2.4 Inspect Physical Volumes

Source L7, with its typo ("Physoical"). Two click states: `pvs`, a summary of
every PV (`sda3` in the OS volume group, `sdb1` and `sdb2` unassigned); then
`pvdisplay /dev/sdb1`, the detail of one new PV.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`.

##### 2.5 Exercise: Initialize a Physical Volume

Source L8.

- **Goal:** Prepare a partition on a blank disk for LVM
- **Environment:** **Host:** `servera`
- **Workflow:** 1. Create a 256 MiB GPT partition with the `lvm` flag on
  `/dev/sdb`; 2. Initialize `/dev/sdb1` as a physical volume; 3. Verify with
  `pvs` and `pvdisplay`

The source command file ends the partition at `256MiB`, which makes it 255
MiB; proposed: end it at `257MiB` (Decision 22). Either way the PV holds 63
extents, 252 MiB (verified), so nothing later changes.

Components: `exercise`.

##### 2.5a Exercise recording (pending)

**Addition.** Recording variant for `initialize-physical-volume-exercise.cast`,
added once the cast exists.

### 3. `volume-groups.md` (8 slides)

`routeAlias: volume-groups`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Create a Volume Group Exercise.

##### 3.1 Volume Groups

Source L9. Section slide.

Components: `section`.

##### 3.2 Volume Groups (VGs)

Source L10. A storage pool made of one or more PVs. "Why VGs are needed":
combines PVs into one block of storage; divides them into 4 MiB chunks called
**physical extents (PEs)**; the PE size can be set when the VG is created and
is the same on every PV in the VG. 4 MiB is the default (Cert Guide chapter
15). On the right, the layers diagram with the VG layer in teal and the others
white (Decision 31).

Components: `two-cols-header`, `AccentText` on the term, Mermaid diagram.

##### 3.3 Create a Volume Group

Source L11. "`vgcreate` pools one or more PVs", over `vgcreate vg01
/dev/sdb1` and its output; then "Create from several PVs" over `vgcreate vg01
/dev/sdb1 /dev/sdb2` as a command.

Components: default layout, fixed `TerminalWindow`, `bash` fence.

##### 3.4 Inspect Volume Groups

Source L12. Two click states: `vgs`, with the OS volume group and `vg01` (two
PVs, no LVs); then `vgdisplay vg01`, trimmed to the source's eight fields with
`...output omitted...` lines where fields are left out, in place of the
source's "Abridged Output" fence title.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`.

##### 3.5 Physical Extents in `pvdisplay`

Source L13. Its heading is an `h2` and its output is edited: comments typed
after four fields and a blank line inserted between them. Rebuilt as a
`TextExplainer` over the real `pvdisplay /dev/sdb1`, now that `sdb1` belongs to
`vg01`, stepping through the source's four comments: PE Size, the size of each
physical extent; Total PE, the extents on this PV; Free PE, the extents
available to allocate; Allocated PE, the extents already in use by LVs. Title
shortened from "Physical Extent (PE) Fields from `pvdisplay`".

Components: default layout, `TextExplainer` (four steps; size chosen by the
component, likely `sm`).

##### 3.6 Extend a Volume Group

Source L14. "`vgextend` adds a PV to an existing VG", "Adds capacity without
affecting mounted file systems", over a transcript of `pvcreate /dev/sdc1` and
`vgextend vg01 /dev/sdc1` with their output. The source shows only `vgextend`,
on a `sdc1` no slide has created; proposed: show the `pvcreate` too (Decision
15).

Components: default layout, fixed `TerminalWindow`.

##### 3.7 Exercise: Create a Volume Group

Source L15.

- **Goal:** Pool the new physical volume into a volume group
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Initialize
  a Physical Volume
- **Workflow:** 1. Create a volume group named `vg_data` using `/dev/sdb1`;
  2. Verify with `vgs` and `vgdisplay`

Components: `exercise`.

##### 3.7a Exercise recording (pending)

**Addition.** Recording variant for `create-volume-group-exercise.cast`.

### 4. `logical-volumes.md` (9 slides)

`routeAlias: logical-volumes`. Alignments: RH134 chapter 11, cert guide
chapter 15. Exercise: Create a Logical Volume Exercise.

##### 4.1 Logical Volumes

Source L16. Section slide.

Components: `section`.

##### 4.2 Logical Volumes (LVs)

Source L17, with its typo ("Partiton"). A flexible block device, created from
free PEs in the VG; the OS sees just another block device, like a partition or
disk. "Why LVs are needed": the size is not bound to one disk, because an LV is
made of extents; resize **without unmounting**, growing a file system while it
is in use. On the right, the layers diagram with the LV layer in slate and the
others white (Decision 31).

Components: `two-cols-header`, Mermaid diagram.

##### 4.3 Create a Logical Volume

Source L18. "`lvcreate` creates an LV from free extents in a VG", "Create a
100 MiB LV" over `lvcreate --name lv01 --size 100M vg01` and its output; then
"Use all remaining free extents" over `lvcreate --name lv01 --extents 100%FREE
vg01` as a command.

Components: default layout, fixed `TerminalWindow`, `bash` fence.

##### 4.4 Specifying LV Size

Source L19. Two click states, each a table of form and meaning. First,
`-l` / `--extents`, a count or percentage of extents: `32` (exactly 32
extents, 128 MiB at 4 MiB each), `+50` (50 more), `100%FREE` (every free
extent in the VG). Then `-L` / `--size`, in units: `300M`, `2G`, `+500M`. A
`Callout` closes the second state: `M` is MiB and `G` is GiB, and LVM rounds a
size up to the next extent (RH134).

Two fixes (Decision 17): the `+` rows add to an existing LV, so they belong to
`lvextend`, which fragment 5 uses; the slide labels them so. And the table
says "LEs" without defining them; a line above it says that an LV's
**logical extents** map one to one onto physical extents (RH134).

Components: default layout, `v-switch at="1"` with two templates, Markdown
tables, `Callout`.

##### 4.5 LV Device Paths

Source L20. "LVM creates two equivalent paths for every LV", over the source's
table: `/dev/vgname/lvname` (`/dev/vg01/lv01`) and `/dev/mapper/vgname-lvname`
(`/dev/mapper/vg01-lv01`). Then, proposed (Decision 16): `ls -l` on both
paths, showing that both are links to the same `dm-` device (the Cert Guide's
example 15-7 does the same), and the line "An LV path never changes between
reboots, so `/etc/fstab` can use it in place of a UUID" (RH134: mount an LV by
name or by UUID), which settles the contradiction with w10's best practice.

Components: default layout, Markdown table, fixed `TerminalWindow`.

##### 4.6 Inspect Logical Volumes

Source L21. Two click states: `lvs`, listing the OS volumes `root` and `swap`
and `lv01` at 100 MiB; then `lvdisplay /dev/vg01/lv01`, trimmed as on 3.4.
`lvs` prints about 85 columns; to check for overflow.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`.

##### 4.8 Procedure: Create a Logical Volume

Source L23, which follows the exercise in the source. Proposed: move it ahead
of 4.7, so the section ends with its exercise and students see the whole
procedure, including the `mkfs` and `/etc/fstab` steps, before they need it
(Decision 12). Six click states, each a heading, two short lines where the
source has them, and a `bash` fence:

1. Create a partition: `parted /dev/sdb mklabel gpt`, `mkpart primary 1MiB
   512MiB`, `set 1 lvm on`, `udevadm settle`, with the note that `udevadm
   settle` waits until the new partition's device file exists
2. Create the PV: `pvcreate /dev/sdb1`, `pvdisplay /dev/sdb1`
3. Create the VG: `vgcreate vg01 /dev/sdb1`, `vgdisplay vg01`
4. Create the LV: `lvcreate --name lv01 --size 300M vg01`, `lvdisplay
   /dev/vg01/lv01`
5. Create the file system: `mkfs.ext4 /dev/vg01/lv01`, with the note that
   XFS needs more than 300 MB, which is why exercise 3's 252 MiB volume uses
   ext4. Verified: on a 252 MiB LV `mkfs.xfs` stops with "Filesystem must be
   larger than 300MB." and exits 1; a 300 MiB LV formats.
6. Mount it persistently: `mkdir /data`, `echo "/dev/vg01/lv01 /data ext4
   defaults 0 0" >> /etc/fstab`, `systemctl daemon-reload`, `mount /data`

Corrections: the source numbers two steps "Step 4"; its `/etc/fstab` line says
`xfs` for the ext4 file system it just made; and it says `udevadm settle`
waits for the kernel to register the partition.

Components: default layout with `vertical: start`, `v-switch at="1"` with six
templates, `bash` fences, `Callout` for the two notes.

##### 4.7 Exercise: Create a Logical Volume

Source L22.

- **Goal:** Carve a logical volume from `vg_data` and mount it at boot
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create a
  Volume Group
- **Workflow:** 1. Create a logical volume named `lv_data` using all available
  space in `vg_data`; 2. Format `lv_data` with an ext4 file system;
  3. Persistently mount `lv_data` on `/data`; 4. Verify with `lsblk`, `df`, and
  `lvdisplay`

`/data` is both 4.8's mount point and this exercise's, as in the source
(Decision 21).

Components: `exercise`.

##### 4.7a Exercise recording (pending)

**Addition.** Recording variant for `create-logical-volume-exercise.cast`.

### 5. `extending-lvm.md` (6 slides)

`routeAlias: extending-lvm`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Extend a Logical Volume Exercise.

##### 5.1 Extending LVM

Source L24. Section slide.

Components: `section`.

##### 5.1a Extend a Logical Volume

**Addition, from O9 and O10** (Decision 11). The section intro the source
lacks. Left, O10's three rows as a table of layer and command: volume group,
`vgextend`; logical volume, `lvextend`; file system, `xfs_growfs` or
`resize2fs`. Right, O9's picture rebuilt in Mermaid: the layers diagram with a
second disk and PV joining the VG, the new PV in blue, the VG in teal, the LV
in slate (Decision 31), and the LV and
file system above them marked as growing. O9 highlighted the new disk in a
green box.

Components: `two-cols-header`, Markdown table, Mermaid diagram.

##### 5.2 Extend a Logical Volume

Source L25. Four click states, each a heading, the source's two short lines
where it has them, and a `bash` fence:

1. Add another PV to the VG, if needed: `parted /dev/sdc mklabel gpt`,
   `mkpart primary 1MiB 256MiB`, `set 1 lvm on`, `udevadm settle`, `pvcreate
   /dev/sdc1`, `vgextend vg01 /dev/sdc1`. The source's heading names `udevadm
   settle` but its fence leaves it out; added.
2. Extend the LV: `lvextend --size +100M /dev/vg01/lv01`
3. Grow the file system: XFS, `xfs_growfs /data` (takes the mount point,
   online only); ext4, `resize2fs /dev/vg01/lv01` (takes the device, online or
   offline). The source's heading says `xfs_grow`.
4. Or both at once: `lvextend --resizefs --size +100M /dev/vg01/lv01`. The
   Cert Guide recommends this form.

The size-change line `lvextend` prints ("Size of logical volume vg01/lv01
changed from ... to ...") is the clearest proof that step 2 worked. Decision 14
offers real output on states 2 to 4.

Components: default layout with `vertical: start`, `v-switch at="1"` with four
templates, `bash` fences.

##### 5.3 Aside: `dd`

Source L26. `dd` copies data from an **input file** (`if=`) to an **output
file** (`of=`) block by block; `/dev/zero` produces endless zeros. Then `dd
if=/dev/zero of=/data/bigfile bs=1M`, and a `Callout`: without `count=`, `dd`
runs until the destination is full. Proposed (Decision 14): a fixed
`TerminalWindow` with the real output, ending in `No space left on device`,
since that message is what exercise 4 asks students to see. The source shows
the command only.

Components: default layout, `AccentText` on the two terms, fixed
`TerminalWindow`, `Callout`.

##### 5.4 Exercise: Extend a Logical Volume

Source L27.

- **Goal:** Grow a full logical volume without unmounting it
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create a
  Logical Volume
- **Workflow:** 1. Fill `lv_data` completely; 2. Confirm that further writes
  fail with "No space left on device"; 3. Add a 256 MiB `lvm` partition on
  `/dev/sdc` to `vg_data` without unmounting `/data`; 4. Extend `lv_data` by
  200 MiB; 5. Grow the ext4 file system; 6. Confirm that writes to `/data`
  succeed again

The source's step 5 says XFS, but `lv_data` is ext4 (exercise 3) and the source
command file runs `resize2fs` (Decision 25). Step 2 works on `lv_data`'s
real size: after `dd` fills it, `echo test > /data/testfile` fails with
"echo: write error: No space left on device" every time (verified, Decision
28).

Components: `exercise`.

##### 5.4a Exercise recording (pending)

**Addition.** Recording variant for `extend-logical-volume-exercise.cast`.

### 6. `removing-lvm.md` (8 slides)

`routeAlias: removing-lvm`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Remove the LVM Setup Exercise.

##### 6.1 Removing LVM

Source L28. Section slide.

Components: `section`.

##### 6.2 Remove a Logical Volume

Source L29. "`lvremove`": removes the LV and frees its extents in the VG;
**irreversible**. A fixed `TerminalWindow`: `umount /dev/vg01/lv01`, then
`lvremove /dev/vg01/lv01` with its `[y/n]` question answered `y` and its
result. The source repeats "Irreversible" as a closing quote; ported as a
`Callout type="danger"` and dropped from the list, so it is said once.

Components: default layout, fixed `TerminalWindow`, `Callout`.

##### 6.3 Remove a Volume Group

Source L30. "`vgremove`" removes the VG and releases its PVs. A fixed
`TerminalWindow` with `vgremove vg01` and its output. The source's closing note,
"All Logical Volumes must be removed before removing the VG", is wrong:
`vgremove` asks "Do you really want to remove volume group "vg01" containing 1
logical volumes? [y/n]:" and removes them too on `y` (verified; answered `n`,
it prints "Volume group "vg01" not removed" and exits 5). Proposed note:
"`vgremove` asks before removing a VG that still holds LVs, and removes them
too" (Decision 18).

Components: default layout, fixed `TerminalWindow`, `Callout`.

##### 6.4 Remove a Physical Volume

Source L31, with its typos ("Phsical Voulme"). "`pvremove`" removes the LVM
label from a device. A fixed `TerminalWindow` with `pvremove /dev/sdb1` and its
output, then "The partition itself is not deleted".

Components: default layout, fixed `TerminalWindow`.

##### 6.5 Removing LVM Components

Source L32. "Teardown order is the reverse of creation: unmount, LV, VG, PV",
then two click states:

1. Unmount and remove the LV: LVM refuses to remove a mounted LV; remove the
   `/etc/fstab` entry, or the next boot stops in emergency mode (w10); `lvremove`
   is irreversible. `umount /data`, `vim /etc/fstab` with the comment "Remove
   the entry", `lvremove /dev/vg01/lv01`.
2. Remove the VG and PVs: `vgremove` releases the PVs; `pvremove` wipes the
   LVM label, and the partition remains. `vgremove vg01`, `pvremove /dev/sdb1
   /dev/sdb2 /dev/sdc1`. The source lists only `sdb1` and `sdb2`, but 3.6 added
   `sdc1` to `vg01`.

The source says a leftover entry causes "a failed mount on reboot"; w10's
Sequencing note records that it stops the boot in emergency mode. To check on
the lab before the slide says which.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, `bash` fences.

##### 6.6 Wipe the Disk

Source L33. "`wipefs` erases the signatures that identify a file system,
partition table, or LVM label; the data stays, but nothing can find it".
The source says it "zeros metadata regions", which overstates it: `wipefs`
erases the few bytes of each signature. Then `wipefs --all /dev/sdb`, with real
output listing each erased signature (proposed, Decision 14; the source shows
the command only). W10 used `wipefs` in exercise cleanups but never on a slide.

Components: default layout, fixed `TerminalWindow`.

##### 6.7 Exercise: Remove the LVM Setup

Source L34.

- **Goal:** Tear down the LVM stack in the reverse order of creation
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Extend a
  Logical Volume
- **Workflow:** 1. Unmount `/data` and remove its `/etc/fstab` entry;
  2. Remove the logical volume; 3. Remove the volume group; 4. Remove the
  physical volumes on `/dev/sdb1` and `/dev/sdc1`; 5. Wipe the `/dev/sdb` and
  `/dev/sdc` disks

The source's requirement line, "Teardown order is the reverse of creation",
moves into the goal, since the environment slot lists only hosts and
prerequisites. The command file also removes `/data`, which no later exercise
uses (Decision 23); cleanup is not listed on the slide.

Components: `exercise`.

##### 6.7a Exercise recording (pending)

**Addition.** Recording variant for `remove-lvm-setup-exercise.cast`.

### 7. `lvm-swap-space.md` (4 slides)

`routeAlias: lvm-swap-space` (`swap-space` is w10's). Alignments: RH134
chapter 11, cert guide chapter 15. Exercise: Create Swap Space on a Logical
Volume Exercise, added at the instructor's request (Open question 3). It
overlaps 8.3 on purpose: the Practice exercises repeat earlier work for extra
practice.

##### 7.1 Swap Space on Logical Volumes

Source L35. Section slide.

Components: `section`.

##### 7.2 Creating Swap Space on a Logical Volume

Source L36, with its typo ("an Logical Volume"). "LVM swap uses the same
commands as partition swap: the device is just an LV path", then three click
states:

1. Create the swap LV, an ordinary LV: `lvcreate --name swap01 --size 512M
   vg01`. The source names it `swap_vol`, the exercise's name, and makes it 1
   GiB, which does not fit the slide chain's `vg01` (Decision 19).
2. Format and activate: `mkswap` writes the swap signature; `swapon`
   activates it until the next reboot. `mkswap /dev/vg01/swap01`, `swapon
   /dev/vg01/swap01`, `swapon --show`.
3. Persist it in `/etc/fstab`: `/dev/vg01/swap01 swap swap pri=5 0 0`
   (Decision 20; the source writes `none swap defaults,pri=5`), the source's
   `Callout` that the kernel uses higher-priority swap first, then `systemctl
   daemon-reload`, `swapon --all`, `swapon --show`.

Steps 2 and 3 end in `swapon --show`, a command that exists only for its
output; Decision 14 offers real output there. It lists the LV by its kernel
name, not its path (verified: `/dev/dm-2 partition 256M 0B -3`), which 4.5's
`ls -l` already explains. Shown or not, the written exercise 7 says so, since
students look for `swap_vol` and do not find it.

Components: default layout with `vertical: start`, `v-switch at="1"` with
three templates, `bash` fences, a titled `text [/etc/fstab]` fence, `Callout`.

##### 7.3 Exercise: Create Swap Space on a Logical Volume

**Addition, requested by the instructor 2026-10-24.** No source slide or
command file; written from 7.2 and the source's `lvm_swap.sh`. Proposed
(Decision 30):

- **Goal:** Add swap space from a new volume group on the spare disk
- **Environment:** **Host:** `servera`
- **Workflow:** 1. Create a 1 GiB `lvm` partition on `/dev/sdd`;
  2. Initialize it as a physical volume and create a volume group named
  `vg_swap`; 3. Create a 512 MiB logical volume named `lv_swap`; 4. Format and
  activate `lv_swap` as swap space; 5. Persistently activate it with priority
  10; 6. Verify with `swapon --show`

It stands alone on `/dev/sdd`, which nothing else this week touches, so it
needs no prerequisite exercise and leaves the `sdb` and `sdc` chain alone.
`sdd`'s sectors are fresh, so `lvcreate` does not stop to ask here. Its
"Clean up" section, not on the slide, removes everything it made: swap off,
the `/etc/fstab` line removed, systemd reloaded, the LV, VG, and PV removed,
and `sdd` wiped. That way 8.3's priority 5 swap is the only one added later.
No reboot; 8.3 has one. The names and priority differ from 8.3's
(`vol_group1`, `swap_vol`, priority 5) so the two are not copies.

Components: `exercise`.

##### 7.3a Exercise recording (pending)

**Addition.** Recording variant for `create-lvm-swap-space-exercise.cast`.

### 8. `lvm-practice.md` (5 slides)

`routeAlias: lvm-practice`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercises: Create a Large LV Spanning Two Disks Exercise, Create
Persistent Swap on an LV Exercise.

##### 8.1 LVM Practice

Source L37 ("Practice"), retitled so the week page's agenda line says what it
practices (Decision 2). Section slide.

Components: `section`.

##### 8.2 Exercise: Create a Large LV Spanning Two Disks

Source L38.

- **Goal:** Build a logical volume larger than either 5 GiB disk
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Remove the
  LVM Setup
- **Workflow:** 1. Create an `lvm` partition on `/dev/sdb` and `/dev/sdc`,
  using all available space; 2. Initialize `/dev/sdb1` and `/dev/sdc1` as
  physical volumes; 3. Create a volume group named `vol_group1` using both
  partitions; 4. Create a 6 GiB logical volume named `srv_vol`; 5. Format
  `srv_vol` with an XFS file system; 6. Persistently mount `srv_vol` on `/srv`;
  7. Verify the mounted size and confirm free space remains in the volume group

The source's requirement, "Each disk is only 5 GB", becomes the goal; the lab
disks are 5 GiB (w10: `Disk /dev/sdb: 5369MB`). The written exercise adds the
Cert Guide's caution: an LV that spans disks is lost if either disk fails,
unless the disks below it are redundant (Decision 27).

Components: `exercise`.

##### 8.2a Exercise recording (pending)

**Addition.** Recording variant for
`create-spanning-logical-volume-exercise.cast`.

##### 8.3 Exercise: Create Persistent Swap on an LV

Source L39.

- **Goal:** Add swap space from the volume group's free space, used at every
  boot
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create a
  Large LV Spanning Two Disks
- **Workflow:** 1. Create a 1 GiB logical volume named `swap_vol` in
  `vol_group1`; 2. Format `swap_vol` as swap space; 3. Activate it temporarily
  and verify with `swapon --show`; 4. Deactivate it; 5. Persistently activate
  it with priority 5; 6. Verify the persistent swap; 7. Reboot to verify

Its "Clean up" section, not on the slide, returns `servera` to the week's
starting state (Decision 23).

Components: `exercise`.

##### 8.3a Exercise recording (pending)

**Addition.** Recording variant for `create-persistent-lvm-swap-exercise.cast`.

## Exercises

| # | Title                                 | Frag | Command file                                  |
|--:|---------------------------------------|-----:|-----------------------------------------------|
| 1 | Initialize a Physical Volume          |    2 | `initialize-physical-volume-exercise.sh`      |
| 2 | Create a Volume Group                 |    3 | `create-volume-group-exercise.sh`             |
| 3 | Create a Logical Volume               |    4 | `create-logical-volume-exercise.sh`           |
| 4 | Extend a Logical Volume               |    5 | `extend-logical-volume-exercise.sh`           |
| 5 | Remove the LVM Setup                  |    6 | `remove-lvm-setup-exercise.sh`                |
| 5a | Create Swap Space on a Logical Volume |   7 | `create-lvm-swap-space-exercise.sh`           |
| 6 | Create a Large LV Spanning Two Disks  |    8 | `create-spanning-logical-volume-exercise.sh`  |
| 7 | Create Persistent Swap on an LV       |    8 | `create-persistent-lvm-swap-exercise.sh`      |

All on `servera`. Each declared title ends in "Exercise". Exercises 1 to 7
port their source command files, rewritten to the current `kitty-demo` format,
with an `.html` written version beside each. Exercise 5a is new (Decision 30)
and lettered so the other numbers, used throughout this plan, do not move.

**The chain.** One pass, in order, with no resets:

1. `sdb1` (256 MiB, `lvm`) becomes a PV
2. `vg_data` from `sdb1`
3. `lv_data` (all of `vg_data`, ext4) on `/data`, in `/etc/fstab`
4. `/data` filled; `sdc1` (256 MiB) added to `vg_data`; `lv_data` grown 200
   MiB
5. All of it removed, `/data` deleted, `sdb` and `sdc` wiped

   5a. Off the chain, on `sdd`: `lv_swap` (512 MiB) in `vg_swap` at priority
   10, in `/etc/fstab`; then its cleanup removes all of it and wipes `sdd`

6. `sdb1` and `sdc1` (whole disks) in `vol_group1`; `srv_vol` (6 GiB, XFS) on
   `/srv`, in `/etc/fstab`
7. `swap_vol` (1 GiB) at priority 5, in `/etc/fstab`; reboot; then cleanup
   restores the start: swap off, `/srv` unmounted, both `/etc/fstab` lines
   removed, systemd reloaded, both LVs, the VG, and both PVs removed, `sdb`
   and `sdc` wiped

The disks and `/etc/fstab` end exactly as they started. LVM's own records do
not, and the taught commands cannot put them back (verified):

- `pvcreate` adds each new PV to `/etc/lvm/devices/system.devices`, and
  `pvremove` leaves the entry behind with no PV ID; `lvmdevices --check` then
  reports each as "device not found".
- Every VG change writes a metadata copy to `/etc/lvm/archive/`, and every
  devices-file change a copy to `/etc/lvm/devices/backup/`.

The archives are harmless. The stale entries made a later `vgcreate` warn
"adding device /dev/sdb1 with idname ... which is already used for missing
device" when a sibling partition's entry was missing. In the chain, exercise 6
recreates the same `sdb1` and `sdc1` that exercises 1 and 4 used, so it may
stay quiet; to confirm on the full run. Proposed (Decision 29): leave LVM's
records alone in the exercises, since clearing them needs `lvmdevices`, which
no slide teaches; have the written exercise 6 explain the warning if it
appears; and reset the instructor lab to its snapshot between the live pass and
the recording pass, so the recordings start clean.

Changes to the source command files, beyond the format:

- Edit `/etc/fstab` with `#@ noenter` on `G` and the `o` line, then `#@ key
  escape` and `:wq`, in place of the host-specific `jj:wq`. As written, the
  source sends an Enter after `G` and after `o`, which inserts a blank line.
- Pauses per "Pausing for the audience": 8 seconds after each intro, 5 after
  multi-line output such as `pvdisplay`, `vgdisplay`, and `mkfs`, 5 on the last
  `/etc/fstab` edit, 6 after `dd` and `lvcreate` on a large volume, and 15
  after `reboot` before `ssh servera` (the instructor lab's `servera` boots in
  about 5 seconds).
- Exercises 1 and 4 end their partitions at `257MiB`, so they are the 256 MiB
  the steps ask for (Decision 22).
- Interactive `parted`: the sources answer the GPT name prompt with `1` and the
  file system type with `ext4` or `xfs`. Verified: on GPT, `mkpart` asks
  `Partition name?  []?` and then `File system type?  [ext2]?`, and whatever
  the type answer, including Enter for the default, `print` in the same session
  shows it (`ext2`) beside the `lvm` flag; a later `parted print` shows the
  column empty. Proposed: name each partition for what it holds (such as
  `pv1`), press Enter at the type, and have the written exercise say the type
  is only a hint, since `set 1 lvm on` is what marks the partition. The
  alternative is command mode, as 4.8 and 5.2 show, which never asks.
- Exercise 4's step 5 header says "Grow the EXT4 file system" in the command
  file and XFS on the slide; both now say ext4 (Decision 25).
- Exercise 5 drops the `wipefs -n` dry runs, a flag no slide teaches, and checks
  the result with `lsblk` instead (Decision 24). It removes `/data` at the end
  (Decision 23).
- Exercise 6's source runs `pvs` without a `clear` before the next header; the
  rewrite clears.
- Exercise 7 gains a "Clean up" section (Decision 23), and its swap line uses
  `swap` as the mount point (Decision 20).
- **`lvcreate` stops to ask.** After exercise 5, `srv_vol` starts on the same
  sectors `lv_data` used, where the old ext4 signature still sits. Verified on
  the same layout: `lvcreate` prints "WARNING: ext4 signature detected on
  /dev/vg01/swap01 at offset 1080. Wipe it? [y/n]:" and, on `y`, "Wiping ext4
  signature on /dev/vg01/swap01." before "Logical volume ... created." With no
  terminal on standard input it answers `[n]` itself and aborts ("Failed to
  wipe start of new LV."), exit 5. `kitty-demo` types into a terminal, so the
  command file answers `y` on its own line, and the written exercise explains
  the question.

The written exercises have students look up their disk names with `lsblk`
before the first `parted`, per `docs/course-authoring.md`, even though the SCC
and instructor labs both say `sdb`.

## Additions

Proposed, each one cuttable:

1. **Slides 1.3a and 1.3b, LVM Commands** (O5): the full table with the
   Cert Guide's Tab tip, then an animation showing that only the layer prefix
   changes.
2. **Slide 2.2a, Prepare a Partition for LVM.** Teaches the flag exercise 1
   needs. Accepted 2026-10-24.
3. **Slide 5.1a, Extend a Logical Volume** (O9 and O10), the Extending
   section's intro.
4. **`ls -l` and the stable-path line on 4.5** (Decision 16).
5. **`pvcreate /dev/sdc1` on 3.6** (Decision 15).
6. **Real output on 5.3 and 6.6**, and optionally 5.2 and 7.2 (Decision 14).
7. **Recording slides for all eight exercises.** The Slidev deck has none; the
   ODP had GIFs for its two.
8. **The spanning caution in exercise 6's written version** (Decision 27).
9. **Exercise 7's cleanup and exercise 5's `rmdir /data`** (Decision 23), so
   the chain ends where the week started.
10. **Exercise 5a, Create Swap Space on a Logical Volume (slide 7.3)**,
    requested by the instructor on 2026-10-24 so fragment 7 ends with an
    exercise (Decision 30).

## Corrections

To verify on the lab where marked; the rest are typos and logic.

- Typos: "Initalized" (L5), "Physoical" (L7), "Partiton" (L17), "xfs_grow"
  (L25), "Phsical Voulme" (L31), "an Logical Volume" (L36). "Filesystem"
  becomes "file system" throughout.
- L13: comments and a blank line were added to `pvdisplay` output by hand.
  Recaptured, and the comments become `TextExplainer` captions.
- L12, L21: "Abridged Output" in a fence title becomes visible
  `...output omitted...` lines, as w10 did.
- L19: the `+` forms are `lvextend` forms; "LEs" is never defined.
- L23: two steps are numbered 4; the `/etc/fstab` line says `xfs` for an ext4
  file system; `udevadm settle` is said to make the kernel register the
  partition.
- L25: the heading names `udevadm settle` and the commands leave it out.
- L27: step 5 says XFS for an ext4 file system.
- L8, L27: a partition from `1MiB` to `256MiB` is 255 MiB, not 256.
- L30: "All Logical Volumes must be removed before removing the VG". Wrong:
  `vgremove` asks, then removes them (verified).
- L32: "a failed mount on reboot". To verify; w10 recorded emergency mode.
- L33: `wipefs` erases signatures; it does not zero whole regions.
- L36: `none` in the swap line's mount point field, against w10's `swap`.
- L7, L12, L21, L13: checked and right. The instructor lab prints the same
  `rhel_servera` volume group, `root` at `<8.00g`, `swap` at `1.00g`, and the
  same PV, VG, and LV sizes and extent counts the source shows (255.00 MiB,
  504.00 MiB, 126 and 63 extents, 3.00 MiB not usable, 25 LEs). Only L13's
  comments and blank line were not real.
- O6, O11: the ODP exercises use `/dev/sdc1` and `/dev/sdd1`, not the
  Slidev deck's `sdb` and `sdc`. Not ported.

## Not ported

- **Stratis, O14 to O24** (Decision 8): a section slide, four concept slides,
  two exercises, three asciinema links (one still `7###`), and two GIFs.
- **The ODP's two exercises, O6 and O11** (Decision 7), and their links and
  GIFs, O7, O8, O12, and O13.
- **O4's flow diagram as a slide of its own.** 1.3 and 4.8 carry the same
  sequence. Easy to add back.
- **The ODP's hard drive icon, molecule background, and LibreOffice theme
  artwork.** See "Third-party images".
- **The `global-bottom.vue` footer**, which carries the college and Red Hat
  logos, and the source's custom layouts (`compact-two-cols-header`,
  `two-cols-header-footer`). The theme supplies the footer and layouts.
- **`slides/public/installing_rhel/`**, w10's screenshots, unreferenced here.
- **RH134 topics the source does not cover**: `pvmove` and `vgreduce`,
  extending a swap LV, and `fsadm` (see "Scope").

## Fitting the class period

Rough costs, not measured: about 45 slides at a minute or so each; exercises 2
and 5 about 3 to 5 minutes, exercises 1 and 3 about 6, exercises 4, 5a, 6, and
7 about 8 to 10 each, with 1 to 2 minutes for exercise 7's reboot. That is a
little over two hours, inside the 2.5-hour class, with less margin than it
looks once questions start.

Decided by the instructor on 2026-10-24: cut nothing until the slides and
exercises are built, as with w10. Candidates then, with what each loses:

- **Run exercise 5 as a demonstration.** Loses hands-on teardown, which is also
  what students need to recover their own VM.
- **Drop exercise 7's reboot.** Loses the proof that `/etc/fstab` works, which
  w10's swap exercise already gave once.
- **Assign the Practice exercises as homework.** Loses the in-class run of the
  two exercises closest to the graded lab.

## Verification

The lab was down when this plan was first written (2026-10-24). The
instructor started it the same day, and these checks ran on `servera`.

**Baseline**, read-only, before anything changed:

- RHEL 10.0 (Coughlan), kernel `6.12.0-55.9.1.el10_0`, `lvm2-2.03.28-6.el10`,
  `xfsprogs-6.11.0-1.el10`, `e2fsprogs-1.47.1-3.el10`, `parted-3.6-7.el10`.
- `sda` holds `sda1` (1 MiB), `sda2` (`/boot`), and `sda3`, the only PV, in
  `rhel_servera` with `root` (`<8.00g`) and `swap` (`1.00g`). `sdb`, `sdc`, and
  `sdd` are blank 5 GiB disks with no signatures. No `/data`; `/srv` exists and
  is empty.
- `/etc/lvm/devices/system.devices` exists and lists only `sda3`, so
  `pvcreate` never prints RH134's "Creating devices file". Its SHA-256 and
  `/etc/fstab`'s were recorded. `wipe_signatures_when_zeroing_new_lvs=1`.
- `servera`'s clock read 2026-10-17 while the host's read 2026-10-24, and
  chronyd logged "System clock wrong by 604536.861672 seconds" without
  stepping it. The lab snapshot was taken with the VMs running on 2026-10-17,
  and a reverted guest resumes at that time. Dates in captured output (`ls -l`,
  `lvdisplay`'s creation time) will carry the lab's date.

**Round 1**, on scratch LVM on `sdb` and `sdc`, following the slide chain:

- Command-mode `parted` prints "Information: You may need to update
  /etc/fstab." and a blank line after `mklabel`, `mkpart`, and `set`. `print`
  then shows Name `primary` and Flags `lvm`.
- Interactive `parted` on GPT: see "Exercises" for the name and type prompts.
- `pvcreate`, `pvs`, `pvdisplay` (new and in a VG), `vgcreate` (one PV and two
  give the same line), `vgs`, `vgdisplay`, `vgextend`, `lvcreate`, `lvs`, and
  `lvdisplay` print exactly the source's values (see "Corrections"). A
  partition ending at `257MiB` shows as 256M in `lsblk` and `256.00 MiB` in
  `pvdisplay`, and still gives 63 extents.
- `ls -l /dev/vg01/lv01 /dev/mapper/vg01-lv01`: both link to `../dm-2`.
- `mkfs.xfs` refuses a 252 MiB LV ("Filesystem must be larger than 300MB.",
  exit 1) and formats a 300 MiB one.
- On a 100 MiB ext4 LV mounted on `/data`, `dd if=/dev/zero
  of=/data/bigfile bs=1M` printed "dd: error writing '/data/bigfile': No space
  left on device", "87+0 records in", "86+0 records out", and the byte count,
  exit 1; `df -h` showed `Avail 0` and `100%`. Then `echo test >
  /data/testfile` succeeded, which round 3 traced to the volume's size.
- `lvextend --size +100M` prints "Size of logical volume vg01/lv01 changed
  from 100.00 MiB (25 extents) to 200.00 MiB (50 extents)." and "Logical volume
  vg01/lv01 successfully resized."; online `resize2fs` prints four lines and a
  blank line; `lvextend --resizefs` prints ten, including `resize2fs`'s own.
  `xfs_growfs` was not run.
- `lvremove` on a mounted LV: "Logical volume vg01/lv01 contains a filesystem
  in use.", exit 5. `vgremove` with an LV, mounted or not, asks before
  removing (see 6.3). `lvremove` asks "Do you really want to remove active
  logical volume vg01/lv01? [y/n]:" and prints "Logical volume "lv01"
  successfully removed." on `y`.
- A new LV over a removed ext4 LV's sectors makes `lvcreate` ask to wipe the
  signature (see "Exercises"). `mkswap` on it prints the version and size line
  and the UUID; `swapon --show` lists it as `/dev/dm-2` at priority `-3`.
- `pvremove` prints "Labels on physical volume "/dev/sdb1" successfully
  wiped." and leaves the devices-file entry (see "Exercises"). `wipefs --all
  /dev/sdb` erases the primary GPT, the backup GPT, and the protective MBR, one
  line each, then prints "calling ioctl to re-read partition table: Success".

**Round 2, and a mistake.** Round 2 meant to repeat the `dd` test on a 252 MiB
ext4 LV shaped like `lv_data`, with several block sizes. Round 1's swap
signature was still on `sdb1`'s first sectors, so `lvcreate` asked to wipe it
and, with no terminal, answered `n` and aborted. That confirmed the
stale-signature problem a second way. My script had no guard for that failure: `mkfs` and `mount` failed, and
the `dd` tests ran into the empty `/data` directory on the **root file
system**, filling it to 100% four times before each file was deleted. Their
results describe XFS on `/`, not ext4, and are discarded. The `vgremove` test
that followed removed an empty VG, so it proved nothing either.

Restored by hand in the same session: the scratch VG, PV, and partition table
removed; `/data` removed; the 13 VG archives and 11 devices-file backups LVM
wrote deleted; `system.devices` rewritten to its original content, mode 0644,
and SELinux context. Afterwards both SHA-256 sums matched the baseline,
`lvmdevices --check` was clean, `sdb` to `sdd` had no signatures, the root file
system was back to 17%, no unit had failed, and XFS reported no errors.
`auditd` logged "suspending logging due to low disk space" when `/` filled,
and it does not resume on its own, so `servera` was reverted to its snapshot
after round 4 (see below).

**Round 3**, the same day, with guards, on exercise 3's exact volume: a
`257MiB` `lvm` partition, `vg_data`, `lv_data` from all free extents (252
MiB), and default `mkfs.ext4`, which makes 258,048 1 KiB blocks, a 4096-block
journal, 12,902 reserved blocks, and a 231M file system in `df`:

- `dd` with `bs=1M`, `bs=4K`, and `bs=1K` each wrote exactly 237,133,824
  bytes before "No space left on device". The last partial write takes what is
  left, so the block size changes nothing.
- After each, `echo test > /data/testfile` failed with "bash: line 1: echo:
  write error: No space left on device". The file is created and the write
  fails, so an interactive shell prints "-bash: echo: write error: No space
  left on device".
- Repeated three times each, immediately after `dd`, in the exercise's order
  (`dd`, 3 seconds, `df`, 3 seconds, `echo`), and after `sync`: failed 9 of 9.
- On a 100 MiB LV in the same VG, the same nine trials all succeeded, with
  `df` reporting 0 available every time. The difference follows the volume's
  size, not timing; the exact cause was not pinned down.
- A second `dd` into a new file, or appending with `bs=1K`, wrote 0 bytes and
  failed with "No space left on device".
- Restored by hand again; both SHA-256 sums matched, `sdb` was blank, and
  `/data` was gone.

**Round 4**, the `lvm` flag (for 2.2a): interactive `set` prompts as listed
there; a flagged partition is type "Linux LVM" and an unflagged one "Linux
filesystem"; `pvcreate` accepted the unflagged one. The unflagged partition
first hit a stale XFS signature left on `sdb` by round 1's test volume, so
`pvcreate` asked to wipe it and, with no terminal, aborted; the script stopped
there, and the signature was erased with `wipefs -a /dev/sdb2` before the
test went on. Round 1 left other old signatures inside `sdb` and `sdc` that
`wipefs` on the whole disk cannot see. Restored by hand; both SHA-256 sums
matched and `sdb` was blank.

**Reverted.** After round 4, `servera` was reverted to its post-configuration
snapshot, which clears the old signatures and the suspended `auditd`.
Afterwards `auditd` was writing records again, both SHA-256 sums matched the
baseline, `/etc/lvm/archive` and `/etc/lvm/devices` held only their original
files, `sdb` to `sdd` had no signatures, there was no `/data`, the root file
system was at 17%, and no unit had failed.

Still to verify during the build:

- `vgremove` answered `y` while an LV is mounted.
- `xfs_growfs` output, for 5.2 if Decision 14 takes it.
- Whether exercise 6 prints the devices-file warning after exercise 5.
- What a leftover `/etc/fstab` entry for a removed LV does at boot (6.5). This
  needs a reboot with a deliberately bad entry; only with the instructor's
  agreement, and restored in the same session.
- Every command file end to end, then the disks, `/etc/fstab`, `swapon
  --show`, and `/data` against the baseline.

Every scratch script now stops at its first failure and checks that a file
system is mounted before writing into it.

**The slide chain.** One capture pass on `servera`, in this order, then
restored:

1. `sdb`: GPT, `sdb1` from `1MiB` to `256MiB` and `sdb2` from `256MiB` to
   `511MiB`, both `lvm` (2.2a)
2. `pvcreate /dev/sdb1` (2.3), `pvcreate /dev/sdb2`, `pvs` and `pvdisplay
   /dev/sdb1` (2.4)
3. `vgcreate vg01 /dev/sdb1` captured for 3.3 and undone, then `vgcreate vg01
   /dev/sdb1 /dev/sdb2`, `vgs` and `vgdisplay vg01` (3.4), `pvdisplay
   /dev/sdb1` (3.5)
4. `sdc1` from `1MiB` to `256MiB`, `lvm`; `pvcreate /dev/sdc1` and `vgextend
   vg01 /dev/sdc1` (3.6)
5. `lvcreate --name lv01 --size 100M vg01` (4.3), `ls -l` on both paths (4.5),
   `lvs` and `lvdisplay` (4.6)
6. `mkfs.ext4`, a temporary mount on `/data`, `dd` until full (5.3)
7. Optional outputs for 5.2 and 7.2 if Decision 14 takes them
8. `umount` and `lvremove` (6.2), `vgremove` (6.3), `pvremove /dev/sdb1`
   (6.4), the other two PVs, `wipefs --all /dev/sdb` (6.6), then `sdc`

`/etc/fstab` is not touched by the chain. Afterwards `/data` is removed, the
disks and `/etc/fstab` must match the baseline, and LVM's archives and
devices-file entries are cleared by a snapshot revert or by hand.

## Authoring notes

- `rows` belongs only on a Magic Move terminal. None is planned this week;
  every `TerminalWindow` is fixed and takes none.
- Mermaid cylinder nodes and Carbon icon shapes load icons asynchronously, so
  leave headroom on 1.3, 2.2, 3.2, 4.2, and 5.1a rather than tuning `scale`
  to the pixel. The layers diagram on 1.3 is the one to copy for 2.2, 3.2, and
  4.2: `scale: 0.72`, `rankSpacing` and `nodeSpacing` 24, mount points inside
  the file system labels. Only the `class` lines change from slide to slide.
- **`check:slides` missed a Mermaid overflow.** The first version of 1.3 ran
  its bottom row and all three disks off the slide in the browser, while
  `check:slides` reported 18.66px of clearance. Look at every Mermaid slide in
  the review browser at 1920x1080, not just the checker's number.
- **The review server misses saves on this share.** After an edit, the deck
  kept serving an older version of the fragment, once a version from between
  two edits. `touch` the file after editing, then reload with a new query
  string (`?fresh=N#/5`), since the browser keeps an open deck. The first
  screenshot after a reload can come back blank; wait and take it again.
- **Animating part of a word.** Magic Move cannot split one shell token, and
  `v-switch` with a transition animates only its first click. 1.3b's recipe
  works: a column of options in a one-line `overflow: hidden` window, moved by
  `v-motion` click states, with `clicks: N` in the slide's frontmatter. Give
  `:initial` the same unit as the click states (`'0%'`, not `0`), or nothing
  moves. Give the window's text a line height above 1 (`leading-[1.3]`):
  `text-4xl` and larger set it to about 1, and descenders then poke into the
  neighbouring slot.
- **An absolutely positioned last item breaks centering.** The default layout
  centers with automatic margins on its first and last body items, so an
  `sr-only` paragraph as the last item sank the slide to the bottom. Put such
  text inside another item.
- **A theme component added while a dev server runs is not picked up** until
  the server restarts; the tag renders as plain text, uncolored.
- **`check:slides --verbose` sometimes leaves a slide out of its report.**
  Slide 5 was missing twice and present on every rerun; rerun before treating
  a missing line as a pass.
- **The theme's `h3` spacing.** An `h3` has 24px below it and a paragraph 16px,
  so a heading followed by one short paragraph reads as belonging to the
  content above it. 1.3 uses a padded nested list instead; 1.2 shows a milder
  form of the same thing between its paragraph and "Why use LVM?".
- Capture every slide with a fence at 1920x1080; `check:slides` cannot see
  overflow inside a code block. `lvs` (about 85 columns), `pvdisplay`, and the
  six-state procedure on 4.8 are the likeliest.
- **UnoCSS `font-mono` is not the theme font.** It resolves to the system
  monospace stack, so its width changes from machine to machine. Use
  `font-family: var(--it230-font-mono)` for monospace text outside a code
  component.
- A line that starts with `AccentText` loses its paragraph; start such lines
  with text.
- `TextExplainer` on 3.5 is more than four lines, so the component picks `sm`;
  do not force a size.
- No presenter notes. Anything learned on the lab goes under "Verification".
- No em dashes. Search the new files for U+2014 before handing work back.

## Decisions

All proposed on 2026-10-24 and waiting on the instructor. Each is reversible.

1. **Eight fragments**, one per source section, in
   `rh134-ch11-managing-storage-with-logical-volume-manager/`.
2. **Section titles:** "Logical Volume Manager (LVM)" for L1 (source "Managing
   Storage with Logical Volume Manager (LVM)") and "LVM Practice" for L37
   (source "Practice"). The rest keep their source titles.
3. **Accent `purple`** (alternatives: `green`, `slate`, or the unused
   `orange`).
4. **Title** "Managing Storage with LVM".
5. **Cover agenda of seven lines.** Accepted 2026-10-24: the instructor
   removed "LVM Practice" from the cover. Eight lines, one per fragment, ran
   3.19 canvas pixels past the cover's content box; seven pass
   `check:slides`. The week page's agenda comes from the topics, so it still
   lists fragment 8.
6. **VM reminder** "Start `workstation` and `servera` on your VDI".
7. **Combine the two decks**: Slidev sequence, commands, and exercises; ODP
   concept slides 1.3a, 1.3b, and 5.1a and O3's diagram details. The ODP's two
   exercises are not ported.
8. **Stratis is not ported** (O14 to O24): RHEL 10's RH134 and Cert Guide
   chapters do not teach it.
9. **The layers diagram is rebuilt in Mermaid** and reused on 1.3, 2.2, 3.2,
   and 4.2, each highlighting its own layer. Accepted 2026-10-24; built on 1.3.
10. **The storage illustration is a placeholder on 1.2**, replaced before
    publication by a Gemini image, a Commons image, or nothing. Accepted
    2026-10-24: placeholder now, replacement chosen later (Open question 5).
11. **Add slides 1.3a, 2.2a, and 5.1a.** All three accepted 2026-10-24. For
    2.2a, flags are introduced this week, with no reference to w10's swap
    partition. 1.3a and 1.3b are built: the table (1.3a) is followed by an
    animation (1.3b) the instructor asked for, showing the pattern behind it.
12. **Move 4.8, the procedure, ahead of exercise 4.7**, so the section ends
    with its exercise.
13. **Procedure slides keep commands-only `bash` fences**; slides where the
    source shows output get recaptured output in `TerminalWindow`.
14. **Real output where the output is the point**: 5.3 (`dd` hitting a full
    disk) and 6.6 (`wipefs` listing what it erased). Optional: states 2 to 4
    of 5.2 (`lvextend`, `resize2fs`) and the `swapon --show` states of 7.2.
15. **3.6 shows `pvcreate /dev/sdc1`** before `vgextend`.
16. **4.5 gains `ls -l` on both paths** and the line that an LV path is stable
    enough for `/etc/fstab`.
17. **4.4 labels the `+` forms as `lvextend` forms** and defines logical
    extents.
18. **6.3's note is reworded to match the lab**: `vgremove` asks before
    removing a VG that still holds LVs, and removes them too.
19. **The slide's swap LV is `swap01` at 512 MiB**, a generic name that fits
    the slide chain's `vg01`; the exercise keeps `swap_vol` at 1 GiB.
20. **Swap lines use `swap` as the mount point**, as in w10 (Decision 32
    there), on 7.2 and in exercise 7.
21. **`/data` stays the mount point** on 4.8 and in exercises 3 to 5, as in the
    source, although w10 used `/data` for slides and `/records` for exercises.
    The alternative is a different slide mount point, such as `/mnt/lv01`.
22. **"256 MiB" partitions end at `257MiB`** in exercises 1 and 4. The
    alternative is to change the steps to say 255 MiB. Either gives 63
    extents, so only the stated size changes.
23. **The chain ends where it started**: exercise 5 removes `/data`, and
    exercise 7 gains a cleanup that restores blank disks and the original
    `/etc/fstab`.
24. **Exercise 5 drops the `wipefs -n` dry runs.** The alternative is to teach
    `-n` on 6.6.
25. **Exercise 4 grows ext4 with `resize2fs`**, as its command file does, and
    the slide's step 5 says ext4.
26. **Every fragment aligns to RH134 chapter 11 and cert guide chapter 15.**
27. **Exercise 6's written version warns** that a spanning LV without
    redundancy is lost when either disk fails.

Added on 2026-10-24 from the lab checks:

28. **Exercise 4's step 2 stays as the source wrote it**, with `dd` at
    `bs=1M`. On `lv_data`'s real size the `echo` fails every time (round 3).
    The command file and written exercise run `df -h /data` before the
    `echo`, as the source command file does; it reads `100%` either way, so a
    student whose volume came out a different size still sees that it is full.
    A smaller block size was tested and changes nothing.
29. **The exercises leave LVM's own records alone.** Clearing the stale
    devices-file entries needs `lvmdevices`, which no slide teaches, and the
    metadata archives are harmless. The written exercise 6 explains the
    devices-file warning if the full run shows it. The instructor lab is reset
    to its snapshot between the live pass and the recording pass.

Added on 2026-10-24 from the instructor's answers:

30. **Fragment 7 gets its own exercise, 5a** (slide 7.3), as the instructor
    asked. Proposed design: standalone on `/dev/sdd` with no prerequisite, a 1
    GiB `lvm` partition, `vg_swap`, a 512 MiB `lv_swap`, priority 10, no
    reboot, and a cleanup that removes all of it. The alternative is to chain
    it on `sdb` after exercise 5, which would make `lvcreate` ask about
    `lv_data`'s old signature here, and 8.2's ask about this exercise's swap
    signature instead of the ext4 one.

31. **A color key for the three layers**, used in text and diagrams all week:
    PV blue, VG teal, LV slate. Chosen by the instructor on 2026-10-24; pink
    was tried for LV and rejected as too loud. Teal and slate nearly merge for
    red-green color blindness, which the names in words cover. Text uses
    `AccentText hue="..."`, a theme addition the instructor suggested in place
    of a separate component. The instructor's rule (2026-10-24): keep it
    consistent across all of this week's material, exercises included, so a
    PV is always blue, a VG teal, and an LV slate, in text or diagram:
    - **Slides,** exercise slides included: wherever text names a layer
      (terms, headings, lists, tables, exercise titles and workflow steps), it
      uses `AccentText` with that layer's hue, and every diagram node for a
      layer takes its hue.
    - **Written exercises:** each page's inline `<style>` block gains three
      classes named and colored like `AccentText`'s hues, `hue-blue`
      (`#0461be`), `hue-teal` (`#006e80`), and `hue-slate` (`#526678`), bold,
      used as `<span class="hue-blue">physical volume</span>`. To build with
      fragment 2's first written exercise and check against
      `check:exercises`, including that a colored `h1` still matches the
      declared exercise title; the declared titles and the page `<title>`
      stay plain text. Once it holds, record the classes under "Exercise
      documents" in `docs/design-system.md`.
    - **Not covered:** command files and recordings, whose terminal text the
      key cannot reach.

## Open questions

1. ~~**The lab.**~~ Answered 2026-10-24: the instructor started it.
   `servera` was reverted to its snapshot after the checks (see
   "Verification").
2. ~~**Time.**~~ Answered 2026-10-24: cut nothing until the week is built,
   as in w10.
3. ~~**Swap without an exercise.**~~ Answered 2026-10-24: fragment 7 gets an
   exercise of its own, even though 8.3 mostly repeats it; the Practice
   exercises repeat earlier work on purpose. See 7.3 and Decision 30, whose
   design waits on the instructor.
4. ~~**Exercise 2.**~~ Answered 2026-10-24: keep it separate. The instructor
   wants no more than about ten content slides between exercises; section,
   title, reminder, and exercise slides do not count. This plan's longest run
   is eight (1.2 to 2.4, before exercise 1, since 1.3b was added); the others
   are 0 to 6.
5. ~~**The 1.2 image.**~~ Answered 2026-10-24: a placeholder now, replaced
   later (Decision 10).
6. **SCC volume group name.** The instructor lab's OS volume group is
   `rhel_servera`, as the source shows. `docs/lab-environments.md` does not say
   whether SCC matches. The instructor will check `vgs` on an SCC `servera`;
   **remind the instructor before the recordings**, since 2.4, 3.4, and 4.6
   show the name.

## Status

As of 2026-10-24.

**Done:** this plan; `course/w11-draft.md` (cover, VM reminder, and fragment
1's import); fragment 1, `logical-volume-manager.md`, five slides built and
checked, including the commands table (1.3a) and the animation that follows it
(1.3b); the week's color key (Decision 31) and `AccentText`'s `hue` prop in
the theme, with its test, gallery line, and documentation. The
lab checks behind every correction are under "Verification", and `servera` was
reverted to its snapshot afterwards.

**Next, in order:**

1. The instructor reviews fragment 1.
2. Fragment 2, `physical-volumes.md`, the first with transcripts, so it needs
   the lab. What fragment 1 settled that reaches it:
   - Capture from the slide chain under "Verification".
   - Copy 1.3's diagram for 2.2 and change only the `class` lines: PVs blue,
     the rest white (Decisions 9 and 31).
   - Color every PV mention that names the layer with `AccentText hue="blue"`
     (Decision 31), including 2.2's definitions, 2.4's `pvs` caption, and
     exercise 1's slide.
   - Build exercise 1's written version with the `hue-blue` class (Decision
     31) and confirm `check:exercises` accepts it before the other exercises
     copy it.
   - Where a slide pairs a short heading with one paragraph, as 2.2's "Why PVs
     are needed" does, check the spacing in the browser; 1.3 needed a padded
     nested list instead (see "Authoring notes").
   - The ten-slide count before exercise 1 is now eight content slides, with
     2.2a included.
3. Open decisions: everything not marked accepted, including Decision 30
   (exercise 5a's design).
4. Before the recordings: the SCC volume group name (Open question 6).

**On another machine:**

- The placeholder image is ignored by Git, so it does not travel. Recreate
  `assets/lvm-storage-illustration.placeholder.jpg` from the instructor's
  source repository: unzip `~/s/IT-230/w11/slides/ManageStorageStack.odp` into
  an empty scratch directory and copy
  `Pictures/100000000000040000000400C4BC7452.jpg` (1024 by 1024, 204,774
  bytes) to that name. Without it, slide 1.2's image fails to load.
- Restart any running dev or review server after pulling, since the theme's
  `AccentText` changed.
- If the review server keeps serving an old version after an edit, `touch` the
  file (see "Authoring notes").
