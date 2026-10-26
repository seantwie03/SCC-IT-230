# W11 - Port

## Prompt

Port w11 from `~/s/IT-230/w11` with the week-porting skill: read the Slidev
deck, the LibreOffice deck, the lesson plan, and the demonstrations, and
produce this plan. Nothing is built until the plan is approved.

## Answer in brief

**Seven topic fragments** in one chapter directory, **eight exercises**, and a
deck of **57 slides**: 38 from the source (36 content slides plus the cover and
VM reminder; L13 was removed on 2026-10-25, Decision 32, and L35 and L36 went
with fragment 7 on 2026-10-26, Decision 45), 3 more from splitting the inspect
slides in two (2.4a, 3.4a, 4.6a, Decision 33), 8 added slides (1.3a, 1.3b,
2.2a, 5.1a, 5.2a, 5.2b, 6.1a, and exercise 8's slide 8.4), and 8 recording
slides that wait on the casts.

| # | Fragment                    | Section title                  | Slides | Exercises |
|--:|-----------------------------|--------------------------------|-------:|----------:|
| 1 | `logical-volume-manager.md` | Logical Volume Manager (LVM)   |      5 |         0 |
| 2 | `physical-volumes.md`       | Physical Volumes               |      8 |         1 |
| 3 | `volume-groups.md`          | Volume Groups                  |      7 |         1 |
| 4 | `logical-volumes.md`        | Logical Volumes                |      9 |         1 |
| 5 | `extending-lvm.md`          | Extending LVM                  |      8 |         1 |
| 6 | `removing-lvm.md`           | Removing LVM                   |      8 |         1 |
| 7 | dropped (Decision 45)       |                                |      0 |         0 |
| 8 | `lvm-practice.md`           | LVM Practice                   |     10 |         3 |
|   | Entry file                  |                                |      2 |           |
|   | **Total**                   |                                | **57** |     **8** |

Slide counts include the recording slides. The fragments follow the Slidev
deck's sections one for one, except Swap Space on Logical Volumes, which was
dropped and folded into the practice fragment (Decision 45). The LibreOffice
deck contributes two concept slides, a command table, and its disk icons and
mount points in the rebuilt layers diagram. Its second half, Stratis, is RHEL 9
material that RHEL 10's RH134 no longer teaches, and is not ported (Decision 8).

Three things to know before approving:

1. **Exercise 6 stops at two questions.** Exercise 5's teardown leaves old XFS
   signatures on the disks, so both of exercise 6's `lvcreate` commands ask
   "Wipe it? [y/n]" (verified). The command file answers `y` to each, and the
   written exercise explains why. The source's other facts checked out; see
   "Verification".
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
- **The exercises form one chain**: exercises 1 to 4 build and grow one stack
  on `sdb` and `sdc`, exercise 5 tears it down, exercises 6 and 7 build and
  grow a second stack across all three disks with swap beside a file system,
  and exercise 8 returns the disks and `/etc/fstab` to the week's starting
  state. See "Exercises".
- **Teardown leaves old signatures behind.** `pvremove` wipes only the LVM
  label and `wipefs --all` on the disk only the partition table, so the
  file system a removed LV held is still on the sectors. A new LV created
  over them makes `lvcreate` ask "Wipe it? [y/n]" (verified). Exercise 6 hits
  this twice after exercise 5, and students need to know the questions are
  expected.
- **W10 taught "use the UUID, not the device file" for `/etc/fstab`.** This
  week's slides and exercises write `/dev/vg01/lv01` and `/dev/vg_data/lv_data`
  into `/etc/fstab`, as RH134 does. That is correct, because an LV path is a
  name the administrator chose and does not change between reboots, but
  students will notice the contradiction. Slide 4.5 says why (Decision 16).
- **W10 taught `swap` as the mount point field of a swap line** (Decision 32
  there). The source here writes `none`. Proposed: follow w10 (Decision 20).
- **W12 is the boot process.** Nothing in w11 depends on it. No exercise
  reboots (proposed, Decision 46); w10's swap exercise already proved an
  `/etc/fstab` line at boot.

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
  *Managing Logical Volumes* (Decision 26). Swap on an LV, which RH134 covers
  in chapter 11, is in the practice fragment (Decision 45).

## Source-to-fragment map

From `managing_storage_with_lvm.md`:

| Source | Title                                     | Goes to   |
|-------:|-------------------------------------------|-----------|
|     L1 | Section: Managing Storage with LVM        | 1.1       |
|     L2 | What is LVM?                              | 1.2       |
|     L3 | LVM: Three Layers                         | 1.3       |
|     L4 | Section: Physical Volumes                 | 2.1       |
|     L5 | Physical Volumes (PVs)                    | 2.2       |
|     L6 | Initialize a Physical Volume              | 2.3       |
|     L7 | Inspect Physical Volumes                  | 2.4, 2.4a |
|     L8 | Exercise: Initialize a Physical Volume    | 2.5       |
|     L9 | Section: Volume Groups                    | 3.1       |
|    L10 | Volume Groups (VGs)                       | 3.2       |
|    L11 | Create a Volume Group                     | 3.3       |
|    L12 | Inspect Volume Groups                     | 3.4, 3.4a |
|    L13 | PE Fields from `pvdisplay`                | removed   |
|    L14 | Extend a Volume Group                     | 3.6       |
|    L15 | Exercise: Create a Volume Group           | 3.7       |
|    L16 | Section: Logical Volumes                  | 4.1       |
|    L17 | Logical Volumes (LVs)                     | 4.2       |
|    L18 | Create a Logical Volume                   | 4.3       |
|    L19 | Specifying LV Size                        | 4.4       |
|    L20 | LV Device Paths                           | 4.5       |
|    L21 | Inspect Logical Volumes                   | 4.6, 4.6a |
|    L22 | Exercise: Create a Logical Volume         | 4.7       |
|    L23 | Procedure: Create a Logical Volume        | 4.8       |
|    L24 | Section: Extending LVM                    | 5.1       |
|    L25 | Extend a Logical Volume                   | 5.2       |
|    L26 | Aside: `dd`                               | 5.3       |
|    L27 | Exercise: Extend a Logical Volume         | 5.4       |
|    L28 | Section: Removing LVM                     | 6.1       |
|    L29 | Remove a Logical Volume                   | 6.2       |
|    L30 | Remove a Volume Group                     | 6.3       |
|    L31 | Remove a Physical Volume                  | 6.4       |
|    L32 | Removing LVM Components                   | 6.5       |
|    L33 | Wipe the Disk                             | 6.6       |
|    L34 | Exercise: Remove the LVM Setup            | 6.7       |
|    L35 | Section: Swap Space on Logical Volumes    | dropped   |
|    L36 | Creating Swap Space on a Logical Volume   | dropped   |
|    L37 | Section: Practice                         | 8.1       |
|    L38 | Exercise: Large LV Spanning Two Disks     | 8.2       |
|    L39 | Exercise: Persistent Swap on an LV        | 8.3       |

3.6 keeps its number but sits in fragment 5, after 5.1a (Decision 34), and
4.8 keeps its number but sits in fragment 8, after 8.1 (Decision 38); 5.2 and
6.5 sit there too, after it (Decisions 40 and 41). L35 and L36 were dropped
with fragment 7 (Decision 45), and L36's swap steps are proposed for 4.8
(Decision 47). L38 and L39 keep their slots, 8.2 and 8.3, for the instructor's
redesigned exercises 6 and 7.

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

Slides with no source row: 1.3a, 1.3b, 2.2a, 5.1a, 5.2a, 5.2b, and 6.1a
(additions), 8.4 (exercise 8), and the eight recording slides 2.5a, 3.7a,
4.7a, 5.4a, 6.7a, 8.2a, 8.3a, and 8.4a.

## File inventory

New, under
`course/chapters/rh134-ch11-managing-storage-with-logical-volume-manager/`:

| File                        | Slides | Exercises |
|-----------------------------|-------:|----------:|
| `logical-volume-manager.md` |      5 |         0 |
| `physical-volumes.md`       |      8 |         1 |
| `volume-groups.md`          |      7 |         1 |
| `logical-volumes.md`        |      9 |         1 |
| `extending-lvm.md`          |      8 |         1 |
| `removing-lvm.md`           |      8 |         1 |
| `lvm-practice.md`           |     10 |         3 |

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

Slides use the generic names `vg01`, `lv01`, and `swap01`; exercises 1 to 5
use `vg_data` and `lv_data`, as the source does, and exercises 6 to 8
`vg_storage`, `lv_records`, and `lv_swap` (proposed, Decision 46) in place of
the source's `vol_group1`, `srv_vol`, and `swap_vol`.

Where the source shows output, the slide shows recaptured output in a
`TerminalWindow`. Where it shows commands only, which is every procedure slide
(4.8, 5.2, 6.5), the slide keeps a plain `bash` fence of commands, since
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

### 2. `physical-volumes.md` (8 slides), built 2026-10-25

`routeAlias: physical-volumes`. Alignments: RH134 chapter 11, cert guide
chapter 15. Exercise: Initialize a Physical Volume Exercise, declared in
`topicInfo` since 2026-10-25, when its files were written.
Built and checked with `check:entry` and `check:slides`; every slide and click
state was also captured at 1920x1080. It waits on the instructor's review. The
transcripts are real output from the slide-chain run on `servera` on
2026-10-24 (round 1 under "Verification"), the same run fragment 3 draws on,
so device names and sizes agree with fragment 3. Trailing spaces in the output were
dropped. The colors follow Decision 31; slide titles stay plain, because they
feed the week page's agenda and Slidev's navigation as raw text.

##### 2.1 Physical Volumes

Source L4. Section slide carrying the `topicInfo` alignments.

Components: `section`.

##### 2.2 Physical Volumes (PVs)

Source L5. Left column, two groups: "A physical volume is a block device
initialized for LVM", with "A partition, a whole disk, or a RAID device"
beneath it and, nested under that, "**Recommendation**: Use a partition" (the
instructor's addition, 2026-10-25, in the deck accent, since it is emphasis
rather than a layer; the basis is round 5 under "Verification"); then "Why PVs
are needed": LVM cannot use raw storage directly;
creating a PV gives the device a **UUID**; only a PV can join a volume group.
Each group is wrapped in a `<div>` so its parts stay together, the
instructor's fix from 1.2. "physical volume" and "PV" are blue, "volume group"
teal. Right column, 1.3's diagram with the PVs in blue and everything else
white. `check:slides`: 87.83px clearance.

Components: `two-cols-header` with `listSpacing: padded` and `leftWidth: 60`
(the instructor dropped `vertical: center`); `<div>` groups; `AccentText`,
with `hue` on the layer terms; Mermaid.

##### 2.2a Prepare a Partition for LVM

**Addition, accepted 2026-10-24** (Decision 11). Exercise 1's first step asks
for "a 256 MiB GPT partition with the `lvm` flag", and no source slide shows the
flag until the procedure recap, 4.8, now in the practice fragment (Decision 38).
W10 never showed `parted`'s `set` command. The instructor chose to introduce
flags here, on their own terms, with no reference back to w10.

"The `lvm` flag marks a partition for LVM", then two click states, since one
transcript of all three commands would not fit:

1. "Set the flag in interactive mode (partition 1) or in one command
   (partition 2)" over an interactive `parted /dev/sdb` session (its banner,
   then `set` answered `1`, `lvm`, and `on`, then `quit` and the "You may need
   to update /etc/fstab." line), followed by command-mode `parted /dev/sdb set
   2 lvm on`. Both modes on one slide, at the instructor's request
   (2026-10-25); exercise 1 uses the interactive form. Captured fresh from
   `servera` the same day, on partitions matching the slide chain, and the
   `print` that followed matched state 2 exactly.
2. "Verify: `print` lists `lvm` in the Flags column" over `parted /dev/sdb
   print`, both partitions flagged `lvm`, then "The flag is a label, not a
   requirement; use it so people and tools can see what the partition holds"
   (Cert Guide chapter 15).

Verified: on GPT the flag changes the partition type from "Linux filesystem"
to "Linux LVM" (`lsblk -o PARTTYPENAME`), and `pvcreate` accepts an unflagged
partition without complaint. Interactive `parted`, as exercise 1 uses it,
asks `Partition number?`, `Flag to Invert?`, and `New state?  [on]/off?`
after `set`. `check:slides`: 23.8px clearance on the first state and 27.7px on
the second.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`.

##### 2.3 Initialize a Physical Volume

Source L6. Two groups: "`pvcreate` creates a physical volume" over
`pvcreate /dev/sdb1` and its output; then "Create several at once" over
`pvcreate /dev/sdb1 /dev/sdb2` and its two "successfully created" lines, a
terminal at the instructor's request (2026-10-25) in place of the source's
command-only block. The second transcript is a separate run on fresh
partitions matching the slide chain, captured that day, since in the chain
`sdb1` was already a PV by then; `servera` was reverted afterwards. Each group
is a `<div>`, so the label sits with what it introduces. `check:slides`:
55.67px clearance.

Components: default layout, `<div>` groups, two fixed `TerminalWindow`s,
`AccentText` with `hue`.

##### 2.4 Inspect Physical Volumes

Source L7, with its typo ("Physoical"), split in two (Decision 33). "`pvs`
gives a summary of all PVs on the system" (the instructor's wording,
2026-10-25) over `pvs`: `sda3` in `rhel_servera`, and `sdb1` and `sdb2`
unassigned at 255.00m. The source's "pvs: a summary" form put a visible gap
between the inline code and the colon. Centered vertically (`vertical:
center`, the instructor's edit). `check:slides`: 120.89px clearance.

Components: default layout, fixed `TerminalWindow`, `AccentText` with `hue`.

##### 2.4a Inspect Physical Volumes

The second half of L7. "`pvdisplay` shows the details of one PV" over
`pvdisplay /dev/sdb1`, a new PV, with the instructor's click-through
highlights (`{all|2-4,6,12|5,7-11}`): the whole output, then what the PV has
(the new-PV lines, PV Name, PV Size, and PV UUID), then what it lacks (the
empty VG Name, Allocatable NO, and the four zero extent counts). Beneath it,
in the instructor's words:
"A PV that has not been added to a volume group and no extents yet". It is
the counterpart of 3.4a's extents. `check:slides`: 23.2px clearance in every
click state.

Components: default layout, fixed `TerminalWindow` with click-based line
highlights, `AccentText` with `hue`.

##### 2.5 Exercise: Initialize a Physical Volume

Source L8.

- **Goal:** Prepare a partition on a blank disk for LVM
- **Environment:** **Host:** `servera`
- **Workflow:** 1. Create a 512 MiB GPT partition with the `lvm` flag on
  `/dev/sdb`; 2. Initialize `/dev/sdb1` as a physical volume (blue);
  3. Verify with `pvs` and `pvdisplay`

The source makes a 255 MiB partition (`1MiB` to `256MiB`). Since 2026-10-26 the
week uses XFS throughout (Decision 49), which needs more than 300 MB, so the
partition is 512 MiB, `1MiB` to `513MiB` (Decision 22's pattern). The PV holds
127 extents, 508 MiB (verified).

Exercise files, written 2026-10-25, moved to 512 MiB on 2026-10-26, and run in
the exercise chain from the snapshot:

- `initialize-physical-volume-exercise.sh`, 52 presses (`kitty-demo
  --check`). Step 1 inspects with `lsblk`, then an interactive `parted
  /dev/sdb` session: `mklabel gpt`; `mkpart` named `pv1`, the file system type
  accepted with `#@ key enter`, `1MiB` to `513MiB`; `set 1 lvm on`; `print`;
  `quit`; `udevadm settle`. Then `pvcreate /dev/sdb1`, `pvs`, and `pvdisplay
  /dev/sdb1`. `#!` delivery notes give the reason for a partition rather than
  the whole disk (round 5, at the instructor's request), the default type,
  the `513MiB` boundary and the room it leaves for XFS, and the new PV.
  Pauses: 8 on the intro, 5 on `lsblk`, `print`, `pvs`, and `pvdisplay`. No
  cleanup: exercise 2 builds on `sdb1`.
- `initialize-physical-volume-exercise.html`, built from w10's exercise
  page. It quotes the `parted` session prompt by prompt, says the 512 MiB
  leaves room for XFS, explains that `print` shows `ext2` as a type hint and
  no file system exists, and gives the expected `pvs` and `pvdisplay` results
  (512.00m, no VG, not allocatable, no extents). A note callout, "Why a
  partition, not the whole disk", gives round 5's reasoning (the instructor's
  request). `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 2.5a Exercise recording (pending)

**Addition.** Recording variant for `initialize-physical-volume-exercise.cast`,
added once the cast exists.

### 3. `volume-groups.md` (7 slides), built 2026-10-25

`routeAlias: volume-groups`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Create a Volume Group Exercise, declared in `topicInfo`. Built and
checked with `check:entry` and `check:slides`, and every slide and click state
captured at 1920x1080; it waits on the instructor's review. Built to fragment
2's conventions: `<div>` groups, the instructor's 2.4 wording and default layout
on the inspect slides, a terminal with output for every command, VG terms teal
and PV terms blue in the body, plain titles. Every transcript comes from the
round 1 slide chain under "Verification", so `vg01` is built from the PVs 2.4
introduced.

##### 3.1 Volume Groups

Source L9. Section slide carrying the `topicInfo` alignments.

Components: `section`.

##### 3.2 Volume Groups (VGs)

Source L10. Left column, two `<div>` groups as on 2.2: "A volume group is a
storage pool", with "Made of one or more physical volumes" beneath it; then
"Why VGs are needed": combines PVs into one block of storage; divides them
into 4 MiB chunks called **physical extents (PEs)**; the PE size is set when
the VG is created, the same on every PV in it. 4 MiB is the default (Cert
Guide chapter 15). Right column, 2.2's diagram with only the VG in teal.
`check:slides`: 39.22px clearance.

Components: `two-cols-header` with `listSpacing: padded` and `leftWidth: 60`;
`<div>` groups; `AccentText` with `hue`; Mermaid.

##### 3.3 Create a Volume Group

Source L11. Two `<div>` groups, like 2.3: "`vgcreate` pools one or more PVs
into a volume group" over `vgcreate vg01 /dev/sdb1` and its output; then
"Create from several PVs" over `vgcreate vg01 /dev/sdb1 /dev/sdb2` and its
output, a terminal rather than the source's command-only block, following the
instructor's 2.3. Both lines are real: the chain ran the one-PV form, removed
it, and ran the two-PV form that 3.4 shows. `check:slides`: 61.67px
clearance.

Components: default layout, `<div>` groups, two fixed `TerminalWindow`s,
`AccentText` with `hue`.

##### 3.4 Inspect Volume Groups

Source L12, split in two like 2.4 (Decision 33). "`vgs` gives a summary of all
VGs on the system" over `vgs`: `rhel_servera`, and `vg01` with two PVs, no
LVs, and 504.00m free. Centered vertically, like 2.4 (the instructor's
edit). `check:slides`: 129.89px clearance.

Components: default layout, fixed `TerminalWindow`, `AccentText` with `hue`.

##### 3.4a Inspect Volume Groups

The second half of L12. "`vgdisplay` shows the details of one VG" over
`vgdisplay vg01`, trimmed to the source's eight fields (VG Name, Cur PV, VG
Size, PE Size, Total PE, Alloc PE / Size, Free PE / Size, VG UUID) with
`...output omitted...` lines where the other twelve are left out, in place of
the source's "Abridged Output" fence title. The instructor replaced the
click-through highlights with fixed ones (`{1-3,5,7-12}`) that only dim the two
`...output omitted...` markers, so the slide has no clicks. Beneath it: "4.00
MiB × 126 extents = 504 MiB; the free extents are what `lvcreate` can use",
the extents lesson 3.5 carried before it was removed (Decision 32).
`check:slides`: 23.17px clearance.

Components: default layout, fixed `TerminalWindow` with line highlights,
`AccentText` with `hue`.

##### 3.5 Physical Extents in `pvdisplay` (removed 2026-10-25)

Source L13: a `TextExplainer` over `pvdisplay /dev/sdb1` once `sdb1` belonged to
`vg01`, stepping through PE Size, Total PE, Free PE, and Allocated PE. The
instructor found a `pvdisplay` right after 3.4's `vgdisplay` jarring, and
`vgdisplay` already shows the same four fields for the whole VG, which is the
level fragment 4 builds on (`lvcreate -l`, `100%FREE`, Current LE). Removed; its
lesson moved to 3.4a's highlighted lines (Decision 32). Lost: the per-PV view,
63 extents per 255 MiB PV with 3 MiB not usable, and the Allocatable NO to yes
contrast with 2.4a, which 2.4a's highlights now carry from the other side.

##### 3.7 Exercise: Create a Volume Group

Source L15.

- **Goal:** Pool the new physical volume (blue) into a volume group (teal)
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Initialize
  a Physical Volume
- **Workflow:** 1. Create a volume group (teal) named `vg_data` using
  `/dev/sdb1`; 2. Verify with `vgs` and `vgdisplay`

Exercise files, written 2026-10-25, updated for 512 MiB on 2026-10-26
(Decision 49), and run in the exercise chain:

- `create-volume-group-exercise.sh`, 18 presses (`kitty-demo --check`), the
  source's `create_volume_group.sh` in the current format: `sudo -i`,
  `vgcreate vg_data /dev/sdb1`, `vgs`, `vgdisplay vg_data`. `#!` notes say
  the VG name comes before the PVs and why the VG is 508 MiB, not 512 (127
  whole 4 MiB extents; `pvdisplay` reports 4.00 MiB not usable). Pauses: 8 on
  the intro, 5 on `vgs` and `vgdisplay`. No cleanup: exercise 3 builds on
  `vg_data`.
- `create-volume-group-exercise.html`, with `hue-teal`, `hue-blue`, and
  `hue-slate`. It gives the expected `vgs` and `vgdisplay` results (one PV, no
  LVs, 508.00m, 4.00 MiB extents, 127 free), and a note callout, "Why 508 MiB
  and not 512", ties the free extents to exercise 3's `lvcreate`.
  `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 3.7a Exercise recording (pending)

**Addition.** Recording variant for `create-volume-group-exercise.cast`.

### 4. `logical-volumes.md` (9 slides), built 2026-10-25

`routeAlias: logical-volumes`. Alignments: RH134 chapter 11, cert guide
chapter 15. Exercise: Create a Logical Volume Exercise, declared in
`topicInfo`, its files built with the slides (the porting skill's rule since
2026-10-25). Built and checked with `check:entry`, `check:slides`, and
`check:exercises`, and every slide and click state captured at 1920x1080; it
waits on the instructor's review. Built to fragments 2 and 3's conventions:
`<div>` groups, a terminal with output for every command, LV terms slate, VG
terms teal, PV terms blue, plain titles. Its procedure slide, 4.8, was built
here and moved to fragment 8 the same day (Decision 38).
Transcripts on 4.5, 4.6, and 4.6a come from the round 1 slide chain; 4.3's
second terminal and 4.4's rounding fact come from the 2026-10-25 side test
under "The exercise chain".

##### 4.1 Logical Volumes

Source L16. Section slide.

Components: `section`.

##### 4.2 Logical Volumes (LVs)

Source L17, with its typo ("Partiton") fixed. Two `<div>` groups: "A logical
volume is a flexible block device", created from free physical extents in a
VG, seen by the OS as just another block device (like a partition, a disk, or
a RAID device); then "Why LVs are needed": size not bound to one physical
disk (made up of physical extents), and resize **without unmounting** (grow a
file system while it is in use). On the right, the layers diagram with the LVs
in slate (stroke `#6f8396`, fill `#dfe4e8`) and the rest white (Decision 31).
`check:slides`: 18.89px clearance.

Components: `two-cols-header`, `<div>` groups, Mermaid diagram, `AccentText`
with `hue`.

##### 4.3 Create a Logical Volume

Source L18. Two `<div>` groups, as on 3.3: "`lvcreate` creates a logical
volume from free extents in a VG" over `lvcreate --name lv01 --size 100M
vg01` and its output; then "Use all the free extents left in the VG" over
`lvcreate --name lv01 --extents 100%FREE vg01` and its output, which the
source showed as a command only (captured on a fresh `vg01` in the side
test). `check:slides`: 61.67px clearance.

Components: default layout, `<div>` groups, two fixed `TerminalWindow`s,
`AccentText` with `hue`.

##### 4.4 Specifying LV Size

Source L19. "An LV is made of **logical extents (LEs)**, each mapped to one
physical extent in the VG" (Decision 17's definition, RH134), then two click
states. First, "`-l` / `--extents` takes a count or percentage of extents"
over `32` (exactly 32 LEs, 128 MiB at 4 MiB per PE) and `100%FREE` (every
free extent left in the VG). Then "`-L` / `--size` takes a size in
human-readable units" over `300M` and `2G`, and a `Callout`: "`M` is MiB and
`G` is GiB. LVM rounds a size up to a whole extent, so `--size 10M` makes a
12 MiB LV" (verified: "Rounding up size to full physical extent 12.00 MiB";
`--extents 32` made 128.00m). The source's `+50` and `+500M` rows moved to
5.2 (Decision 35). The headings first had a colon after the inline code,
which left the same visible gap 2.4 dropped, and a separate description line
that pushed the second state 12.98px off the slide; folding the description
into the heading fixed both. The instructor then removed `vertical: start`
and changed "An LV" to "A LV" (2026-10-25). `check:slides`: 75.73px and 57px
clearance.

Components: default layout, `v-switch at="1"` with two templates, Markdown
tables, `Callout`, `AccentText` with `hue`.

##### 4.5 LV Device Paths

Source L20. "LVM creates two equivalent paths for every LV" over the source's
table (`/dev/vgname/lvname`, `/dev/mapper/vgname-lvname`, with `vg01` and
`lv01` examples). The source's closing note that either path points to the
same device becomes "Use either; both link to the same device" over `ls -l`
on both paths,
each `-> ../dm-2` (Decision 16), and the slide ends "The path stays the same
across reboots, so `/etc/fstab` can use it in place of a UUID" (RH134).
`check:slides`: 13.14px clearance.

Components: default layout, Markdown table, fixed `TerminalWindow`,
`AccentText` with `hue`.

##### 4.6 Inspect Logical Volumes

Source L21, split in two like 2.4 and 3.4 (Decision 33). "`lvs` gives a
summary of all LVs on the system" over `lvs`: `root` and `swap` in
`rhel_servera`, and `lv01` in `vg01` at 100.00m, with the trailing spaces of
its 90-column header trimmed. Centered vertically. `check:slides`: 120.89px
clearance.

Components: default layout with `vertical: center`, fixed `TerminalWindow`,
`AccentText` with `hue`.

##### 4.6a Inspect Logical Volumes

The second half of L21. "`lvdisplay` shows the details of one LV" over
`lvdisplay /dev/vg01/lv01` trimmed to LV Path, LV Name, VG Name, LV UUID, LV
Status, LV Size, and Current LE, with `...output omitted...` where the rest
is left out. The source's abridged output also kept Segments and Allocation;
dropped, since nothing teaches them and the twelve lines then match 3.4a.
Built with click-through highlights (`{all|3-5|10-11}`), as first chosen;
the instructor then replaced them with fixed ones, `{1-6,8,10-11}`, that dim
only the `...output omitted...` markers, as on 3.4a (2026-10-25). Beneath it:
"25 logical extents × 4.00 MiB = 100 MiB, taken from the VG's free extents",
which ties back to 3.4a's arithmetic. `check:slides`: 23.2px clearance.

Components: default layout, fixed `TerminalWindow` with line highlights,
`AccentText` with `hue`.

##### 4.7 Exercise: Create a Logical Volume

Source L22.

- **Goal:** Carve a logical volume (slate) from `vg_data` and mount it at
  boot
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create a
  Volume Group
- **Workflow:** 1. Create a logical volume (slate) named `lv_data` using all
  available space in `vg_data`; 2. Format `lv_data` with an XFS file system;
  3. Persistently mount `lv_data` on `/data`; 4. Verify with `lsblk`, `df`,
  and `lvdisplay`

The source asked for ext4; it is XFS since 2026-10-26 (Decision 49). `/data`
is both 4.8's mount point and this exercise's, as in the source (Decision 21).
`check:slides`: 144.84px clearance.

Exercise files, written 2026-10-25, moved to XFS on 2026-10-26, and run in the
exercise chain:

- `create-logical-volume-exercise.sh`, 46 presses (`kitty-demo --check`), the
  source's `create_logical_volume.sh` in the current format: `lvcreate --name
  lv_data --extents 100%FREE vg_data`, `lvs`, `mkfs.xfs`, `mkdir /data`, the
  `/etc/fstab` edit in `vim` (`G` and `o` with `#@ noenter`, the line
  `/dev/vg_data/lv_data /data xfs defaults 0 0` typed with `#@ noenter` and
  held 5 seconds, `#@ key escape`, `:wq`, in place of the source's `jj:wq`),
  `cat /etc/fstab`, `systemctl daemon-reload`, `mount /data`, then `lsblk`,
  `df -h /data`, and `lvdisplay`, each cleared before the next (the source
  ran the three together). `#!` notes give the 127 extents behind 508 MiB,
  that XFS is RHEL's default and needs more than 300 MB, why the LV path can
  stand in for a UUID, and Current LE 127. Pauses: 8 on the intro, 5 on
  `lvs`, `mkfs.xfs`, the typed line, `cat`, and each verification. No
  cleanup: exercise 4 fills and grows `lv_data`.
- `create-logical-volume-exercise.html`, with the hue classes. It gives the
  `vim` keys in prose, says XFS is RHEL's default and quotes `mkfs.xfs`'s
  refusal below 300 MB ("Filesystem must be larger than 300MB."), and gives
  the expected results: `lvs` at 508.00m; `lsblk` with `vg_data-lv_data`
  (508M) under `sdb1`; `df` naming `/dev/mapper/vg_data-lv_data` at 444M,
  since XFS's internal log takes 64 MiB (16384 blocks of 4 KiB, from
  `mkfs.xfs`'s output); and `lvdisplay` with 508.00 MiB and 127 LEs.
  `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 4.7a Exercise recording (pending)

**Addition.** Recording variant for `create-logical-volume-exercise.cast`.

### 5. `extending-lvm.md` (8 slides), built 2026-10-25

`routeAlias: extending-lvm`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Extend a Logical Volume Exercise, declared in `topicInfo`, its
files built with the slides. Built and checked with `check:entry`,
`check:slides`, and `check:exercises`, and every slide and click state captured
at 1920x1080; it waits on the instructor's review. Fragments 1 to 4 introduce
and create; this one grows each layer (Decision 34), one slide per layer: 3.6
the VG, 5.2a the LV, 5.2b the file system. Its procedure slide, 5.2, was built
here and moved to fragment 8 the same day (Decision 40). Layer terms keep the
color key.

##### 5.1 Extending LVM

Source L24. Section slide.

Components: `section`.

##### 5.1a How LVM Storage Grows

**Addition, from O9 and O10** (Decision 11). The plan's title was "Extend a
Logical Volume", the same as 5.2's; retitled so the overview and the procedure
differ. Left: "Each layer grows with its own command, from the bottom up" over
O10's three rows as a table of layer and command, colored like 1.3a (volume
group, `vgextend`; logical volume, `lvextend`; file system, `xfs_growfs` or
`resize2fs`), then "The file system stays mounted the whole time". Right: O9's
picture rebuilt in Mermaid: a disk and PV, a "New disk" and "New Physical
Volume" in blue joining the VG by a dashed link, the VG teal, and above it the
LV (slate) and file system, each labeled "grows". O9's green box around the
new disk is the blue fill and the "New" labels. The two-line "grows" labels
made the diagram 16.3px too tall at 1.3's scale of 0.72, so it uses 0.66. The
instructor widened the left column from 58 to 65 (2026-10-25).
`check:slides`: 28.81px clearance.

Components: `two-cols-header`, Markdown table, Mermaid diagram, `AccentText`
with `hue`.

##### 3.6 Extend a Volume Group

Source L14, **moved from fragment 3** (Decision 34) and dropped in from the
source kept here: "`vgextend` adds a PV to an existing VG" with "Adds capacity
without affecting mounted file systems" beneath it, over one terminal with
`pvcreate /dev/sdc1` and `vgextend vg01 /dev/sdc1` and their output, from the
round 1 slide chain. The instructor removed its `<div>` group and centered it
vertically (2026-10-25). The source shows only `vgextend`, on a `sdc1` no
slide has created; the `pvcreate` follows Decision 15. 5.2, whose second step
repeats `vgextend`, moved to the practice fragment (Decision 40), which settles
Decision 37. `check:slides`: 99.39px clearance.

Components: default layout with `vertical: center`, fixed `TerminalWindow`,
`AccentText` with `hue`.

##### 5.2a Extend a Logical Volume

**Addition, from 5.2's third state** (Decision 40, the instructor's design,
2026-10-25). "`lvextend` grows an LV into free extents in its VG" over a
terminal with round 1's real output for `lvextend --size +100M
/dev/vg01/lv01` ("Size of logical volume vg01/lv01 changed from 100.00 MiB (25
extents) to 200.00 MiB (50 extents)." and "Logical volume vg01/lv01
successfully resized."), then "A `+` adds to the current size" over 4.4's two
`+` rows (Decision 35): `-L +500M` / `--size +500M` adds 500 MiB, and `-l +50`
/ `--extents +50` adds 50 LEs (both verified in the fragment 5 side test), and,
since 2026-10-26, `-l +100%FREE` / `--extents +100%FREE` adds every free extent
in the VG (Decision 46; exercise 7 uses it). The terminal follows fragments 2
to 4's convention of output for every command on a concept slide.
`check:slides`: 12.78px clearance with the third row.

Components: default layout, fixed `TerminalWindow`, Markdown table,
`AccentText` with `hue`.

##### 5.2b Grow the File System

**Addition, from 5.2's fourth and fifth states** (Decision 40). "`lvextend`
grows the LV, not the file system inside it", then two columns: "XFS" with
"`xfs_growfs` takes the mount point" over `xfs_growfs /data`, and "ext4" with
"`resize2fs` takes the device" over `resize2fs /dev/vg01/lv01`; then, across
both, "Or do both at once: `--resizefs` runs the right tool for XFS or ext4"
over `lvextend --resizefs --size +100M /dev/vg01/lv01`. The source's "online
only" for XFS is carried by "takes the mount point"; a longer sentence wrapped
and left the two columns' commands at different heights. Its "online or
offline" for ext4 is left out, as on 5.2. Verified: `resize2fs` and
`--resizefs` on ext4 in round 1, `xfs_growfs` on a mount point and
`--resizefs` on XFS (it ran `xfs_growfs` itself) in the fragment 5 side test.
`check:slides`: 20px clearance.

Components: `two-cols-header` with `::bottom::`, `bash` fences, `AccentText`
with `hue`.

##### 5.3 Aside: Fill a File or Device with `dd`

Source L26, whose title joined "Aside: `dd`" and "Fill a File or Device" with a
dash, now one phrase. "`dd` copies data from an input file (`if=`) to an output
file (`of=`) block by block", the two terms in the deck accent; "`/dev/zero` is
a special file that produces endless zeros"; then, as Decision 14 proposes, a
fixed `TerminalWindow` with real output: `dd: error writing '/data/bigfile': No
space left on device` and the records and bytes lines. Since 2026-10-26 the
command uses `bs=4k`, as exercise 4 does (Decision 50), recaptured on a 300 MiB
XFS `lv01` on `/data` in a side test on `sdd` (216 MiB copied, 28K left); it
first showed `bs=1M` on round 1's 100 MiB ext4 `lv01`. The source showed the
command only, and its note
said "the shell prints" the error; `dd` prints it, so the `Callout` now reads
"Without a `count=` limit, `dd` keeps writing until the destination is full" and
the terminal shows the message. `check:slides`: 43.05px clearance.

Components: default layout, `AccentText`, fixed `TerminalWindow`, `Callout`.

##### 5.4 Exercise: Extend a Logical Volume

Source L27.

- **Goal:** Grow a full logical volume (slate) without unmounting it
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create a
  Logical Volume
- **Workflow:** 1. Fill `lv_data` completely; 2. Confirm that further writes
  fail with "No space left on device"; 3. Add a 512 MiB `lvm` partition on
  `/dev/sdc` to `vg_data` without unmounting `/data`; 4. Extend `lv_data` by
  200 MiB; 5. Grow the XFS file system; 6. Confirm that writes to `/data`
  succeed again

The source's step 5 said XFS while its command file ran `resize2fs`; with XFS
throughout (Decision 49), the slide and the command file now both say XFS and
run `xfs_growfs /data`, reversing Decision 25. Its step 3 ended with a dash and
"do not unmount `/data`", now "without unmounting `/data`". `check:slides`:
99.19px clearance.

**XFS changes step 1** (verified 2026-10-26). After the source's `dd ...
bs=1M` fills the 508 MiB XFS volume, `df` still shows about 820K available, and
`echo "test" > /data/testfile` succeeds, so step 2 shows no failure. Tested on
a matching volume: a 1 MiB write fails every time; a second `bs=1M` `dd` fails
but leaves `echo` working; filling with `bs=4k`, XFS's block size, leaves 28K
and makes `echo` fail. The instructor chose `bs=4k` and the `echo`, which lands
harder in class than a second `dd` (Decision 50). In the chain on `lv_data`,
the `bs=4k` fill and the `echo` were repeated four times: 28K left and "-bash:
/data/testfile: No space left on device" every time. On XFS the shell cannot
create the file at all, so the message names the file rather than ext4's
"echo: write error", and no empty `testfile` is left.

Exercise files, written 2026-10-25, moved to XFS and 512 MiB on 2026-10-26, and
run in the exercise chain:

- `extend-logical-volume-exercise.sh`, 71 presses (`kitty-demo --check`):
  `df -h /data` and `dd if=/dev/zero of=/data/bigfile bs=4k` to fill it; `df
  -h /data` and the `echo` that fails; an interactive `parted /dev/sdc`
  session like exercise 1's (`pv2`, the type accepted with `#@ key enter`,
  `1MiB` to `513MiB`, in place of the source's name `1`, type `ext4`, and
  `256MiB`); `udevadm settle`, `pvcreate /dev/sdc1`, `vgextend vg_data
  /dev/sdc1`, `vgs vg_data`; `lvextend --size +200M`, `lvs vg_data`;
  `xfs_growfs /data`, `df -h /data`; and the `echo` again, followed by `cat
  /data/testfile`. `#!` notes explain the expected `dd` error, why `bs=4k`,
  that not even a 5-byte file fits, the `513MiB` boundary, the 508 MiB the new
  PV adds, the 127 to 177 extents, and that `xfs_growfs` takes the mount
  point. Pauses: 10 on the twelve-line intro, 5 on `df`, the failing `echo`,
  `print`, `vgs`, `lvs`, `df` after `xfs_growfs`, and `cat`, and 6 on the
  filling `dd`. No cleanup: exercise 5 removes it all.
- `extend-logical-volume-exercise.html`, from the 2026-10-26 runs: `df` at
  444M with 410M available, `dd` writing 4 KiB blocks and stopping at about
  410 MiB, `df` at 100% with about 28K left, the `echo`'s failure (no
  `testfile` is created), the `parted` session for `/dev/sdc`, `vgs` at
  1016.00m with 508.00m free, `lvextend`'s 508.00 MiB (127 extents) to 708.00
  MiB (177 extents), `xfs_growfs` and `df` at 644M with about 197M available,
  and the `echo` succeeding with `cat` printing `test`. A note callout, "One
  command for both", gives `lvextend --resizefs` and the ext4 form,
  `resize2fs`. `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 5.4a Exercise recording (pending)

**Addition.** Recording variant for `extend-logical-volume-exercise.cast`.

### 6. `removing-lvm.md` (8 slides), built 2026-10-25

`routeAlias: removing-lvm`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercise: Remove the LVM Setup Exercise, declared in `topicInfo`, its files
built with the slides. Built and checked with `check:entry`, `check:slides`,
and `check:exercises`, and every slide and click state captured at 1920x1080;
it waits on the instructor's review. One concept slide per step, as in
fragment 5: 6.1a the unmount, 6.2 the LV, 6.3 the VG, 6.4 the PV, 6.6 the disk.
Its procedure slide, 6.5, was built here and moved to fragment 8 the same day
(Decision 41). Transcripts come
from round 1's slide chain, except 6.2's, retaken in the fragment 6 side test
in a terminal so the typed `y` shows where a student sees it.

##### 6.1 Removing LVM

Source L28. Section slide.

Components: `section`.

##### 6.1a Unmount a Logical Volume

**Addition, the instructor's request** (Decision 42, 2026-10-25). "`umount`
detaches the file system; LVM refuses to remove an LV that is still mounted"
over a terminal with `umount /data`, `vim /etc/fstab`, and `systemctl
daemon-reload`, none of which print anything; then "Delete the LV's line in
`vim`" over a `text [/etc/fstab]` fence with `/dev/vg01/lv01 /data xfs
defaults 0 0`, the line 4.8's procedure appends (`ext4` until Decision 49);
then a `Callout type="warning"`, which the instructor shortened to "A leftover
entry makes the next boot stop in emergency mode", with "emergency mode" in
red (the fragment 6 check under "The exercise chain"). Built from 6.5's first step,
which said the same in bullets before it moved to fragment 8. "In `vim`, delete" left a gap before the
comma, as on 2.4, so `vim` ends the sentence. 6.2 still opens with `umount
/dev/vg01/lv01`, which now repeats this slide's point by device instead of by
mount point. `check:slides`: 29.22px clearance.

Components: default layout, fixed `TerminalWindow`, `text` fence with a
title, `Callout`, `AccentText` with `hue`.

##### 6.2 Remove a Logical Volume

Source L29. "`lvremove` removes an LV and frees its extents in the VG" over a
terminal: `umount /dev/vg01/lv01` (the source's form, verified: `umount`
takes the device as well as the mount point), then `lvremove /dev/vg01/lv01`
with "Do you really want to remove active logical volume vg01/lv01? [y/n]: y"
and "Logical volume "lv01" successfully removed.". The source said
"Irreversible" twice, as its first bullet and as a closing quote; it is now
said once, in a `Callout type="danger"`: "**Irreversible**: all data on the LV
is destroyed". `check:slides`: 61.55px clearance.

Components: default layout, fixed `TerminalWindow`, `Callout`, `AccentText`
with `hue`.

##### 6.3 Remove a Volume Group

Source L30. "`vgremove` removes a VG and releases its PVs back to an
unassigned state" (the source's two lines as one) over `vgremove vg01` and
"Volume group "vg01" successfully removed". The source's closing note, "All
Logical Volumes must be removed before removing the VG", is wrong; a `Callout
type="warning"` says instead "`vgremove` asks before removing a VG that still
holds LVs, and on `y` removes them too" (Decision 18). Verified in the side
test: on a VG holding an active LV, `vgremove` asks "Do you really want to
remove volume group "vg01" containing 1 logical volumes? [y/n]:", then "Do
you really want to remove active logical volume vg01/lv01? [y/n]:", and on two
`y`s removes both; answered `n` (round 1), it prints "Volume group "vg01" not
removed" and exits 5. `check:slides`: 70.39px clearance.

Components: default layout, fixed `TerminalWindow`, `Callout`, `AccentText`
with `hue`.

##### 6.4 Remove a Physical Volume

Source L31, with its typos ("Phsical Voulme") fixed. "`pvremove` removes the
LVM label from a device" over `pvremove /dev/sdb1` and "Labels on physical
volume "/dev/sdb1" successfully wiped.", then "The partition itself is not
deleted". `check:slides`: 68.2px clearance.

Components: default layout, fixed `TerminalWindow`.

##### 6.6 Wipe the Disk

Source L33. "`wipefs` erases the signatures that identify a file system,
partition table, or LVM label", then "The data stays on the disk, but nothing
can find it" (the source's "leaves the rest of the data untouched (but
inaccessible)"). The source said it "zeros metadata regions", which overstates
it: `wipefs` erases the few bytes of each signature, as the output shows. A
terminal with round 1's real output for `wipefs --all /dev/sdb`: the GPT
signature at the start and at the end of the disk, the protective MBR, and
"calling ioctl to re-read partition table: Success" (Decision 14; the source
showed the command only). `check:slides`: 55.7px clearance.

Components: default layout, fixed `TerminalWindow`.

##### 6.7 Exercise: Remove the LVM Setup

Source L34.

- **Goal:** Tear down the LVM stack in the reverse order of creation
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Extend a
  Logical Volume
- **Workflow:** 1. Unmount `/data` and remove its `/etc/fstab` entry;
  2. Remove the logical volume (slate); 3. Remove the volume group (teal);
  4. Remove the physical volumes (blue) on `/dev/sdb1` and `/dev/sdc1`; 5. Wipe
  the `/dev/sdb` and `/dev/sdc` disks

The source's requirement line, "Teardown order is the reverse of creation",
moved into the goal, since the environment slot lists only hosts and
prerequisites. `check:slides`: 122.84px clearance.

Exercise files, written 2026-10-25 and run on `servera` from exercise 4's end
state (see "The exercise chain"):

- `remove-lvm-setup-exercise.sh`, 50 presses (`kitty-demo --check`), the
  source's `remove_lvm.sh` in the current format. Step 1: `umount /data`; the
  `/etc/fstab` edit in `vim` as the source wrote it (`/lv_data` to find the
  line, `dd` with `#@ noenter`, `:wq`); `cat /etc/fstab`; `systemctl
  daemon-reload`; and `rmdir /data` (Decision 23). Step 2: `lvremove` with its
  `y` answer on its own line, which the source left out (the command would
  have waited at the question), then `lvs`. Steps 3 and 4: `vgremove vg_data`
  and `vgs`; `pvremove /dev/sdb1 /dev/sdc1` and `pvs`. Step 5: `wipefs --all`
  on each disk, written long as on 6.6 (the source used `-a`), then `lsblk`;
  the source's `wipefs -n` dry runs are gone (Decision 24). `#!` notes give
  the emergency-mode reason, what `dd` deletes, the irreversibility, and that
  the partitions outlive `pvremove`. The source's dash notes and arrow line
  are rewritten. Pauses: 10 on the eleven-line intro, 5 on `cat`, `lvs`,
  `vgs`, `pvs`, and the closing `lsblk`.
