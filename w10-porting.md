# W10 - Port

## Prompt

W09 is Fall Break, so it is skipped. Port w10 from `~/s/IT-230/w10`: read the
slides, the lesson plan, and the demonstrations, and use the week-porting skill
to produce this plan.

Revised 2026-10-17. The instructor pointed out that the two LibreOffice decks
in `slides/`, `ManageBasicStorage.odp` and `InstallRedHatEnterpriseLinux.odp`,
are what was presented last year and are more polished than the Slidev
Markdown. The new deck takes the best of both. See "Combining the two source
decks".

## Answer in brief

All five fragments are built (2026-10-17 and 2026-10-18). **Five topic fragments** in
two chapter directories, **seven exercises**, and a deck of **63 slides**. Six
are recording slides, added on 2026-10-19 once the instructor recorded the
casts, so all 63 render.

| # | Fragment                   | Section title         | Slides | Exercises |
|--:|----------------------------|-----------------------|-------:|----------:|
| 1 | `partitions.md`            | Partitions            |     17 |         2 |
| 2 | `file-systems.md`          | File Systems          |      8 |         1 |
| 3 | `mounting-file-systems.md` | Mounting File Systems |     16 |         2 |
| 4 | `swap-space.md`            | Swap Space            |      8 |         1 |
| 5 | `installing-rhel.md`       | Installing RHEL       |     12 |         1 |
|   | Entry file                 |                       |      2 |           |
|   | **Total**                  |                       | **63** |     **7** |

Fragments 1 to 4 follow the Slidev deck's slide sequence, with the ODP's
concept slides merged in or added beside them. Fragment 5 follows the ODP's
much shorter sequence, plus two slides from the Slidev deck. The Kickstart
material in both decks stays out (Decision 3).

Three things blocked the build. None blocks it now, but two must be settled
before publication:

1. ~~**Disk names.**~~ Resolved 2026-10-17. The instructor lab printed `vdb`
   where students see `sdb`; it was rebuilt with SATA disks and now prints
   `sdb` natively. See "The disk-name problem" and Decision 1.
2. **Installer screenshots.** All are RHEL 9.3, and three carry the Red Hat
   logo. Fragment 5 is built with them as uncommitted placeholders, and needs
   fresh RHEL 10.0 captures before publication (Decisions 12 and 30).
3. **Image provenance.** Six decorative or illustrative images have no
   recorded source, five shared by both decks and one only in the install ODP.
   They are used as uncommitted placeholders and replaced before publication
   (Decisions 11 and 30).

## Scope

The lesson plan's agenda is "Manage Basic Storage", "Configure SWAP space", and
"Install RHEL Manually". Its assignments are RHA chapter 10 section 05 and SCC
Lab chapter 10 lab 01. Its "Ideas" section says Kickstart cannot be taught yet
"because students don't know GRUB yet", and w12 is the boot-process week.

The source material is in `~/s/IT-230/w10/slides/`, in two forms:

- **Slidev Markdown:** `slides.md` (cover and VM reminder),
  `managing_basic_storage.md` (43 slides), and `installing_rhel.md` (38
  slides). Converted from the ODP decks this year, with command transcripts
  added and some drafted slides, such as the "(suggested)" duplicates.
- **LibreOffice decks:** `ManageBasicStorage.odp` (29 slides) and
  `InstallRedHatEnterpriseLinux.odp` (16 slides). What the instructor presented
  last year, and more polished. They carry no presenter notes worth keeping
  and no command slides.

The demonstrations are six `kitty-demo` command files in
`demonstrations/managing_basic_storage/`, plus two Markdown run sheets and one
command file in `demonstrations/installing_rhel/`.

The curriculum is RH134 chapter 10, *Managing Basic Storage*, and chapter 16,
*Installing Red Hat Enterprise Linux*, with *RHCSA Cert Guide* chapters 14,
*Managing Storage*, and 1, *Installing Red Hat Enterprise Linux*. Nothing from
either is copied. They were read so the plan knows which facts students meet
before class.

W09 has no source deck to port. `~/s/IT-230/w09/w09-lesson_plan.md` holds a
single line, a break notice. No `course/w09.md` is created.

## Port fidelity

Source slides are numbered by file. **M1 to M43** are
`managing_basic_storage.md` in order, **I1 to I38** are `installing_rhel.md`,
**SO1 to SO29** are `ManageBasicStorage.odp`, and **IO1 to IO16** are
`InstallRedHatEnterpriseLinux.odp`. Planned slides are numbered by fragment,
such as 1.4. In fragments 1 to 4 the numbers follow the Slidev deck, and a slide
taken only from an ODP carries a letter, such as 1.5a, so the numbering never
moves. Fragment 5 follows the ODP and is numbered in its own order.

The source order is kept slide for slide. Nothing is split, merged, reordered,
or dropped in this plan except where a heading says "propose", and each
proposal is listed again under "Decisions".

## Combining the two source decks

Decided with the instructor on 2026-10-17: take the best of each.

- **The ODP decks supply structure and concept slides.** Their strength is the
  slide that explains why at a glance: MBR as six icon-and-caption facts, the
  mount mnemonic ("similar syntax as `cp`: `mount /from /to`"), the fstab flow
  into systemd mount units, icon trios for XFS and for swap, a Disk Size Units
  table, and the install deck's hub-and-spoke view of the Installation Summary.
  The icon-and-caption pattern is rebuilt with the new `IconGrid` theme
  component, using Carbon icons in place of the ODP's office-suite icons.
- **The Slidev decks supply command slides.** The ODP decks have none: each
  exercise was a step list followed by an asciinema link. The Slidev decks have
  the transcripts, workflows, fstab samples, and best practices this
  repository's slides need.
- **Exercises follow the Slidev deck's six** (Option B, chosen 2026-10-17). The
  ODP had four, with one combined mount exercise and no GPT exercise.
- **Fragment 5 follows the ODP,** which shows the installer in 7 slides where
  the Slidev deck used 24, plus the Slidev deck's standard-partition and
  root-account slides (both chosen 2026-10-17).

Four kinds of change are forced rather than chosen:

- **Device names in output.** See "The disk-name problem".
- **Images that cannot be published.** Two RH134 figures and four Cert Guide
  and RH134 tables are rebuilt in our own form. Nine installer screenshots are
  recaptured. See "Third-party images".
- **Output that is not real.** Several source transcripts were edited by hand
  or do not match RHEL 10.0. Each is listed under "Corrections" and recaptured.
- **Theme expression.** The source's `<br />` spacers, inline `<img>` tags,
  custom `two-cols-header-footer` layout, and logo footer give way to the
  theme's layouts, its `bottom` slot, and its footer.

Every em dash in the source copy is rewritten.

## The disk-name problem

`pnpm lab` reaches the instructor lab, whose disks are virtio: `vda` through
`vdd`. A udev rule adds `sda` through `sdd` symlinks, with the comment "Demos
and students use /dev/sd[a-z]". Students on the SCC lab have SATA disks named
`sda` through `sdd` natively.

Verified on `servera` on 2026-10-06, before the rebuild: typing `/dev/sdb`
works, but almost every tool reports the kernel name.

- `parted /dev/sdb print` reports `Disk /dev/vdb`.
- `lsblk -fp /dev/sdb` lists `/dev/vdb`, `/dev/vdb1`, `/dev/vdb2`.
- `mount` and `findmnt` report `/dev/vdb1 on /mnt/...`.
- `swapon --show` lists `/dev/vdb2`.

So a transcript captured here mixes `sdb` typed and `vdb` printed, which is the
one thing a week about device names cannot afford. About sixteen slides in
fragments 1 to 4 print a device name. The six source demonstrations already
show the mismatch: their headers say `/dev/sdb` and their commands type
`/dev/vdb`.

Four ways to handle it, in the order I would pick them:

1. **Attach the instructor lab's disks on a SATA bus.** Every transcript,
   command file, and recording then shows `sdb` natively, as the SCC lab does,
   and the udev symlink rule can go. `docs/lab-environments.md` already lists
   this under "Making them more alike". The remaining difference is the model
   string in `parted print` (`ATA QEMU HARDDISK` against `ATA VBOX HARDDISK`).
   Cost: a VM change before any transcript is captured. Moving the OS disk too
   needs the initramfs to carry the `ahci` driver, or a rebuild through
   `create_vms.yml`. If only the three blank disks move, they become `sda` to
   `sdc`, which is worse, so all four move or none do.
2. **Type `/dev/vdb` on every slide**, capture real output, and let slide 1.11
   tell SCC students their disk is `sdb`. Ready now and internally consistent,
   but students translate on every slide, and the exercise slides say `sdb`
   while the slides before them say `vdb`.
3. **Type `/dev/sdb` and show the mixed output**, as the udev rule intends.
   Matches what a recording made today would show, and confuses on nearly
   every slide.
4. **The instructor captures slide transcripts on the SCC lab** and I format
   them. Slides match students exactly. Recordings still show `vdb`, and I
   cannot verify those transcripts through `pnpm lab`.

**Resolved 2026-10-17: option 1.** The instructor changed the `rhel-lab`
automation and rebuilt the lab with all four disks on the SATA bus and the udev
symlink rule removed. `servera` now reports `sda` and blank `sdb` to `sdd`
natively, and `parted` reports `Model: ATA QEMU HARDDISK (scsi)`. The same
rebuild moved the lab interface to PCI bus 0, slot 8, so it is `enp0s8` like the
SCC lab's, and added `lab_rsa` beside `id_rsa`. See "Verification".

## Sequencing and framing

- **W11 is LVM**, and it needs the three blank disks blank. This week's
  exercises leave partitions on `sdb` and `sdc`, an `/etc/fstab` entry for
  `/records`, and a swap entry. A leftover fstab entry for a wiped disk
  stops the next boot in emergency mode. So the last storage exercise on each
  disk restores it (Decision 20).
- **W12 is the boot process.** Kickstart needs `inst.ks=` typed at the boot
  menu, which is why the lesson plan defers it. Kickstart is not planned here
  (Decision 3).
- **Slide 5.6 promises LVM "next week"**, which is right: w11 is LVM.
- **No earlier exercise reboots a host.** Two source exercises end with
  `reboot`. See Decision 19 and "Authoring notes".
- **W07 taught interface names as something you look up.** Slide 1.11 does the
  same for disks, which is the habit `docs/lab-environments.md` asks for.

## Deck-level decisions

- **Entry file:** `course/w10-draft.md`, renamed to `course/w10.md` at
  publication.
- **Accent:** `blue` (Decision 5). It is cool, which suits a Bash-heavy deck,
  and has been used once (w02). Used so far: teal, blue, teal, purple, green,
  slate, pink, yellow; `red` is reserved for the Final.
- **Title:** "Managing Basic Storage and Installing RHEL" (the source's "&"
  spelled out).
- **Cover agenda:** five lines, one per fragment: Partitions, File Systems,
  Mounting File Systems, Swap Space, Installing RHEL.
- **Cover summary:**

  ```yaml
  courseInfo:
    summary: >-
      This week we will partition a disk, build file systems on it, mount them
      at boot, add swap space, and then install Red Hat Enterprise Linux by
      hand.
  ```

- **VM reminder:** "Start `workstation` and `servera` on your VDI". The source
  says "Start your VDI" and "Start Up the `servera` VM". The install exercise
  creates its own VM, so it adds nothing to the reminder.
- **Chapter directories:** `course/chapters/rh134-ch10-managing-basic-storage/`
  for fragments 1 to 4, and
  `course/chapters/rh134-ch16-installing-red-hat-enterprise-linux/` for
  fragment 5.
- **Alignments:** fragments 1 to 4 align to RH134 chapter `"10"`, *Managing
  Basic Storage*, and cert guide chapter `"14"`, *Managing Storage*.
  Fragment 5 aligns to RH134 chapter `"16"` and cert guide chapter `"01"`,
  both *Installing Red Hat Enterprise Linux*, which adds both to the week
  page's "Before class" list even though the lesson plan assigns neither
  (Decision 23).

## Source-to-fragment map

From `managing_basic_storage.md`:

| Source | Title                               | Goes to |
|-------:|-------------------------------------|---------|
|     M1 | Section: Managing Basic Storage     | 1.1     |
|     M2 | Partitions                          | 1.2     |
|     M3 | Two Partition Formats               | 1.3     |
|     M4 | Master Boot Record (MBR)            | 1.4     |
|     M5 | GUID Partition Table (GPT)          | 1.5     |
|     M6 | Device names (image only)           | 1.6     |
|     M7 | Partitioning Tools: `lsblk`         | 1.7     |
|     M8 | Partitioning Tools: `parted`        | 1.8     |
|     M9 | `parted` Command Mode               | 1.9     |
|    M10 | `parted` Interactive Mode           | 1.10    |
|    M11 | Device Files                        | 1.11    |
|    M12 | The `parted` Workflow               | 1.12    |
|    M13 | Exercise: Two GPT Partitions        | 1.13    |
|    M14 | Exercise: Five MBR Partitions       | 1.14    |
|    M15 | Demo: Five MBR Partitions (GIF)     | 1.15    |
|    M16 | Section: File Systems               | 2.1     |
|    M17 | File Systems                        | 2.2     |
|    M18 | XFS vs EXT4                         | 2.3     |
|    M19 | Create an XFS File System           | 2.4     |
|    M20 | Create an ext4 File System          | 2.5     |
|    M21 | Exercise: Create File Systems       | 2.6     |
|    M22 | Demo: Create File Systems (GIF)     | 2.7     |
|    M23 | Section: Mounting File Systems      | 3.1     |
|    M24 | Mount Temporarily, Step 1           | 3.2     |
|    M25 | Mount Temporarily, Step 2           | 3.3     |
|    M26 | Mount Temporarily, Step 3           | 3.4     |
|    M27 | Mount Temporarily, Step 4           | 3.5     |
|    M28 | Exercise: Temporarily Mount XFS     | 3.6     |
|    M29 | Mount File System Persistently      | 3.7     |
|    M30 | fstab fields (image only)           | 3.8     |
|    M31 | fstab line and field table          | 3.9     |
|    M32 | Systemd Mount Units                 | 3.10    |
|    M33 | Best Practices                      | 3.11    |
|    M34 | Exercise: Persistently Mount XFS    | 3.12    |
|    M35 | Demo: Mount File System (GIF)       | 3.13    |
|    M36 | Section: Manage Swap Space          | 4.1     |
|    M37 | Swap Space                          | 4.2     |
|    M38 | How much Swap Do I Need?            | 4.3     |
|    M39 | Swap Space Components               | 4.4     |
|    M40 | Swap Space Workflow                 | 4.5     |
|    M41 | Swap Priority                       | 4.6     |
|    M42 | Exercise: Persistent Prioritized Swap | 4.7   |
|    M43 | Demo: Create Swap Space (GIF)       | 4.8     |