- `remove-lvm-setup-exercise.html`, built from exercise 4's page. It gives the
  `vim` keys in prose, a warning callout, "Remove the entry before the next
  reboot" (the 90-second wait and emergency mode), `lvremove`'s question and
  answer, what to do if it reports `contains a filesystem in use`, and the
  expected `lvs`, `vgs`, `pvs`, `wipefs`, and `lsblk` results.
  `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 6.7a Exercise recording (pending)

**Addition.** Recording variant for `remove-lvm-setup-exercise.cast`.

### 7. Swap Space on Logical Volumes, dropped 2026-10-26

Dropped by the instructor before it was built (Decision 45), with exercise 5a
(Decision 30). Its section slide (L35) is gone; its one content slide (L36) is
not built, and its steps are proposed for 4.8 (Decision 47). Swap on an LV
moves into the practice fragment, where exercises 6 to 8 create, extend, and
remove a swap LV beside `lv_records`.

Compared with w10's swap fragment and exercise, the fragment's only new points
were that the swap device is an LV path made with `lvcreate`, that
`/etc/fstab` can name that path, and that `swapon --show` lists the LV as
`/dev/dm-N`; fragment 4 already teaches the last two (4.5). What RH134 chapter
11 adds, extending a swap LV (RH134 ch11 section 3: `swapoff`, `lvextend`,
`mkswap`, `swapon`, with a warning that turning swap off on a busy system can
run it out of memory), the source never had; exercise 7 now does it.

### 8. `lvm-practice.md` (10 slides), built 2026-10-26

`routeAlias: lvm-practice`. Alignments: RH134 chapter 11, cert guide chapter
15. Exercises: Create LVM Storage Exercise, Extend LVM Storage Exercise, and
Remove LVM Storage Exercise, declared in `topicInfo`, their files built with
the slides. Built and checked with `check:entry`, `check:slides`, and
`check:exercises`, and every slide and click state captured at 1920x1080; it
waits on the instructor's review.

The fragment has two purposes (Decision 43, the instructor, 2026-10-25):

1. **Creation in one exercise.** Fragments 2 to 4 build the stack a layer at
   a time, one exercise per layer; exercise 6 goes from partition to
   persistent mount in one pass.
2. **A reference set.** The three procedures, 4.8 (create), 5.2 (extend), and
   6.5 (remove), give every step with minimal instruction, so students can
   come back to them as a refresher. The concept slides in fragments 2 to 6
   do the teaching.

Since fragment 7 was dropped (Decision 45), it also carries swap on an LV:
exercise 6 creates `/records` and a swap LV on the two blank disks, exercise
7 adds the third disk and extends both, and exercise 8 removes it all. Each
procedure sits right before the exercise that uses it (Decision 48), and each
was trimmed to steps and commands (Decision 44) and given the swap steps
(Decision 47). Every procedure command, swap steps included, ran in the
fragment 8 side test, and every exercise ran on the chain (see "The exercise
chain").

##### 8.1 LVM Practice

Source L37 ("Practice"), retitled (Decision 2). Section slide; not on the
cover's agenda (Decisions 5 and 48).

Components: `section`.

##### 4.8 Procedure: Create a Logical Volume

Source L23, built in fragment 4 and moved here (Decision 38). Seven click
states, each an `h3` step heading over a commands-only `bash` fence: create a
partition (`parted /dev/sdb mklabel gpt`, `mkpart primary 1MiB 512MiB`, `set 1
lvm on`, `udevadm settle`); create the PV (`pvcreate`, `pvdisplay`); create
the VG (`vgcreate vg01 /dev/sdb1`, `vgdisplay`); create the LV (`lvcreate
--name lv01 --size 300M vg01`, `lvdisplay`); create the file system
(`mkfs.xfs` since Decision 49; the 300 MiB LV is large enough, verified); mount
it persistently (`mkdir /data`, the `echo ... >> /etc/fstab` line with `xfs`,
`systemctl daemon-reload`, `mount /data`); and, new, "Step
7: Add swap space on an LV" (`lvcreate --name swap01 --size 200M vg01`,
`mkswap`, `echo "/dev/vg01/swap01 swap swap defaults 0 0" >> /etc/fstab`,
`systemctl daemon-reload`, `swapon -a`), from source L36 (Decision 47). Its
two callouts (`udevadm settle`, the XFS minimum) are gone (Decision 44); 2.2a
and the fragment 4 slides teach both. `swap01` is 200 MiB because `vg01` here
is 508 MiB and `lv01` takes 300 (Decision 19's 512 MiB would not fit).
`check:slides`: 236.64px clearance or more in every state.

Components: default layout with `vertical: start`, `v-switch at="1"` with seven
templates, `bash` fences, `AccentText` with `hue`.

##### 8.2 Exercise: Create LVM Storage

Source L38 ("Large LV Spanning Two Disks"), redesigned by the instructor
(Decision 45), details accepted (Decision 46).

- **Goal:** Pool two blank disks into one volume group (teal) that holds a
  file system and swap space
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Remove the
  LVM Setup
- **Workflow:** 1. Create an `lvm` partition using all of `/dev/sdb`, and
  another using all of `/dev/sdc`; 2. Initialize both as physical volumes
  (blue) and create a volume group (teal) named `vg_storage` from them;
  3. Create a 1 GiB logical volume (slate) named `lv_swap`, and one named
  `lv_records` from the rest of the space; 4. Format `lv_records` with XFS and
  persistently mount it on `/records`; 5. Format `lv_swap` as swap space and
  persistently activate it; 6. Verify with `lsblk`, `df`, and `swapon --show`

`check:slides`: 145.67px clearance.

Exercise files, written 2026-10-26 and run on `servera` from exercise 5's end
state:

- `create-lvm-storage-exercise.sh`, 92 presses (`kitty-demo --check`).
  Partitions in command mode, as 4.8 shows (`mkpart primary 1MiB 100%`);
  `pvcreate` and `vgcreate` on both; `lvcreate` for `lv_swap` and for
  `lv_records` (`--extents 100%FREE`), each followed by a `y` line, since
  with XFS in exercises 3 and 4 both ask "Wipe it?" (Decision 49); `mkfs.xfs`,
  `mkdir /records`, and the `vim` line `/dev/vg_storage/lv_records /records
  xfs defaults 0 0`, `daemon-reload`, `mount /records`; `mkswap`, the `vim`
  line `/dev/vg_storage/lv_swap swap swap defaults 0 0`, `tail -3`,
  `daemon-reload`, `swapon -a`; then `lsblk`, `df -h /records`, `swapon
  --show`. `#!` notes explain the `Wipe it?` question, the 9 GiB volume that
  spans both disks, the swap line's mount point, and `dm-2`. Pauses: 10 on
  the intro, 5 on the outputs before each `clear` and on the typed lines.