From `ManageBasicStorage.odp`:

| Source    | Title                               | Goes to          |
|----------:|-------------------------------------|------------------|
|       SO1 | Title: Manage Basic Storage         | the cover        |
|       SO2 | Partitions                          | 1.2              |
|       SO3 | Two Partition Types (icons)         | 1.3              |
|       SO4 | MBR, six icon facts                 | 1.4              |
|       SO5 | GPT                                 | 1.5              |
|       SO6 | Disk Size Units (scan)              | 1.5a, new        |
|       SO7 | Common Device Names (scan)          | 1.6              |
|       SO8 | Partitioning Components             | 1.7, 1.8         |
|       SO9 | Exercise: Five MBR on `/dev/sdb`    | 1.14             |
| SO10, 11  | Demo link and GIF                   | 1.15             |
|      SO12 | File Systems                        | 2.2              |
|      SO13 | XFS, three icon facts               | 2.3              |
|      SO14 | Exercise: Create File Systems       | 2.6              |
| SO15, 16  | Demo link and GIF                   | 2.7              |
|      SO17 | Mount Temporarily (mnemonic)        | 3.1a, new        |
|      SO18 | Mount at Boot (fstab flow)          | 3.7              |
|      SO19 | `/etc/fstab` fields (scan)          | 3.8, 3.9         |
|      SO20 | Exercise: mount, temp then boot     | 3.6, 3.12        |
| SO21, 22  | Demo link and GIF                   | 3.13             |
|      SO23 | Section: Manage Swap Space          | 4.1              |
|      SO24 | Swap Space, three icon facts        | 4.2              |
|      SO25 | How Much Swap (RH134 table)         | 4.3              |
|      SO26 | Swap Space Components               | 4.4              |
|      SO27 | Exercise: Persistent Swap           | 4.7              |
| SO28, 29  | Demo link and GIF                   | 4.8              |

Fragment 5 combines `InstallRedHatEnterpriseLinux.odp` and
`installing_rhel.md`:

| Planned | Title                              | From                 |
|---------|------------------------------------|----------------------|
| 5.1     | Section: Installing RHEL           | IO1, I1              |
| 5.2     | Download Installation Media        | IO2, I2              |
| 5.3     | The Boot Menu                      | IO3 (same as I3)     |
| 5.4     | Installation Summary               | IO4 (same as I5), I4 |
| 5.5     | The Installation Summary Hub       | IO5                  |
| 5.6     | Standard Partitions                | I12, I14, I15        |
| 5.7     | Root Account                       | I18                  |
| 5.8     | Install Settings for `serverc`     | IO6, I23             |
| 5.9     | Installation Complete              | IO7 (same as I22)    |
| 5.10    | Exercise: Install RHEL             | I24                  |

Not carried into fragment 5: I6 (the hub slide covers the summary's sections);
I7, I9, I13, I16, I19, and I20 as slides of their own (each screen appears in
the hub instead); I8, I10, I17, and I21 (their lab values move to the settings
slide, 5.8, and their explanations are dropped); and I11, the inner section
slide. See Decision 26. IO8 to IO16 and I25 to I38 are the Kickstart material
(Decision 3).

Slides with no source row in fragments 1 to 4: 1.4a, split from M4's slide;
1.5b and 1.5c, the units slides; 1.13a and 3.6a, recording slides for exercises
the source gave no demo slide. The instructor removed 1.11, 1.12, and 1.12a on
2026-10-18, so M11 and M12 are no longer ported.

## File inventory

New, under `course/chapters/rh134-ch10-managing-basic-storage/`:

| File                       | Slides | Exercises |
|----------------------------|-------:|----------:|
| `partitions.md`            |     17 |         2 |
| `file-systems.md`          |      8 |         1 |
| `mounting-file-systems.md` |     16 |         2 |
| `swap-space.md`            |      8 |         1 |

Plus `exercises/` with six `.sh` command files, six `.html` written exercises,
and six `.cast` recordings, and `assets/` for whatever survives the image
review.

New, under `course/chapters/rh134-ch16-installing-red-hat-enterprise-linux/`:
`installing-rhel.md` (12 slides),
`exercises/install-rhel-manually-exercise.html` (written only, Decision 22), and
`assets/` with the instructor's screenshots: nine RHEL 10.0 installer screens
(the boot menu, the Installation Summary, the six hub screens, and Installation
Complete), three crops of the installed `serverc`'s console, four VirtualBox
screens (three of the New Virtual Machine wizard and the Adapter 2 settings),
`assets/screenshots/` with all 22 of the instructor's dry-run captures as taken
(`rhel-install-01` to `-17` and `vm-creation-1` to `-5`; no slide references
them), and `installation-disc.webp`, the instructor's CD image for 5.2. The raw captures include
Anaconda's Red Hat sidebar logo and VirtualBox's Red Hat OS badge; the
instructor approved committing them on 2026-10-19.

Also changed: `.gitignore`, which gains the `*.placeholder.*` rule (Decision
30).

Already built (2026-10-17): the `IconGrid` theme component, in
`packages/slidev-theme-it230/components/IconGrid.vue` with its logic in
`setup/icon-grid.ts`, tests in `tests/icon-grid.test.mjs`, a gallery slide in
`example.md`, and its documentation in `docs/design-system.md` and
`docs/course-authoring.md`.

Also new: `course/w10-draft.md`. At publication, `tests/site.test.mjs` gains
`"w10"` in its published-week list, which will then skip `"w09"`.

## Third-party images

The Slidev deck references 25 images and the ODP decks reuse most of the same
files. None can be copied across as it stands. Images that appear only in the
ODP decks are listed at the end of this section.

**RH134 figures, cannot be used, rebuild.** `storage-mbr.svg` and
`storage-gpt.svg` (M4, M5) are byte-for-byte RH134 figures 10.1 and 10.2, the
same files as `rh134-ch10-managing_basic_storage/.md_assets/`. Propose our own
partition-layout diagrams as Mermaid block diagrams (Mermaid 11.16 is
installed), with our own labels: the MBR bar shows three primaries, an extended
partition holding two logicals, and free space; the GPT bar shows the primary
table, five partitions, free space, and the backup table.

**Cert Guide tables, cannot be used, rebuild.** `device_names.png` (M6) and
`fstab_fields.png` (M30) are scans of tables from the *RHCSA Cert Guide*
(Pearson). The first even says "RHEL 9". Rebuild M6 as our own Markdown table.
M30 is covered by M31's own table already; see Decision 10.

**RH134 table, cannot be used, rebuild.** `swap_sizing.png` (M38) is a
screenshot of the RH134 chapter 10 swap sizing table, in Red Hat's typeface.
Rebuild it as our own Markdown table. The numbers are Red Hat's published
recommendation, so the slide credits "Red Hat's recommendation" in text.

**Photographs and illustrations with no recorded source.** `AGENTS.md` bars
assets with unclear publication rights, so each of these goes in as an
uncommitted placeholder and is replaced before publication (Decision 30). Each
has a fallback if no replacement is found.

- `mbr_diagram.jpg` (M2): an open hard drive whose platter is divided into
  four colored sections. **Resolved 2026-10-19:** the instructor generates it
  with Gemini from their own prompt, so it is the instructor's asset, not a
  third-party one, and needs no credit line. The final version (the fourth
  generation) is a straight top-down view of the drive standing upright, made
  at 3:4 on a solid pure-green background with no shadow. The green was keyed
  out to real transparency (a soft key on how green each pixel is, with green
  spill removed only in a thin band along the cut so the drive's teal section
  is untouched), the drive was cropped and padded with equal transparent
  margins to exactly 3:4, and the result was saved as
  `assets/hard-drive-platter.webp` (900 by 1200, 58 KB; the same image as PNG
  is 1.2 MB). The theme's image backdrop shows the week's accent through the
  transparent margin, as it does on w01's exam slide. Earlier versions were
  dropped: a square render (the column is taller than wide), and a taller
  render whose "transparent" background was a checkerboard painted into a
  JPEG. Alt text calls it an illustration, not a photograph.
- `bios-setup-screen.jpg` and `gpt_diagram.jpg` (M3): vendor firmware
  screenshots, an AMI-style BIOS setup screen and an ASUS UEFI "EZ Mode" screen.
  The second is misnamed; it shows firmware, not a GPT diagram. **Replaced
  2026-10-19** with two CC BY-SA 4.0 images from Wikimedia Commons, credited on
  the slide; see 1.3.
- `partitioning_components.jpg` (M8): appears AI-generated, a flat-lay of
  dividers, tools, and spools. Whether it can be published depends on the tool
  that made it. Fallback: full width text. **Replaced 2026-10-19** with a
  decorative image: no literal picture of a partitioning tool suggested
  itself, and the instructor found a pizza and cutter too concrete, so it is
  an abstract 3D disk split into four wedges of different sizes, floating
  slightly apart, in the hard drive's four platter colors. The instructor
  generated it with Gemini at 1:1 on pure green, so it is the instructor's
  asset and needs no credit line. Keyed like the others (no pixel inside the
  segments lost opacity, and the gaps show the week's accent), then centered
  at 90% of the width on a 1:1 transparent canvas:
  `assets/partitioned-disk.webp` (1200 by 1200, 84 KB). Its alt text is empty,
  as it is decorative. The placeholder was deleted.
- `filesystem_types.jpg` (M17): a stock-style photograph of coloured binders
  on white shelves, which illustrates "like shelves in a book case". **Replaced
  2026-10-19** with two images the instructor generated with Gemini from
  prompts written for the bookcase story (Decision 33), so they are the
  instructor's assets and need no credit line. Each is a straight-on view of
  the same light wooden bookcase at 3:4 on pure green: one with no shelves and
  the books piled at the bottom, one with shelves and the books in rows, in the
  hard drive's four platter colors. Both were keyed like the hard drive, scaled
  so the two bookcases are the same height (90% of the canvas), and centered on
  identical 900 by 1200 transparent canvases: `assets/bookcase-no-shelves.webp`
  (56 KB) and `assets/bookcase-with-shelves.webp` (45 KB). A tighter crop with
  an even margin around each bookcase was tried and rejected by the instructor
  as too perfectly proportioned. The binders placeholder was deleted.

**Installer screenshots, recapture.** The `installing_rhel/` PNGs are the
instructor's own captures of a RHEL **9.3** install in VirtualBox (dated
February 2025), and the install ODP embeds the same files byte for byte. The
revised fragment 5 uses nine of them: the boot menu, the Installation Summary,
the six spoke screens on the hub slide, and Installation Complete. Three
problems:

- The course targets RHEL 10.0, and the 9.3 screens disagree with the slides:
  the summary shows "Root Password" and "Security Profile" where the slide text
  describes RHEL 10's "Root Account", and the manual partitioning screen shows
  device type LVM on the slide that teaches Standard Partition.
- `anaconda_summary.png` (I5), `install_complete.png` (I22), and
  `kickstart_summary.png` (I34) show the Red Hat logo in the sidebar. `AGENTS.md`
  bars Red Hat logos. The recaptures crop the sidebar.
- `grub_boot_menu.png` (I3) shows RHEL **9.0** at low resolution and does not
  match the other captures. Its source is not recorded.

Propose: the instructor captures RHEL 10.0 screens during a dry run of the
install exercise on the SCC lab, which also answers the open questions about
that exercise. The text "Red Hat Enterprise Linux 10.0 Installation" in the
installer header stays; it is a text reference.

**GIFs, not ported.** `parted_demo.gif`, `mkfs_demo.gif`, `mount_demo.gif`,
`swap_demo.gif`, and `kickstart_demo.gif` give way to casts, per
`docs/course-authoring.md`.

**Unreferenced by the Slidev deck.** `mbr_table.jpg` sits in the source's
`public/` directory but no slide in either deck uses it. `disk_size_units.png`
is used by the storage ODP; see below.

**Only in the ODP decks.**

- **Disk Size Units (SO6), cannot be used, rebuild.** A scan of the *RHCSA Cert
  Guide* table of decimal and binary units, the same file as the unreferenced
  `disk_size_units.png`. Slide 1.5a rebuilds it as our own Markdown table.
- **The cable photograph (IO2), no recorded source.** Three network cables
  running into a white device, across the top of "Download Installation Media".
  It looks like a stock or presentation-designer image. Same rule as the other
  unsourced images; fallback: slide 5.2 runs as text. **Replaced 2026-10-19**
  with a decorative CD, since the slide is about ISO images. The instructor
  generated it with Gemini on pure green, so it is the instructor's asset and
  needs no credit line. The prompt kept green out of the disc's rainbow sheen
  and asked for an opaque hub ring, so the key could not eat into the disc; no
  pixel inside the disc lost opacity, and the open center hole shows the
  week's accent. Gemini returned it at 3:4 rather than the 4:3 asked for, so
  the disc was cropped and centered at 90% of the height on a 4:3 transparent
  canvas to suit the landscape column: `assets/installation-disc.webp` (1200
  by 900, 52 KB). Its alt text is empty, the repository's mark for a
  decorative image. The cable placeholder was deleted.
- **Office-suite icons (SO3, SO4, SO13, SO24), not ported.** The icon facts are
  rebuilt with `IconGrid` and Carbon icons (Apache-2.0), which the theme
  already ships, so no icon file needs a publication basis.
- **The hub-and-spoke arrows (IO5).** Drawn shapes, not an image. Slide 5.5
  rebuilds the layout with the recaptured screenshots.
- **The LibreOffice theme artwork** on the title and section slides is not
  needed; the theme's own cover and section layouts replace it.

## Topic fragments

Each fragment opens with its `layout: section` slide, which carries the
`routeAlias` and `topicInfo`. A "fixed" `TerminalWindow` shows a transcript that
never changes and takes no `rows`. A "Magic Move" terminal grows across clicks
and takes `rows` equal to the line count of its final state, counted when it is
built and confirmed with `check:slides --verbose`. Every prompt takes the theme
form, `root@servera:~#` or `student@servera:~$`.

Device names below follow Decision 1, option 1, which the rebuild made true.

### 1. `partitions.md` (17 slides), built 2026-10-17

`routeAlias: partitions`. Alignments: RH134 chapter 10, cert guide chapter 14.
Exercises: Create Two GPT Partitions Exercise, Create Five MBR Partitions
Exercise. Built and checked, then revised by the instructor on 2026-10-18; the
entries below describe that final version. Every transcript was captured on the
rebuilt instructor lab, which names its disks `sda` to `sdd` like the SCC lab.
The recording slides, 1.13a and 1.15, wait on the casts.

Entries keep the numbers they were planned under, so references elsewhere in
this plan still resolve, and are listed in deck order. On 2026-10-18 the
instructor moved 1.6 to open the fragment, split the MBR layout bar onto its own
slide (1.4a), and removed 1.11, 1.12, and 1.12a: the steps they repeated are
explained on the command mode and interactive mode slides, 1.9 and 1.10.

##### 1.1 Partitions

Sources M1 and SO1. Section slide titled "Partitions" (Decision 4), carrying the
`topicInfo` alignments and both exercises.

Components: `section`.

##### 1.6 Storage Device Names

Sources M6 and SO7, moved by the instructor to the start of the fragment. "The
Linux kernel gives each storage device a file", then our own table of disk type,
device, and first partition: SCSI, SATA, and USB disks, and VirtualBox disks
(`/dev/sda`, `/dev/sda1`); virtual disks in KVM virtual machines (`/dev/vda`,
`/dev/vda1`); NVMe solid-state drives (`/dev/nvme0n1`, `/dev/nvme0n1p1`).
Closing line: the letter counts disks, so `sda` is the first disk and `sdb` the
second, except on NVMe.

Components: default layout, Markdown table.

##### 1.2 Partitions

Sources M2 and SO2. "Split a hard drive into sections", then two click-revealed
groups: **Pro: Isolation** (a full root partition, `/`, crashes the system,
which a separate `/var` prevents; OS files stay apart from user files) and
**Con: Inflexible** (plan ahead, since partitions are hard to resize later;
space is wasted when a partition is sized too large).

Components: `two-cols-header` (`leftWidth: 59`), two `v-click` groups,
`SuccessText` on "Pro:" and `DangerText` on "Con:", the instructor's
AI-generated hard drive illustration on the right (`hard-drive-platter.webp`).
Revised 2026-10-19 so the image takes the full height beneath the title,
like w01's "IT-230 Exams" slide: "Split a hard drive into sections" moved from
the header into the left column, so both columns run the full 402 canvas
pixels beneath the title, and the image is a 3:4 transparent WebP, shown at
301 by 402 with the accent backdrop as its frame. The instructor set the split
to 59/41, at which every bullet fits on one line.

##### 1.3 Two Partition Types

Sources M3 and SO3. Each column is one partition type under its own heading:
Master Boot Record (MBR), "The older standard", its firmware screenshot, and
"Used mostly with BIOS firmware"; then, on a click, GUID Partition Table (GPT),
"The modern standard", its screenshot, and "Used mostly with UEFI firmware".
Both images are 270px wide, each with a credit line beneath it in small type
(`text-xs`, at the instructor's request; replaced 2026-10-19, chosen by the
instructor):

- BIOS: "PhoenixBIOS Setup Utility" on a Gericom 1st Supersonic M6T laptop,
  photographed by Ekrem Canli (User:HylgeriaK), CC BY-SA 4.0, from
  <https://commons.wikimedia.org/wiki/File:Gericom_1st_Supersonic_M6T_BIOS.jpg>;
  cropped to the screen and scaled to 1200px wide, which the credit line notes
  ("cropped"). Saved as `assets/bios-setup-screen.jpg`.
- UEFI: ASUS "UEFI BIOS Utility - Advanced Mode" (the Precision Boost Overdrive
  page), a screenshot by 10kvsgp, CC BY-SA 4.0, from
  <https://commons.wikimedia.org/wiki/File:Precision_Boost_Overdrive_settings.png>;
  unmodified. Saved as `assets/uefi-setup-screen.png`.

The instructor wanted a BIOS screen that says "BIOS" (the public-domain Award
screen says "CMOS Setup Utility") and a UEFI screen that is visibly
mouse-driven, to show the contrast; the Surface, TianoCore, and InsydeH2O UEFI
screens were rejected because they look like text-mode BIOS menus. The UEFI
screen's own title still says "UEFI BIOS", since vendors use both names. The
credit lines follow the form already used on the archives slide.

Components: `two-cols-header` with `vertical: start` and `horizontal: center`,
a `v-click` around the GPT column.

##### 1.4 Master Boot Record (MBR)

Sources M4 and SO4. Six icon facts in rows of three: an older scheme, from 1983;
disks up to 2 TiB; one partition table, no copy; used with BIOS firmware; only
four primary partitions; extended partitions hold more.

Components: default layout with `horizontal: center`, `IconGrid`.

##### 1.4a Creating 6 Partitions on MBR

Split from 1.4 by the instructor. Three lines: partitions 1 to 3 are primary
partitions; partition 4 is an extended partition; the extended partition can
hold several logical partitions. Then our own layout bar: MBR, `sdb1` to
`sdb3`, and `sdb4 (extended)` with `sdb5` and `sdb6` beneath it. This slide now
carries what 1.12a taught about extended and logical partitions.

Components: default layout, `AccentText` on the partition kinds, Mermaid
`block-beta` at `scale: 1.1` (partitions in the blue accent's wash, the table in
grey, the extended partition dashed).

##### 1.5 GUID Partition Table (GPT)

Sources M5 and SO5. Five icon facts: up to 128 partitions; disks up to 8 ZiB;
two copies of the partition table; works with UEFI firmware; a globally unique
ID (GUID) for each disk and partition. Beneath them, our own bar from the
primary GPT, through `sdb1` to `sdb5` and free space, to the backup GPT. The
instructor replaced the planned "When to use" column and its `Callout` with the
`IconGrid`.

Components: default layout with `horizontal: center`, `IconGrid`, Mermaid
`block-beta` at `scale: 1.1`.

##### 1.5a Disk Size Units (removed 2026-10-18)

From the storage ODP (SO6): one slide with two explanatory lines, the byte-count
table, and the `lsblk` and `parted` example. The instructor chose the two-slide
version, 1.5b and 1.5c, and removed it.

##### 1.5b Why Two Sets of Units

**Addition, 2026-10-17, chosen over 1.5a on 2026-10-18.** Background the
instructor supplied on the IEC binary prefixes, trimmed to what explains the
difference. Three facts revealed one per click, each naming what it introduces
before the next relies on it: decimal, where 1 KB is 1000 bytes, the way drive
makers count; binary, where 1 KB is 1024 bytes, the power of 2 closest to 1000;
the same names, KB, MB, and GB, for two different sizes. On the next click, "In
1998 the binary units got names of their own" over a table of prefix (kibi to
tebi), what it is short for, and symbol.