- `create-lvm-storage-exercise.html`: the same steps, the `Wipe it?` question
  explained, a warning callout on spanning two disks (Decision 27), and the
  expected `lvs`, `lsblk`, `df` (9.0G), and `swapon --show` (`/dev/dm-2`)
  results. `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 8.2a Exercise recording (pending)

**Addition.** Recording variant for `create-lvm-storage-exercise.cast`.

##### 5.2 Procedure: Extend a Logical Volume

Source L25, built in fragment 5 and moved here (Decision 40), restored to
`vertical: start` (Decision 44). Six click states: create a PV on the new disk
(with "Skip steps 1 and 2 if the VG already has enough free extents"); add the
PV to the VG; extend the LV; grow the file system ("XFS: `xfs_growfs` takes
the mount point", "ext4: `resize2fs` takes the device"); the `--resizefs`
alternative; and, new, "For a swap LV: extend it with the swap off"
(`swapoff`, `lvextend --size +100M /dev/vg01/swap01`, `mkswap`, `swapon`),
from RH134 chapter 11 (Decision 47). The option table stayed on 5.2a, and the
"Adds capacity", "No impact", and "Adds 100 MiB" bullets and the `--resizefs`
sentence are gone (Decision 44). `check:slides`: 166.45px clearance or more in
every state.

Components: default layout with `vertical: start`, `v-switch at="1"` with six
templates, `bash` fences, `AccentText` with `hue`.

##### 8.3 Exercise: Extend LVM Storage

Source L39 ("Persistent Swap on an LV"), redesigned (Decisions 45 and 46).

- **Goal:** Grow a file system and swap space onto a third disk
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create LVM
  Storage
- **Workflow:** 1. Create an `lvm` partition using all of `/dev/sdd` and add it
  to `vg_storage`; 2. Extend `lv_swap` by 1 GiB; 3. Extend `lv_records` with
  the rest of the free space and grow its file system; 4. Verify with `vgs`,
  `df`, and `swapon --show`

`check:slides`: 144.84px clearance.

Exercise files, written 2026-10-26 and run from exercise 6's end state:

- `extend-lvm-storage-exercise.sh`, 46 presses. `vgs` (nothing free), the
  `sdd` partition, `pvcreate`, `vgextend`, `vgs` (about 5 GiB free);
  `swapoff`, `lvextend --size +1G`, `mkswap`, `swapon`, `swapon --show`;
  `lvextend --resizefs --extents +100%FREE`; then `vgs`, `df -h /records`,
  and `swapon --show`. `#!` notes say why swap must be off, that `mkswap`
  gives a new UUID while `/etc/fstab` names the LV path, and that
  `--resizefs` runs `xfs_growfs`. Pauses: 8 on the intro, 5 on `vgs`,
  `mkswap`, and the `swapon --show`s, 6 on the `lvextend --resizefs` output.
- `extend-lvm-storage-exercise.html`, with the expected results (14.99g and
  5.00g free, 1 to 2 GiB, the "wiping old swap signature" warning, 13G) and a
  note, "Why /etc/fstab still works". `check:exercises` passes it.

The `+100%FREE` form is the third row added to 5.2a's table (Decision 46).

Components: `exercise`.

##### 8.3a Exercise recording (pending)

**Addition.** Recording variant for `extend-lvm-storage-exercise.cast`.

##### 6.5 Procedure: Remove LVM

Source L32 ("Removing LVM Components"), built in fragment 6 and moved here
(Decision 41). "Teardown order: **Swap off and unmount → LV → VG → PV**, the
reverse of creation", then three click states: "Step 1: Swap off, unmount, and
remove the LVs" (`swapoff /dev/vg01/swap01`, `umount /data`, `vim /etc/fstab
# Remove both entries`, `systemctl daemon-reload`, `lvremove /dev/vg01/lv01
/dev/vg01/swap01`); "Step 2: Remove the VG and PVs" (`vgremove vg01`,
`pvremove /dev/sdb1 /dev/sdc1`); and "Step 3: Wipe the disks" (`wipefs --all
/dev/sdb /dev/sdc`). Its bullets are gone (Decision 44); the swap steps are
Decision 47. Two fixes for the reference set: `pvremove` named `/dev/sdb2`,
which came from the slide chain, not from 4.8 and 5.2, so it now names only
`sdb1` and `sdc1`; and the wipe step, which exercise 8 needs, is added from
6.6. `check:slides`: 191.64px clearance or more.

Components: default layout with `vertical: start`, `v-switch at="1"` with three
templates, `bash` fences, `AccentText` with `hue`.

##### 8.4 Exercise: Remove LVM Storage

**Addition** (Decision 45).

- **Goal:** Return all three disks to blank
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Extend LVM
  Storage
- **Workflow:** 1. Deactivate the swap space and unmount `/records`; 2. Remove
  both entries from `/etc/fstab`; 3. Remove both logical volumes (slate), the
  volume group (teal), and the three physical volumes (blue); 4. Wipe
  `/dev/sdb`, `/dev/sdc`, and `/dev/sdd`

`check:slides`: 145.67px clearance.

Exercise files, written 2026-10-26 and run from exercise 7's end state:

- `remove-lvm-storage-exercise.sh`, 48 presses. `swapoff`, `umount /records`,
  `swapon --show`; the `vim` edit (`/vg_storage`, `dd` twice with `#@
  noenter`, `:wq`), `tail -3`, `daemon-reload`, `rmdir /records` (Decision
  23); `lvremove` of both LVs with a `y` line for each question, `vgremove`,
  `pvremove` of all three, `pvs`; `wipefs --all` on all three disks in one
  command, and `lsblk`. Pauses: 8 on the intro, 5 on `swapon --show`, `tail`,
  `pvs`, and `lsblk`.
- `remove-lvm-storage-exercise.html`, with the `vim` keys in prose, the
  emergency-mode warning, `lvremove`'s two questions, and the expected
  results. `check:exercises` passes it.

Components: `exercise`, `AccentText` with `hue`.

##### 8.4a Exercise recording (pending)

**Addition.** Recording variant for `remove-lvm-storage-exercise.cast`.

## Exercises

| # | Title                                 | Frag | Command file                                  |
|--:|---------------------------------------|-----:|-----------------------------------------------|
| 1 | Initialize a Physical Volume          |    2 | `initialize-physical-volume-exercise.sh`      |
| 2 | Create a Volume Group                 |    3 | `create-volume-group-exercise.sh`             |
| 3 | Create a Logical Volume               |    4 | `create-logical-volume-exercise.sh`           |
| 4 | Extend a Logical Volume               |    5 | `extend-logical-volume-exercise.sh`           |
| 5 | Remove the LVM Setup                  |    6 | `remove-lvm-setup-exercise.sh`                |
| 6 | Create LVM Storage                    |    8 | `create-lvm-storage-exercise.sh`              |
| 7 | Extend LVM Storage                    |    8 | `extend-lvm-storage-exercise.sh`              |
| 8 | Remove LVM Storage                    |    8 | `remove-lvm-storage-exercise.sh`              |

All on `servera`. Each declared title ends in "Exercise". Exercises 1 to 5
port their source command files, rewritten to the current `kitty-demo` format,
with an `.html` written version beside each. Exercises 6 to 8 are the
instructor's redesign of the source's two Practice exercises (Decision 45);
the source's `multi_disk_logical_volume.sh` and `lvm_swap.sh` supply their
command forms. Exercise 5a was dropped with fragment 7.

**The chain.** One pass, in order, with no resets:

1. `sdb1` (512 MiB, `lvm`) becomes a PV
2. `vg_data` (508 MiB) from `sdb1`
3. `lv_data` (all of `vg_data`, XFS) on `/data`, in `/etc/fstab`
4. `/data` filled; `sdc1` (512 MiB) added to `vg_data`; `lv_data` grown 200
   MiB, XFS with it
5. All of it removed, `/data` deleted, `sdb` and `sdc` wiped
6. `sdb1` and `sdc1` (all of each disk) in `vg_storage`; `lv_swap` (1 GiB)
   and `lv_records` (the rest, XFS) on `/records`; both in `/etc/fstab`
7. `sdd1` (all of `sdd`) added; `lv_swap` grown 1 GiB with swap off;
   `lv_records` grown into the rest, its file system with it
8. All of it removed: swap off, `/records` unmounted and deleted, both
   `/etc/fstab` lines removed, systemd reloaded, both LVs, the VG, and the
   three PVs removed, and the three disks wiped

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
  `/etc/fstab` edit, and 6 after `dd` and `lvcreate --resizefs` on a large
  volume. No exercise reboots (Decision 46).
- Exercises 1 and 4 make 512 MiB partitions, `1MiB` to `513MiB`, large enough
  for XFS (Decisions 22 and 49).
- Interactive `parted`: the sources answer the GPT name prompt with `1` and the
  file system type with `ext4` or `xfs`. Verified: on GPT, `mkpart` asks
  `Partition name?  []?` and then `File system type?  [ext2]?`, and whatever
  the type answer, including Enter for the default, `print` in the same
  session shows it (`ext2`) beside the `lvm` flag; a later `parted print`
  shows the column empty. Exercises 1 and 4 name each partition for what it
  holds (`pv1`, `pv2`), press Enter at the type, and the written exercise says
  the type is only a hint, since `set 1 lvm on` is what marks the partition.
  The practice exercises use command mode, as 4.8 and 5.2 show, which never
  asks.
- XFS throughout (Decision 49): exercise 3 formats with `mkfs.xfs`, and
  exercise 4 grows with `xfs_growfs /data`; its fill uses `bs=4k`, since after
  a `bs=1M` fill a tiny `echo` still fits on XFS (Decision 50, see 5.4).
- Exercise 5 drops the `wipefs -n` dry runs, a flag no slide teaches, and checks
  the result with `lsblk` instead (Decision 24). It removes `/data` at the end
  (Decision 23).
- Exercises 6 to 8 are written fresh to the instructor's design (Decision 45),
  so the source's `pvs` without a `clear` and its missing cleanup no longer
  apply. Their swap lines use `swap` as the mount point (Decision 20).
- **`lvcreate` stops to ask, twice in exercise 6.** Teardown leaves old file
  system signatures on the sectors, and `lvcreate` checks the start of each
  new LV. After exercise 5, `lv_swap` starts where `lv_data` began, on its XFS
  superblock, and `lv_records` starts at the beginning of `sdc1`, where
  `lv_data`'s XFS kept a copy of its superblock after growing onto that disk
  (verified: `lv_records` is allocated from `/dev/sdc1(0)` first). Each
  prints "WARNING: xfs signature detected on /dev/vg_storage/... at offset 0.
  Wipe it? [y/n]:" and, on `y`, "Wiping xfs signature on ...". With no
  terminal on standard input `lvcreate` answers `[n]` itself and aborts
  ("Failed to wipe start of new LV."), exit 5. `kitty-demo` types into a
  terminal, so the command file answers `y` on its own line after each, and
  the written exercise explains both questions. With ext4 in exercises 3 and
  4, only `lv_swap` asked.

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
6. **Real output on 5.3 and 6.6**, and optionally 5.2 (Decision 14).
7. **Recording slides for all eight exercises.** The Slidev deck has none; the
   ODP had GIFs for its two.
8. **The spanning caution in exercise 6's written version** (Decision 27).
9. **Exercise 8, Remove LVM Storage, and exercise 5's `rmdir /data`**
   (Decisions 23 and 45), so the chain ends where the week started.
10. ~~**Exercise 5a, Create Swap Space on a Logical Volume (slide 7.3)**~~,
    dropped 2026-10-26 with fragment 7 (Decision 45).

## Corrections

To verify on the lab where marked; the rest are typos and logic.

- Typos: "Initalized" (L5), "Physoical" (L7), "Partiton" (L17), "xfs_grow"
  (L25), "Phsical Voulme" (L31), "an Logical Volume" (L36). "Filesystem"
  becomes "file system" throughout.
- L13: comments and a blank line were added to `pvdisplay` output by hand.
  The slide was later removed (Decision 32).
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
- **L13, Physical Extent (PE) Fields from `pvdisplay`** (Decision 32), whose
  lesson moved to 3.4a's highlighted `vgdisplay` lines.
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
and 5 about 3 to 5 minutes, exercises 1 and 3 about 6, exercises 4, 6, and 7
about 8 to 10 each, and exercise 8 about 5. That is a little over two hours,
inside the 2.5-hour class, with less margin than it looks once questions start.

Decided by the instructor on 2026-10-24: cut nothing until the slides and
exercises are built, as with w10. Candidates then, with what each loses:

- **Run exercise 5 as a demonstration.** Loses hands-on teardown, which is also
  what students need to recover their own VM.
- **Assign the Practice exercises as homework.** Loses the in-class run of the
  three exercises closest to the graded lab.

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

**Round 5**, 2026-10-25, a PV on a whole disk against one on a flagged
partition, for 2.2's "a partition, a whole disk, or a RAID device". `pvcreate
/dev/sdc` on the bare disk and `pvcreate /dev/sdb1` on a 256 MiB partition
flagged `lvm`:

- `parted /dev/sdc print`: "Error: /dev/sdc: unrecognised disk label",
  "Partition Table: unknown", exit 1. `sdb` lists partition 1 with the `lvm`
  flag.
- `fdisk -l /dev/sdc` prints only the disk's size and geometry, the same as a
  blank disk. `sdb` shows "Disklabel type: gpt" and `/dev/sdb1 ... 256M Linux
  LVM`.
- Plain `lsblk` shows `sdc` as a bare disk with nothing under it; only
  `lsblk -f` and `blkid` report `LVM2_member`. `sdb` shows `sdb1` beneath it.
- `fdisk /dev/sdc`, opened interactively, warns "The device contains
  'LVM2_member' signature and it will be removed by a write command", then
  offers a new DOS label. On `sdb` it opens the GPT quietly.
- **`parted` destroys a whole-disk PV without asking.** Interactive `mklabel
  gpt` on `sdc` wrote the label at once; afterwards `pvs /dev/sdc` reported
  "Failed to find physical volume". On `sdb` it asked "The existing disk label
  on /dev/sdb will be destroyed ... Yes/No?", and on `No` the PV survived.

Both course references put their own hands-on PVs on partitions: RH134's
examples, guided exercise, and lab (whose partitions run `1MiB` to `257MiB`,
as Decision 22 proposes), and the Cert Guide's exercise 15-1, which calls
partitions "recommended practice". `servera` was reverted to its snapshot
afterwards, and the baseline checks matched.

Still to verify during the build:

- `vgremove` answered `y` while an LV is mounted.
- `xfs_growfs` output, for 5.2 if Decision 14 takes it.
- ~~Whether exercise 6 prints the devices-file warning after exercise 5.~~ It
  does not (step 10 of the exercise chain).
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
2. `pvcreate /dev/sdb1` (2.3), `pvcreate /dev/sdb2`, `pvs` (2.4) and
   `pvdisplay /dev/sdb1` (2.4a)
3. `vgcreate vg01 /dev/sdb1` captured for 3.3 and undone, then `vgcreate vg01
   /dev/sdb1 /dev/sdb2`, `vgs` (3.4) and `vgdisplay vg01` (3.4a), and `pvdisplay
   /dev/sdb1` inside the VG (for 3.5, since removed)
4. `sdc1` from `1MiB` to `256MiB`, `lvm`; `pvcreate /dev/sdc1` and `vgextend
   vg01 /dev/sdc1` (3.6)
5. `lvcreate --name lv01 --size 100M vg01` (4.3), `ls -l` on both paths (4.5),
   `lvs` and `lvdisplay` (4.6)
6. `mkfs.ext4`, a temporary mount on `/data`, `dd` until full (5.3)
7. Optional outputs for 5.2 if Decision 14 takes them
8. `umount` and `lvremove` (6.2), `vgremove` (6.3), `pvremove /dev/sdb1`
   (6.4), the other two PVs, `wipefs --all /dev/sdb` (6.6), then `sdc`

`/etc/fstab` is not touched by the chain. Afterwards `/data` is removed, the
disks and `/etc/fstab` must match the baseline, and LVM's archives and
devices-file entries are cleared by a snapshot revert or by hand.

**The exercise chain.** `servera` stays in the state the last verified
exercise ends in, so each exercise is verified by running it on its
predecessor's result (the instructor, 2026-10-25). Started 2026-10-25 from the
baseline:

1. Exercise 1, as its command file runs it: the interactive `parted` session
   through a terminal, `udevadm settle`, `pvcreate /dev/sdb1`, `pvs` (256.00m,
   no VG).
2. Exercise 2: `vgcreate vg_data /dev/sdb1`; `vgs` and `vgdisplay vg_data`
   (252.00 MiB, 4.00 MiB extents, 63 total and free); `pvdisplay /dev/sdb1`
   now shows `vg_data`, Allocatable yes, and 4.00 MiB not usable.

3. A side test for fragment 4, on `sdd`, with `/etc/fstab`, LVM's devices
   file, and its archive and backup listings copied first: 4.8's procedure
   end to end (`parted` `1MiB` to `512MiB`, a 511 MiB PV, `vg01` at 508 MiB
   and 127 extents, `lv01` at 300 MiB and 75 LEs, `mkfs.ext4`, the appended
   `/etc/fstab` line, `daemon-reload`, `mount /data`); then, after unmounting
   and restoring `/etc/fstab`, 4.3's `lvcreate --name lv01 --extents 100%FREE
   vg01` and 4.4's rounding (`--size 10M` printed "Rounding up size to full
   physical extent 12.00 MiB"; `--extents 32` made 128.00m). The first
   `100%FREE` attempt hit the removed ext4 LV's signature and stopped at
   "Wipe it? [y/n]" (aborting with exit 5, as already recorded), so the
   signature was wiped with a throwaway `lvcreate --yes` and the capture
   retaken. Teardown: LVs, `vg01`, and the PV removed, `sdd` wiped and its
   first 4 MiB zeroed, the devices file restored from the copy, and the new
   archive and backup files deleted. Both hashes and all three listings
   matched the copies, `sdd` showed no signatures, `/data` was gone, and
   `vg_data` was untouched.
4. Exercise 3, as its command file runs it, with the `vim` keystrokes typed
   through a terminal: `lvcreate --name lv_data --extents 100%FREE vg_data`
   (252.00m), `mkfs.ext4`, `mkdir /data`, one line added to `/etc/fstab`
   (`/dev/vg_data/lv_data /data ext4 defaults 0 0`, checked by `diff`),
   `daemon-reload`, `mount /data` (no output); `lsblk` shows
   `vg_data-lv_data` 252M on `/data`, `df -h` 231M, and `lvdisplay` 63 LEs.

5. A side test for fragment 5, on `sdd`, copied and restored as in step 3:
   a 2 GiB partition, `vg01`, a 400 MiB XFS `lv01` mounted on a scratch
   directory; `lvextend --size +100M` then `xfs_growfs` on the mount point
   (336M to 436M in `df`); `lvextend --extents +50` (125 to 175 extents) and
   `--size +500M` (700 MiB to 1.17 GiB); and `lvextend --resizefs --size
   +100M` on XFS, which ran `xfs_growfs` itself. Teardown as in step 3; both
   hashes and all three listings matched, `sdd` showed no signatures, and
   `/data` was still `lv_data`.
6. Exercise 4, as its command file runs it, with the `parted` session and the
   two `echo`s typed through a terminal (the `echo`s in a `sudo -i` login
   shell): `dd` stopped at 226 MiB with "No space left on device"; `df` 100%;
   `-bash: echo: write error: No space left on device`, leaving a 0-byte
   `testfile`; `sdc1` from `1MiB` to `257MiB` named `pv2` with the `lvm`
   flag; `vgextend` gave `vg_data` 504.00m and 252.00m free; `lvextend
   --size +200M` went from 63 to 113 extents (452.00 MiB); `resize2fs` ran on
   line and `df` showed 418M with 167M free; the second `echo` worked and
   `cat` printed `test`.

7. A check and a side test for fragment 6. Read-only, on the chain's `/data`:
   `systemctl show data.mount` (`Requires` the device unit, `RequiredBy=
   local-fs.target`), `systemctl show local-fs.target`
   (`OnFailure=emergency.target`), `DefaultTimeoutStartUSec=1min 30s`, and
   `findmnt --verify` clean. On `sdd`, copied and restored as in step 3: a
   mounted ext4 `lv01`, `umount /dev/vg01/lv01` by device, `lvremove` answered
   `y` in a terminal, then `vgremove vg01` on a VG still holding an active LV
   (two questions, both answered `y`, both removed) and `pvremove`. Both
   hashes and all three listings matched afterwards, and `sdd` was blank.
8. Exercise 5, as its command file runs it, with the `vim` keystrokes and the
   `lvremove` answer typed through a terminal: `umount /data`; `/lv_data`,
   `dd`, `:wq` removed exactly the one line, and `/etc/fstab` matched the
   baseline hash `b96e219b79…` again; `daemon-reload`; `rmdir /data`;
   `lvremove` answered `y`; `vgremove vg_data` without a question; `pvremove
   /dev/sdb1 /dev/sdc1`; `wipefs --all` on both disks (GPT at both ends and
   the PMBR); `lsblk` showed no partitions.

9. A side test for fragment 8, on `sdd` (`sdd1` for the slides' `sdb1`,
   `sdd2` for `sdc1`), copied and restored as in step 3: 4.8 end to end with
   step 7 (a 200 MiB `swap01` beside the 300 MiB `lv01` in the 508 MiB `vg01`,
   its `/etc/fstab` line, `swapon -a`, `findmnt --verify` clean); 5.2 with the
   swap step (`swapoff`, `lvextend +100M`, `mkswap` warning "wiping old swap
   signature" and writing a new UUID, 760963b3… to 8be52509…, `swapon`); and
   6.5 (`swapoff`, `umount`, both lines out, `lvremove` of both LVs asking
   once per LV, `vgremove`, `pvremove`, `wipefs --all`). `swap01`'s
   `lvcreate` asked about an XFS signature left on `sdd` by the fragment 5
   side test; a student's `sdd` has none. Both hashes and all three listings
   matched afterwards, and `sdd` was blank.
10. Exercise 6, as its command file runs it, with the `vim` lines typed
    through a terminal: one partition per disk from `1MiB` to `100%`;
    `pvcreate` without the devices-file warning Decision 29 expected;
    `vg_storage` at 9.99g; `lv_swap`'s `lvcreate` asked about `lv_data`'s
    ext4 signature and wiped it on `y`, and `lv_records` (8.99g) did not ask;
    `mkfs.xfs`; both `/etc/fstab` lines; `/records` mounted (9.0G in `df`),
    swap on as `/dev/dm-2`; `findmnt --verify` clean.
11. Exercise 7: `sdd1` added (14.99g, 5.00g free); swap off, `lvextend --size
    +1G` (256 to 512 extents), `mkswap` with its warning, swap on at 2G;
    `lvextend --resizefs --extents +100%FREE` grew `lv_records` to 12.99g and
    XFS with it (13G in `df`); `findmnt --verify` clean.
12. Exercise 8: swap off, `/records` unmounted; `/vg_storage`, `dd` twice,
    `:wq` removed exactly the two lines, and `/etc/fstab` matched the
    baseline hash; `rmdir /records`; `lvremove` of both LVs (asking about
    `lv_swap` first); `vgremove`; `pvremove` of all three; one `wipefs --all`
    for the three disks; `lsblk` showed three blank disks.

**`servera` is now at the end of exercise 8, the week's starting state** for
the disks and `/etc/fstab`: `sdb`, `sdc`, and `sdd` blank with no signatures,
`/etc/fstab` at the baseline hash, no `/data` or `/records`, and only
`rhel_servera`. LVM's own records differ, as Decision 29 expects:
`system.devices` keeps entries for `sdb1`, `sdc1`, and `sdd1` with `PVID=.`.
The whole chain has run once in order; reset to the snapshot before the live
pass and again before the recording pass (Decision 29).

**The XFS rerun, 2026-10-26** (Decision 49). `servera` was reverted to its
snapshot, the baseline confirmed (the original devices-file hash, blank disks,
the baseline `/etc/fstab`), and exercises 1 to 8 run in order as their final
command files do, with the `parted` sessions, `vim` edits, and prompt answers
typed through a terminal:

1. Exercise 1: `parted print` shows `pv1` from 1049kB to 538MB with the `lvm`
   flag; `pvs` and `pvdisplay` show 512.00m.
2. Exercise 2: `vg_data` 508.00m, 127 extents of 4.00 MiB; `pvdisplay` in the
   VG reports 4.00 MiB not usable.
3. Exercise 3: `lv_data` 508.00m without a question; `mkfs.xfs` (4 groups of
   32512 blocks, a 16384-block log); `df` 444M with 410M available;
   `lvdisplay` 127 LEs.
4. Exercise 4, in its final form (Decision 50, run again from the snapshot
   the same day): `dd ... bs=4k` stopped at 410 MiB; `df` 100% with 28K
   available; the `echo` failed with "-bash: /data/testfile: No space left on
   device", and repeating the fill and the `echo` three more times gave the
   same; `sdc1` from `1MiB` to `513MiB`; `vg_data` 1016.00m with 508.00m
   free; `lvextend +200M` from 127 to 177 extents (708.00 MiB); `xfs_growfs
   /data`; `df` 644M with 197M available; the `echo` succeeded and `cat`
   printed `test`. Earlier runs with `bs=1M` left 820K, where the `echo`
   succeeded and a 1 MiB `dd` failed.
5. Exercise 5: as before; `/etc/fstab` back to the baseline hash.
6. Exercise 6: `lv_swap` and `lv_records` each asked about an XFS signature at
   offset 0 and wiped it on `y`; `lv_records` came from `/dev/sdc1(0)` then
   `/dev/sdb1(256)`. A first run stopped there, since the script answered only
   the first; a read-only scan then found `lv_data`'s XFS superblock copies at
   MiB 129, 256, and 383 of `sdb` and 2 and 129 of `sdc`, the second at the
   start of `sdc1`'s data. Everything else as before.
7. Exercises 7 and 8: as before; at the end `/etc/fstab` matched the baseline
   hash and the three disks were blank.

The snapshot restores the data disks as well as the system disk: `sdd`'s
leftover XFS copies from the fragment 5 side test were gone after the revert.
So the reset between the live and recording passes starts both from the same
disks. `servera` is at the end of exercise 8, the week's starting state for
the disks and `/etc/fstab`.

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
- **Line highlights inside `TerminalWindow` work** as on any fence, counting
  the prompt line as line 1. Click-through steps such as
  ```` ```bash-session {all|2-4,6,12|5,7-11} ```` add one click per step
  (2.4a); a fixed range such as `{1-3,5,7-12}` adds none, and on a trimmed
  transcript can dim just the `...output omitted...` markers (3.4a). Inside a
  `v-switch`, click-through steps also need `{at:N}` and template click ranges
  to line up, which is why the inspect slides were split instead
  (Decision 33).
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
6. **VM reminder** "Start `workstation` and `servera` on your VDI". Since
   2026-10-26, "Start `servera` on your VDI": nothing this week uses
   `workstation` (the instructor).
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
    with its exercise. Built that way on 2026-10-25, then superseded the same
    day by Decision 38.