Components: default layout with `horizontal: center`, `IconGrid` with `clicks`
(`data-base`, `chip`, `warning-alt`), a `v-click` around the line and table.

##### 1.5c Disk Size Units

**Addition, 2026-10-17, chosen over 1.5a on 2026-10-18.** The byte-count table
alone: each decimal unit and its binary counterpart, with exact byte counts, and
each binary unit as a power of 2, from 2¹⁰ to 2⁴⁰. The instructor removed the
three click-revealed reasons to care (the "1 TB" drive at 931 GiB, `5G` against
`5369MB`, and the 477 MiB partition).

Components: default layout with `vertical: center`, Markdown table. The lab
checks behind the removed reasons are kept under "Verification".

##### 1.7 Partitioning Tools

Sources M7 and SO8. "`lsblk` lists block devices: every disk, partition, and
mount point", then `lsblk -p` on `servera` (13 lines): the OS disk with its
partitions and LVM volumes, the three blank disks, and both optical drives.

Components: default layout, fixed `TerminalWindow`.

##### 1.8 Partitioning Tools

Sources M8 and SO8. "`parted`, the partition editor": create and manage
partitions (add, delete, and resize); supports both MBR (`msdos`) and GPT; two
modes, interactive and command.

Components: `two-cols-header` with `listSpacing: padded`, and the decorative
`partitioned-disk.webp` on the right (empty alt text), which fills the column
height at 349 by 349. It replaced the tools placeholder on 2026-10-19.

##### 1.9 `parted` Command Mode

Source M9. "Create an MBR partition table and 1 partition in command mode".
Three states: `mklabel msdos`, then `mkpart primary xfs 1MiB 1GiB`, each
answered by "Information: You may need to update /etc/fstab." and a blank line,
then `print` with its full output, whose empty File system column shows that no
file system exists yet.

Components: default layout, Magic Move `TerminalWindow` with `rows="15"`,
confirmed by `check:slides` at 320.8px.

##### 1.10 `parted` Interactive Mode

Source M10. "Create an MBR partition table and 1 partition in interactive mode".
Seventeen states, typing and Enter as separate clicks (instructor review,
2026-10-17): the banner and `(parted)` prompt, then `mklabel` answered `msdos`,
`mkpart` answered `primary`, `xfs`, `1MiB`, and `1GiB`, and `quit` with its
`/etc/fstab` reminder (13 lines).

Components: default layout, Magic Move `TerminalWindow` with `rows="13"`,
confirmed by `check:slides` at 284.8px.

##### 1.11 Device Files (removed 2026-10-18)

Source M11. Compared `/dev/sd[a-z]*` with `/dev/vd[a-z]*`. Removed by the
instructor; 1.6 covers both names. This settles Open question 7.

##### 1.12 The `parted` Workflow: Command Mode (removed 2026-10-18)

Source M12. Walked `lsblk`, `mklabel`, two `mkpart` commands, `udevadm settle`,
and `print` across three click states. Removed by the instructor, who explains
the process on 1.9 and 1.10. Its second partition, `sdb2`, was the only one a
slide created; fragment 2 now formats the GPT exercise's partitions instead.

##### 1.12a Extended and Logical Partitions (removed 2026-10-18)

**Addition** (Decision 13), removed by the instructor. 1.4a now shows the
extended and logical layout, and the MBR exercise's written version carries the
details: logical partitions number from 5, and starting one 1 MiB inside the
extended partition avoids `parted`'s "closest location" question.

##### 1.13 Exercise: Create Two GPT Partitions on `/dev/sdb`

Source M13. Goal: partition a blank disk with a GPT label. Host `servera`.
Workflow: inspect `/dev/sdb`; create a `gpt` disk label; create two partitions,
1 GiB each; verify the partitions.

Components: `exercise`.

##### 1.13a Exercise recording (added 2026-10-19)

**Addition.** Recording variant for `create-two-gpt-partitions-exercise.cast`.
Added 2026-10-19: the cast runs 2 min 45 s with 5 section markers, the
`AsciinemaPlayer` label describes the recorded workflow, and the `resources`
slot links the written exercise.

##### 1.14 Exercise: Create Five MBR Partitions on `/dev/sdc`

Sources M14 and SO9, with M14's two corrections. Goal: use an extended
partition to get past MBR's four-partition limit. Host `servera`. Workflow:
inspect `/dev/sdc`; create an `msdos` disk label; create three primary
partitions, 500 MiB each; create an extended partition in the remaining space;
create a 1 GiB logical partition inside it; verify the partitions.

Components: `exercise`.

##### 1.15 Exercise recording (added 2026-10-19)

Sources M15, SO10, and SO11. Recording variant for
`create-five-mbr-partitions-exercise.cast`. Added 2026-10-19: the cast runs 4
min 44 s with 8 section markers, the `AsciinemaPlayer` label describes the
recorded workflow, and the `resources` slot links the written exercise.

### 2. `file-systems.md` (8 slides), built 2026-10-18

`routeAlias: file-systems`. Alignments: RH134 chapter 10, cert guide chapter
14. Exercise: Create File Systems Exercise. Built and checked after the
instructor reviewed fragment 1 and approved three changes for it: 2.4 and 2.5
say their partitions come from the GPT exercise, 2.4's verify state ties the
`xfs` typed into `parted` back to `mkfs.xfs`, and 2.3 is centred like the other
`IconGrid` fact slides. Every transcript comes from one capture on `servera`,
taken from the GPT exercise's end state; `sdb` was wiped afterwards. The
instructor revised 2.3 to 2.5 on 2026-10-18, and the entries below describe
that version. The recording slide, 2.7, was added on 2026-10-19.

##### 2.1 File Systems

Source M16. Section slide, carrying the `topicInfo` alignments and the
exercise.

Components: `section`.

##### 2.1a File Systems (added 2026-10-19)

Added by the instructor (Decision 33). Source M17's line, "A file system
controls how files are stored, like shelves in a bookcase", moves here from
2.2. Below it, two pictures of the same bookcase: on the left with no shelves,
its books in a messy pile at the bottom (a partition with no file system); on
the right, on the first click, with shelves and the books standing in rows
(after the file system is added).

Components: `two-cols-header` (even columns), one image per column, the right
one in `<v-click>`. The click attaches to the image's paragraph without adding
a wrapper, so the column's image-fit rules still apply and both images fill the
column height.

##### 2.2 File Systems

Sources M17 and SO12. A table of file system and notes: XFS (Red Hat default),
ext4 (long-standing Linux standard), Btrfs (copy-on-write, snapshots), and
SO12's ZFS (file system and volume manager). Closing `Callout`: Red Hat
recommends XFS. Btrfs and ZFS stay unmarked (Decision 18). The source's "Many
Choices" heading was dropped because the slide overflowed by 38px with it; the
table header carries the same idea. The bookcase line moved to 2.1a on
2026-10-19, which leaves nothing under the title.

Components: `two-cols-header` (`leftWidth: 60`), Markdown table with the names
in bold as in the source, `Callout`, and 2.1a's shelved bookcase on the right,
filling the column height as the hard drive does on 1.2.

##### 2.3 XFS vs ext4

Sources M18 and SO13. "Both are **journaling** file systems, so both recover
quickly after a crash", then a comparison table with a column for each file
system: largest file system (1024 TiB and 50 TiB), grow (only while mounted;
mounted or unmounted), shrink (never; only while unmounted), and create with
(`mkfs.xfs`, `mkfs.ext4`). The instructor asked for this version because the
`IconGrid` version gave XFS three facts and ext4 one line, and chose it over
that version on 2026-10-18.

Components: default layout, `AccentText` on "journaling", Markdown table.
Sources: grow and shrink from Cert Guide chapter 15 ("You can decrease an Ext4
file system offline only") and RH134 chapter 11 (`xfs_growfs` supports only
online resizing, `resize2fs` both), with the `resize2fs` man page on `servera`;
the sizes from Red Hat's RHEL 10 file systems guide ("Supported file system size
up to 1024 TiB" for XFS and 50 TiB for ext4), since neither course source gives
them. The table uses "mounted" before 3.2 defines mounting.

##### 2.4 Create an XFS File System