13. **Procedure slides keep commands-only `bash` fences**; slides where the
    source shows output get recaptured output in `TerminalWindow`. Built that
    way on 4.8 on 2026-10-25, for review; its commands were all run in the
    side test.
14. **Real output where the output is the point**: 5.3 (`dd` hitting a full
    disk) and 6.6 (`wipefs` listing what it erased). Optional: states 2 to 4
    of 5.2 (`lvextend`, `resize2fs`) and the `swapon --show` states of 7.2 (7.2
    was dropped with fragment 7, Decision 45).
15. **3.6 shows `pvcreate /dev/sdc1`** before `vgextend`.
16. **4.5 gains `ls -l` on both paths** and the line that an LV path is stable
    enough for `/etc/fstab`. Built on 2026-10-25, for review.
17. **4.4 labels the `+` forms as `lvextend` forms** and defines logical
    extents. The `+` forms moved to 5.2 instead (Decision 35); the definition
    was built on 4.4 on 2026-10-25.
18. **6.3's note is reworded to match the lab**: `vgremove` asks before
    removing a VG that still holds LVs, and removes them too.
19. **The slide's swap LV is `swap01` at 512 MiB**, a generic name that fits
    the slide chain's `vg01`; the exercise keeps `swap_vol` at 1 GiB. 7.2 was
    dropped (Decision 45); 4.8's proposed swap step uses `swap01` (Decision
    47), and the exercises `lv_swap` (Decision 46).
20. **Swap lines use `swap` as the mount point**, as in w10 (Decision 32
    there), on 7.2 and in exercise 7. Since Decision 45, on 4.8's swap step
    and in exercises 6 and 7.
21. **`/data` stays the mount point** on 4.8 and in exercises 3 to 5, as in the
    source, although w10 used `/data` for slides and `/records` for exercises.
    The alternative is a different slide mount point, such as `/mnt/lv01`.
22. **"256 MiB" partitions end at `257MiB`** in exercises 1 and 4. The
    alternative is to change the steps to say 255 MiB. Either gives 63
    extents, so only the stated size changes. RH134's own guided exercise
    uses `1MiB` to `257MiB`. Applied in exercise 1's files on 2026-10-25; the
    instructor can still switch to the alternative.
    Since Decision 49, the partitions are 512 MiB and end at `513MiB`, the
    same pattern.
23. **The chain ends where it started**: exercise 5 removes `/data`, and
    exercise 7 gains a cleanup that restores blank disks and the original
    `/etc/fstab`. Since Decision 45, exercise 8 is that cleanup, and it
    removes `/records`.
24. **Exercise 5 drops the `wipefs -n` dry runs.** The alternative is to teach
    `-n` on 6.6.
25. **Exercise 4 grows ext4 with `resize2fs`**, as its command file does, and
    the slide's step 5 says ext4. Reversed by Decision 49: exercise 4 grows
    XFS with `xfs_growfs /data`, as the source's slide said.
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
    Superseded by Decisions 49 and 50: on XFS the `echo` succeeds after a
    `bs=1M` fill, so the fill uses `bs=4k` (see 5.4).
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
    Dropped 2026-10-26 with fragment 7 (Decision 45).