Source M19. Two click states. First, "Format `/dev/sdb1` with XFS" over
`mkfs.xfs /dev/sdb1`, its first output line, `...output omitted...`, and the
last seven lines from `data` to "Discarding blocks...Done.", then a `Callout`
titled "Format the partition, not the disk": file systems should be created on
a partition (`sdb1`), not a disk (`sdb`). Then "Verify: `lsblk -fp` shows the
file system type and its UUID" over `lsblk -fp /dev/sdb`, with `xfs` and a UUID
on `sdb1` and nothing yet on `sdb2`, and the closing line "The `xfs` typed into
`parted` only set the partition type. `mkfs.xfs` created the file system." The
trimmed output and the `Callout` are the instructor's (2026-10-18).

Components: default layout, `v-switch at="1"` with two templates, each a fixed
`TerminalWindow`, and `Callout`. On a whole disk with a partition table,
`mkfs.xfs` refuses ("appears to contain a partition table (gpt)") and
`mkfs.ext4` asks "Proceed anyway?"; see "Verification".

##### 2.5 Create an ext4 File System

Source M20, with its corrections. Same shape: "Format `/dev/sdb2` with ext4"
over `mkfs.ext4 /dev/sdb2` and its full output, then "Verify: both partitions
now have a file system" over `lsblk -fp /dev/sdb` showing `xfs` on `sdb1` and
`ext4` on `sdb2`. The tab before the superblock list is written as eight
spaces, because the slide renders a tab four columns wide and a terminal
renders it eight.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`.

##### 2.6 Exercise: Create File Systems on `/dev/sdb`

Sources M21 and SO14, identical.

- **Goal:** Put an XFS and an ext4 file system on the two GPT partitions
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create Two
  GPT Partitions
- **Workflow:** 1. Inspect `/dev/sdb`; 2. Create an XFS file system on
  `/dev/sdb1`; 3. Create an ext4 file system on `/dev/sdb2`; 4. Verify the file
  systems

Components: `exercise`.

##### 2.7 Exercise recording (added 2026-10-19)

Sources M22, SO15, and SO16. Recording variant for
`create-file-systems-exercise.cast`. Added 2026-10-19: the cast runs 1 min 2 s
with 5 section markers, the `AsciinemaPlayer` label describes the recorded
workflow, and the `resources` slot links the written exercise.

### 3. `mounting-file-systems.md` (16 slides), built 2026-10-18

`routeAlias: mounting-file-systems`. Alignments: RH134 chapter 10, cert guide
chapter 14. Exercises: Temporarily Mount an XFS File System Exercise,
Persistently Mount an XFS File System Exercise. Built and checked; the entries
below describe what shipped, and it waits on the instructor's review. The
recording slides, 3.6a and 3.13, were added on 2026-10-19.

Slides use `/mnt/data` and `/data` as their mount points; the exercises keep
the source's `/mnt/records` and `/records`, so the exercises are not a replay
of the slides (Decision 15).

The transcripts continue from fragment 2's file systems, so the UUIDs students
met on 2.4 and 2.5 come back here: `sdb1` (XFS) is
`6bb0dab6-7866-42ce-986b-7d6c73c0bb48` and `sdb2` (ext4) is
`0039b3e0-6751-40a6-8fd7-e4311b20b09a`, on 3.4, 3.8, 3.9, 3.9a, and 3.10
(instructor review, 2026-10-18). On the lab the two file systems were recreated
with those UUIDs (`mkfs.xfs -m uuid=` and `mkfs.ext4 -U`) before capture; that
is setup only, and every transcript is real output from those file systems.

##### 3.1 Mounting File Systems

Source M23. Section slide, carrying the `topicInfo` alignments and both
exercises.

Components: `section`.

##### 3.1a `mount` reads like `cp`

**From the storage ODP (SO17), not in the Slidev deck.** The ODP's three boxes
read "Mount command", "Similar syntax as `cp`", and "`mount /from /to`". Rebuilt
as the comparison they point at, so students meet the argument order before
3.3 names the parts: the heading "`mount` reads like `cp`" over a two-row table
of command, from, and to (`cp /etc/hosts /tmp/hosts`, `mount /dev/sdb1
/mnt/data`). The planned two-line code fence rendered small in the centred
layout, and the table's From and To headers say the lesson outright.

Components: `center` layout, Markdown table.

##### 3.2 Mount File System Temporarily: Step 1

Source M24. A file system must be **mounted** on a directory before you can use
it; that directory is the **mount point**; `/mnt` is there for temporary
mounts. Then "Create the mount point" over `mkdir /mnt/data`.

Components: default layout, `AccentText` on the two terms, fixed
`TerminalWindow` ending in a bare prompt.

##### 3.3 Mount File System Temporarily: Step 2

Source M25. `mount` attaches the file system to the mount point; the mount is
**temporary**, so after a reboot the file system is no longer mounted. A
`TextExplainer` over `mount /dev/sdb1 /mnt/data` names the file system and the
mount point (Decision 16). Closing line: temporary mounts can use the device
file; persistent mounts should use the UUID.

Components: default layout, `TextExplainer` (two steps; the first is active
before any click).

##### 3.4 Mount File System Temporarily: Step 3

Source M26. "Verify: `lsblk -fp` now fills in FSAVAIL, FSUSE%, and MOUNTPOINTS
for `sdb1`" over `lsblk -fp /dev/sdb` (`908.3M`, `5%`, `/mnt/data` on `sdb1`;
`sdb2` ext4 and unmounted) and `mount | grep /mnt/data`. The source ran
`lsblk -p` but showed `-f` columns; corrected. The `lsblk` command is the one
2.4 and 2.5 verified with, so the columns that were empty there are the point.

Components: default layout, fixed `TerminalWindow` holding both commands.

##### 3.5 Mount File System Temporarily: Step 4

Source M27. Unmount with `umount`; the command is **u**mount, not **un**mount.

Components: default layout, `AccentText` on "u" and "un", fixed
`TerminalWindow` ending in a bare prompt.

##### 3.6 Exercise: Temporarily Mount an XFS File System

Sources M28 and SO20, the first half of the ODP's combined mount exercise.

- **Goal:** Mount a file system by hand, then unmount it
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create File
  Systems
- **Workflow:** 1. Inspect `/dev/sdb`; 2. Create the mount point
  `/mnt/records`; 3. Temporarily mount `/dev/sdb1` on `/mnt/records`; 4. Verify
  the mount; 5. Unmount `/dev/sdb1`; 6. Verify it is unmounted

The written exercise adds a note for `umount: /mnt/records: target is busy.`,
which appears when a shell is still inside the mount point.

Components: `exercise`.

##### 3.6a Exercise recording (added 2026-10-19)

**Addition.** The source has no demo slide for this exercise. Recording variant
for `temporarily-mount-xfs-exercise.cast`. Added 2026-10-19: the cast runs 1
min 39 s with 7 section markers, the `AsciinemaPlayer` label describes the
recorded workflow, and the `resources` slot links the written exercise.

##### 3.7 Mount File System Persistently

Sources M29 and SO18 ("Mount File System automatically at Boot"). "The file
system table, `/etc/fstab`: F-stab or FS-tab, you decide!" and "Each line
defines a file system to mount at boot", then an excerpt of `servera`'s file:
its root, `/boot`, and swap lines, with the rebuilt lab's UUIDs. The excerpt
leaves out anaconda's comment block and the instructor lab's `/dev/sr1
/mnt/dvd` line, adds a column-header comment, and lines the fields up in
columns; `/etc/fstab` is whitespace-delimited, so the spacing changes nothing.
The fence title says "excerpt, header comment added". SO18's flow closes the
slide: `/etc/fstab` entries, "translated to", systemd mount units.

Components: default layout, titled `text` fence, two-node Mermaid
`flowchart LR` with an edge label, at `scale: 0.9`.

##### 3.8 The Six Fields

Sources M30 and SO19, the same scan of a Cert Guide table, which cannot be
published (Decision 10). "Each line has six fields, separated by whitespace",
then a `TextExplainer` over `UUID=6bb0dab6-... /data xfs defaults 0 0` stepping
through device, mount point, type, options, dump, and fsck. The explanations
follow the Cert Guide's Table 14-5: dump is obsolete and set to 0, and the fsck
field is commonly 0.

Components: default layout, `TextExplainer` with `size="sm"`. The line is 64
columns, which the component sizes `md`, and at `md` it overflowed the slide by
35px; see "Authoring notes".

##### 3.9 Fields of an `/etc/fstab` Entry

Source M31, which had no heading (its first visible line is a comment inside
the fence). Title added. The `/data` line above a six-row table of field,
example, and description; options give `ro` and `noexec` as examples, from the
Cert Guide's Table 14-6. The source's UUID,
`a4d4d93a-1234-5678-abcd-ef0123456789`, is invented; the slide uses `sdb1`'s UUID
from 2.4, `6bb0dab6-7866-42ce-986b-7d6c73c0bb48`.

Components: default layout, untitled `text` fence, Markdown table. The fence
lost its `[/etc/fstab]` title to fit. 3.3px of clearance remains, which is
fine: only overflow matters (instructor, 2026-10-18).

##### 3.9a Add an Entry to `/etc/fstab`

**Addition, 2026-10-18** (Decision 31). Two click states. First, "Create the
mount point, then append the UUID instead of typing it" over `mkdir /data`,
`lsblk -no UUID /dev/sdb1 >> /etc/fstab`, and `tail -1 /etc/fstab` showing the
bare UUID, with a `Callout type="warning"` titled "Use >>, not >": `>` replaces
all of `/etc/fstab` with this one line, erasing the entries for `/`, `/boot`,
and swap; `>>` appends. Then "Finish the line in `vim`: `G` to the last line,
`I` to add `UUID=` in front, `A` to add the other fields" over `vim
/etc/fstab` and `tail -1` showing the finished line. The planned single
terminal became a `v-switch` so the warning and the vim keys each get room, as
on 2.4; `mkdir /data` was added because `mount -av` on 3.10 needs the mount
point.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`, `Callout type="warning"`.

##### 3.10 Systemd Mount Units

Source M32. "`/etc/fstab` entries become systemd mount units, so reload systemd
after every edit, then mount every entry", over `systemctl daemon-reload` and
then `mount -av` with its real output (Decision 25): `/` and swap ignored,
`/boot` and `/mnt/dvd` already mounted, `/data` successfully mounted. Verbose
mode also prints a five-line SELinux warning for a new file system, which the
slide keeps because students will see it; a line revealed with the second state
explains it: a new file system has no SELinux labels yet, and
`restorecon -R /data` adds them (an addition, kept by the instructor on
2026-10-18; `restorecon` was taught in week 6). The `/mnt/dvd` line comes from the instructor lab's kickstart, which slide
1.7's `lsblk` already shows; the SCC lab may not print it.

Components: default layout, Magic Move `TerminalWindow` in two states with
`rows="12"`, confirmed by `check:slides` at 266.8px, and a `v-click="1"` line.

##### 3.11 Best Practices

Source M33. **Use the UUID, not the device file:** device names such as
`/dev/sdb1` can change between reboots, rarely, and the UUID belongs to the file
system. **Always test before rebooting:** `findmnt --verify` checks
`/etc/fstab` without mounting anything (Decision 24), and `mount -av` mounts
every entry that is not mounted yet. Closing warning: a broken `/etc/fstab` can
stop the system from booting (the Cert Guide says the same).

Components: default layout, `listSpacing: padded`, `Callout type="warning"`.

##### 3.12 Exercise: Persistently Mount an XFS File System

Sources M34 and SO20, the second half of the ODP's combined mount exercise.

- **Goal:** Mount a file system at every boot
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create File
  Systems
- **Workflow:** 1. Inspect `/dev/sdb`; 2. Create the mount point `/records`;
  3. Persistently mount `/dev/sdb1` on `/records`; 4. Test with `mount -av`;
  5. Reboot and verify

Step 3 appends the UUID with `>>` and finishes the line in vim (Decision 31).
Step 4 adds `restorecon -Rv /records` after `mount -av`, so the SELinux warning
3.10 explains does not come back; it is not a workflow step of its own (kept
by the instructor, 2026-10-18). Step 5 keeps its reboot; the one-reboot cut is
deferred (Decision 19). The command file waits 15 seconds after `reboot`
before `ssh servera`: the instructor lab's `servera` boots in about 5.

Components: `exercise`.

##### 3.13 Exercise recording (added 2026-10-19)

Sources M35, SO21, and SO22. Recording variant for
`persistently-mount-xfs-exercise.cast`. Added 2026-10-19: the cast runs 2 min
55 s with 6 section markers, the `AsciinemaPlayer` label describes the recorded
workflow, and the `resources` slot links the written exercise.

### 4. `swap-space.md` (8 slides), built 2026-10-18

`routeAlias: swap-space`. Alignments: RH134 chapter 10, cert guide chapter 14.
Exercise: Create Persistent Prioritized Swap Space Exercise. Built and checked;
it waits on the instructor's review, and the recording slide, 4.8, was added
on 2026-10-19. The swap partition's UUID on 4.5 and 4.6,
`114d5f7e-dfeb-47c1-be7a-7de8a283134b`, comes from one capture, so the `mkswap`
output and both `/etc/fstab` lines agree.

##### 4.1 Swap Space

Sources M36 and SO23, both "Manage Swap Space", retitled as a noun (Decision
4). Section slide, carrying the `topicInfo` alignments and the exercise.

Components: `section`.

##### 4.2 Swap Space

Sources M37 and SO24. "Swap is a **backup plan** for when RAM is full: the
kernel moves idle memory pages to disk", then the ODP's three facts in place of
M37's pros and cons: used when RAM is full; keeps the system from crashing;
much slower than RAM. Closing line: swap is **not a substitute** for enough
RAM (RH134: "do not consider swap space as a sustainable solution for
insufficient RAM").

Components: default layout with `horizontal: center`, `IconGrid`
(`dashboard`, `checkmark-outline`, `face-dissatisfied`), `AccentText`, and
`DangerText` on "not a substitute".

##### 4.3 How Much Swap Do I Need?

Sources M38 and SO25, the same RH134 screenshot, rebuilt as our own table.
"It depends. Red Hat's recommendation:" over the four rows of RH134's Table
10.1 (RAM, swap space, and swap space if allowing for hibernation), then
"Hibernation saves the contents of RAM to swap before powering off, so it needs
more swap than RAM".

Components: default layout, Markdown table; the lead line is the credit.

##### 4.4 Swap Space Components

Sources M39 and SO26. Three click states: (1) the `linux-swap` partition type,
which marks the partition's purpose in `parted` (RH134: tools no longer require
it), and `mkswap`, which writes the swap signature; (2) `swapon`, active until
the next reboot, and `/etc/fstab`, active at every boot; (3) `free -h` and
`swapon --show` (instructor review, 2026-10-18), with real output from one
session: the system's swap at priority `-2`. SO26's tools illustration is not
used here.