31. **A color key for the three layers**, used in text and diagrams all week:
    PV blue, VG teal, LV slate. Chosen by the instructor on 2026-10-24; pink
    was tried for LV and rejected as too loud. Teal and slate nearly merge for
    red-green color blindness, which the names in words cover. Text uses
    `AccentText hue="..."`, a theme addition the instructor suggested in place
    of a separate component. The instructor's rule (2026-10-24): keep it
    consistent across all of this week's material, exercises included, so a
    PV is always blue, a VG teal, and an LV slate, in text or diagram:
    - **Slides,** exercise slides included: wherever text names a layer
      (terms, lists, tables, captions, and workflow steps), it uses
      `AccentText` with that layer's hue, and every diagram node for a layer
      takes its hue. Slide titles stay plain, exercise titles included:
      Slidev passes a title on as raw text, so a colored section title would
      put `<AccentText ...>` tags into the week page's agenda.
    - **Written exercises:** each page's inline `<style>` block gains three
      classes named and colored like `AccentText`'s hues, `hue-blue`
      (`#0461be`), `hue-teal` (`#006e80`), and `hue-slate` (`#526678`), bold,
      used as `<span class="hue-blue">physical volume</span>`. Built with
      exercise 1's written version on 2026-10-25 and accepted by
      `check:exercises`. Headings stay plain, as slide titles do, so the
      `h1` still matches the declared title. Recorded under "Exercise
      documents" in `docs/design-system.md` the same day.
    - **Not covered:** command files and recordings, whose terminal text the
      key cannot reach.

Decided by the instructor on 2026-10-25:

32. **Slide 3.5 (source L13) is removed.** A `pvdisplay` right after
    `vgdisplay` was jarring, and `vgdisplay` shows the same extent fields for
    the whole VG. 3.4a now shows those lines (VG Size through Free PE) with
    one sentence of arithmetic, and 2.4a steps through what the new PV has
    and then what it lacks (an empty VG Name, Allocatable NO, and zero
    extents), so the two display slides teach the before and after. The
    instructor set the final highlights: click-through on 2.4a, fixed on 3.4a.
33. **Each inspect slide is two slides,** the summary command (`pvs`, `vgs`,
    `lvs`), centered vertically, and then the details command with line
    highlights (2.4 and 2.4a, 3.4 and 3.4a, 4.6 and 4.6a). The `v-switch`
    that held both added click bookkeeping for little benefit.