Components: default layout with `vertical: start`, `v-switch at="1"` with three
templates, a fixed `TerminalWindow` holding both commands.

##### 4.5 Swap Space Workflow

Source M40, with its corrections. Two click states. First, "Steps 1 and 2:
create a `linux-swap` partition, then format it as swap" over
`parted /dev/sdb mkpart swap1 linux-swap 2GiB 3GiB` (no `mklabel`, so the GPT
exercise's partitions survive and the new one is `sdb3`), `udevadm settle`, and
`mkswap /dev/sdb3` with its real output. Then "Step 3: activate it now;
`swapoff` turns it off again" over `swapon /dev/sdb3`, `swapon --show` (the new
swap at `-3`, below the system's `-2`), and `swapoff`, followed by "Step 4: add
it to `/etc/fstab`, then run `systemctl daemon-reload` and `swapon -a`" over the
`pri=5` line, which uses `swap` as its mount point (Decision 32). As in the
source, the line carries `pri=5` before 4.6 explains it.

Components: default layout with `vertical: start`, `v-switch at="1"` with two
templates, each a fixed `TerminalWindow`, and a titled `text` fence.

##### 4.6 Swap Priority

Source M41. Several swap spaces can have different **priorities**, and the
higher priority is used first. Set it with `pri=` in the options field;
without it, each new swap space gets a lower priority than the last (RH134, and
4.5's `-3`). The `pri=5` line, then `swapon --show` after `swapon -a`: the
system's swap at `-2` and `sdb3` at `5`.

Components: default layout, `AccentText`, titled `text` fence, fixed
`TerminalWindow`.

##### 4.7 Exercise: Create Persistent Prioritized Swap Space

Sources M42 and SO27. SO27's five steps are M42's seven without the
deactivate and verify steps.

- **Goal:** Add a swap partition that is used before the system's own
- **Environment:** **Host:** `servera`; **Prerequisite exercise:** Create Two
  GPT Partitions
- **Workflow:** 1. Create a partition on `/dev/sdb` suitable for swap;
  2. Format `/dev/sdb3` as swap space; 3. Activate the swap space temporarily;
  4. Deactivate it; 5. Persistently activate it with priority 5; 6. Verify the
  persistent swap; 7. Reboot to verify

Step 1 uses interactive `parted` (name `swap1`, type `linux-swap`, `2GiB` to
`3GiB`). Step 5 appends the UUID with `>>` and finishes the line in vim, as
exercise 5 does (Decision 31), and the line reads `swap swap pri=5 0 0`
(Decision 32). The command file waits 15 seconds after
`reboot`. Its "Clean up" section, not on the slide, restores `/dev/sdb` and
`/etc/fstab` for w11 (Decision 20): `swapoff`, `umount /records`, delete the
`/records` and swap lines in vim by searching for `/records` and `/pri=5`,
`systemctl daemon-reload`, `wipefs -a` on the three partitions and then the
disk, and `rmdir /records /mnt/records`. The written exercise says the
`umount` and `rmdir` errors are harmless for a student who skipped the mount
exercises.

Components: `exercise`.

##### 4.8 Exercise recording (added 2026-10-19)

Sources M43, SO28, and SO29. Recording variant for
`create-persistent-prioritized-swap-exercise.cast`. Added 2026-10-19: the cast
runs 6 min 14 s with 9 section markers, the `AsciinemaPlayer` label describes
the recorded workflow, and the `resources` slot links the written exercise.

### 5. `installing-rhel.md` (12 slides, no recordings), built 2026-10-18

`routeAlias: installing-rhel`, in
`course/chapters/rh134-ch16-installing-red-hat-enterprise-linux/`. Alignments:
RH134 chapter 16 and cert guide chapter 1, both "Installing Red Hat Enterprise
Linux" (Decision 23); the cert guide chapter is written `"01"`, as the entry
check requires. Exercise: Install RHEL Manually Exercise, written only: the
instructor runs it in the SCC lab so students can follow along creating the
VirtualBox VM, so there is no command file and no recording (Decision 22,
confirmed 2026-10-18). Built and checked; it waits on the instructor's review.

Built on the install ODP's sequence plus the Slidev deck's standard-partition
and root-account slides (Decision 26), and revised on 2026-10-18 from the
instructor's dry run on the VDI, whose screenshots are now the slides' images
(Decision 12). Each RHEL 10.0 capture was cropped to the guest display (a
1276 by 800 region at 0, 63 of the VirtualBox window; the boot menu's is 718 by
400), and the Installation Summary also loses Anaconda's left sidebar, with its
Red Hat logo (the first 190px), as Decision 12 planned; so does Installation
Complete, the RHEL 10.0 screen at the end of the dry run. No logo inside a
screenshot is painted over: the VirtualBox wizard's Red Hat OS-type badge stays
as captured (instructor, 2026-10-18). The wizard screenshots were retaken with
the working values and name the VM `servercc`; the instructor asked for that to
be ignored, so the slide's text says `serverc`. The cable photograph on 5.2 was
the only placeholder left; a decorative CD replaced it on 2026-10-19.

**Order, revised 2026-10-18 at the instructor's direction.** On the VDI the
installer takes too long to load and run to wait for in class, so students
create the VM and select the Install entry at the very start of the topic, and
it loads while the rest of the slides are presented. The slides run: 5.1, 5.2a
(Create the Virtual Machine), 5.3 (The Boot Menu), 5.2 (Download Installation
Media), 5.4 to 5.9, 5.9a (Verify the Installation), and 5.10. The entries below
keep their numbers.

##### 5.1 Installing Red Hat Enterprise Linux (RHEL)

Sources I1 and IO1. Section slide, carrying the `topicInfo` alignments and the
exercise.

Components: `section`.

##### 5.2 Download Installation Media

Sources IO2 and I2. The download link,
<https://developers.redhat.com/products/rhel/download>, then the Boot ISO (the
installer only, much smaller; needs a network to download packages) and the DVD
ISO (the installer and every package, about 8 GiB; no network needed, so use it
for the lab). On a click, a `Callout`: write the ISO to a USB drive, or attach
it to a virtual machine as a virtual CD-ROM. The DVD size is measured: the
RHEL 10.0 DVD on `servera` is 8,465,612,800 bytes, about 7.9 GiB, and the Cert
Guide says "approximately 8 GiB". No course source or Red Hat page found gives
the Boot ISO's size, so the slide says "much smaller", as the Cert Guide does;
the source decks' "1 GB" is not used. A decorative CD replaced the cable
photograph on 2026-10-19.

Components: `two-cols-header` (`leftWidth: 55`), the link in the header, both
ISO types stacked on the left, the CD on the right (empty alt text, as it is
decorative; it fills the column height at 327 by 245), and the `Callout`
in the `bottom` slot (the instructor removed its `v-click`). The plan had the
photograph across the top; there it overflowed the slide by 52px.

##### 5.2a Create the Virtual Machine

**Addition, at the instructor's direction (2026-10-18)**, from the dry run's
VirtualBox screenshots. Four click states, each a sentence over one
screenshot: name it `serverc` in `C:\Temp\VMs\IT-230\IT-230`, choose the DVD
ISO, and leave **Proceed with Unattended Installation** unchecked; give it 2048
MB of memory and 2 CPUs, and leave **Use EFI** unchecked; create a new 10 GB
virtual hard disk; in Settings, then Network, leave Adapter 1 on NAT and attach
Adapter 2 to the Internal Network `intnet`. All four screenshots are final;
the wizard places the disk in the VM's folder, at
`C:\Temp\VMs\IT-230\IT-230\serverc\serverc.vdi`.

Components: default layout with `vertical: start`, `v-switch at="1"` with four
templates, each image 300px tall.

##### 5.3 The Boot Menu

Sources IO3 and I3. The RHEL 10.0 boot menu from the dry run (GRUB 2.12):
"Install Red Hat Enterprise Linux 10.0", "Test this media & install Red Hat
Enterprise Linux 10.0", and "Troubleshooting". Above it: "Select **Install Red Hat
Enterprise Linux 10.0** now: it loads slowly on the VDI, so it runs while we go
through the slides".

Components: default layout, lone image.

##### 5.4 Installation Summary

Sources IO4 (the same image as I5) and I4. The summary screenshot beside I4's
three points: the hub every setting is reached from; a warning triangle marks
an item you must complete; nothing is written to disk until **Begin
Installation** (RH134: "Anaconda marks mandatory items with a triangle warning
symbol"; the RHEL 10.0 screen: "We won't touch your disks until you click
'Begin Installation'"). The screenshot is the dry run's summary, before any
item was set.

Components: `two-cols-header` (`leftWidth: 62`), the image on the left,
`AccentText` on "Begin Installation".

##### 5.5 The Installation Summary Hub

Source IO5. The Installation Summary screenshot in the middle, larger, with
two-way arrows out to six screen thumbnails, each labelled with its screen's
name: Time & Date, Software Selection, and Installation Destination in a left
column; Network & Host Name, Root Account, and User Creation in a right column.
The labels are the text alternative, so the thumbnails have empty alt text; the
summary, which has no label, has the alt text "Installation Summary".

Built at the instructor's direction (2026-10-18) from a one-off grid and
Slidev's built-in `Arrow` component, in place of Mermaid, which cannot load the
topic's images in a production build (a path inside a Mermaid block is a plain
string, while Slidev processes Markdown image paths). `docs/course-authoring.md`
asks for HTML to be used sparingly rather than not at all, and a single slide's
grid is within that; the same pattern on several slides would call for a theme
component. The ODP put three screens above the hub and three below; the
left-and-right arrangement leaves about 110 to 160px for each arrow, where the
vertical gaps above and below the hub left about 17px.

Components: a three-column grid (`items-center`) of Markdown images, each box
fixed at 130 by 82px, and the summary at 190 by 142px, with `object-contain`, so
the RHEL 10.0 recaptures land in the same boxes whatever their aspect ratio;
six `<Arrow two-way>` in the accent colour (`var(--it230-color-accent-fill)`),
inside one `aria-hidden="true"` wrapper, so they are decorative to assistive
technology and outside `check:slides`' measurements. `Arrow` draws in slide
coordinates (its SVG is positioned against the slide page), and its endpoints
were measured from the rendered grid and set 8px clear of each image. If the
grid, the labels, or the box sizes change, measure the image edges again and
move the endpoints.

##### 5.6 Standard Partitions

**From the Slidev deck (I12, I14, I15), chosen 2026-10-17, revised from the dry
run (2026-10-18).** "**Automatic** storage uses LVM and picks the sizes;
**Custom** lets you choose", then the layout the dry run used: biosboot 1 MiB
(BIOS Boot), `/boot` 1 GiB xfs, swap 1 GiB, and `/` taking the rest as xfs.
Three click-revealed steps: in Installation Destination, choose Custom, then
Done; set the partitioning scheme to Standard Partition; click + for each mount
point, then Done and Accept Changes. RHEL 10.0's Manual Partitioning screen has
a "New mount points will use the following partitioning scheme" setting, so
the scheme is set once; I15's "change it on every mount point" tip is gone, and
so is the table's Device type column. Anaconda wrote a GPT label on the BIOS VM
(its Summary of Changes lists "partition table (GPT)"), so the BIOS boot
partition is required, which settles Open question 5.

Components: default layout, Markdown table, `v-clicks` ordered list.

##### 5.7 Root Account

**From the Slidev deck (I18), chosen 2026-10-17.** Three click-revealed groups
on the left: RHEL 10 disables `root` by default, and admins use `sudo` instead;
enable it for the lab with **Enable root account** and the lab password
`redhat` (ported from the source deck, as `AGENTS.md` allows), and SSH refuses
password logins as `root` unless **Allow root SSH login with password** is also
selected; in production, leave `root` disabled and use a `wheel`
administrator. The dry run's Root Account screenshot on the right shows both
options. RH134 chapter 16 states each fact.

Components: `two-cols-header` (`leftWidth: 60`), three `v-click` groups, the
screenshot in the right column.

##### 5.8 Install Settings for `serverc`

Sources IO6 and I23. Two tables whose headers name them. Virtual machine: 2048
MB of RAM and 2 vCPUs (the dry run's values; 4096 MB froze the VDI on the first
attempt), a 10 GB disk, adapter 1 NAT, and adapter 2 the Internal Network
`intnet`. Operating system: Minimal Install, time zone UTC, `enp0s8` at
`172.25.250.12/24` with no gateway or DNS, host name `serverc` (as entered in
the dry run, in place of `serverc.lab.example.com`), `root` enabled with
`redhat`, and `student` / `student` as an administrator. The partition row and
the `enp0s3` row were dropped to fit; the written exercise keeps both.

Components: `two-cols-header` (`leftWidth: 40`), two Markdown tables.

##### 5.9 Installation Complete

Sources IO7 and I22. The RHEL 10.0 Installation Complete screen from the dry
run, sidebar cropped. (The RHEL 9.3 capture stood in briefly while the install
finished.)

Components: default layout, lone image.

##### 5.9a Verify the Installation

**Addition, from the instructor's dry run (2026-10-18).** Three click states,
each a sentence over a crop of the installed `serverc`'s console (a fresh
install's prompt is `[student@serverc ~]$`, which the theme's `bash-session`
grammar does not recognize, so the real screen is shown rather than a retyped
transcript): logging in as `student`, and `hostname` printing `serverc`;
`ip addr`, with `172.25.250.12/24` on `enp0s8` and `10.0.2.15/24` from
VirtualBox's NAT on `enp0s3`; and `lsblk`, with `sda1` 1M, `sda2` 1G on
`/boot`, `sda3` 1G as `[SWAP]`, `sda4` 8G on `/`, and `sr0` empty (`1024M`).

Components: default layout with `vertical: start`, `v-switch at="1"` with three
templates, each image sized to its crop.

##### 5.10 Exercise: Install RHEL on `serverc`

Source I24, condensed, with VM creation added because students follow the
instructor in the SCC lab.

- **Goal:** Install RHEL 10 by hand with standard partitions
- **Environment:** **Host:** a new VirtualBox virtual machine, `serverc`, on
  your VDI; **Requirement:** the RHEL 10.0 DVD ISO,
  `C:\Temp\VMs\IT-230\rhel-10.0-x86_64-dvd.iso`
- **Workflow:** 1. Create the `serverc` virtual machine in VirtualBox; 2. Boot it
  from the RHEL 10.0 DVD; 3. Set the time zone and software selection; 4. Create
  standard partitions for `/boot`, swap, and `/`; 5. Configure the network and
  host name; 6. Enable `root` and create the `student` administrator; 7. Begin
  the installation and reboot; 8. Verify with `hostname`, `ip addr`, and `lsblk`

The written exercise follows the dry run (instructor, 2026-10-18): VM Folder
`C:\Temp\VMs\IT-230\IT-230`, 2048 MB and 2 CPUs, Unattended Installation and
Use EFI left unchecked, adapter 2 on `intnet`; Region Etc and City Coordinated
Universal Time; the partitioning scheme set to Standard Partition before adding
`biosboot`, `/boot`, swap, and `/`, and the Summary of Changes; `enp0s3` already
connected, `enp0s8` set manually with no gateway or DNS, host name `serverc`;
Enable root account with Allow root SSH login with password; full name
`Student User` with "Add administrative privileges to this user account (wheel
group membership)"; and Anaconda's "Press Done again to use the password
anyway". It opens with a note that, in class, steps 1 and 2 happen at the start of the
topic so the installer loads during the slides. Its verify step quotes the
dry run's real output. It warns about mouse drift (two pointers that do not line up), which
the instructor met during the dry run. It names no passwords: `AGENTS.md`
allows the lab passwords in slide content only.

Components: `exercise`.

## Exercises

| # | Title                                   | Host      | Frag | Command file                                     |
|--:|-----------------------------------------|-----------|-----:|--------------------------------------------------|
| 1 | Create Two GPT Partitions               | `servera` |    1 | `create-two-gpt-partitions-exercise.sh`          |
| 2 | Create Five MBR Partitions              | `servera` |    1 | `create-five-mbr-partitions-exercise.sh`         |
| 3 | Create File Systems                     | `servera` |    2 | `create-file-systems-exercise.sh`                |
| 4 | Temporarily Mount an XFS File System    | `servera` |    3 | `temporarily-mount-xfs-exercise.sh`              |
| 5 | Persistently Mount an XFS File System   | `servera` |    3 | `persistently-mount-xfs-exercise.sh`             |
| 6 | Create Persistent Prioritized Swap Space | `servera` |   4 | `create-persistent-prioritized-swap-exercise.sh` |
| 7 | Install RHEL Manually                   | new VM    |    5 | none                                             |

Option B, chosen by the instructor on 2026-10-17: the Slidev deck's six
storage exercises rather than the storage ODP's four. Each declared title ends
in "Exercise", such as "Create Two GPT Partitions Exercise". Exercises 1 to 6
port the six source command files, rewritten to the
current `kitty-demo` format. Exercise 7 is an `.html` written exercise only,
drawn from IO6, I23, I24, and the `install_rhel-manually.md` run sheet.

Exercises 1, 3, 4, 5, and 6 form one chain on `/dev/sdb`: partition, format,
mount by hand, mount at boot, add swap. Exercise 2 stands alone on `/dev/sdc`.
Each later exercise names its prerequisite in the Environment slot.

Changes to the source command files, beyond the format:

- Type `/dev/sdb` and its siblings, which the rebuilt lab names natively
  (Decision 1); the sources type `/dev/vdb` under headers that say `/dev/sdb`.
- Edit `/etc/fstab` with `i`, the text, `#@ key escape`, and `:wq`, not the
  host-specific `jj` mapping.
- Exercise 5 appends the UUID with `lsblk -no UUID /dev/sdb1 >> /etc/fstab`
  and finishes the line in vim (Decision 31), in place of the source's copy
  and paste. Every `mkfs` run makes a new UUID, so the value cannot be written
  into the command file, and a `--record` run cannot paste. The command file
  types a comment warning that `>` would replace the file, and the written
  exercise repeats it as a warning aside.
- Pauses per "Pausing for the audience": 8 seconds after the intro, 5 after
  multi-line output such as `mkfs.xfs`, 5 on the last fstab edit.
- Exercise 2 wipes `/dev/sdc` at its end; nothing later uses it.
- Exercise 6 ends by restoring `/dev/sdb`: remove the `/records` and swap lines
  from `/etc/fstab`, deactivate the swap, unmount `/records`, reload systemd,
  wipe the disk, and remove the two mount points (Decision 20).
- Exercise 1's GPT partitions are named; `parted` asks for a name rather than a
  type on GPT. The source demo answers `1` and `2`; propose `data1` and
  `data2`, checked on the lab.
- Exercises 4 and 5 inspect and verify with `lsblk -fp /dev/sdb` as exercise 3
  does, in place of the sources' bare `lsblk -fp` (instructor review,
  2026-10-18).
- Exercise 3 inspects with `lsblk -fp /dev/sdb` in place of the source's bare
  `lsblk -fp`, matching its step. It is 91 columns wide; the full listing is
  140, which is likely to wrap at the recording's 30-point font.
- Exercise 2's boundaries leave 1 MiB gaps (`1MiB 500MiB`, `501MiB 1000MiB`),
  so no partition is the 500 MiB the step asks for. Propose contiguous
  boundaries, checked on the lab.

## Additions

Proposed, each one cuttable:

1. ~~**Slide 1.12a, Extended and Logical Partitions.**~~ Removed by the
   instructor, 2026-10-18; slide 1.4a shows the layout instead.
2. **Recording slides 1.13a and 3.6a.** Every exercise with a command file gets
   one, as in w07.
3. **`findmnt --verify` on slide 3.11** (Decision 24). It checks
   `/etc/fstab` without mounting anything. To verify on the lab first.
4. **Real `mount -av` output on slide 3.10** (Decision 25).

Taken from the ODP decks, beside the Slidev deck's slides (Decision 27):

5. **Slide 1.5a, Disk Size Units** (SO6), rebuilt as our own table.
6. **Slide 3.1a, `mount` reads like `cp`** (SO17).
7. **`IconGrid` concept slides** in place of bullet lists on 1.3, 1.4, 2.3, and
   4.2 (SO3, SO4, SO13, SO24). The component is built (2026-10-17).

Chosen by the instructor on 2026-10-18:

8. **Slide 3.9a, Add an Entry to `/etc/fstab`** (Decision 31), with its
   `>>` warning.

## Corrections

Verified on the lab where marked; the rest are typos and logic.

- Typos: "importatnt" (M2), "Primarilly" (M3), "Inteactive" (M10),
  "autoamtically" (M32). "Filesystem" becomes "file system" throughout.
- M7: the `lsblk -p` columns were widened by hand, and `/dev/sr0` is missing.
  Recaptured.
- M12: the `lsblk` output pairs `sda` names with `252:x` numbers, which are
  virtio numbers. It is not a transcript from any lab. Recaptured.
- M12: `2048s` becomes `1MiB`; Step 4's title stops saying `udevadm settle`
  registers partitions with the kernel.
- M14: step 1 named `/dev/sdb`; steps 4 and 5 called the extended partition
  logical.
- I12: **Btrfs is not available on RHEL 10.0**, so RHEL's installer does not
  offer it. M17's table keeps it as a general Linux choice (Decision 18).
  Verified on `servera`:
  `modinfo btrfs` reports "Module btrfs not found", `btrfs-progs` is not in the
  repositories, and `/usr/sbin` holds `mkfs.xfs` and the `mkfs.ext*` family
  only.
- M20: `mkfs.ext4` output reads "2768" where ext4 writes 32768, and 131072
  blocks is a 512 MiB partition where the exercise's `sdb2` is 1 GiB.
  Recaptured.
- M26: `lsblk -p` cannot print FSTYPE and UUID columns; it needs `-f`.
- M31: the example UUID is invented.
- M40: `mklabel gpt` would erase `sdb1` and `sdb2`, and the new partition would
  then be `sdb1`, not the `sdb3` that `mkswap` formats; `2002MiB 4002MiB` is
  2000 MiB, while the `mkswap` output claims 1 GiB.
- M40: RHEL 10's `mkswap` prints `size = 1024 MiB (1073737728 bytes)` and
  `no label, UUID=...`, not `size = 1 GiB` and `UUID=c3d4e5f6-...` (verified).
- M40, M41: the swap line's mount point is `swap` on one slide and `none` on the
  next. Both slides now use `swap`, as RH134 recommends (Decision 32); RHEL's
  own `/etc/fstab` uses `none` for the system swap (verified).
- M41: the `swapon --show` sample is invented. Recaptured.
- M11: `vd` names are attributed to the RHA lab. Slide 1.11 corrected this
  before the instructor removed it; 1.6 now covers both names.
- I2: the RHEL 10.0 DVD is 7.9 GB, verified from the DVD attached to `servera`
  (`/dev/sr1`, label `RHEL-10-0-BaseOS-x86_64`), not "~10 GB".
- I17: the DNS server is not `172.25.250.9`. On the instructor lab it is
  `172.25.250.1`, in both `/etc/resolv.conf` and `/root/anaconda-ks.cfg`, and
  `workstation` runs no DNS server (`named` and `dnsmasq` inactive, nothing on
  port 53). The SCC value is Open question 4.
- I4, I6 and other titles: the em dashes are rewritten.
- IO2 and I2 both put the DVD ISO at 10 GB; see the I2 correction above.
- IO6 and IO16 specify RHEL 9.3; the course targets RHEL 10.0.
- SO12 lists ZFS beside Btrfs. Neither ships with RHEL 10.0; both stay on 2.2
  as general Linux choices (Decision 18).
- SO9's step list names `/dev/sdb` for the MBR exercise; Option B keeps it on
  `/dev/sdc`, so the GPT chain owns `/dev/sdb`.

## Not ported

- **The Kickstart section, I25 to I38** (proposed, Decision 3): 14 slides, two
  exercises with a "(suggested)" duplicate of one, a demo slide whose link
  still reads `TODO`, `install_rhel-automated.md`, and
  `install_rhel-stage_kickstart_file.sh`. The lesson plan defers Kickstart
  until students know GRUB. If it comes back in a later week, it needs these
  fixes first: `--device=enp1s0` and `--boot-drive=vda` match no current lab
  (the rebuilt instructor lab is `enp0s8` and `sda`, like SCC);
  `content.example.com` does not exist in either lab; DNS as
  above; the RHEL 10 `rootpw --allow-ssh` option; a firewall step for `httpd`
  in the staging exercise (the source command file has one, the slide does
  not); and `serverd` in the files against `serverc` on the slides.
- **All five GIFs and their asciinema.org links**, replaced by casts.
- **The `global-bottom.vue` footer**, which carries the college and Red Hat
  logos. The theme supplies the footer.
- **The source's custom layouts**, replaced by `two-cols-header` and its
  `bottom` slot.
- **The install ODP's Kickstart slides, IO8 to IO16** (Decision 3), for the
  same reason as I25 to I38. IO9, "Kickstart Validator", is a single bullet.
- **Fragment 5 slides the ODP sequence leaves out**: I6, I8, I10, I11, I17, and
  I21, and the individual screenshot slides I7, I9, I13, I16, I19, and I20,
  whose screens appear on the hub slide instead (Decision 26).
- **The storage ODP's combined mount exercise** (SO20) as one exercise. Option
  B keeps the Slidev deck's two.
- **The office-suite icons, the repeated AI-generated tools image, and the
  LibreOffice theme artwork** from the ODP decks. See "Third-party images".
- **The ODP presenter notes** on SO4, SO5, SO8, and SO26, which restate the
  slides; this repository's slides carry no notes.
- **`mbr_table.jpg`**, which no slide in either deck uses.

## Fitting the class period

Six storage exercises and a full install in 2.5 hours is a lot, and the class
has been running out of time. Rough costs, not measured: each storage exercise
5 to 10 minutes, a VDI reboot 1 to 2 minutes, a graphical install 20 to 30
minutes including configuration.

Deferred by the instructor (2026-10-17): nothing is cut until the slides and
exercises are fully built, when the cuts are easier to judge. These are the
candidates, with what each loses:

- **One reboot instead of two** (Decision 19). The persistent-mount exercise
  stops at `mount -av`, and the swap exercise's reboot verifies both. Loses the
  moment where students see `/records` survive a reboot on its own.
- **Run the MBR exercise as a demonstration.** `docs/course-authoring.md` allows
  solo delivery. Loses hands-on practice with extended and logical partitions,
  (Slide 1.12a, once tied to this cut, has since been removed.)
- **Assign the install as homework** after the walkthrough slides. Loses the
  in-class "We Do" for the install, which the lesson plan's agenda names.

Two savings are already in the plan for their own reasons rather than for
time: Kickstart stays out because students do not know GRUB yet (Decision 3),
and following the install ODP shortened fragment 5 from 23 slides to 10
(Decision 26).

## Verification

Checked on the instructor lab through `pnpm lab`, 2026-10-06. Everything was
read-only except one test on `/dev/sdb`, which was restored.

- `servera` runs RHEL 10.0 (Coughlan) with `parted` 3.6, `xfsprogs` 6.11.0, and
  `e2fsprogs` 1.47.1. `pykickstart` and `httpd` are not installed.
- Disks: `vda` (10 GiB OS disk, GPT with a 1 MiB `bios_grub` partition, a 1 GiB
  `/boot`, and LVM holding root and swap) and blank 5 GiB `vdb`, `vdc`, `vdd`.
  `/dev/sda` to `/dev/sdd` are symlinks to them.
- `free -h` reports 1.7Gi of memory and 1.0Gi of swap; `swapon --show` lists
  `/dev/dm-1` at priority `-2`.
- `/etc/fstab` holds root, `/boot`, and swap by UUID, plus
  `/dev/sr1 /mnt/dvd iso9660 defaults,nofail 0 0`. Its header tells the reader
  to run `systemctl daemon-reload` after editing.
- **The `sdb` test.** On a GPT label I made a 1 GiB partition and a 1 GiB
  `linux-swap` partition through `/dev/sdb`, formatted and mounted the first,
  and activated the second as swap. `parted print` reported `Disk /dev/vdb`
  with `Name` column entries and a `swap` flag on the second partition;
  `mount`, `findmnt`, `lsblk -fp /dev/sdb`, and `swapon --show` all reported
  `vdb`. The new swap took priority `-3` after the system's `-2`, so swap areas
  without `pri=` count down from `-2`. `mkswap` printed
  `Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)` and
  `no label, UUID=...`.
- **Restored:** swap deactivated, file system unmounted, the temporary mount
  point removed, and the signatures and label wiped from both partitions and
  the disk. Afterwards `parted` reports `unrecognised disk label` on `vdb`,
  `lsblk` shows it with no partitions, `swapon --show` lists only `/dev/dm-1`,
  and the `sdb1` and `sdb2` symlinks are gone.
- Btrfs is absent (see Corrections).
- Network: `enp1s0` at `172.25.250.10/24`, default route via `172.25.250.1`,
  nameserver `172.25.250.1`, search `lab.example.com`. `workstation` serves no
  DNS. `serverc` answers ping.