34. **Extending gets its own fragment.** Fragments 1 to 4 introduce each
    layer and create it; growing any layer waits for fragment 5. So 3.6,
    Extend a Volume Group, moves from fragment 3 to fragment 5, after 5.1a's
    overview and before 5.2. Fragment 3 drops to seven slides and fragment 5
    grows to seven. One extending fragment rather than two, since a fragment
    for `vgextend` alone would be a section slide and one content slide.
    Fragment 4's transcripts show no VG capacity, so capturing them after
    `vgextend` in the slide chain does not show on screen.

Decided by the instructor on 2026-10-25, following Decision 34:

35. **4.4's `+` rows move to fragment 5.** Accepted 2026-10-25 and built on
    4.4; they wait on 5.2's second state. `+50` (`-l`) and `+500M` (`-L`)
    add to an existing LV, so only `lvextend` takes them; Decision 17 labels
    them on 4.4 for now. Proposed: 4.4 keeps the create-time forms (`32`,
    `100%FREE`, `300M`, `2G`), and the two `+` forms go to 5.2's "Extend the
    LV" state beside `lvextend --size +100M`, where they are used. Lost: the
    side-by-side view of every form in one table. Since Decision 40 they sit
    on 5.2a, the `lvextend` slide.
36. **4.6a's highlights click through**, like 2.4a's, not fixed like 3.4a's.
    Built so; the instructor then made them fixed, as on 3.4a, in review.
37. **5.2 keeps its "Add another PV" state** beside 3.6 for now; whether to
    combine them is decided once fragment 5 is built. Since 2026-10-25 that
    state is two (Decision 39), and step 2 is 3.6's `vgextend` alone.
    Settled by Decision 40: 5.2 moved to the practice fragment, so 3.6 is the
    only `vgextend` slide in fragment 5.
38. **The procedure, 4.8, moves to the practice fragment**, after 8.1 and
    before exercise 6, which follows the same recipe. Fragment 4 drops to nine
    slides and fragment 8 grows to six. Fragment 4 now ends its concepts at
    4.6a and goes straight to exercise 3; the procedure becomes a recap where
    students put every layer together on their own.
39. **5.2's first step is two**, "Create a PV on the new disk" and "Add the
    PV to the VG", so each layer has its own step and no fence holds three
    layers' commands (the instructor's suggestion, 2026-10-25). 5.2 has five
    click states.
40. **Fragment 5 teaches one layer per slide, and 5.2 moves to the practice
    fragment.** After 3.6 (the VG) come 5.2a, "Extend a Logical Volume"
    (`lvextend` with real output and the `+` option table), and 5.2b, "Grow
    the File System" (`xfs_growfs`, `resize2fs`, and `lvextend --resizefs`).
    The five-step procedure, 5.2, goes to fragment 8 after 4.8, retitled
    "Procedure: Extend a Logical Volume", without the option table. The
    instructor's design, 2026-10-25. Fragment 5 grows to eight slides,
    fragment 8 to seven, and the deck to 58.

Decided by the instructor on 2026-10-25:

41. **6.5, Removing LVM Components, moves to the practice fragment** as
    "Procedure: Remove LVM", after 5.2, so fragment 8 holds all three
    procedures (create, extend, remove) and fragment 6, like fragment 5, keeps
    one concept slide per step. Since 6.1a (Decision 42) teaches unmounting
    and removing the `/etc/fstab` entry, no point of 6.5's is lost. Accepted
    2026-10-25 and moved: fragment 6 drops to eight slides and fragment 8
    grows to eight.
42. **6.1a, Unmount a Logical Volume, comes before 6.2**: `umount`, deleting
    the `/etc/fstab` line, `systemctl daemon-reload`, and why the line must
    go. The instructor's request, 2026-10-25. Fragment 6 grows to nine slides
    and the deck to 59.
43. **The practice fragment serves two purposes**: exercise 6 shows creation
    in one exercise instead of a layer at a time, and the three procedures
    (4.8, 5.2, 6.5) are a reference set of every step to create, extend, and
    remove, with minimal instruction. The instructor, 2026-10-25.

Decided by the instructor on 2026-10-25, following Decision 43:

44. **The procedures are trimmed to steps and commands when fragment 8 is
    built.** Accepted 2026-10-25. Each keeps its step headings and fences, and
    only the words a reader needs to choose a command: 5.2's "Skip steps 1 and 2
    if the VG already has enough free extents" and its XFS and ext4 labels.
    Dropped, since the concept slides teach them: 4.8's two callouts (`udevadm
    settle`, the XFS minimum), 5.2's "Adds capacity", "No impact", and "Adds 100
    MiB" bullets and its `--resizefs` sentence, and 6.5's bullets. 6.5 keeps its
    teardown-order line, which is the procedure's shape. All three share one
    layout, `vertical: start`, so the step headings sit at the same height as a
    reader clicks through (5.2 lost it on 2026-10-25). Lost: the reasons beside
    each step, which a student reviewing alone finds on the concept slides
    instead.

Decided by the instructor on 2026-10-26:

45. **No swap fragment; the practice fragment holds three exercises.** Fragment
    7 and exercise 5a are dropped: the fragment mostly repeated w10, and the
    practice now covers swap on an LV. Exercise 6 creates LVM on the two blank
    disks with `/records` and a swap LV, both mounted; exercise 7 adds the
    third disk and extends both; exercise 8 removes it all, back to three blank
    disks. The deck drops to seven fragments and 57 slides; the exercises stay
    at eight. The cover's "Swap Space on Logical Volumes" line is removed.

Decided by the instructor on 2026-10-26, following Decision 45:

46. **Exercise details.** Accepted 2026-10-26. Titles "Create LVM Storage", "Extend LVM Storage",
    and "Remove LVM Storage". Names `vg_storage`, `lv_records`, and
    `lv_swap`. Each disk gets one `lvm` partition from `1MiB` to `100%`.
    Exercise 6 makes `lv_swap` 1 GiB first and `lv_records` from the rest
    (`--extents 100%FREE`), XFS on `/records`, both in `/etc/fstab` by LV path,
    the swap line with `defaults` and no priority. Exercise 7 grows `lv_swap`
    by 1 GiB (swap off, `lvextend`, `mkswap`, swap on) and `lv_records` by
    `--extents +100%FREE` with `--resizefs`, which adds a third row to 5.2a's
    table. No reboot; the persistent lines are checked with `systemctl
    daemon-reload`, `mount /records`, and `swapon -a`, as in exercise 3.
    Alternatives: fixed sizes in place of `100%FREE`, a swap priority, or a
    reboot at the end of exercise 6.
47. **The reference procedures gain the swap steps** (accepted 2026-10-26): 4.8 a last step, "Create
    swap space on an LV", from source L36; 5.2 a step, "Extend a swap LV",
    from RH134 chapter 11; 6.5's first step a `swapoff`. No other slide
    teaches swap on an LV now. The alternative is a fourth reference slide,
    "Procedure: Swap Space on an LV", with create, extend, and remove states.
48. **Each procedure sits right before its exercise** in fragment 8 (4.8 then
    exercise 6, 5.2 then 7, 6.5 then 8). Accepted 2026-10-26. The cover agenda
    now has six lines, so "LVM Practice" would fit again; the instructor keeps
    it off the cover.
49. **XFS for every exercise and the create procedure.** It is RHEL's
    recommended and default file system; w10 already showed ext4. Exercises 1
    and 4 make 512 MiB partitions (`1MiB` to `513MiB`), so exercise 3's
    `lv_data` (508 MiB) clears XFS's 300 MB minimum; exercise 3 runs
    `mkfs.xfs`, exercise 4 `xfs_growfs /data`, and 4.8 and 6.1a write `xfs`
    lines. The concept slide 5.2b and procedure 5.2 keep `resize2fs` beside
    `xfs_growfs`, since students will meet ext4. Two consequences, verified:
    exercise 4's fill needs `bs=4k` for the `echo` to fail (Decision 50), and
    exercise 6 meets two "Wipe it?" questions instead of one. The instructor,
    2026-10-26, with the VM reminder reduced to `servera` (Decision 6).
50. **Exercise 4 fills with `bs=4k` and keeps the `echo`.** After a `bs=1M`
    fill, XFS has about 820K left and a 5-byte `echo` succeeds; a 4 KiB fill
    leaves 28K, and the `echo` fails with "-bash: /data/testfile: No space
    left on device" (four times in four tries on `lv_data`). The `echo` lands
    harder than a second `dd` (the instructor, 2026-10-26). 5.3's transcript
    was recaptured with `bs=4k` on XFS so the slide matches.

## Open questions

1. ~~**The lab.**~~ Answered 2026-10-24: the instructor started it.
   `servera` was reverted to its snapshot after the checks (see
   "Verification").
2. ~~**Time.**~~ Answered 2026-10-24: cut nothing until the week is built,
   as in w10.
3. ~~**Swap without an exercise.**~~ Answered 2026-10-24: fragment 7 gets an
   exercise of its own, even though 8.3 mostly repeats it; the Practice
   exercises repeat earlier work on purpose. Superseded 2026-10-26: fragment 7
   and exercise 5a were dropped (Decision 45).
4. ~~**Exercise 2.**~~ Answered 2026-10-24: keep it separate. The instructor
   wants no more than about ten content slides between exercises; section,
   title, reminder, and exercise slides do not count. This plan's longest run
   is nine (1.2 to 2.4a, before exercise 1, since 1.3b and 2.4a were added);
   the others are 0 to 7.
5. ~~**The 1.2 image.**~~ Answered 2026-10-24: a placeholder now, replaced
   later (Decision 10).
6. **SCC volume group name.** The instructor lab's OS volume group is
   `rhel_servera`, as the source shows. `docs/lab-environments.md` does not say
   whether SCC matches. The instructor will check `vgs` on an SCC `servera`;
   **remind the instructor before the recordings**, since 2.4, 3.4, and 4.6
   show the name.

## Status

As of 2026-10-26.

**Done:**

- This plan, and `course/w11-draft.md` with the cover, the VM reminder, and
  the imports for fragments 1 to 6 and 8.
- Fragment 1, `logical-volume-manager.md`, five slides built and checked,
  including the commands table (1.3a) and the animation that follows it
  (1.3b).
- Fragment 2, `physical-volumes.md`, seven slides built and checked (the
  recording slide waits on the cast), and exercise 1's command file and
  written version.
- Fragment 3, `volume-groups.md`, six slides built and checked (the same),
  and exercise 2's command file and written version. Its Extend a Volume
  Group slide moved to fragment 5 (Decision 34).
- Fragment 4, `logical-volumes.md`, eight slides built and checked (the
  recording slide waits on the cast), and exercise 3's command file and
  written version. Its procedure slide moved to fragment 8 (Decision 38).
- Fragment 5, `extending-lvm.md`, seven slides built and checked (the
  recording slide waits on the cast), and exercise 4's command file and
  written version. Its procedure slide, 5.2, moved to fragment 8 (Decision
  40).
- Fragment 6, `removing-lvm.md`, seven slides built and checked (the
  recording slide waits on the cast), and exercise 5's command file and
  written version. Its procedure slide, 6.5, moved to fragment 8 (Decision
  41).
- Fragment 8, `lvm-practice.md`, seven slides built and checked (the three
  recording slides wait on the casts): the three procedures, trimmed and given
  the swap steps, each before its exercise, and exercises 6 to 8's command
  files and written versions.
- The week's color key (Decision 31) and `AccentText`'s `hue` prop in the
  theme, with its test, gallery line, and documentation.
- The lab checks behind every correction, under "Verification". The whole
  exercise chain has run in order from the snapshot with XFS throughout
  (Decision 49), and `servera` is back at the week's starting state ("The
  exercise chain").

**Next, in order:**

1. The instructor reviews the XFS changes (Decision 49), fragment 8, and
   exercises 6 to 8.
2. The image pass: replace 1.2's placeholder (Decision 10, Open question 5).
3. Before the recordings: the SCC volume group name (Open question 6), the
   snapshot reset (Decision 29), a read-only check that the lab is at the
   week's start, and `kitty-demo --check` on all eight command files.
4. The recordings, in order, then the recording slides 2.5a to 8.4a.
5. Publication, per the porting skill.

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