- `/root/anaconda-ks.cfg` exists on `servera`. It shows `autopart` (which is
  where the GPT and `bios_grub` partition came from on a BIOS host),
  `timezone Etc/UTC`, `@^minimal-environment`, and `rootpw --plaintext
  --allow-ssh`. `timedatectl` reports `Etc/UTC`.

Re-checked after the rebuild, 2026-10-17, on all four hosts unless noted. The
facts above that name `vd` devices or `enp1s0` describe the old lab.

- Disks: `servera`, `serverb`, and `serverc` each show a 10 GiB `sda` (1 MiB,
  1 GiB `/boot`, LVM holding an 8 GiB root and 1 GiB swap) and blank 5 GiB
  `sdb`, `sdc`, `sdd`, with device numbers `8:0` to `8:48`. `workstation` has a
  single 20 GiB `sda`. All four have `sr0` (empty) and `sr1` (the DVD, mounted
  at `/mnt/dvd`). `/etc/udev/rules.d/` is empty.
- `parted /dev/sdb print` on `servera` reports
  `Model: ATA QEMU HARDDISK (scsi)` and `Disk /dev/sdb: 5369MB`.
- **Stable across reboots.** On `servera`, SATA ports `ata-1` and `ata-2` hold
  `sr0` and `sr1`, and `ata-3` to `ata-6` hold `sda` to `sdd`. The mapping was
  identical before and after each of two reboots.
- Network: each host's only interface besides `lo` is `enp0s8`, holding its
  address (`.9` to `.12`); `servera`'s default route is via `172.25.250.1` on
  `enp0s8`, and `firewall-cmd --get-active-zones` lists `public (default)` with
  `enp0s8`.
- Keys: `student` and `root` each have `authorized_keys`, `id_rsa`, and
  `lab_rsa`, and `cmp` on `servera` confirms `id_rsa` and `lab_rsa` are the
  same key. `servera` reaches `serverb` as `student`, `serverc` as `root`, and
  `workstation` from a root shell, without a password. That test wrote
  `known_hosts` files for both users on `servera`; both were removed so the
  host matches the instructor's post-build snapshot.
- Unchanged on `servera`: SELinux `Enforcing`, BIOS boot, the `public` zone
  allowing `cockpit dhcpv6-client ssh`, `PermitRootLogin yes`, passwordless
  `sudo`, `Etc/UTC`, kernel `6.12.0-55.9.1.el10_0`, 1.7Gi of memory, and none
  of `httpd`, `mod_ssl`, `setools-console`, `setroubleshoot-server`, `bzip2`,
  `acl`, or `nmap-ncat` installed.

Verified while building fragment 1, 2026-10-17, on the rebuilt `servera`:

- `lsblk` lists `sda` to `sdd`, then `sr0` and `sr1`, the order slide 1.7
  shows.
- Command-mode `parted` prints "Information: You may need to update
  /etc/fstab." after `mklabel` and after `mkpart`, followed by a blank line.
  `print` prints `Model: ATA QEMU HARDDISK (scsi)`, the table, and a trailing
  blank line. A partition ending at `1GiB` prints its end as `1074MB`.
- Interactive prompts: `New disk label type?`; on `msdos`,
  `Partition type?  primary/extended?` and `File system type?  [ext2]?`, each
  with two spaces after the question mark; on GPT, `Partition name?  []?` in
  place of the type. Once an extended partition exists the prompt becomes
  `primary/logical?`, and with all four slots used, `[logical]?`.
- A logical partition started exactly where its extended partition starts makes
  `parted` offer "the closest location we can manage", one sector later, and
  wait for Yes or No. Starting 1 MiB inside avoids the question. Logical
  partitions number from 5, and `lsblk` shows the extended container as `1K`.
- Within one session, GPT's `print` repeats the file system types typed at
  `mkpart` (`xfs`, `ext4`), while `lsblk -fp` shows no file system on either
  partition. The written GPT exercise says so.
- Both exercises ran end to end with the answers in their command files,
  including the empty Enter each step header sends inside `parted`. The MBR
  exercise's three primaries are exactly 500 MiB and its logical partition
  exactly 1 GiB.
- `wipefs -a` on the whole disk removes an `msdos` table with extended and
  logical partitions, and a GPT (primary header, backup header, and protective
  MBR), and re-reads the table. The MBR exercise's cleanup uses it.
- Restored: two `parted` sessions left waiting on input by an interrupted
  capture were ended by their process IDs, the temporary input and output files
  were removed, and `sdb` and `sdc` were wiped. `wipefs -n` reports no
  signatures on `sdb`, `sdc`, or `sdd`, as before the build.

Verified while building fragment 2, 2026-10-18, on `servera`, starting from the
GPT exercise's end state (`mklabel gpt`, then `data1` from `1MiB` to `1GiB` and
`data2` from `1GiB` to `2GiB`):

- Versions: `xfsprogs-6.11.0-1.el10` and `e2fsprogs-1.47.1-3.el10`.
- `mkfs.xfs /dev/sdb1` prints 12 lines ending "Discarding blocks...Done.", with
  `blocks=261888` (1 GiB less the first 1 MiB). `mkfs.ext4 /dev/sdb2` writes
  262,144 4k blocks and 65,536 inodes, with backups at 32768, 98304, 163840,
  and 229376, and an 8192-block journal. These replace M20's "2768" and its
  512 MiB numbers (Corrections).
- `lsblk -fp /dev/sdb` shows `xfs` on `sdb1` after the first command and
  `ext4` with FSVER `1.0` on `sdb2` after the second. The UUIDs on 2.4 and 2.5
  are from this run: `sdb1` is `6bb0dab6-7866-42ce-986b-7d6c73c0bb48` and
  `sdb2` is `0039b3e0-6751-40a6-8fd7-e4311b20b09a`. Fragment 3 can reuse them
  if its transcripts should match.
- Without a terminal, `mke2fs` prints progress counters erased by backspaces;
  the slide shows the line as a terminal leaves it, "Discarding device blocks:
  done".
- On a partition that already holds a file system, `mkfs.xfs` refuses ("appears
  to contain an existing filesystem", "Use the -f option to force overwrite",
  exit 1). `mkfs.ext4` asks "Proceed anyway? (y,N)" at a terminal and stops on
  `n` (exit 1), but overwrites silently when standard input is not a terminal.
  The written exercise's warning describes the terminal behavior students see.
- Pointed at the whole disk while it holds a GPT, `mkfs.xfs /dev/sdb` refuses
  ("appears to contain a partition table (gpt)", "Use the -f option to force
  overwrite", exit 1), and `mkfs.ext4 /dev/sdb` stops at "Found a gpt
  partition table in /dev/sdb" and "Proceed anyway? (y,N)" (answered `n`).
  The disk was wiped afterwards.
- Restored: the file systems and the GPT were wiped with `wipefs -a`;
  `lsblk -fp` shows `sdb` and `sdc` blank and `wipefs` lists no signatures on
  `sdb`.

Checked ahead of fragment 3, 2026-10-18, on `servera`: `lsblk -no UUID
/dev/sdb1` prints the bare UUID on one line, and `>>` adds it after a scratch
file's existing line (`/etc/fstab` was not touched). The test partition and
file system were wiped, and `sdb` is blank again.

Verified while building fragment 3, 2026-10-18, on `servera`, after recreating
fragment 2's end state with its two UUIDs and backing up `/etc/fstab`:

- `mount /dev/sdb1 /mnt/data` and `umount /mnt/data` print nothing. After the
  mount, `lsblk -fp /dev/sdb` shows `908.3M`, `5%`, and `/mnt/data` on `sdb1`,
  and `mount | grep /mnt/data` prints `/dev/sdb1 on /mnt/data type xfs
  (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)`.
- `servera`'s `/etc/fstab` names `/`, `/boot`, and swap by UUID, and ends with
  the kickstart's `/dev/sr1 /mnt/dvd iso9660 defaults,nofail 0 0`.
- `vim` with `G`, `I`, `UUID=`, Esc, `A`, the rest of the line, Esc, and `:wq`
  turns the appended bare UUID into the finished entry, tested interactively on
  a scratch file.
- `findmnt --verify` prints "Success, no errors or warnings detected" on a clean
  file, warns "your fstab has been modified, but systemd still uses the old
  version" before `systemctl daemon-reload`, and exits 1 with `[E]` lines for a
  bad entry.
- `mount -av` reports `/` and swap as ignored, `/boot` and `/mnt/dvd` as
  already mounted, and `/data` as successfully mounted, after a five-line
  "does not contain SELinux labels" warning. Plain `mount` does not print the
  warning. `restorecon -Rv /data` relabels the root of the file system from
  `unlabeled_t` to `default_t`, and the next `mount -av` is quiet.
- `umount` inside a busy mount point prints `umount: /mnt/records: target is
  busy.` and exits 32.
- Both exercises ran end to end except the reboot, with `vim -es` standing in
  for the interactive edit. `ls /mnt` lists `dvd` and `records`.
- Restored: every test mount was unmounted, `/etc/fstab` was copied back from
  its backup (its SHA-256 matches the value before the build), systemd was
  reloaded, the four test mount points were removed, `sdb` was wiped, and the
  backup was deleted.
- Not tested: the reboot in exercise 5. Its 15-second pause before `ssh
  servera` rests on the instructor's estimate that `servera` boots in about 5
  seconds; tune it on the first recording (see "Authoring notes").

Verified while building fragment 4, 2026-10-18, on `servera`, after recreating
the state the earlier exercises leave (the GPT partitions with fragment 2's
UUIDs, `/records` mounted from `/etc/fstab`, and `/mnt/records`):

- `free -h` shows 1.7Gi of memory and the system's 1.0Gi swap, which
  `swapon --show` lists as `/dev/dm-1` at priority `-2`.
- Command-mode `parted /dev/sdb mkpart swap1 linux-swap 2GiB 3GiB` prints the
  `/etc/fstab` reminder and a blank line; `print` then lists partition 3 from
  `2147MB` to `3221MB` with the `swap` flag. Interactive mode accepts
  `linux-swap` at `File system type?`, and within the session `print` shows
  `linux-swap(v1)`.
- `mkswap /dev/sdb3` prints "Setting up swapspace version 1, size = 1024 MiB
  (1073737728 bytes)" and the UUID. Right after `mkswap`, `lsblk -no UUID`
  prints an empty line until udev has probed the partition, about a second
  later; `blkid` sees the UUID at once. In the exercise several commands and
  seconds separate the two, and `kitty-demo` holds 3 seconds after each step.
- A temporary `swapon /dev/sdb3` gets priority `-3`. With the `pri=5` line,
  `systemctl daemon-reload`, and `swapon -a`, it gets `5`.
- With two swap lines that both use `none` as the mount point,
  `findmnt --verify` reports "[W] target specified more than once" (0 errors,
  1 warning). RH134 recommends `swap` in that field instead, saying it gives
  more informative error messages; `fstab(5)` and anaconda use `none`. With the
  new line using `swap` (Decision 32), `findmnt --verify` prints "Success, no
  errors or warnings detected" and `swapon -a` activates `sdb3` at priority
  `5`; checked and restored the same day.
- The cleanup returns `/etc/fstab` to its exact original content (`cmp` against
  the backup), and the vim search-and-`dd` keys delete exactly the `/records`
  and swap lines, tested interactively on a scratch file.
- **Stale extended-partition records.** The first capture failed: `mkswap`
  warned "don't erase bootbits sectors (dos partition table detected)", and
  `lsblk` then showed no UUID. A scan of every MiB boundary found a leftover
  extended boot record on `sdb` at 2048 MiB, from extended partitions tried
  there while building fragment 1, and on `sdc` at 1501 MiB, where the MBR
  exercise's extended partition starts. `wipefs -a` on the whole disk clears
  only the signatures at the start and end. Both MiB were zeroed on the
  instructor lab. Students' `sdc` keeps the same record after the MBR exercise's
  cleanup; it only matters if a later partition starts at exactly 1501 MiB.
- Restored: swap off, `/records` unmounted, `/etc/fstab` copied back (its
  SHA-256 matches), systemd reloaded, the mount points removed, `sdb` wiped, and
  the backup deleted. A final scan finds `sdb`, `sdc`, and `sdd` clean.

Still to verify, during the build:

- Whether `mklabel` warns on a disk that already has a label (the prompts
  themselves were verified with fragment 1).
- From the install dry run, still unseen: whether leaving `/`'s size empty is
  what made it take the rest (the dry run's `/` is 8 GiB with 1.97 MiB left
  over). The ISO need not be removed: the instructor did not remove it, and at
  the first login `lsblk` shows `sr0` with no media (`1024M`), so it was
  ejected at the end of the install. The written exercise's "If the installer
  starts again" note was removed (2026-10-19). RH134
  says root is disabled by default "starting in" RHEL 10, but the 9.3 summary
  screenshot already reports "Root account is disabled", so the "new in 10"
  framing on slide 5.7 is still worth checking.
- The SCC lab values in Open question 4. `pnpm lab` cannot reach the VDI.
- The instructor's first dry run of the install exercise on the VDI
  (2026-10-18) confirmed, from its screenshots: VirtualBox's New Virtual
  Machine wizard has a "Proceed with Unattended Installation" checkbox, left
  unchecked; "Use EFI" is unchecked, so the VM boots with BIOS and the
  `biosboot` note applies; adapter 2 attaches to the Internal Network `intnet`;
  and the RHEL 10.0 boot menu (GRUB 2.12) reads "Install Red Hat Enterprise
  Linux 10.0", "Test this media & install Red Hat Enterprise Linux 10.0", and
  "Troubleshooting". The VDI then froze after the Install entry. Things to try:
  less memory for `serverc` (the lab's other servers have 1 CPU and 2048 MB,
  and RH134 lists 1.5 GiB as the DVD minimum), servera's own System and Display
  settings, a check for VirtualBox's Hyper-V turtle icon, and the
  Troubleshooting menu's basic graphics mode if only the VM hangs. The wizard's
  VM Folder in that run was `C:\Temp\VMs\IT-230\IT-230\IT-230`.
- The second dry run (2026-10-18) installed: VM Folder
  `C:\Temp\VMs\IT-230\IT-230`, which put the disk at
  `...\IT-230\serverc\serverc.vdi`, 2048 MB of memory, and 2 CPUs. Its
  screenshots show: Time & Date's UTC is Region Etc, City Coordinated Universal
  Time; Manual Partitioning's "New mount points will use the following
  partitioning scheme" set to Standard Partition; the layout BIOS Boot 1024 KiB
  (`sda1`), `/boot` 1024 MiB (`sda2`), swap 1024 MiB (`sda3`), and `/` 8 GiB
  (`sda4`), with a GPT label in the Summary of Changes; `enp0s3` connected
  before any change; `enp0s8` set to Manual, `172.25.250.12` netmask 24, no
  gateway or DNS; host name `serverc`; the Root Account screen's "Disable root
  account" and "Enable root account" choices and "Allow root SSH login with
  password"; Create User's "Add administrative privileges to this user account
  (wheel group membership)" and "Require a password to use this account"; and
  "Press Done again to use the password anyway" for the weak lab passwords.
  The VDI showed two mouse pointers that did not line up during the install.

## Authoring notes

Learned while building fragment 1:

- **`kitty-demo.py --check` is broken in the instructor's `cli_demos` clone**
  by an uncommitted one-line edit that calls `report(path, steps)` before
  `steps` is assigned, so every file fails with `UnboundLocalError`. The
  command files were validated with the committed `kitty-demo.py` instead: 54
  presses for the GPT exercise and 91 for the MBR exercise. The edit was left
  in place.
- **A step header inside `parted` is safe; a `clear` before it is not.** The
  driver paints the header and sends one Enter, which `parted` treats as an
  empty command. A bare `clear` before a header is typed as text, which
  `parted` would reject.
- **Drive interactive programs with a timeout when capturing.** An unanswered
  `parted` question left two sessions waiting on `servera`.
- **Mermaid `block-beta` renders in the theme** and passes `check:slides`.
- **A line that starts with `AccentText` lost its paragraph on 1.5a**, exactly
  as `docs/design-system.md` warns, because a wrapped source line began with
  the component. Keep such a sentence on one source line, starting with text.
- **Placeholders are ignored by Git** through the `*.placeholder.*` rule added
  to `.gitignore`, so `git status` lists the chapter's `assets/` directory as
  ignored until real images arrive.

- Verify every command with `pnpm lab` before it lands, per the
  `lab-verification` skill.
- `rows` belongs only on the Magic Move terminals (1.9, 1.10, 3.10), counted from the
  final state. Every other terminal this week is fixed and takes none.
- Capture every slide with a fence at 1920x1080 and look at it;
  `check:slides` cannot see overflow inside a code block. `mkfs.xfs` output is
  the tallest transcript this week.
- The Mermaid block diagrams on 1.4 and 1.5 are a new diagram type for this
  repository. Check that they render in the theme and in the PDF export before
  building the rest of fragment 1 around them; the fallback is a styled table.
- **Reboots in recordings are untested.** No exercise so far reboots its host.
  After `reboot`, the SSH session ends and the recording shell is briefly local
  before `ssh servera` reconnects. Try a short command file first to see what
  `kitty-demo.py --record` and `pnpm run casts` make of that.
- `TextExplainer` sizes a line of up to 64 columns `md`, but in the default
  layout a 64-column line at `md` overflowed by 35px (3.8, which now sets
  `size="sm"`). The threshold in `setup/text-explainer.ts` may be a theme
  issue worth raising separately.
- No presenter notes. Anything checked on the lab goes under "Verification".
- No em dashes. Search the new files for U+2014 before handing work back.
- The `lab-verification` skill used to say RHA disks are `vd`, against
  `docs/lab-environments.md`. Both were updated for the rebuild on 2026-10-17
  and now agree that all three labs present `sd` names.

## Decisions

Decisions 2 to 25 were proposed here and answered by the instructor on
2026-10-17: accepted unless the entry says otherwise. Each stays reversible.

1. **Disk names: accepted 2026-10-17, option 1.** The instructor lab's four
   disks moved to the SATA bus and the udev symlink rule is gone; the same
   rebuild made the lab interface `enp0s8` and added `lab_rsa`.
2. **Five fragments**, split on the source's section slides. Fragment 5 no
   longer carries an inner section slide (Decision 26).
3. **The Kickstart material is not ported**, I25 to I38 and IO8 to IO16, as the
   lesson plan's "Ideas" section already says.
4. **Section titles:** "Partitions" for M1 (source "Managing Basic Storage") and
   "Swap Space" for M36 (source "Manage Swap Space"). The rest keep their
   source titles.
5. **Accent `blue`** (chosen over `orange`).
6. **Title** "Managing Basic Storage and Installing RHEL".
7. **Cover agenda** of five lines, one per fragment.
8. **VM reminder** "Start `workstation` and `servera` on your VDI".
9. **Restricted images rebuilt:** M4 and M5 as Mermaid diagrams, M6, M38, and
   SO6 as Markdown tables.
10. **M30 becomes a `TextExplainer`** field walk (slide 3.8), chosen over
    dropping it.
11. **Images without a recorded source** (M2, M3's two, M8, M17, and IO2's
    cable photograph) are placeholders until they are replaced with images
    that have a recorded source and license (Decision 30). M3's fallback is
    SeaBIOS and OVMF captures; the others fall back to text.
12. **Installer screenshots recaptured** on RHEL 10.0 by the instructor, with
    the sidebar logo cropped. Until then the RHEL 9.3 captures are placeholders
    (Decision 30); publication waits for the recaptures.
13. **Add slide 1.12a**, Extended and Logical Partitions. Reversed by the
    instructor on 2026-10-18; see 1.12a.
14. **Recording slides 1.13a and 3.6a** for the two exercises without a demo
    slide.
15. **Generic mount points on slides** (`/mnt/data`, `/data`); the exercises
    keep `/mnt/records` and `/records`.
16. **Slide 3.3 uses a `TextExplainer`** for `mount`'s two arguments, in place
    of the source's comment line.
17. **`2048s` becomes `1MiB`** on slide 1.12. The slide has since been removed;
    every slide and exercise that partitions uses `1MiB`.
18. **Btrfs stays on 2.2 unmarked, and SO12's ZFS joins it.** The instructor:
    not every file system on the slide needs to be supported by RHEL. Btrfs is
    still dropped from 5.6, because that slide lists what RHEL's installer
    offers, and the installer does not offer it.
19. **Deferred: one reboot instead of two.** This is a cut for time, and the
    instructor wants no cuts until the slides and exercises are built (Open
    question 8). Both exercises keep their reboot for now.
20. **Disk cleanup:** exercise 2 wipes `/dev/sdc`; exercise 6 restores `/dev/sdb`
    and `/etc/fstab`, so w11 starts with blank disks.
21. **I15 folds into 5.6** as an "Anaconda defaults to LVM" `Callout`; the rest
    of I15 repeats I14 and is not ported.
22. **IO6 and I23 become the settings slide (5.8) and I24 the exercise slide
    (5.10)**, condensed to seven steps. The install exercise is written only:
    no command file, no recording.
23. **Fragment 5 aligns to RH134 chapter 16 and cert guide chapter 1,** whatever
    the lesson plan assigns (Open question 6).
24. **Optional:** `findmnt --verify` on slide 3.11.
25. **Slide 3.10 shows `mount -av`'s real output.**

Decided by the instructor on 2026-10-17:

26. **Fragment 5 follows the install ODP**, with the Slidev deck's
    standard-partition and root-account slides added (5.6 and 5.7). Ten slides
    in place of 23; the slides it leaves out are listed under "Not ported".
27. **Combine the two source decks**: ODP structure and concept slides, Slidev
    command slides. See "Combining the two source decks".
28. **Exercises follow Option B**, the Slidev deck's six storage exercises.
29. **An `IconGrid` theme component** shows the ODP's icon-and-caption facts.
    Built and documented the same day; see "File inventory". After review it
    gained a `clicks` option that reveals the items one per click, and its icons
    moved to the accent fill. A separate `IconText` placed by the layout's
    props was considered and dropped: the default layout stacks body items in
    one column, so individual components cannot sit side by side without a
    wrapper or a new layout mode.
30. **Existing pictures are placeholders** until replaced. Placeholder files
    are named `*.placeholder.<ext>` and a `.gitignore` rule keeps them out of
    commits, because `AGENTS.md` treats every committed file and revision as
    public and a replaced image would stay in history. The RH134 figures and
    Cert Guide scans are not used even as placeholders; they are rebuilt as our
    own tables and diagrams from the start (Decision 9).

Decided by the instructor on 2026-10-18:

31. **Exercise 5 appends the UUID with a redirect**, chosen over reading it
    from `lsblk` and typing it: `lsblk -no UUID /dev/sdb1 >> /etc/fstab`, then
    the line is finished in vim. The UUID arrives exact, so a typo cannot break
    the boot, and the recording works even though every `mkfs` run makes a new
    UUID. Slide 3.9a teaches the command, and a `Callout` warns to use `>>`,
    not `>`. The cost is two new `lsblk` options, `-n` and `-o`.
32. **The new swap line uses `swap` as its mount point**, following RH134's
    recommendation, in place of the `none` that `fstab(5)` and anaconda use.
    Two swap lines that both say `none` make `findmnt --verify` warn "target
    specified more than once"; with `swap` it reports no warnings. Slides 4.5
    and 4.6, the exercise 6 command file, and its written version use
    `UUID=... swap swap pri=5 0 0`; the written version notes that the
    system's own line uses `none` and that both work.

Decided by the instructor on 2026-10-19:

33. **The bookcase analogy gets its own slide**, 2.1a, ahead of the file
    system table. The instructor tells it in two steps: a partition is a
    bookcase with no shelves, where books fall into a pile and nothing can be
    found; a file system adds the shelves. The empty bookcase shows first and
    the shelved one arrives on the click, as the story turns. 2.2 reuses the
    shelved image beside the table.

## Open questions

Answered by the instructor on 2026-10-17 and 2026-10-18.

1. ~~**Disk names**~~ (Decision 1). Answered: the instructor changed the
   `rhel-lab` automation and rebuilt the lab.
2. ~~**Image provenance.**~~ Answered: use the existing images as placeholders
   for now (Decision 30). `mbr_diagram.jpg`, `bios-setup-screen.jpg`,
   `gpt_diagram.jpg`, `partitioning_components.jpg`, `filesystem_types.jpg`, and
   IO2's cable photograph are replaced before publication.
3. ~~**Installer screenshots.**~~ Answered: the instructor captures new RHEL
   10.0 screens where they are needed. Until then the RHEL 9.3 captures are
   placeholders.
4. ~~**SCC install values.**~~ Answered 2026-10-17, from the instructor lab and
   from the SCC lab (output and settings supplied by the instructor).

   Instructor lab: `servera`'s single interface has static `172.25.250.10/24`,
   gateway and DNS server `172.25.250.1`, search domain `lab.example.com`, and
   time zone `Etc/UTC`. `172.25.250.1` is the libvirt network's own address; its
   DNS service resolves every lab host name and reaches the internet.

   SCC lab: each VM has two VirtualBox adapters. Adapter 1 is NAT: `enp0s3`
   takes DHCP, with the default route via `10.0.2.2` and the college's own DNS
   servers and search domain. Adapter 2
   is a VirtualBox Internal Network: `enp0s8` with static `172.25.250.10/24`
   and no gateway or DNS server. Time zone `Etc/GMT`, the
   same offset as `Etc/UTC`. Lab host names resolve when those VMs are running
   (the instructor's capture had only `servera` up, so `serverc` did not
   resolve).

   The ISO on the VDI is `C:\Temp\VMs\IT-230\rhel-10.0-x86_64-dvd.iso`. No
   `serverc` VM exists in the SCC lab, so the exercise creates a new VM named
   `serverc`.

   Values that work in both labs: address `172.25.250.12/24`, **no gateway and
   no DNS server** on the lab interface, host name `serverc.lab.example.com`,
   and time zone `Etc/UTC`. The install comes from the DVD, so it needs no
   network. On the SCC lab, the new VM gets the same two adapters as the others
   and its NAT adapter supplies the internet; on the instructor lab it simply
   has no internet, which the exercise does not need. A gateway of
   `172.25.250.1` would point at nothing on an Internal Network, so it is left
   out.

   The Internal Network is named `intnet`: the instructor's VirtualBox
   screenshots of the new `serverc` (2026-10-18) show adapter 2 attached to
   it, set to match servera's. `docs/lab-environments.md` now records it.
5. ~~**GPT on BIOS.**~~ Answered: whatever works. Settled by the dry run
   (2026-10-18): Anaconda wrote a GPT label on the BIOS VM, and the layout
   includes a 1 MiB BIOS Boot partition (`sda1`), then `/boot`, swap, and `/`.
   Slide 5.6 and the written exercise show that layout.
6. ~~**Before class.**~~ Answered: ignore the lesson plan here and align
   fragment 5 to RH134 chapter 16 and cert guide chapter 1 (Decision 23).
7. ~~**Slides 1.6 and 1.11.**~~ Answered: keep both for now. Settled on
   2026-10-18: the instructor removed 1.11 and moved 1.6 to open the fragment.
8. ~~**Time.**~~ Answered: cut nothing now. Once the slides and exercises are
   fully built, the cuts are easier to judge. Decision 19 is deferred with the
   rest.
9. ~~**The w09 gap.**~~ Answered: leave it as a gap. The site lists Week 08,
   then Week 10.
10. ~~**Screenshots on the hub slide (5.5).**~~ Answered 2026-10-18: arrange
    the screenshots with a grid and connect them with Slidev's `Arrow`
    component. See 5.5.

## Ready to build

Decisions 2 to 33 are answered. Fragment 1 is built (2026-10-17) and was
revised by the instructor (2026-10-18). Fragment 2 is built (2026-10-18) and
was revised by the instructor. Fragment 3 is built (2026-10-18) and was
approved without changes. Fragment 4 is built (2026-10-18) and was approved
with minor edits. Fragment 5 is built (2026-10-18) from the instructor's
RHEL 10.0 dry-run screenshots. The first dry run froze the VDI after the boot
menu's Install entry; the second, with 2048 MB of memory, installed (see
"Verification").

Every placeholder image was replaced on 2026-10-19: the hard drive (1.2), the
two firmware screens (1.3, from Wikimedia Commons with credits), the
partitioned disk (1.8), the two bookcases (2.1a and 2.2), and the CD (5.2).
None remains in week 10. The six recordings were made, processed, and given
their slides on 2026-10-19.

**Published 2026-10-19** at the instructor's direction. The instructor approved
committing the raw dry-run captures in `assets/screenshots/`. `course/w10-draft.md`
was renamed to `course/w10.md`, and `"w10"` joined the published-week list in
`tests/site.test.mjs`, which skips `"w09"` until that week is ported. Before
publication the SCC lab's internal DNS server addresses were removed from Open
question 4, since nothing in the course needs them; the lab passwords named in
5.7 and 5.8 were left, as `docs/lab-environments.md` already publishes them.
