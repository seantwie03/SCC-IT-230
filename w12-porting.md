# W12 - Port

## Prompt

Port w12 from `~/s/IT-230/w12` with the week-porting skill: read the Slidev
deck, the LibreOffice deck, the lesson plan, and the demonstrations, and
produce this plan. Nothing is built until the plan is approved.

## Answer in brief

**Four topic fragments** in two chapter directories, **four exercises**, one
per source exercise, and a deck of **48 slides** under the decisions accepted
on 2026-10-29 and 2026-11-01: 41 from the source (39 content, section, and
exercise slides plus the cover and VM reminder), 5 added (1.1a, 1.2a, 1.4a,
2.8a, 3.2a), and 2 recording slides (1.14a, 2.9a) that wait on the casts
(Decision 10).

| # | Fragment                             | Section title                  | Slides | Exercises |
|--:|--------------------------------------|--------------------------------|-------:|----------:|
| 1 | `grub2-boot-loader.md`               | GRUB2 Boot Loader              |     18 |         1 |
| 2 | `systemd-targets.md`                 | systemd Targets                |     11 |         1 |
| 3 | `repairing-file-systems-at-boot.md`  | Repairing File Systems at Boot |      8 |         1 |
| 4 | `recovering-superuser-access.md`     | Recovering Superuser Access    |      9 |         1 |
|   | Entry file                           |                                |      2 |           |
|   | **Total**                            |                                | **48** |     **4** |

Slide counts include the recording slides Decision 10 gives casts (fragments 1
and 2). The fragments follow the Slidev deck's sections one for one, in source
order. The LibreOffice deck contributes an intro slide for GRUB2 (1.1a), detail
for the targets slides, and an optional command table (2.8a).

Where things stand on 2026-11-01:

1. **Fragment 1 is complete** (committed 2026-10-31 as `616d13c`), with its
   long output lines wrapped once at a space as built. Changed 2026-11-01,
   unstaged: the VDI screenshots on 1.3 and 1.4, and the new 1.4a.
2. **Fragment 2 is complete** (`784ed53`), its recording slide waiting on the
   cast.
3. **Fragment 3 is complete** (`f4ef2e1`). Changed 2026-11-01, unstaged: the
   VDI crops and the <kbd>Esc</kbd> line on 3.2a.
4. **Fragment 4 is complete** (`974a737`). Changed 2026-11-01, unstaged:
   `passwd -S` on 4.3 and the VDI screenshot on 4.4.
5. **The console steps are verified**, over the instructor lab's serial
   console (Round 6) and on the SCC lab's VDI (Round 8). Open question 1 is
   answered.
6. **Decision 26's prototype passed** (Rounds 6 to 8). The lab settings it
   needs are on the instructor-lab copy on this machine only; making them
   permanent (prototype step 9) and rewriting the four command files are
   still to do. See "Console delivery".

## Scope

The lesson plan's agenda is "Boot Process" and "Recovering the root password".
It assigns RHA chapter 12 section 07, SCC Lab chapter 12 lab 01 and chapter 13
lab 01, and the optional *RHCSA Cert Guide* chapters 17 and 18.

The source material is in `~/s/IT-230/w12/slides/`:

- **Slidev Markdown:** `slides.md` (cover and VM reminder),
  `controlling_troubleshooting_boot.md` (30 slides, three sections, three
  exercise slides), and `recovering_superuser_access.md` (9 slides, one
  section, one exercise slide). It is this year's conversion. The only
  presenter notes are on the boot-process diagram, a full walk through both
  firmware paths.
- **LibreOffice deck:** `ControlBootProcess.odp` (11 slides), last year's deck
  as taught. It covers systemd targets and GRUB2 only: the Red Hat boot
  diagram three times, three targets slides, a GRUB2 slide, a GRUB2 components
  slide (`/etc/default/grub` and `grub2-mkconfig`) on a stock photograph, and
  two "Demo" placeholders. No file-system repair, no root recovery, no
  presenter notes.
- **`slides/public/`** holds six PNGs. Four are used by the decks; two,
  `emergency_mode.png` and `boot_stalled_incorrect_uuid.png`, are not
  referenced anywhere (see "Third-party images").

The demonstrations are four `kitty-demo` command files, one per exercise
slide, in `demonstrations/controlling_troubleshooting_boot/` and
`demonstrations/recovering_superuser_access/`, plus `recover_root_access.md`,
the console steps for the last one written out.

The curriculum is RH134 chapter 12, *Controlling and Troubleshooting the Boot
Process*, and chapter 13, *Recovering Superuser Access*, with *RHCSA Cert
Guide* chapter 17, *Managing and Understanding the Boot Procedure*, and
chapter 18, *Essential Troubleshooting Skills*. Nothing from any of them is
copied. RHCSA objectives covered: boot systems into different targets
manually; interrupt the boot process to gain access to a system; configure
systems to boot into a specific target automatically; modify the system boot
loader. Topics the source leaves out are under "Not ported".

## Port fidelity

Source slides are numbered by file. **S1 and S2** are `slides.md`, **B1 to
B30** are `controlling_troubleshooting_boot.md` in order (B2 is the diagram,
which has no heading), **R1 to R9** are `recovering_superuser_access.md`, and
**O1 to O11** are `ControlBootProcess.odp`. Planned slides are numbered by
fragment, such as 2.4, following the Slidev deck. A slide this repository adds
carries a letter, such as 1.1a, so the source numbering never moves, and a
slide that moves keeps its number.

The source order is kept slide for slide. Nothing is split, merged, reordered,
or dropped in this plan except where a heading says "propose", and each
proposal is listed again under "Decisions".

Every em dash in the source copy is rewritten.

## Combining the two source decks

Proposed (Decision 7), following what w10 and w11 settled:

- **The Slidev deck supplies the sequence, the command slides, and all the
  exercises.** Its four sections become the fragments.
- **The ODP supplies concept detail.** O8, "GRUB2: boots the kernel and the
  initramfs", becomes 1.1a, the intro slide the Slidev GRUB2 section lacks.
  O4's "targets can contain targets" and "one isolatable target is the
  default" fold into 2.2. O5's "can only log in as root" for the rescue and
  emergency targets folds into 2.3. O6's table of `systemctl` target
  subcommands is an optional summary slide, 2.8a.
- **O10, `/etc/default/grub` and `grub2-mkconfig`, is not ported.** RH134 for
  RHEL 10 teaches `grubby` instead, which the Slidev deck follows; the Cert
  Guide still teaches the file. Say if you want it back (see "Not ported").
- **O2, O3, and O9 are the Red Hat boot diagram**, the same file as B2's
  image, and are rebuilt with it (Decision 8).

Forced changes, not choices:

- **Images that cannot be published as they are.** See "Third-party images".
- **Output that is not real.** B5 to B9 and B11 show `grubby` and
  `grub2-editenv` output from an older lab build (other machine ID, other swap
  UUID), B8 and B9 edit it by hand (`args="... rhgb quiet"`, a comment inside
  output), R3 shows a SHA-512 hash RHEL 10 no longer writes, and R6 shows the
  typed password echoed. Every transcript is recaptured.
- **Theme expression.** The source's `<br />` spacers, `image` and
  `image-right` layouts, `[[root@servera ~]#]` fence titles, and logo footer
  give way to the theme's layouts, `TerminalWindow`, plain `bash` fences, and
  footer.

## Sequencing and framing

- **W12 starts from the lab snapshot.** The instructor reverts the lab between
  weeks, so `servera` starts with `menu_auto_hide=1` in its GRUB environment,
  `multi-user.target` as default, the original `/etc/fstab`, and `root`
  unlocked with password `redhat` (see "Verification").
- **The week runs on two hosts.** Exercise 2 (targets) runs on `workstation`,
  because the point of `isolate` and `set-default` is watching the graphical
  login disappear and come back; `servera` has no display manager
  (`display-manager.service` is not found there). The other three exercises
  run on `servera`.
- **The exercises chain on `servera`.** Exercise 1 makes the GRUB2 menu appear
  on every boot, and exercise 4 depends on that. The last exercise's
  cleanup hides it again (Decision 16). See "Exercises".
- **Every lab host boots BIOS** (`docs/lab-environments.md`). The source's
  diagram shows BIOS and UEFI side by side, as RH134 does. 1.2 keeps both
  paths and says which one the lab VMs take.
- **W11 taught `/etc/fstab` and `systemctl daemon-reload`**, and w10 the UUID
  form of a line. Fragment 3 relies on both without reteaching them.
- **W06 taught SELinux contexts.** 4.7 relies on that for why `/etc/shadow`
  needs relabelling.

## Deck-level decisions

- **Entry file:** `course/w12-draft.md`, renamed to `course/w12.md` at
  publication.
- **Accent:** `green` (Decision 3). Cool, which suits a Bash-heavy deck, and
  used once, in w04. Used so far: teal (w01, w06), purple (w02, w11), blue
  (w03, w10), green (w04), slate (w05), pink (w07), yellow (w08). `red` is
  reserved for the Final; `orange` is unused but warm.
- **Title:** "Controlling the Boot Process and Root Password Reset", the
  source's own with "and" for "&" (Decision 4).
- **Cover agenda:** four lines, one per fragment (Decision 5).
- **Cover summary:**

  ```yaml
  courseInfo:
    summary: >-
      This week we will follow a RHEL system from power-on to the login
      prompt, change how GRUB2 starts the kernel, choose which systemd target
      the system boots into, repair a broken /etc/fstab from an emergency
      shell, and reset a lost root password.
  ```

- **VM reminder:** "Start `workstation` and `servera` on your VDI", as in w10
  (Decision 6). The source says "Start your VDI" and "Start Up the `servera`
  and `workstation` VMs".
- **Chapter directories:**
  `course/chapters/rh134-ch12-controlling-and-troubleshooting-the-boot-process/`
  for fragments 1 to 3 and
  `course/chapters/rh134-ch13-recovering-superuser-access/` for fragment 4.
- **Alignments** (Decision 1): fragments 1 and 2 align to RH134 chapter `"12"`
  and cert guide chapters `"17"` and `"18"` (17 covers GRUB2 and targets, 18
  the boot prompt and troubleshooting targets); fragment 3 to RH134 `"12"` and
  cert guide `"18"`; fragment 4 to RH134 `"13"`, *Recovering Superuser
  Access*, and cert guide `"18"`.

## Source-to-fragment map

From `controlling_troubleshooting_boot.md`:

| Source | Title                                   | Goes to      |
|-------:|-----------------------------------------|--------------|
|     B1 | Section: GRUB2 Boot Loader              | 1.1          |
|     B2 | Boot process diagram (no heading)       | 1.2, 1.2a    |
|     B3 | The GRUB2 Boot Menu                     | 1.3          |
|     B4 | Editing a GRUB2 Boot Entry              | 1.4          |
|     B5 | Inspect the Default Kernel              | 1.5          |
|     B6 | Change the Default Boot Entry           | 1.6          |
|     B7 | Get the Default Kernel Path             | 1.7          |
|     B8 | Add a Persistent Kernel Argument        | 1.8          |
|     B9 | Remove a Persistent Kernel Argument     | 1.9          |
|    B10 | The GRUB Environment (table)            | 1.10         |
|    B11 | The GRUB Environment (list)             | 1.11         |
|    B12 | `menu_auto_hide`                        | 1.12         |
|    B13 | `grubby` vs `grub2-editenv`             | 1.13         |
|    B14 | Exercise: GRUB2 Boot Loader             | 1.14         |
|    B15 | Section: systemd Targets                | 2.1          |
|    B16 | What Is a systemd Target?               | 2.2          |
|    B17 | Common Boot Targets                     | 2.3          |
|    B18 | Target Dependencies                     | 2.4          |
|    B19 | View Default Boot Target                | 2.5          |
|    B20 | Change Default Boot Target              | 2.6          |
|    B21 | Switch Targets at Runtime               | 2.7          |
|    B22 | Boot to a Specific Target               | 2.8          |
|    B23 | Exercise: systemd Targets               | 2.9          |
|    B24 | Section: Repairing File Systems at Boot | 3.1          |
|    B25 | When the Boot Process Fails             | 3.2          |
|    B26 | Remount Root Read/Write                 | 3.3          |
|    B27 | Find the Failing Mount                  | 3.4          |
|    B28 | Fix `/etc/fstab` and Reload             | 3.5          |
|    B29 | Repairing a Corrupted Filesystem        | 3.6          |
|    B30 | Exercise: Repair a File System at Boot  | 3.7          |

From `recovering_superuser_access.md`:

| Source | Title                              | Goes to |
|-------:|------------------------------------|---------|
|     R1 | Section: Recovering Superuser Access | 4.1   |
|     R2 | When Root Access Is Lost           | 4.2     |
|     R3 | Aside: Locking an Account          | 4.3     |
|     R4 | Edit the GRUB2 Entry               | 4.4     |
|     R5 | Remount Root Read/Write            | 4.5     |
|     R6 | Reset the Root Password            | 4.6     |
|     R7 | Trigger SELinux Relabeling         | 4.7     |
|     R8 | Hand Control to systemd            | 4.8     |
|     R9 | Exercise: Recover Root Access      | 4.9     |

From `slides.md`: S1 (cover) and S2 (VM reminder) go to the entry file.

From `ControlBootProcess.odp`:

| Source | Title                                  | Goes to        |
|-------:|----------------------------------------|----------------|
|     O1 | Title: Control the Boot Process        | the cover      |
| O2, O3 | Red Hat boot diagram                   | 1.2, 1.2a      |
|     O4 | Systemd Targets                        | 2.2            |
|     O5 | Systemd Targets - Isolatable           | 2.3            |
|     O6 | Systemd Targets - Components (table)   | 2.8a, new      |
|     O7 | Demo                                   | not ported     |
|     O8 | GRand Unified Boot-loader 2 (GRUB2)    | 1.1a, new      |
|     O9 | Red Hat boot diagram                   | 1.2, 1.2a      |
|    O10 | GRUB2 Components                       | not ported     |
|    O11 | Demo                                   | not ported     |

Slides with no source row: 1.1a, 1.2a, 2.8a, 3.2a (additions), and the
recording slides 1.14a and 2.9a.

## File inventory

New, under
`course/chapters/rh134-ch12-controlling-and-troubleshooting-the-boot-process/`:

| File                                | Slides | Exercises |
|-------------------------------------|-------:|----------:|
| `grub2-boot-loader.md`              |     18 |         1 |
| `systemd-targets.md`                |     11 |         1 |
| `repairing-file-systems-at-boot.md` |      8 |         1 |

New, under `course/chapters/rh134-ch13-recovering-superuser-access/`:

| File                             | Slides | Exercises |
|----------------------------------|-------:|----------:|
| `recovering-superuser-access.md` |      9 |         1 |

Plus, in each topic's `exercises/`, one `.sh` command file and one `.html`
written exercise per exercise (four of each), and a `.cast` beside each
exercise that gets a recording (Decision 10). Since 2026-11-01 the ch12
topic's `assets/` holds the VDI screenshots that replaced the placeholders,
`grub-menu.png` (1.3) and `grub-editor.png` (1.4), and the two crops on 3.2a,
`boot-stalled-incorrect-uuid.png` and `emergency-mode.png`. The ch13 topic
gains `assets/grub-editor-init-bin-bash.png` (4.4). The instructor's other
eleven VDI screenshots are kept beside them for later use, renamed with an
`scc-` prefix that marks the lab they came from (for example
`scc-servera-emergency-shell-vim-fstab.png`); no slide references them. The
placeholders were deleted on 2026-11-01, so none remain in the week.

Also new: `course/w12-draft.md`. At publication, `tests/site.test.mjs` gains
`"w12"` in its published-week list.

No theme change is planned.

## Third-party images

The Slidev deck references four images. The ODP embeds the Red Hat diagram,
a stock photograph, and six Microsoft Office icons. Two more PNGs sit unused
in `public/`.

**`boot-process-diagram.png` (B2; also O2, O3, O9), rebuild.** A Red Hat
figure: Red Hat's typeface and blue, the RH134 layout of a BIOS row and a UEFI
row converging on the kernel and initramfs. Proposed (Decision 8): rebuild it
as our own Mermaid diagrams across 1.2 and 1.2a, from the facts in RH134
section 12.1 and 12.3 and the source's own presenter notes. No placeholder is
needed.

**`grub-menu-1.png` (B3) and `grub-editor.png` (B4), replace.** Uncropped
captures of a GRUB 2.12 console, 796 by 581 and 790 by 586. They show kernel
`6.12.0-55.12.1`, `root=UUID=15507695-22bb-4c65-94e6-a4...`, and `console=tty0
console=ttyS0,115200n8`: RH134's own `grubby --info` example carries that
kernel and UUID, so these look like captures of the Red Hat Academy lab, not
the SCC or instructor lab, where the `linux` line carries
`root=/dev/mapper/rhel_servera-root` and no `console=` options (verified on
the instructor lab). Proposed (Decision 11): recapture both during a VDI dry
run, or rebuild the editor as text. Copied in as
`assets/grub-menu.placeholder.png` and `assets/grub-editor.placeholder.png`
on 2026-10-29, when fragment 1 was built.

**`grub-cmdline-edit.png` (R4), replace.** The same RHA editor screen in a
rounded window frame on a blue gradient, with `init=/bin/bash` already typed
at the end and marked with a yellow highlighter stroke. Same proposal as
above. Copied in as `assets/grub-cmdline-edit.placeholder.png`, in the ch13
topic, on 2026-10-31, when fragment 4 was built.

**`emergency_mode.png` and `boot_stalled_incorrect_uuid.png`, unreferenced,
instructor's own.** Crops of a console in the same window frame: the
emergency-mode "Give root password for maintenance" prompt, and systemd's
`(27s / 1min 30s)` wait on `dev-disk-by\x2duuid-...zzz.device`, with the
`zzz` marked in yellow. The second mounts `/mnt/dvd`, which only the SCC and
instructor labs have, so both are from this course's exercise. Proposed
(Decision 12): use them on a new 3.2a. Placeholders until you confirm.

**The stock photograph (O10, 2048 by 1365 JPEG), not ported.** A blurred code
editor used as slide artwork, with no recorded source.

**The Microsoft Office icons (O4, O8), not ported.** Six SVGs named
`Icons_Checkmark`, `Icons_Subtitles`, `Icons_Programmer`, `Icons_LaptopSecure`,
`Icons_Server`, and `Icons_Firefighter`, with their 97-pixel PNG fallbacks.
Carbon icons in `IconGrid` replace them where a slide wants an icon.

**The college and Red Hat logos in `public/`, not ported.** The theme's footer
replaces them.

## Topic fragments

Each fragment opens with its `layout: section` slide, which carries the
`routeAlias` and `topicInfo`. A "fixed" `TerminalWindow` shows a transcript
that never changes and takes no `rows`. Every prompt takes the theme form,
`root@servera:~#`. Every transcript comes from one slide chain on `servera`
(and `workstation` for the targets slides it needs), so IDs and UUIDs agree
from slide to slide.

Where the source shows output, the slide shows recaptured output. Where it
shows commands only, the slide keeps a plain `bash` fence, since
`docs/course-authoring.md` forbids a transcript that implies a command printed
nothing when its output was only left out. Commands typed at the console in
the `init=/bin/bash` shell follow Decision 19.

### 1. `grub2-boot-loader.md` (18 slides), built 2026-10-29

`routeAlias: grub2-boot-loader`. Alignments: RH134 chapter 12, cert guide
chapters 17 and 18. Exercise: Change Kernel Arguments Exercise, declared in
`topicInfo`. Built in source order, with one exercise at the end: Decision 9
was rejected on 2026-10-29, since fourteen content slides before an exercise
is acceptable here. Checked with `check:entry`, `check:exercises`, and
`check:slides` (no overflow; clearances below are from its `--verbose`
report), and every slide and click state was captured at 1920x1080. The
transcripts are real output from `servera` on 2026-10-29 ("Verification",
Round 2). The entries below describe what shipped; the fragment waits on the
instructor's review.

##### 1.1 GRUB2 Boot Loader

Source B1. Section slide carrying the `topicInfo`.

Components: `section`.

##### 1.1a What Is GRUB2?

**Addition, from O8** (Decision 22). "The **GRand Unified Bootloader 2** is the
boot loader RHEL uses", over four facts: loads the kernel, the heart of the
OS; loads the initramfs, a small OS with drivers; passes arguments to the
kernel; offers a menu of kernels to boot. The title follows w11's "What Is
LVM?". `check:slides`: 132.59px clearance.

Components: default layout with `vertical: center`; `IconGrid` with Carbon
`chip`, `archive`, `parameter`, and `list`.

##### 1.2 The Boot Process: Firmware to GRUB2

Source B2, first half, and its presenter notes (Decision 8). A Mermaid
`flowchart LR` at `scale: 0.9`: "Power on and POST" branches to two rows that
meet at the GRUB2 menu, **BIOS firmware**, "Boot sector (MBR)", "GRUB2 core
image before partition 1", and **UEFI firmware**, "Boot entry in NVRAM", "EFI
System Partition /boot/efi". The GRUB2 node is drawn in the green accent's 22%
fill with a 2px stroke; the rest are white with grey strokes. Beneath it: "Both
paths end at the GRUB2 menu; the lab VMs boot **BIOS**". `check:slides`:
129.56px.

Components: default layout, Mermaid flowchart with `classDef`.

##### 1.2a The Boot Process: GRUB2 to Login

Source B2, second half, and its presenter notes (Decision 8). Seven steps in two
labelled groups at `scale: 0.8`. "Running from memory": GRUB2 menu, "Kernel
and initramfs loaded into memory", "/sbin/init (systemd) starts as PID 1",
"initrd.target mounts root on /sysroot". "Running from the disk": "systemd
restarts from the disk", "default.target starts services", "Login prompt". The
arrow joining the groups is labelled "Switch root to /sysroot", so the step
that moves from memory to the disk is the hand-off itself (instructor review,
2026-10-30: the unlabelled arrow did not show that the bottom row follows the
top). Mermaid ignores a group's `direction LR` when a node inside it links
outside it, so the arrow joins the groups, not their nodes. Beneath it: "Kernel
arguments can change what runs as PID 1 and which target systemd starts",
which sets up `init=` (4.2) and `systemd.unit=` (2.8). A single row of seven ran
off the right edge; two rows at 0.9 ran the top group past the content box,
and 0.8 fits. `check:slides`: no overflow (rechecked after the label change).

Components: default layout, Mermaid `flowchart TB` with two `direction LR`
subgraphs.

##### 1.3 The GRUB2 Boot Menu

Source B3. Left column: "Lists the installed kernels, newest first", "The
default entry starts highlighted" (in place of the source's "`*` marks the
default entry", see "Corrections"), "A countdown boots it automatically", and
the key table: any key except <kbd>Enter</kbd> stops the countdown, arrow keys
select, <kbd>Enter</kbd> boots, <kbd>e</kbd> edits. "Arrow keys" is written
out because the arrow characters fall outside the bundled Lato subsets. Right
column: `assets/grub-menu.png`, the VDI capture of `servera`'s menu (Round 8,
V01; 720 by 400) that replaced the placeholder on 2026-11-01 (Decision 11).
The alt text quotes both entries, the help lines, and the countdown.
`check:slides`: 8.88px, as before.

Components: `two-cols-header` with `vertical: center`; Markdown table with
`<kbd>`; image.

##### 1.4 Editing a GRUB2 Boot Entry

Source B4. Left column: the five steps (press <kbd>e</kbd>; move to the line
that starts with `linux`; <kbd>End</kbd>; type a space and the arguments;
<kbd>Ctrl</kbd>+<kbd>X</kbd>) and a `Callout`, "Changes apply to **this boot
only**". Right column: `assets/grub-editor.png`, the VDI capture of the
editor just after <kbd>e</kbd> (Round 8, V02), which replaced the placeholder
on 2026-11-01; rebuilding it as text (Decision 11) stays possible. Its
`linux` line wraps at 78 columns with `\`, as on the serial console, and its
`initrd` line ends in `$tuned_initrd`, which the instructor lab lacks. Until
2026-11-01 Decision 14 sat here as a sentence in the `bottom` band; 1.4a now
shows it, so the band is gone. `check:slides`: 65px (it was 0px with the
band and the placeholder).

Components: `two-cols-header` with `vertical: center`; ordered list with
`<kbd>`; `Callout` with `AccentText`; image.

##### 1.4a Check the Running Kernel's Arguments

**Addition** (Decision 31), 2026-11-01, so exercise 1's `cat /proc/cmdline`
is taught before it is used. "`/proc/cmdline` holds the arguments the running
kernel booted with", then a `TextExplainer` over `cat /proc/cmdline` as
`student`: the 249-column line from the instructor lab's `servera` (the
fragment's machine, UUID `c0d07a5b-...`, booted with `ipv6.disable=1`; read
on 2026-10-31, Round 6's baseline), wrapped at spaces into four lines of at
most 77 columns. At the `sm` size a full-width `TextExplainer` holds about 90
columns (see "Authoring notes"). Four steps: `BOOT_IMAGE=...` (whole line),
"Added by GRUB2: the kernel it loaded"; `root=...`, "The root file system";
`ro`, "Mount / read-only at first; systemd remounts it read/write later"
(Round 4); `ipv6.disable=1`, "Typed at the end of the linux line in the GRUB2
editor, so it comes last". Then "Wrapped here at spaces; the real output is a
single line". The SCC lab's line differs (`rhel-root`, `rhgb quiet`; Round
8). `check:slides`: 46.59px in every state.

Components: default layout with `vertical: center`, `TextExplainer`.

##### 1.5 Inspect the Default Kernel

Source B5. Three `v-switch` templates, each its own fixed terminal as in the
source: `grubby --default-index` prints `0`, with "Entries are numbered from
`0`" beneath; `grubby --info 0`; and `grubby --info $(grubby
--default-index)`, introduced by "Command substitution combines the two:
`$(grubby --default-index)` becomes `0`" (the source's inline comment). The
`args` line is wrapped once, after the `resume=UUID=...` argument.
`check:slides`: 128.34px on the first state, 92.89px on the others.

Components: `v-switch` with three `TerminalWindow` templates.

##### 1.6 Change the Default Boot Entry

Source B6. "`grubby --set-default-index` changes which entry GRUB2 boots by
default", the command and its real confirmation, wrapped once after `.conf`,
then "The change persists across reboots; verify with `grubby
--default-index`". `check:slides`: 63.67px.

Components: fixed `TerminalWindow`.

##### 1.7 Get the Default Kernel Path

Source B7. `grubby --default-kernel` and its path in a terminal, then
"`--update-kernel` needs a kernel path, and `--default-kernel` provides it"
over a `bash` fence of `grubby --update-kernel $(grubby --default-kernel)
--args="..."`. `check:slides`: 56.14px.

Components: fixed `TerminalWindow`, `bash` fence.

##### 1.8 Add a Persistent Kernel Argument

Source B8. Two `v-switch` templates. First: "`grubby --update-kernel` adds
arguments to an entry; they persist across reboots", the command followed by a
bare prompt (it prints nothing, verified), then two bullets: `rhgb` shows a
graphical boot screen when `plymouth` is installed; `quiet` hides most boot
messages. Second: "Verify with `grubby --info`: `rhgb quiet` now ends `args`",
the full output with both lines of the wrapped `args` highlighted.
`check:slides`: 109.8px, then 92.89px.

Components: `v-switch` with two `TerminalWindow` templates; line highlight
`{4,5}`.

##### 1.9 Remove a Persistent Kernel Argument

Source B9. As 1.8 with `--remove-args`: "`--remove-args` takes arguments off an
entry; the change persists across reboots", then "Verify with `grubby --info`:
`rhgb quiet` is gone from `args`". The source's `h3` heading became the same
sentence form as 1.8's. `check:slides`: 155.89px, then 92.89px.

Components: as 1.8.

##### 1.10 The GRUB Environment

Source B10. "GRUB2 keeps a few variables in `/boot/grub2/grubenv` and reads
them at every boot", "`grub2-editenv` manages them", the three-row table
(`list`, `set name=value`, `unset name`), and "The `-` stands for the default
file, `/boot/grub2/grubenv`" (from `grub2-editenv --help`, verified).
`check:slides`: 43.3px.

Components: default layout with `vertical: center`, Markdown table.

##### 1.11 The GRUB Environment

Source B11. `grub2-editenv - list` with its real four lines as a
`TextExplainer`, three steps: `saved_entry`, "The default boot entry, which
grubby --set-default-index sets" (the correction behind 1.13); `menu_auto_hide`,
"1 hides the menu after a successful boot"; `boot_success`, "1 when the last
boot succeeded". `check:slides`: 107.64px in each state. The lines a step marks
sit a few pixels right of the others (see "Authoring notes").

Components: default layout with `vertical: center`, `TextExplainer`.

##### 1.12 `menu_auto_hide`

Source B12. "GRUB2 hides the menu when `menu_auto_hide=1` and the last boot
succeeded", "Unset it so the menu appears on every boot", the real `unset` and
`list` transcript (verified: `menu_auto_hide` drops out of the list), and a
`Callout` titled "Once per VM": "The setting persists, so each VM needs it only
once". The `boot_indeterminate` and two-minute-session details stay in this
plan (see "Verification"). `check:slides`: 43.19px.

Components: fixed `TerminalWindow`, `Callout`.

##### 1.13 `grubby` vs `grub2-editenv`

Source B13. The comparison table, corrected: **Manages**, boot entries and
their kernel arguments against GRUB2's environment variables; **Stored in**,
`/boot/loader/entries/*.conf` against `/boot/grub2/grubenv`; **Use for**,
kernel arguments and the default entry against menu behavior; **Example**,
`--args="rhgb quiet"` against `menu_auto_hide`. Then "`grubby` controls
*what* boots; `grub2-editenv` controls *how* the menu behaves", and a `Callout`
titled "One overlap": "`grubby --set-default-index` stores the default in
`grubenv`, as `saved_entry`" (verified with index 1 and back). `check:slides`:
31.03px.

Components: default layout, Markdown table, `Callout`.

##### 1.14 Exercise: Change Kernel Arguments

Source B14 (Decision 20; the split titles of Decision 9 are gone with it).
Goal: "Boot `servera` once with an extra kernel argument, then make it
persistent". Environment: "**Host:** `servera`, with its VM console open for
the GRUB2 menu". Workflow: make the GRUB2 menu appear on every boot; boot once
with `ipv6.disable=1` added at the GRUB2 menu; confirm the argument with
`/proc/cmdline` and `ip -br addr`; reboot without editing and confirm the
argument is gone; add `ipv6.disable=1` persistently with `grubby`; reboot and
confirm the argument is still there; remove the argument with `grubby`.
`check:slides`: 98.39px.

Components: `exercise`.

##### 1.14a Exercise recording

Pending the cast. Recording it needs the GRUB2 edit made by hand in the
console during step 2's 45-second pause (Open question 5).

### 2. `systemd-targets.md` (11 slides), built 2026-10-31

`routeAlias: systemd-targets` (unused before; w04 has `systemd-services`).
Alignments: RH134 chapter 12, cert guide chapters 17 and 18, the same as
fragment 1's, so the week lists them once. Exercise: Switch systemd Targets
Exercise, declared in `topicInfo`. Deck slides 20 to 29. Checked with
`check:entry`, `check:exercises`, and `check:slides` (no overflow; clearances
below are from its `--verbose` report), and every slide and click state was
captured at 1920x1080. The transcripts are real output from `servera` and
`workstation` on 2026-10-31 ("Verification", Round 3); none carries a machine
ID or UUID, so they hold on either copy of the instructor lab. The entries
below describe what shipped; the fragment waits on the instructor's review.

W04's `systemd-services.md` already defines a target ("A Target Is a Group of
Units") and promises that "a later week digs into targets, boot order, and
switching between them". This fragment is that week; 2.2 restates the
definition rather than reteaching units, and exercise 2 checks its results
with `systemctl is-active`, which w04 taught.

##### 2.1 systemd Targets

Source B15. Section slide carrying the `topicInfo`.

Components: `section`.

##### 2.2 What Is a systemd Target?

Sources B16 and O4. "A **target** is a named group of units the system starts
to reach a state", over six facts: decides which services start at boot (B16);
can contain other targets (O4); servers boot to text logins only (B16's
headless-server bullet, without its em dash); rescue and emergency targets for
repairs (B16); switch targets without a reboot (B16); one target is the boot
default (O4). O4's "isolatable" is left to 2.7, where `AllowIsolate=yes`
explains it. `check:slides`: 62.84px.

Components: default layout with `vertical: center`; `IconGrid` with Carbon
`application`, `tree-view`, `terminal`, `tools`, `renew`, and `star`.

##### 2.3 Common Boot Targets

Sources B17 and O5. The four-row table: `graphical.target`, "Multi-user, with
a graphical login"; `multi-user.target`, "Multi-user, text logins only";
`rescue.target`, "Single-user repair shell; local file systems read/write";
`emergency.target`, "Minimal repair shell; root file system read-only". Then
"Both repair shells ask for the `root` password" (O5's "can only log in as
root", in RH134's terms) and "Targets nest: `graphical.target` includes
`multi-user.target`, which includes `basic.target`". B17's "most filesystems
mounted read/write" became "local file systems", since `rescue.target` pulls
in `sysinit.target` and so `local-fs.target`, but not `remote-fs.target`
(Round 3). `check:slides`: 21.42px.

Components: default layout, Markdown table.

##### 2.4 Target Dependencies

Source B18. "`systemctl list-dependencies` shows the units a target pulls in",
then the real output on `servera`, cut with two `...output omitted...` lines:
the target, `display-manager.service` and
`systemd-update-utmp-runlevel.service` (both `○`), `multi-user.target` (`●`),
its first two units (`audit-rules.service`, `auditd.service`), and
`basic.target`. Lines 3 and 5, the display manager and `multi-user.target`, are
highlighted. B18's `firewalld` and `NetworkManager` are not the first units
under `multi-user.target` on RHEL 10, so they are not shown; the full tree is
113 lines. Beneath it: "`graphical.target` adds a display manager on top of
everything `multi-user.target` starts" (B18's closing note), and a `Callout`:
"● marks an active unit and ○ an inactive one; `servera` has no display
manager", which the source never explains. `check:slides`: 25.09px. The tree
characters and both bullets render in the theme's monospace font (checked in
the capture).

Components: fixed `TerminalWindow` with line highlight `{3,5}`, `Callout`.

##### 2.5 View Default Boot Target

Source B19. "`systemctl get-default` shows the target the system boots into",
then two fixed terminals side by side: `servera` prints `multi-user.target`
("A server: text logins only") and `workstation` prints `graphical.target`
("A desktop: a graphical login"). The second terminal is new; the source shows
`servera` alone. Both verified. `check:slides`: 72.27px.

Components: `two-cols-header`, a fixed `TerminalWindow` per column.

##### 2.6 Change Default Boot Target

Source B20. "`systemctl set-default` changes the default by replacing a
symlink", then `systemctl set-default graphical.target` on `servera` with its
two real lines, `Removed '/etc/systemd/system/default.target'.` and `Created
symlink '/etc/systemd/system/default.target' →
'/usr/lib/systemd/system/graphical.target'.` (identical to the source and to
RH134), then "The running system keeps its current target until the next
boot" (verified on `workstation`: `graphical.target` and `gdm` stayed active
after `set-default multi-user.target`). The first build named the link's full
path in the sentence, which wrapped onto a second line; the terminal already
shows it. `check:slides`: 63.7px.

Components: fixed `TerminalWindow`.

##### 2.7 Switch Targets at Runtime

Source B21. "`systemctl isolate` switches the running system to another
target, with no reboot", a `bash` fence of `systemctl isolate
multi-user.target` (it prints nothing, and the fence keeps the slide
host-neutral: on `servera` the command would change nothing), three bullets
(stops every unit the new target does not need; starts the units it needs that
are not running; lasts until the next boot, the default does not change), and
the `Callout` "Only targets with `AllowIsolate=yes` in their unit file can be
isolated". The third bullet is new, verified on `workstation`. `check:slides`:
38.87px.

Components: `bash` fence, bulleted list, `Callout`.

##### 2.8 Boot to a Specific Target

Source B22, three `v-switch` states as the source. First: "`systemd.unit=` on
the kernel command line picks the target for one boot", "**Step 1:** Open the
GRUB2 editor", and three numbered steps (reboot and stop the countdown; press
<kbd>e</kbd> to edit the default entry; move to the line that starts with
`linux`). Second: the same sentence, "**Step 2:** Append the target", "Press
<kbd>End</kbd>, then type a space and the argument", a `text` fence of
`systemd.unit=rescue.target`, and "Press <kbd>Ctrl</kbd>+<kbd>X</kbd> to
boot". Third: "Which repair shell?" over the comparison table, then "Type
`exit` or press <kbd>Ctrl</kbd>+<kbd>D</kbd> to leave the shell and continue
the normal boot".

The table, corrected from B22 (Round 3, unit files and RH134): **File
systems**, "Local file systems, read/write" against "Root only, read-only";
**Services**, "Logging and devices; no network" against "Almost none"; **Use
when**, "A service breaks the normal boot" against "`rescue.target` fails, as
with a bad `/etc/fstab` line". B22 had rescue for "investigating services or
fstab", but a bad `/etc/fstab` line fails `local-fs.target`, which
`rescue.target` needs, and systemd falls back to emergency; that also sets up
fragment 3. "Almost none" replaces B22's "None", since I could not confirm
from the unit files alone whether `journald` survives into the emergency shell.
B22's "Ctrl+D" is kept beside `exit`, the word the rescue banner itself uses.

No editor image: B22 has none, and Decision 11's text rebuild of the editor
would go here when it exists. `check:slides`: 119.25px, 106.8px, 73.28px.

Components: `v-switch` with three templates; ordered list with `<kbd>`; `text`
fence; Markdown table.

##### 2.8a systemd Target Commands

**Addition, from O6, optional** (Decision 21). A two-column table in teaching
order: `systemctl list-dependencies TARGET`, "Show the units a target pulls
in"; `systemctl list-units --type target`, "Show the active targets";
`systemctl get-default`, "Show the default target"; `systemctl set-default
TARGET`, "Change the default target"; `systemctl isolate TARGET`, "Switch to a
target now". Beneath it: "At the GRUB2 menu, `systemd.unit=TARGET` picks the
target for one boot". `TARGET` follows `systemctl`(1)'s own placeholder.
`list-units --type target` appears on no other slide; it is O6's, and its
output was checked on `servera` and `workstation`. Cut the slide if time is
short. `check:slides`: 39.52px.

Components: default layout with `vertical: center`, Markdown table.

##### 2.9 Exercise: Switch systemd Targets

Source B23 and `systemd_targets.sh`. Goal: "Switch `workstation` between
targets now, by default, and for a single boot". Environment: "**Host:**
`workstation`, with its VM console open". No prerequisite exercise. Workflow:
make the GRUB2 menu appear on every boot (Decision 15); inspect the default
target and its dependencies; switch to `multi-user.target` without rebooting;
make `multi-user.target` the default and reboot to confirm; restore
`graphical.target` as the default; boot once into `rescue.target` from the
GRUB2 menu; confirm the root file system is read/write, then continue the
boot. The last step is the command file's step 6, which B23's slide leaves
out. `check:slides`: 98.73px.

Components: `exercise`.

##### 2.9a Exercise recording

Pending the cast. Like exercise 1's, the take needs console work during its
pauses: the GRUB2 edit after step 6's reboot and the rescue shell during the
pause on step 7's header (Open question 5).

### 3. `repairing-file-systems-at-boot.md` (8 slides), built 2026-10-31

`routeAlias: repairing-file-systems-at-boot`. Alignments: RH134 chapter 12,
cert guide chapter 18. Exercise: Repair a File System at Boot Exercise,
declared in `topicInfo`. Deck slides 30 to 37. Checked with `check:entry`,
`check:exercises`, and `check:slides` (no overflow; clearances below), and
every slide and click state was captured at 1920x1080. The transcripts are
real output from `servera` on the Round 3 lab copy, on 2026-10-31
("Verification", Round 4). The entries below describe what shipped; the
fragment waits on the instructor's review.

W10's `mounting-file-systems.md` taught the fstab fields (including "fsck:
check at boot? `0` is no"), `lsblk -fp` for UUIDs, and `systemctl
daemon-reload` and `mount --all` after an edit. This fragment relies on all of
them.

##### 3.1 Repairing File Systems at Boot

Source B24. Section slide carrying the `topicInfo`.

Components: `section`.

##### 3.2 When the Boot Process Fails

Source B25, corrected (Round 4). "A bad `/etc/fstab` entry can halt the boot"
(with "halt the boot" in `AccentText`), then a two-row table, **Problem**
against **What happens at boot**: "Device or UUID that does not exist",
"systemd waits 90 seconds for it, then gives up"; "Damaged file system", "The
mount may fail; `fsck` at boot repairs ext4, not XFS". Then "Then systemd
opens an **emergency shell** and asks for the `root` password" (B25's closing
blockquote) and a `Callout`: "A missing mount point does not stop the boot:
systemd creates the directory".

B25's third row, "Nonexistent mount point: mount fails immediately", is the
`Callout` now: on the lab, `mount --all` fails on a missing mount point, but
the mount unit systemd builds from the same line creates the directory and
mounts (Round 4). RH134 says the same as B25 and is wrong for RHEL 10 too.
B25's "systemd attempts repair" for a corrupted file system holds only for
ext4 with a nonzero sixth field; `fsck.xfs` is a stub. `check:slides`: 42.12px.

Components: default layout, `AccentText`, Markdown table, `Callout`.

##### 3.2a What a Failed Boot Looks Like

**Addition** (Decision 12). Two `v-switch` states over console captures.
Built over the instructor's captures as placeholders; on 2026-11-01 they were
replaced by crops of the VDI screenshots V04 and V05 (Round 8), each with a
16-pixel black margin so the theme's rounded image corners clip nothing:
`assets/boot-stalled-incorrect-uuid.png` (the last six lines of V04, 1024 by
128) and `assets/emergency-mode.png` (the banner and prompt from V05, 640 by
112). First: "systemd waits 90 seconds for the device with the mistyped UUID"
over the stalled job line, `(39s / 1min 30s)`, then "A splash screen instead
of messages? Press <kbd>Esc</kbd>" (Decision 31: on the SCC lab, Plymouth
hides the wait). Second: "Then it gives up and opens the emergency shell" over
the emergency banner and password prompt, which match, word for word, the
`systemd-sulogin-shell` string read in Round 3. Each alt text quotes the key
lines, since the images are text. `check:slides`: 116.59px, then 138.34px.

The stalled capture's UUID is now the SCC lab's `/boot`, `2cd783eb-...`,
which still differs from 3.4's (Open question 6: they need not match).

Components: default layout, `v-switch` with an image per template.

##### 3.3 Remount Root Read/Write

Source B26. "Booted to `emergency.target` on purpose: `/` is mounted
**read-only**" and "Dropped there by a failed mount: `/` is usually already
**read/write**" (both B26's claims, now backed by the unit files: see Round
4), then a fixed terminal with `mount | grep root` and its real line,
`/dev/mapper/rhel_servera-root on / type xfs (rw,relatime,...)` in full, then
"`ro` in the options means remount before editing `/etc/fstab`" over a `bash`
fence of `mount -o remount,rw /`. B26's typo `rhel_servera_root` is fixed by
using the real output, and its "Abridged Output" title with an em dash is
gone.

The output was captured over SSH on a normal boot, so it shows `rw`; the slide
claims only that the options show `rw` or `ro`. A first build put the line in
a `TextExplainer` marking `rw`, which ran 168px off the right edge: the line
is 106 columns and `TextExplainer` at `sm` holds fewer than a `TerminalWindow`.
`check:slides`: 44.59px.

Components: fixed `TerminalWindow`, `bash` fence.

##### 3.4 Find the Failing Mount

Source B27. "`mount --all` mounts every `/etc/fstab` entry that is not already
mounted", then the real error for a mistyped `/boot` UUID on `servera`, `mount:
/boot: can't find UUID=5c381752-9fdd-458f-976f-240db85ec6a4zzz.` (exit 32),
then "Each error names the mount point and the device it could not find" and a
`Callout`: "Fix the error, then run `mount --all` again: no output means every
entry mounted" (B27's closing blockquote).

B27's example, the missing mount point, became the UUID form (the plan's first
option): a missing mount point no longer stops a boot (3.2), and the UUID form
is what 3.2a and the exercise produce. The missing-mount-point error and its
`dmesg(1)` line stay in this plan (Round 1, Round 4). `check:slides`: 53.92px.

Components: fixed `TerminalWindow`, `Callout`.

##### 3.5 Fix `/etc/fstab` and Reload

Source B28, two `v-switch` states. First: "**Step 1:** Edit the bad entry", a
`bash` fence of `vim /etc/fstab`, and three fixes: correct a typo in a UUID or
device path, comparing with `lsblk -fp` (w10's command, new here); create a
missing mount point; comment out an entry for a device that no longer exists.
Second: "**Step 2:** Reload systemd, then mount every entry", a fence of
`systemctl daemon-reload` and `mount --all`, then "No errors? Reboot to confirm
the system boots normally" over `systemctl reboot` (Decision 17). Commands
only: the emergency shell cannot be captured over SSH. `check:slides`:
116.67px, 118.72px.

Components: `v-switch` with two templates, `bash` fences, bulleted list.

##### 3.6 Repairing a Corrupted File System

Source B29. "For damage inside a file system, not an `/etc/fstab` error, run
its repair tool on the device", then two columns: **XFS**, `xfs_repair
/dev/sdb1`, "`fsck.xfs` does nothing at boot"; **ext4**, `fsck.ext4 -p
/dev/sdb2`, "`-p` repairs small problems without asking". A warning `Callout`
in the `bottom` band: "Unmount the file system first; `xfs_repair` refuses a
mounted one". B29 ran both tools on `/dev/sda2`, the lab's XFS `/boot`; the
stand-ins are partitions on a blank disk, one per file system. Both tools were
run on scratch file systems, and `xfs_repair` on a mounted one (Round 4).
"Filesystem" became "File System". A first build's XFS caption ran to two
lines and pushed the columns out of line. `check:slides`: 17px.

Components: `two-cols-header` with a `bottom` band, `bash` fences, `Callout`.

##### 3.7 Exercise: Repair a File System at Boot

Source B30 and `repair_file_system_at_boot.sh`. Goal: "Break the `/boot`
entry in `/etc/fstab`, then repair it from the emergency shell". Environment:
"**Host:** `servera`, with its VM console open". No prerequisite exercise.
Workflow: break the UUID of the `/boot` entry in `/etc/fstab`; reboot and log
in to the emergency shell as `root`; check that the root file system is
read/write; find the bad entry with `mount --all`; correct the entry in
`/etc/fstab`; reload systemd and confirm `mount --all` succeeds; reboot and
confirm a normal boot. B30's "pre-configured with a broken `/etc/fstab`
entry" is dropped, and its step 0 is step 1. The read/write check is new,
since 3.3 teaches it and the exercise is where it can be seen. `check:slides`:
97.91px.

Components: `exercise`.

### 4. `recovering-superuser-access.md` (9 slides), built 2026-10-31

`routeAlias: recovering-superuser-access`. Alignments: RH134 chapter 13,
*Recovering Superuser Access* (no other fragment aligns to it), and cert guide
chapter 18. Exercise: Recover Root Access Exercise, declared in `topicInfo`.
Deck slides 38 to 46, in the new chapter directory
`course/chapters/rh134-ch13-recovering-superuser-access/`. Checked with
`check:entry`, `check:exercises`, and `check:slides` (no overflow; clearances
below), and every slide and click state was captured at 1920x1080. The
`servera` facts behind it are from the Round 3 lab copy on 2026-10-31
("Verification", Round 5). The entries below describe what shipped; the
fragment waits on the instructor's review.

RH134 for RHEL 10 teaches this same `init=/bin/bash` procedure, step for step,
as its method without rescue media, so the source's sequence stands. W06's
`selinux-file-policies.md` taught `restorecon`, which 4.7 leans on.

##### 4.1 Recovering Superuser Access

Source R1. Section slide carrying the `topicInfo`.

Components: `section`.

##### 4.2 When Root Access Is Lost

Source R2. "If the `root` password is unknown or locked, nobody can administer
the system" and "`init=/bin/bash` on the kernel command line starts bash as
PID 1 instead of systemd", over three facts: no login, no password; a root
shell at once; `/` is mounted read-only. A `Callout`: "Needs the console,
physical or remote, to reach the GRUB2 menu", in place of R2's "cannot be done
remotely". A first build's captions ran to two lines, one breaking
"read-only" at its hyphen. `check:slides`: 79.08px.

Components: default layout with `vertical: center`, `IconGrid` with Carbon
`login`, `user-admin`, and `locked`, `Callout`.

##### 4.3 Aside: Locking an Account

Source R3, corrected (Round 5). "`passwd -l` locks an account by putting `!` in
front of its password hash", then a `TextExplainer` over six lines:
`grep root /etc/shadow`, `root:$y$j9T$...::0:99999:7:::`, `passwd -l root`,
`passwd: password changed.`, and the same `grep` showing
`root:!$y$j9T$...::0:99999:7:::`. Two steps: the hash, "The hash of the
password, shortened here"; the `!`, "No password can match a hash that starts
with !". Built with a `Callout` keeping R3's closing line, verified in Round
5: "Setting a new password with `passwd` writes a fresh hash without the `!`,
which unlocks the account". The prompts are `root@servera:~#`, since this
aside runs on a normal boot. R3's `$6$rounds=4096$` (SHA-512) is yescrypt's
`$y$j9T$` on RHEL 10, and the fields after the hash are the lab's own. The
hash is shortened with `...` as the plan proposed; it is never printed in
full here or in this plan.

Changed 2026-11-01 (Decision 31), because exercise 4 uses `passwd -S` in
steps 1 and 7 and no slide taught it: two more lines, `passwd -S root` and
`root L never 0 99999 7 -1` (Round 5), and a third step on the `L`: "passwd
-S shows L for locked. A new password from passwd writes a fresh hash without
the !, and the status reads P". The `Callout` folded into that step, since
with it the slide overflowed by 22px. `check:slides`: 67.66px, then 35.27px on
the last step.

Components: default layout, `TextExplainer`.

##### 4.4 Edit the GRUB2 Entry

Source R4. `two-cols-header` with `leftWidth: 45`: three `v-switch` states on
the left, an editor image on the right. Built with R4's image as
`assets/grub-cmdline-edit.placeholder.png` (Decision 11; a RHA capture with
kernel `6.12.0-55.12.1`); since 2026-11-01 it is
`assets/grub-editor-init-bin-bash.png`, the VDI capture V15 (Round 8): the
SCC lab's `linux` line with `init=/bin/bash` appended after `rhgb quiet`,
wrapped over four screen lines. `check:slides`: 76.8px in each state. First:
"**Step 1:** Open the GRUB2 editor" and the three steps as on 2.8. Second:
"**Step 2:** Clean up the `linux` line", "Remove any `console=` options", and
a warning `Callout`, "Left in place, they can open the shell on a console you
cannot reach" (R4 and RH134). Third: "**Step 3:** Append `init=/bin/bash`",
"Press <kbd>End</kbd>, then type a space and", a `text` fence of
`init=/bin/bash`, and "Press <kbd>Ctrl</kbd>+<kbd>X</kbd> to boot". The lab's
kernel line has no `console=` options (Round 5), and neither has the SCC
lab's (Round 8), so the step stays "if any". Round 6 showed what the step
guards against: with `console=ttyS0` last, the `init=/bin/bash` shell opens on
the serial port only. (The built version measured 28.48px with the
placeholder.)

Components: `two-cols-header`, `v-switch` with three templates, ordered list
with `<kbd>`, `Callout`, `text` fence, image.

##### 4.5 Remount Root Read/Write

Source R5. "The kernel line's `ro` mounts `/` **read-only**, and systemd,
which would remount it, never ran" (the `ro` is in `/proc/cmdline` and in
1.5's `grubby --info` output), "`passwd` must write `/etc/shadow`, so remount
first, at the `bash-5.2#` prompt", a `TerminalWindow` titled "servera console"
holding a `bash` fence of `mount -o remount,rw /` (Decision 19), and "Verify
with `mount | grep root`: look for `rw` in the options". R5 verified with
`mount | grep ' / '`; `grep root` matches 3.3. `check:slides`: 52.33px.

Components: `TerminalWindow` with a `bash` fence.

##### 4.6 Reset the Root Password

Source R6, corrected. "`passwd` with no argument changes the current user's
password, and that user is `root`", then a "servera console" terminal holding
a `text` fence: `bash-5.2# passwd`, `New password:`, `BAD PASSWORD: The
password is shorter than 8 characters`, `Retype new password:`, `passwd:
password updated successfully`. The four output lines are real (Round 5);
R6's echoed `redhat` is gone, since nothing echoes, which the next line says:
"Nothing echoes as you type the password". The `Callout` keeps R6's: "`root`
gets a warning for a short password, but the change still goes through".

Decision 19 asked for a `bash` fence; this slide uses `text`, because it holds
output, and a `bash` fence would colour the prompts and messages as shell
code. The prompt line is not a capture: the `init=/bin/bash` shell cannot be
reached over SSH, and the output lines were captured from the same `passwd`
on a normal boot. `check:slides`: 43.13px.

Components: `TerminalWindow` with a `text` fence, `Callout`.

##### 4.7 Trigger SELinux Relabeling

Source R7. "With no SELinux policy loaded, the new `/etc/shadow` from `passwd`
gets **no label**" and "An unlabeled `/etc/shadow` blocks logins once SELinux
enforces again" (both R7's, as RH134 states them), a "servera console"
terminal with `touch /.autorelabel`, and "Next boot, systemd sees
`/.autorelabel`, runs `restorecon` on every file, and reboots". That last line
replaces R7's blockquote and is verified from the relabel generator and
script (Round 5). The first build's two sentences each wrapped one word onto
a second line. `check:slides`: 52.33px.

Components: `TerminalWindow` with a `bash` fence.

##### 4.8 Hand Control to systemd

Source R8. "`reboot` is `systemctl`, which needs systemd, and systemd is not
running" (`/usr/sbin/reboot` links to `systemctl`, Round 5), "`exec` replaces
bash with systemd as PID 1, and the boot carries on", a "servera console"
terminal with `exec /sbin/init`, "The relabel runs, then the system reboots by
itself into a normal boot", and a warning `Callout`, "Not `exit`: that ends PID
1 and leaves the kernel without one" (Cert Guide chapter 18). How long the
relabel takes is console-only and unmeasured. `check:slides`: 45.92px.

Components: `TerminalWindow` with a `bash` fence, `Callout`.

##### 4.9 Exercise: Recover Root Access

Source R9 and `recover_root_access.sh`. Goal: "Lock `root` out of `servera`,
then get back in by booting with `init=/bin/bash`". Environment: "**Host:**
`servera`, with its VM console open" and "**Prerequisite exercise:** Change
Kernel Arguments", which unhides the menu. Workflow: lock the `root` account
and confirm a console login fails (Decision 18); boot once with
`init=/bin/bash` added at the GRUB2 menu; remount the root file system
read/write; reset the `root` password; schedule an SELinux relabel; hand
control to systemd and wait for the relabel and reboot; log in as `root` at
the console. R9's "The `root` password on `servera` has been changed" is
dropped, since step 1 locks the account instead. Its steps named the tools
(`exec /sbin/init`, `/.autorelabel`); the workflow now says what to do, as
`docs/course-authoring.md` asks. `check:slides`: 76.36px.

Components: `exercise`.

## Exercises

| # | Title                          | Frag | Host        | Command file                             |
|--:|--------------------------------|-----:|-------------|------------------------------------------|
| 1 | Change Kernel Arguments        |    1 | servera     | `change-kernel-arguments-exercise.sh`    |
| 2 | Switch systemd Targets         |    2 | workstation | `switch-systemd-targets-exercise.sh`     |
| 3 | Repair a File System at Boot   |    3 | servera     | `repair-file-system-at-boot-exercise.sh` |
| 4 | Recover Root Access            |    4 | servera     | `recover-root-access-exercise.sh`        |

Each declared title ends in "Exercise". The command files port the source's
four, rewritten to the current `kitty-demo` format.

**The chain on `servera`.** One pass, in order, with no resets:

1. `menu_auto_hide` unset; one boot with `ipv6.disable=1` typed at the menu,
   one without; the argument added with `grubby`, one boot with it, then
   removed (built; the running kernel keeps IPv6 off until the next boot)
2. (on `workstation`, independent of the chain; built, and its cleanup
   returns `workstation` to its start)
3. One `/etc/fstab` UUID broken, the emergency shell, the line fixed (built;
   `/etc/fstab` ends byte for byte as it started)
4. `root` locked, the password reset to `redhat` from `init=/bin/bash`, the
   relabel; cleanup sets `menu_auto_hide=1` again (Decision 16) (built)

At the end `/etc/fstab`, the boot entry's arguments, and the GRUB environment's
variables are back to their starting values; `/etc/shadow` holds a new hash of
the same password. `grubby` rewrites the entry file when it changes it, which
drops the trailing space the installer left on its `options` line, so the
file's checksum does not return to the snapshot's (verified).

**Console steps.** Every exercise has steps at the console. The command files
write them as `#!` notes, which `kitty-demo` shows only to the instructor, and
the written exercises describe them as prose (Decision 10). Since 2026-11-01
they are verified: on the instructor lab over the serial console (Round 6) and
on the SCC lab's VDI (Round 8). Under Decision 26 the `#!` notes become typed
lines; a trial of exercise 3 written that way recorded cleanly (Round 6, step
7), and the pattern for each reboot is under "Console delivery".

**Reboots.** Each reboot ends the SSH session; the command file reconnects
with `ssh servera` after a pause. Exercise 3 waits out systemd's 90-second
device timeout, and exercise 4 a full SELinux relabel, both at the console.

### Exercise 1, Change Kernel Arguments, built 2026-10-29

`change-kernel-arguments-exercise.sh` and `.html` in the topic's
`exercises/`; `kitty-demo --check` counts 59 presses. Steps as on 1.14. Ported
from `grub2_boot_loader.sh`, with these changes:

- `ipv6.disable=1` in place of `rhgb quiet` (Decision 13), checked with `cat
  /proc/cmdline` and `ip -br addr` (Decision 14) instead of watching boot
  messages, so each result shows in the SSH session and in the recording.
- The source checks the default entry with `grubby --info` before rebooting;
  that moved to step 5, where `grubby --info` shows the added argument.
- `sudo -i` after each reconnect where the step needs root; steps 3, 4, and 6
  read `/proc/cmdline` and `ip` as `student`.
- Pauses: 10 seconds on the intro (it runs past ten lines), 5 on each `list`,
  `cat /proc/cmdline`, `ip -br addr`, and `grubby --info`; 45 seconds after
  step 2's reboot, long enough for the instructor to stop the countdown and type
  the argument in the console; 25 after the other two reboots, for the
  five-second countdown and the boot.
- The console steps in step 2 are four `#!` notes, the last one saying to make
  the edit during the pause when recording.

The written exercise lists the console as a requirement, describes the GRUB2
editor in five numbered keystrokes with a note that <kbd>Esc</kbd> discards the
edit (GRUB's own help line says so), shows the two-line `ip -br addr` output
with IPv6 off, mentions the SCC lab's extra `enp0s3`, and ends by leaving the
menu visible for the later exercises. `check:exercises`: no violations.

Verified on `servera` on 2026-10-29 (Round 2): every step except step 2's
console edit, whose effect was verified separately by booting with the same
argument set through `grubby`.

### Exercise 2, Switch systemd Targets, built 2026-10-31

`switch-systemd-targets-exercise.sh` and `.html` in the topic's `exercises/`;
`kitty-demo --check` counts 61 presses. Steps as on 2.9, plus an unnumbered
"Clean up" step that sets `menu_auto_hide=1` again (Decision 16) and is left off
the slide, as `docs/course-authoring.md` asks. Ported from `systemd_targets.sh`,
with these changes:

- Step 1, unhiding the menu, is new (Decision 15), as in exercise 1.
- Step 2 keeps the source's `get-default` and `list-dependencies
  graphical.target`; the pager is left with `q` under `#@ noenter`.
- Step 3 checks the switch over SSH with `systemctl is-active
  graphical.target multi-user.target` (`inactive`, then `active`) and
  `get-default` (still `graphical.target`), so the result shows in the
  recording as well as on the console. The source checked `get-default` only.
- Step 4 reconnects and checks `get-default` and `is-active
  graphical.target` after the reboot.
- The source's step 5 ran seven `#!` notes together on one line and said "Open
  the workstation console and triggering a reboot"; each note is now its own
  line, and the reboot is a command. The root password is named, not written.
- The source's step 6 wrote `mount | grep ' / '` and `exit` as commands typed
  into the SSH session, which is down while `workstation` sits in the rescue
  shell. They are `#!` notes now, done at the console, and the command file
  reconnects afterwards and checks `systemctl is-active graphical.target`
  (`active`), which shows the boot continued.
- Pauses: 10 seconds on the intro, 5 on the `list`, `is-active`, and final
  `list`, 6 on the pager; 35 after step 4's reboot (SSH answered 28 seconds
  after `systemctl reboot` to `multi-user.target`, countdown included); 45
  after step 6's reboot for the edit and the boot to the rescue shell, and 45
  on step 7's header for the console work and the boot on to
  `graphical.target` (SSH answered 34 seconds after a reboot to
  `graphical.target`).

The written exercise names the VM window as a requirement, describes the GRUB2
edit in the same five numbered keystrokes as exercise 1, says the rescue shell
asks for the root password without quoting it, and describes the `rw` option
rather than printing the rescue shell's `mount` line, which I could not
capture. `check:exercises`: no violations.

Verified on `workstation` on 2026-10-31 (Round 3): every step over SSH,
including both reboots and the cleanup; step 6's menu edit and step 7's rescue
shell are console-only and unverified (Open question 1).

### Exercise 3, Repair a File System at Boot, built 2026-10-31

`repair-file-system-at-boot-exercise.sh` and `.html` in the topic's
`exercises/`; `kitty-demo --check` counts 35 presses. Steps as on 3.7. No
recording (Decision 10), so the pauses are only the intro's and those on
output. Ported from `repair_file_system_at_boot.sh`, with these changes:

- The `vim` edit moves by search, not by counting lines from the end: `/boot`,
  `0`, `E`, `azzz` (with `#@ noenter` on the last three), `#@ key escape`,
  `:wq`. Run against a copy of `servera`'s `/etc/fstab` with `vim -Es`, it
  appends `zzz` to exactly the `/boot` UUID (Round 4). It no longer depends on
  the `/dev/sr1` line being last, which also answers half of Open question 3.
  `jj:wq` is gone with it.
- The source's `cat /etc/fstab` after the edit is `grep /boot /etc/fstab`,
  which shows the changed line alone.
- The source ran its console steps together on one line each (`#! mount --all
  #! The error message ...`). Each step is now its own header, so the audience
  sees which step the console is on, with one `#!` note per line saying what
  to type there and what to look for.
- Step 3, checking `/` is read/write, is new (see 3.7).
- `systemctl reboot` from the emergency shell, not `reboot -f` (Decision 17).
- The closing check is `mount | grep /boot` as `student`, not the source's
  `cat /etc/fstab` and `mount | grep -v tmpfs`.

The written exercise names the VM window as a requirement, describes the
`vim` edit in four numbered keystrokes, quotes the `mount --all` error with
the UUID elided, points to `lsblk -fp` for the right UUID, and says there is
nothing to clean up when exactly the `zzz` is removed. It does not quote the
root password. `check:exercises`: no violations.

Verified on `servera` on 2026-10-31 (Round 4), over SSH: step 1's edit (on a
copy) and its effect on `mount --all` (on the real file), and steps 4 to 6's
commands with `/boot` still mounted. The console steps were verified on
2026-11-01, by hand over the serial console and in a `kitty-demo` trial
(Round 6), and on the VDI (Round 8).

Changed 2026-11-01 (Decision 31), from the VDI run. The written exercise's
step 2 now opens with "If the VM window shows a splash screen instead of boot
messages, press <kbd>Esc</kbd> to see them": the SCC lab's `servera` boots
with `rhgb quiet`, and Plymouth hid the wait until <kbd>Esc</kbd>. Step 7
now says that two red `Failed to connect to system scope bus via local
transport: No such file or directory` lines are expected after `systemctl
reboot` from the emergency shell, and that the reboot goes ahead; they
appeared on both labs. The command file gains matching `#!` notes in steps 2
and 7 (`kitty-demo --check`: 35 presses, unchanged). The written exercise's
"This time `mount --all` prints nothing" holds on the SCC lab; the instructor
lab, without `quiet`, also prints the kernel's `XFS (sda2): Mounting V5
Filesystem ...` line there (Rounds 6 and 8).

### Exercise 4, Recover Root Access, built 2026-10-31

`recover-root-access-exercise.sh` and `.html` in the ch13 topic's
`exercises/`; `kitty-demo --check` counts 30 presses. Steps as on 4.9, plus an
unnumbered "Clean up" step that sets `menu_auto_hide=1` again (Decision 16).
No recording (Decision 10). Ported from `recover_root_access.sh` and
`recover_root_access.md`, with these changes:

- Step 1 locks `root` (Decision 18) and checks the lock over SSH with `sudo
  passwd -S root` (`L`), then at the console with a `root` login that fails.
- The source's step 2 told the instructor to see the `.md` file, and its
  "3-6" ran four console commands together in one section. Every step is now
  its own header, with one `#!` note per line saying what to type at the
  console and what to look for, and step 3 adds `mount | grep root` to see
  the `rw`.
- Step 7 reconnects and checks `sudo passwd -S root` (`P`), which shows the
  lock is gone as well as the password set.
- Neither file writes the `root` password. The notes say "root's usual
  password", and the written exercise says "the `root` password the lab
  normally uses". The source wrote it out in four places; `AGENTS.md` allows
  that only in slide content.
- `recover_root_access.md`, the source's separate console walk-through, is
  folded into the written exercise.

The written exercise lists the console and the prerequisite exercise, quotes
`passwd -l`'s and `passwd`'s real messages, explains each of `reboot`, `exit`,
and `exec`, and ends by hiding the GRUB2 menu, which returns `servera` to the
week's start. `check:exercises`: no violations.

Verified on `servera` on 2026-10-31 (Round 5), over SSH: step 1's lock and its
`passwd -S` line, step 4's `passwd` output and its effect on the `!`, and step
7's `P`, all in a side test that restored `/etc/shadow` afterwards. The
`init=/bin/bash` boot and everything typed in it were verified on 2026-11-01
over the serial console (Round 6) and on the VDI (Round 8).

Changed 2026-11-01 (Decision 31): step 6 of the written exercise now says the
relabel takes "about two minutes on the SCC lab". It took 2 minutes 3 seconds
there (Round 8), against about 6 seconds on the instructor lab (Round 6).

## Console delivery

Decision 26, accepted 2026-10-31: present and record the console steps through
a serial console, attached with `virsh console` in the `kitty-demo`
Presentation window, and keep the VM's graphical console as the fallback. The
prototype ran on 2026-10-31 and 2026-11-01 and passed (Rounds 6 to 8; see
"Prototype results"). Its lab settings are on the instructor-lab copy on this
machine only, and the command files are not rewritten yet.

### Why

The instructor weighed it this way. For: the console appears in Kitty at a
presentable font size; the console steps can be recorded with the rest of the
exercise; and the demonstration is smoother, with no switching between
windows. Against: text may wrap differently in Kitty than on a student's
console; students use the VM window, so what they see differs slightly from
the recording; and the kernel line differs between the instructor lab, the
RHA lab, and the SCC lab. The recordings are worth it.

### How it works

Two settings on each instructor-lab VM. GRUB2 draws its menu and editor on
both the VGA console and the serial port (`GRUB_TERMINAL_INPUT` and
`GRUB_TERMINAL_OUTPUT` set to `console serial`, with `GRUB_SERIAL_COMMAND`).
The kernel line gains `console=tty0 console=ttyS0,115200`, with `ttyS0`
last, because the last `console=` becomes `/dev/console`: that is where
systemd's status lines, the rescue and emergency shells, the
`init=/bin/bash` shell, and the relabel output go. With the kernel console
on the serial port, systemd also starts a serial login prompt there.

The prototype added a third setting, a drop-in for `emergency.service` and
`rescue.service` on each VM, `serial-size.conf` in
`/etc/systemd/system/emergency.service.d/` and `rescue.service.d/`:

```ini
# Instructor lab only: the serial console in Kitty is 120x24
[Service]
TTYColumns=120
TTYRows=24
Environment=TERM=xterm-256color
```

Without it those two shells get `24 80` and `vt220` (Round 6): `vim` draws at
80 columns in a 120-column window and leaves stray characters, and without an
alternate screen `pnpm run casts` cannot clear the lab vimrc's whitespace
dots. The serial login and the `init=/bin/bash` shell need nothing, since
`agetty` and the kernel already give them `24 120`.

Two side effects. GRUB2's `12_menu_auto_hide` skips itself when either
terminal setting includes `serial`, so the menu shows on every boot and
`menu_auto_hide` does nothing on these VMs; the exercises' `grub2-editenv`
steps still run and print the same. And `grubby --update-kernel=ALL --args`
also appends to `GRUB_CMDLINE_LINUX`, so no separate edit of
`/etc/default/grub` is needed.

During an exercise, the Presentation window attaches with `virsh -c
qemu:///system console servera` after a reboot (plain `virsh` connects to the
session URI and finds no VM), the console steps are typed there by
`kitty-demo` like any other step, and `#@ key ctrl+]` detaches before `ssh
servera` reconnects. GRUB2 draws its menu about 1.7 seconds after the
reboot's Enter, and draws it only once, so the attach must come first. Record
mode waits 3 seconds between typing a command and its Enter, too long here,
so each reboot that needs the menu uses this pattern, which attached 0.6
seconds after the Enter in the second trial (Round 6):

```sh
#@ pause 0.5
systemctl reboot
#@ noenter
#@ pause 0
virsh -c qemu:///system console servera
#@ key enter
```

Then a short `#@ pause` and the keys for the menu. Live, press
<kbd>F2</kbd> quickly; if the countdown is missed, reboot again (Decision
28). The words on screen are the same programs' output that students see in
their VM windows; the frame, the wrapping, and the kernel line are not.

Known on 2026-10-31, read-only through `pnpm lab` on the lab copy on this
machine: both `servera` and `workstation` already have a serial port (`ttyS0
at I/O 0x3f8 ... is a 16550A` in the kernel log), `/proc/consoles` lists only
`tty0`, `/etc/default/grub` has `GRUB_TERMINAL_OUTPUT="console"` and no serial
settings, and `serial-getty@ttyS0` is inactive. `virsh`, `virt-viewer`, and
`virt-manager` are installed on the machine that runs both the VMs and Kitty.

### Fallback

The VM's graphical console in `virt-viewer`, full screen or beside the
Presentation window, with scaling on so the 8x16 VGA text is readable. The
command files keep working: at a console step, step past the console lines
with <kbd>F3</kbd> and type them in the VM window. Use it when the serial
console misbehaves in class.

It is a partial fallback (Round 6). With `ttyS0` as `/dev/console`, the VM
window shows only kernel messages: systemd's status lines and the start job's
countdown go to the serial port alone. `sulogin` prompts on every console, so
the rescue and emergency shells can be reached from the VM window, but the
`init=/bin/bash` shell opens on `/dev/console` only. To fall back for exercise
4, delete `console=ttyS0,115200` in the GRUB2 editor for that boot, which is
what 4.4's "Remove any `console=` options" does.

### Prototype plan

On the lab copy on this machine, so the home lab stays as it is. Everything
below is undone by `start-latest-snapshot servera workstation`. `virsh
console` is interactive, so the instructor runs it; I can prepare the exact
commands and a trial command file (see Open question 1 for the alternative).

1. **Baseline.** `virsh dumpxml servera` shows a `<serial>` and a `<console>`
   device. Record the SHA-256 of `/etc/default/grub`, `grub.cfg`, `grubenv`,
   and the boot entry files, as in Round 2.
2. **GRUB2 on serial only.** Set `GRUB_TERMINAL_INPUT="console serial"`,
   `GRUB_TERMINAL_OUTPUT="console serial"`, and `GRUB_SERIAL_COMMAND="serial
   --unit=0 --speed=115200"`, then `grub2-mkconfig -o /boot/grub2/grub.cfg`,
   and confirm the boot entry files did not change. Reboot with `virsh console
   servera` attached in Kitty at the presentation font size, and check:
   - the menu, its help lines, and the countdown appear and are readable;
   - any key stops the countdown, the arrows move, `e` opens the editor;
   - <kbd>End</kbd> reaches the end of the `linux` line (or <kbd>Ctrl</kbd>+<kbd>E</kbd>),
     <kbd>Ctrl</kbd>+<kbd>X</kbd> boots, <kbd>Esc</kbd> discards;
   - how the frame and arrows render, and where the `linux` line wraps.

   Capture the editor's text here, before step 3 changes the kernel line: it
   is the text Decision 11 wants for 1.4, 2.8, and 4.4, and it still matches
   the SCC lab's arguments.
3. **The kernel on serial.** `grubby --update-kernel=ALL --args="console=tty0
   console=ttyS0,115200"`, and the same in `GRUB_CMDLINE_LINUX` so a future
   kernel inherits it. Reboot attached, and check: kernel and systemd messages
   reach Kitty; a serial login prompt appears; `stty size` after logging in;
   colours.
4. **Exercise 3 by hand over serial**, the most console-heavy: the 90-second
   wait, the emergency banner, whether `sulogin` prompts on both consoles,
   `mount | grep root` (`rw`?), `vim /etc/fstab` at Kitty's size, `systemctl
   daemon-reload`, `mount --all`, and `systemctl reboot` (Decision 17).
5. **Exercise 4 by hand over serial**: the console login as a locked `root`;
   `init=/bin/bash` added with `ttyS0` kept; the `bash-5.2#` prompt and any
   job-control warnings; `mount -o remount,rw /`; `passwd`; `touch
   /.autorelabel`; `exec /sbin/init`; the relabel's output and length; the
   automatic reboot; the console login as `root`.
6. **Exercise 2's console steps on `workstation`**: the same two settings,
   then `systemd.unit=rescue.target`, the rescue banner (with `rhgb quiet` and
   Plymouth on that host), `mount | grep ' / '`, and `exit`.
7. **`kitty-demo` integration.** A trial copy of exercise 3's command file
   with the console steps as real lines: `virsh console servera` after the
   reboot, `#@ key` for <kbd>e</kbd>, the arrows, <kbd>End</kbd>, and
   <kbd>Ctrl</kbd>+<kbd>X</kbd>, and `#@ key` for `Ctrl+]` to detach (whether
   Kitty's `send-key` accepts `ctrl+]` is to verify). Run it live, then with
   `--record`; process it with `pnpm run casts`, check it with `--check`, and
   play it back. Note whether the cast sanitizer accepts `virsh`'s
   `Connected to domain` lines and how wide lines wrap in the player.
8. **Compare with the VDI.** The same exercise 3 steps on the SCC lab, with
   screenshots, and a list of what differs from the cast. This doubles as
   Open question 1's VDI dry run.

Exit criteria: the GRUB2 menu and editor readable and fully drivable from
`kitty-demo`; all three shells usable, `vim` included; one cast that processes
cleanly and reads well in playback. If one step fails, that step falls back to
the graphical console and the rest stays on serial.

Record the results under "Verification" as a new round, then revert or keep
(step 9).

9. **Keep it.** Make the change permanent on both instructor-lab copies: a new
   snapshot after the change, or the change added to the lab's build
   automation, since `start-latest-snapshot` otherwise undoes it.

### Prototype results

Run 2026-10-31 and 2026-11-01; details under "Verification", Rounds 6 to 8.

1. **Baseline:** passed. `servera` has a `pty` serial device and console.
2. **GRUB2 on serial:** passed. Menu and editor readable at the presentation
   size; any key, the arrows, <kbd>e</kbd>, <kbd>End</kbd>,
   <kbd>Ctrl</kbd>+<kbd>E</kbd>, <kbd>Esc</kbd>, and
   <kbd>Ctrl</kbd>+<kbd>X</kbd> all work. The menu now always shows.
3. **The kernel on serial:** passed. Colour only in systemd's and
   `systemctl`'s output on the serial login (`vt220`); accepted (Decision 27).
4. **Exercise 3 by hand:** passed, after the size and `TERM` drop-in.
5. **Exercise 4 by hand:** passed.
6. **Exercise 2's console steps on `workstation`:** passed.
7. **`kitty-demo`:** passed on the second trial, with the attach pattern
   above. `#@ key ctrl+]` works, and the cast processes and checks cleanly.
8. **The VDI:** done by the instructor (Round 8); the differences that matter
   to students went into the written exercises and 3.2a (Decision 31).
9. **Keep it:** not done; decided 2026-11-01 (Decision 32). The settings go
   into `/source/rhel-lab/configure_vms.yml`, for all four VMs, and
   the instructor takes the new snapshot. Nothing is applied by hand. The
   prototype's changes on this lab copy (and the backups in
   `/root/w12-serial-backup/` on `servera` and `workstation`) are discarded by
   the `start-latest-snapshot -a` that comes before the playbook runs.

### What changes in week 12 if it is implemented

Slides (students' view is unchanged, so no slide has to change):

- **1.3, 1.4, 4.4, 3.2a:** done another way on 2026-11-01. The VDI
  screenshots replaced the placeholders (Round 8), which shows students their
  own lab; the serial captures stay unused.
- **4.4:** "Remove any `console=` options" conflicts with what the recording
  shows, since the instructor keeps `ttyS0`. Keep RH134's wording and say why
  on camera, or reword the step. Your call.
- **Recording slides:** 1.14a and 2.9a as planned, plus new **3.7a** and
  **4.9a** for exercises 3 and 4.
- Fragment 1's `grubby --info` transcripts (1.5, 1.8, 1.9) stay as captured,
  without `console=`. Any later recapture on a changed lab would show the
  extra arguments, so recapture with them removed or keep the old captures.

Command files (all four change; each needs a new `kitty-demo --check`, a live
run, and new pauses):

- **`change-kernel-arguments-exercise.sh`:** step 2's four console notes
  become `virsh console servera`, `#@ key` lines for the countdown, `e`, the
  arrows, and <kbd>End</kbd>, the typed ` ipv6.disable=1` under `#@ noenter`,
  `#@ key ctrl+x`, the detach, and `ssh servera`. The 45-second pause for a
  manual edit goes. Its `cat /proc/cmdline` and `grubby --info` output in the
  recording will include the `console=` arguments.
- **`switch-systemd-targets-exercise.sh`:** step 6's GRUB2 edit the same way
  with `systemd.unit=rescue.target`; step 7's `mount | grep ' / '` and `exit`
  typed in the rescue shell; the two 45-second pauses become waits for the
  boot.
- **`repair-file-system-at-boot-exercise.sh`:** steps 2 to 7 typed in the
  emergency shell, including the `vim` keystrokes that remove `zzz`, with a
  pause long enough for the 90-second device timeout. The trial in the
  scratchpad (Round 6) is the template: the attach pattern, `#@ pause 105` on
  the attach's Enter (the prompt came 94 seconds after it), the password, a
  `clear` before every console header, `/zzz`, `3x`, `:wq`, and `#@ key
  ctrl+]` 30 seconds after the last reboot.
- **`recover-root-access-exercise.sh`:** step 1's failed console login, step
  2's GRUB2 edit, steps 3 to 6 at `bash-5.2#`, a pause for the relabel (about
  6 seconds on the instructor lab, then the boot), and step 7's console login.
- **The `root` password** is typed as an ordinary line at each prompt
  (Decision 29). It does not echo, so a cast does not show it.
- **Device names in notes.** Keep exercise 3's notes free of `/dev/sda2`:
  a console-attached boot names the OS disk `sdd` about one time in four
  (Round 7). Re-record a take that shows `sdd2`.

Written exercises: three notes added on 2026-11-01 (Decision 31), for what
students see on the SCC lab; nothing about the serial console.

This plan: Decision 10 (recordings for all four exercises), "Answer in brief"
and "File inventory" (50 slides; fragment 3 has 9 and fragment 4 has 10; a
`.cast` for every exercise), "Additions" (3.7a and 4.9a), the exercise
entries under "Exercises", and Open question 5. The "Verification" rounds are
written (Rounds 6 to 8).

Outside week 12:

- **Both instructor-lab copies:** the GRUB2 and kernel settings and the two
  drop-ins on all four VMs, through `/source/rhel-lab/configure_vms.yml`,
  then a new snapshot taken by the instructor (Decision 32).
- **`AGENTS.md`:** widen the credential allowance to cover the lab's `root`
  and `student` passwords in command files (Decision 29), with the matching
  line in `docs/course-authoring.md`. Not done.
- **`docs/lab-environments.md`:** done on 2026-11-01: the disk-name
  correction (Decision 30), and the differences Rounds 6 to 8 found (the
  boot screen and kernel line, the volume group names, the prompt and `vim`,
  `plymouth`, SCC's boot and relabel times, and the instructor lab's serial
  ports). Still to add with step 9: the serial settings themselves
  (`console=tty0 console=ttyS0,115200`, GRUB2's serial terminal, the
  drop-ins), and RHA's kernel line (`console=tty0 console=ttyS0,115200n8` in
  the RHA capture on 4.4's source).
- **`docs/course-authoring.md`:** "Recording an exercise" gains how console
  steps are recorded through `virsh console`: the attach pattern, the
  password lines, and the detach.
- **`kitty-demo`:** nothing. `#@ key ctrl+]` works (Round 6), and no password
  directive is needed.
- **Agent access, optional:** if you want me to drive the serial console for
  verification, a wrapper like `pnpm lab` that allows only the four lab
  domains, with matching approval rules in `.codex/rules/default.rules`,
  `.claude/settings.json`, and `.agents/settings.json`.

## Additions

Accepted 2026-10-29 (Decisions 7, 8, 12, 14, 15, 16, 21, 22):

1. **Slide 1.1a, What Is GRUB2?** (O8), the GRUB2 section's intro. Built.
2. **Slide 1.2a**, the second half of the split boot diagram (Decision 8).
   Built.
3. **`cat /proc/cmdline` on 1.4** (Decision 14), as a sentence. Built, then
   replaced on 2026-11-01 by slide 1.4a (item 8).
4. **Slide 2.8a, systemd Target Commands** (O6), optional (Decision 21).
   Built.
5. **Slide 3.2a, What a Failed Boot Looks Like** (Decision 12). Built, with
   the two captures as placeholders.
6. **Recording slides** for the exercises Decision 10 gives casts. The source
   has none.
7. **Unhiding `workstation`'s menu in exercise 2** (Decision 15), and hiding
   both menus again in cleanup (Decision 16). Built for `workstation`.

Accepted 2026-11-01 (Decision 31):

8. **Slide 1.4a, Check the Running Kernel's Arguments**, so `/proc/cmdline`
   is taught before exercise 1 uses it. Built.
9. **`passwd -S` on 4.3**, which exercise 4 uses in steps 1 and 7. Built.
10. **Notes in the written exercises** for what the SCC lab shows: the splash
    screen and <kbd>Esc</kbd> (exercise 3, step 2, and on 3.2a), the two red
    D-Bus lines (exercise 3, step 7), and the relabel's two minutes
    (exercise 4, step 6). Built.

Also in fragment 2, within existing slides rather than as new ones: the
`workstation` terminal on 2.5, the closing line on 2.6, the third bullet on
2.7, and the `Callout` explaining `●` and `○` on 2.4.

## Corrections

Verified on the lab where marked; the rest are typos, logic, or to verify.

- B3: `*` marks the highlighted entry, not the default (verified 2026-11-01:
  on the serial console the `*` moves with the arrow keys, and the VDI menu
  shows it on the highlighted entry; Rounds 6 and 8).
- B5, B6, B8, B9, B11: output from an older build (machine ID
  `f0523084...`, swap UUID `f60c96c7...`); the instructor lab now prints
  `62e8bf6f...` and `c0d07a5b...` (verified). B8 and B9 elide and comment
  inside the output.
- B8: `rhgb` needs `plymouth`, which the lab servers do not have (verified),
  so only `quiet` changes the console. That is the instructor lab: the SCC
  lab's `servera` already boots with `rhgb quiet` and shows a Plymouth splash
  (Round 8), so 1.8's example adds what SCC has and 1.9's removes it.
  Exercise 1 uses `ipv6.disable=1` instead (Decision 13), so no student
  changes it.
- B12: the menu also hides when `boot_indeterminate=1`, and only after a
  successful boot as `grub-boot-success.timer` defines one (verified in
  `grub.cfg` and the unit).
- B13: `grubby --set-default-index` writes `saved_entry` in `grubenv`
  (verified: `GRUB_DEFAULT=saved`), so the table's "Stored in" row is wrong
  for the default.
- B17: "most filesystems mounted read/write" for `rescue.target` is the local
  file systems: it needs `sysinit.target`, hence `local-fs.target`, but not
  `remote-fs.target` (verified in the unit files).
- B18: `firewalld` and `NetworkManager` are not the first units under
  `multi-user.target` on RHEL 10; `audit-rules` and `auditd` are (verified).
- B22: a bad `/etc/fstab` line is not a job for `rescue.target`, which needs
  `local-fs.target`; systemd falls back to `emergency.target` (unit files,
  RH134). "Services: None" for emergency is softened to "Almost none".
- B25: a missing mount point does not stop the boot: the mount unit creates
  the directory (verified, Round 4; RH134 says otherwise). XFS is not checked
  at boot: `fsck.xfs` is a stub (verified, and RH134).
- B26: `rhel_servera_root` is `rhel_servera-root` (verified); the second
  fence title carries an em dash.
- B27: `mount --all` prints a second line, the `dmesg(1)` hint, and exits 32
  (verified).
- B28, B30: `systemctl reboot` on the slide, `reboot -f` in the exercise;
  `systemctl reboot` kept (Decision 17).
- B29: `/dev/sda2` is the lab's XFS `/boot`, so `fsck.ext4 -p /dev/sda2` is
  wrong (stand-ins `/dev/sdb1` and `/dev/sdb2` now); "Filesystem" becomes "file system".
- B30: "pre-configured with a broken `/etc/fstab` entry" contradicts step 0.
- B23 and its command file: `workstation`'s menu is never unhidden, so step 5
  cannot be done as written unless someone catches a one-second hidden
  timeout. Its step 6 types `mount` and `exit` into an SSH session that the
  rescue boot has closed (fixed in exercise 2).
- R2: "cannot be done remotely": a remote console can.
- R3: RHEL 10 writes yescrypt (`$y$`), not `$6$rounds=4096$`; `passwd -l`
  prints "passwd: password changed." (verified on a throwaway user, and on
  `root` in Round 5). R3's claim that a new password removes the `!` holds
  (Round 5).
- R6: the typed password is not echoed; the rest of R6's output matches RHEL
  10's `passwd` exactly (Round 5).
- R9: the slide says the password was changed; the command file locks the
  account.
- Command files: `jj:wq`; notes run together; "Open the workstation console
  and triggering a reboot"; exercise 3's `#^ 1-2` header has no command after
  it before the next header.
- Every em dash in the source copy (about a dozen) is rewritten.

## Not ported

- **O10, `/etc/default/grub` and `grub2-mkconfig`.** RH134 for RHEL 10
  teaches `grubby`; the Cert Guide still teaches the file and
  `grub2-mkconfig -o /boot/grub2/grub.cfg`. One trap if it comes back: on
  RHEL 10, `grub2-mkconfig` leaves the kernel command line in the BLS entries
  alone unless given `--update-bls-cmdline` (the option exists, verified with
  `--help`; its effect is to verify), so editing `GRUB_CMDLINE_LINUX` and
  running `grub2-mkconfig` as the Cert Guide shows may change nothing. Easy
  to add as 1.13a.
- **O7 and O11, "Demo"**, placeholders for live demonstrations.
- **The ODP's Office icons and stock photograph, and the logos.** See
  "Third-party images".
- **The `global-bottom.vue` footer and the source's custom layouts**
  (`compact-two-cols-header`, `two-cols-header-footer`).
- **B2's presenter notes as notes.** Their content goes onto 1.2 and 1.2a; no
  slide carries notes.
- **RH134 topics the source does not cover**: resetting the root password from
  rescue media (RH134's recommended method), `lsinitrd`, `systemctl poweroff`
  and `halt`, and the `nofail` mount option. **Cert Guide topics**: `rd.break`,
  `dracut --force`, `grub2-install`, and rescue disks.

## Fitting the class period

Rough costs, not measured: about 45 slides at a minute or so each, and four
exercises that each reboot at least once. On the VDI a reboot is slower than
the instructor lab's few seconds. Exercise 1 about 12 minutes (three reboots),
exercise 2 about 12 (two reboots of `workstation` plus rescue), exercise 3
about 8 plus the 90-second timeout, and exercise 4 about 10 plus the relabel.
That is roughly two hours, inside the 2.5-hour class with little margin.

Candidates if it runs long, with what each loses:

- **Drop exercise 1's second reboot** (booting again without editing). Loses
  the proof that a menu edit lasts one boot; 1.4 still says so.
- **Drop exercise 1's third reboot** and check with `grubby --info` alone.
  Loses the proof that the argument reached the kernel.
- **Run exercise 2 as a demonstration.** Loses hands-on targets; nothing later
  depends on it.

Accepted 2026-10-29: cut nothing until the week is built (Decision 24).

## Verification

All on 2026-10-29 through `pnpm lab`. `servera` was up; `workstation` did not
answer `ping` at first, so the first baseline and Round 1 cover `servera`
only. `servera`'s clock reads
2026-10-19, ten days behind the host, as after a snapshot revert.

**Baseline**, read-only:

- RHEL 10.0 (Coughlan), kernel `6.12.0-55.9.1.el10_0`, `grub2-tools-2.12-14`,
  `grubby-8.40-77`, `systemd-257-9.el10_0.1`, `bash` 5.2.26 (so the
  `init=/bin/bash` prompt should read `bash-5.2#`).
- Two boot entries: index 0 the kernel, index 1 the rescue kernel
  (`0-rescue-62e8bf6f...`). `grubby --default-index` prints `0`;
  `--default-kernel` prints `/boot/vmlinuz-6.12.0-55.9.1.el10_0.x86_64`;
  `--info` prints the same seven fields as the source.
- `grub2-editenv - list`: `saved_entry`, `menu_auto_hide=1`, `boot_success=1`,
  `boot_indeterminate=0`. `/etc/default/grub` has `GRUB_TIMEOUT=5`,
  `GRUB_DEFAULT=saved`, `GRUB_TERMINAL_OUTPUT="console"`, and no `rhgb
  quiet`. `/proc/cmdline` has no `console=` options. `plymouth` is not
  installed.
- `grub.cfg`'s `10_reset_boot_success` and `12_menu_auto_hide` sections, and
  `grub-boot-success.timer` (`OnActiveSec=2min`), as under 1.12.
- `systemctl get-default`: `multi-user.target`, a link to
  `/usr/lib/systemd/system/multi-user.target`. `list-dependencies
  graphical.target` as under 2.4. `display-manager.service`, `gdm`, and
  `gnome-shell` are absent. `AllowIsolate=yes` on 22 targets, including
  `rescue` and `emergency`.
- `/etc/fstab`: root, `/boot`, and swap by UUID, and `/dev/sr1 /mnt/dvd
  iso9660 defaults,nofail 0 0` last. Root is `rw`.
- `root`: `P` (password set), SELinux `Enforcing`, no `/.autorelabel`,
  `/sbin/init` links to `../lib/systemd/systemd`. `ENCRYPT_METHOD YESCRYPT`.
- `grub2-mkconfig --help` lists `--update-bls-cmdline`.

**Round 1**, side tests, each restored:

- `mount --all --fstab <scratch file>` with a missing mount point and with a
  mistyped UUID, as under 3.4. The scratch file and a scratch directory in
  `/tmp` were removed; `/etc/fstab` was never touched.
- A throwaway user, `w12probe`: `passwd -l` prints "passwd: password
  changed.", the hash gains a single `!`, and `passwd -S` reports `L`. An
  attempt to capture `passwd`'s interactive prompts by piping input through
  `pnpm lab -- --tty` hung waiting for input and was stopped; capture those at
  the console instead. Restored: the user deleted with `userdel -r`, and its
  lines removed from the `-` backup copies (`/etc/passwd-`, `shadow-`,
  `group-`, `gshadow-`, `subuid-`, `subgid-`) that `useradd` and `userdel`
  rewrote; afterwards no file under `/etc`, `/var/spool`, or `/home` named it.
  The backup files' timestamps differ from the snapshot's.

**Revert.** Later on 2026-10-29 the instructor ran `start-latest-snapshot
-a`, which reverted every host, including Round 1's backup-file edits.
`workstation` came up with it.

**Round 2**, 2026-10-29, after the revert. Baseline re-read on both hosts,
with SHA-256 sums of `/etc/fstab`, `/etc/default/grub`, `grubenv`, and the two
entry files:

- `servera` as in the first baseline; its clock read 2026-10-17 until the
  first reboot.
- `workstation`: `graphical.target` default and active, `gdm` and `plymouth`
  installed, and `rhgb quiet` already on its kernel line (it was installed with
  a graphical environment, `servera` was not). `grubenv` as `servera`'s, with
  `menu_auto_hide=1`.

Side tests for fragment 1's slides on `servera`, each restored. The four files
were copied to `/root/w12-backup/` first and copied back after; all four
checksums then matched the round's baseline:

- `grubby --set-default-index 0` prints "The default is
  /boot/loader/entries/62e8bf6f...-6.12.0-55.9.1.el10_0.x86_64.conf with index 0
  and kernel /boot/vmlinuz-6.12.0-55.9.1.el10_0.x86_64"; index 1 prints the
  rescue entry's line, and `grub2-editenv - list` then shows
  `saved_entry=62e8bf6f...-0-rescue` (the basis for 1.13's callout).
- `grubby --update-kernel ... --args="rhgb quiet"` and `--remove-args` print
  nothing and exit 0; `--info` shows `rhgb quiet` at the end of `args`, then
  gone. `/etc/default/grub` is untouched. The entry file comes back without the
  installer's trailing space on its `options` line.
- `grub2-editenv - unset menu_auto_hide` prints nothing; `list` then shows
  three variables.
- **A mistake, restored.** The first attempt piped a script into `pnpm lab --
  --tty servera sudo bash -s`, which ran it as an interactive shell, slowly,
  and my 90-second `timeout` killed the local side partway. The remote shell
  kept going and ran the rest of the script, including the `--args`,
  `--remove-args`, `unset`, and `set` steps, without my seeing the output.
  `grubenv` came back with its variables reordered and the entry file without
  its trailing space; both were restored from the backup and the checksums
  matched. Scripts now go through a single non-interactive command (see
  "Authoring notes").
- **`ipv6.disable=1`** (Decision 13), set with `grubby` and booted once:
  `systemctl is-system-running` reports `running`, no unit failed, `ip -br
  addr` shows `lo` with `127.0.0.1/8` and `enp0s8` with `172.25.250.10/24` and
  no IPv6 addresses, and `sshd` listens on `0.0.0.0:22`. The only complaint in
  the journal was chronyd's "Could not open command socket on [::1]:323",
  which does not affect time sync. Removed, rebooted, and the IPv6 addresses
  came back; the entry file was restored from the backup.
- **`boot_success`**: each boot resets it to 0. An SSH session of 130 seconds
  left it at 0 (the timer's one-minute accuracy); one of 200 seconds set it to
  1 at 2 minutes 12 seconds, through `grub-boot-success.service` in the
  session's user manager. So a student who reboots within about two minutes of
  logging in sees the menu even with `menu_auto_hide=1`.

**Exercise 1's chain run.** Steps 1 and 3 to 7 of the command file on
`servera`, in order; step 2's reboot ran without the console edit. Outputs as
in the written exercise.

**Round 3**, 2026-10-31, on a second copy of the instructor lab on another
machine, the one `pnpm lab` reached that day. It runs the same RHEL 10.0
kernel and package versions as Rounds 1 and 2 and the same disk layout, but has
its own machine IDs and UUIDs (`servera`'s machine ID is `4add9bf2...`, not
`62e8bf6f...`), so fragment 1's transcripts do not match it while fragment 2's,
which carry neither, do. Its clocks matched the host's.

Baseline, read-only:

- `servera`: BIOS; `/dev/sda` is GPT (`pmbr_boot`), partition 1 a 1 MB BIOS
  boot partition (`bios_grub`), partition 2 the 1 GB XFS `/boot`, partition 3
  LVM. This is the layout `docs/lab-environments.md` gives for the SCC and
  instructor labs, and it is the basis for Decision 25. `grubenv` with
  `menu_auto_hide=1`, default `multi-user.target`, so the copy is at the
  snapshot, not at exercise 1's end state.
- `workstation`: BIOS, `graphical.target` default and active, `gdm` active
  (`display-manager.service` is an alias for it), `menu_auto_hide=1`, `root`
  `P`, SELinux `Enforcing`, `rhgb quiet` on its kernel line.

Slide captures, each restored:

- `systemctl list-dependencies graphical.target` on `servera`: the lines on
  2.4; 113 lines in all. On `workstation` the tree starts with
  `accounts-daemon` and `gdm.service`, both active.
- `systemctl get-default`: `multi-user.target` on `servera`,
  `graphical.target` on `workstation`.
- `systemctl set-default graphical.target` on `servera`: the two lines on 2.6,
  exit 0. Restored with `set-default multi-user.target`; the link points at
  `/usr/lib/systemd/system/multi-user.target` again, with a new timestamp.
- `systemctl list-units --type target`: 23 loaded units on `servera`, 24 with
  `graphical.target` on `workstation`.

Unit files and binaries behind 2.3 and 2.8, read on `servera`:

- `rescue.target` requires `sysinit.target` and `rescue.service`;
  `emergency.target` requires only `emergency.service`.
  `systemd-remount-fs.service`, which remounts root read/write, is wanted by
  `local-fs.target`, which `sysinit.target` pulls in. `rescue.target`'s tree
  includes `systemd-journald`, `systemd-udevd`, `local-fs.target`, and
  `swap.target`, and no `NetworkManager`. All four boot targets carry
  `AllowIsolate=yes` among 22 targets.
- Both shells run `systemd-sulogin-shell`, whose banner reads: `You are in %s
  mode. After logging in, type "journalctl -xb" to view system logs,
  "systemctl reboot" to reboot, or "exit" to continue bootup.` It names
  `default.target`, which it starts when the shell exits. `sulogin` prompts
  `Give root password for maintenance` / `(or press Control-D to continue):`,
  and also carries `Cannot open access to console, the root account is
  locked.`, which bears on fragment 4: with `root` locked, neither repair
  shell lets anyone in.

Exercise 2 on `workstation`, every step over SSH, run as scripts sent in one
argument:

- `grub2-editenv - unset menu_auto_hide`, exit 0.
- `systemctl isolate multi-user.target` prints nothing and exits 0; the SSH
  session survives; `is-active graphical.target multi-user.target` prints
  `inactive` and `active` (exit 0, since one is active); `gdm` is `inactive`;
  `get-default` still prints `graphical.target`.
- `set-default multi-user.target` prints its two lines. Reboot: ping after 7
  seconds, SSH after 28, the five-second countdown included. Then
  `get-default` prints `multi-user.target` and `is-active graphical.target`
  prints `inactive` (exit 3), as `student`.
- `sudo systemctl set-default graphical.target`, then a reboot standing in for
  step 6's: SSH after 34 seconds; `graphical.target` and `gdm` active.
- Cleanup: `grub2-editenv - set menu_auto_hide=1`, exit 0. The list holds the
  same four variables as before, with `menu_auto_hide` now last.
- A side test for 2.6: `set-default multi-user.target` left `graphical.target`
  and `gdm` active; restored with `set-default graphical.target`.
- `mount | grep ' / '` on a normal boot prints
  `/dev/mapper/rhel_workstation-root on / type xfs (rw,relatime,seclabel,...)`.

Restored: `workstation`'s default link points at `graphical.target`, its
`grubenv` has `menu_auto_hide=1`, and the backup of `grubenv` I copied to
`/root` first was removed. `servera`'s default link points at
`multi-user.target`.

**Round 4**, 2026-10-31, on the Round 3 lab copy, `servera` only. One script,
sent in one argument, with a trap that restored everything on exit; the
baseline is the same as Round 3's.

- `/etc/fstab` (SHA-256 `347cab0d...`): root, `/boot`, and swap by UUID, all
  with `0 0`, and `/dev/sr1 /mnt/dvd iso9660 defaults,nofail 0 0` last, as on
  the home copy. `/boot` is `/dev/sda2`, UUID `5c381752-...`.
- Timeouts: `DefaultTimeoutStartUSec=1min 30s`, and `boot.mount` and
  `dev-sda2.device` carry a 90-second running timeout, so the wait on 3.2 and
  3.2a is the default. `local-fs.target` has `OnFailure=emergency.target`.
- `systemd-remount-fs.service`, which remounts `/` read/write, runs before
  `local-fs-pre.target` and `local-fs.target`, so by the time a `/boot` mount
  fails, `/` is already read/write; `emergency.target` alone never pulls it in
  (Round 3). That is the basis for 3.3's two claims.
- `fsck.xfs` is a shell script; run by hand on a device it prints "If you
  wish to check the consistency of an XFS filesystem or repair a damaged
  filesystem, see xfs_repair(8)." and exits 0.
- `mount | grep root` and `mount | grep ' / '` both print only the root line;
  `mount | grep /boot` prints `/dev/sda2 on /boot type xfs (rw,...)`.
- **A mistyped `/boot` UUID**, in the real `/etc/fstab` (`zzz` appended with
  `sed`, then `systemctl daemon-reload`): `mount --all` prints `mount: /boot:
  can't find UUID=5c381752-9fdd-458f-976f-240db85ec6a4zzz.` and exits 32, while
  `/boot` stays mounted (`boot.mount` keeps `What=/dev/sda2` and stays
  active). With the file restored and systemd reloaded, `mount --all` prints
  nothing and exits 0.
- **A missing mount point**, with a scratch XFS file system on `/dev/sdb` and a
  line for `/mnt/w12probe` added to `/etc/fstab`: `mount --all` fails with
  `mount: /mnt/w12probe: mount point does not exist.` and the `dmesg(1)` line,
  exit 32. After `systemctl daemon-reload`, `systemctl start
  mnt-w12probe.mount`, the unit the boot would start, exits 0, creates the
  directory, and mounts it.
- **`xfs_repair`** on that file system while mounted: "contains a mounted and
  writable filesystem", "fatal error -- couldn't initialize XFS library",
  exit 1. Unmounted: Phases 1 to 7 and `done`, exit 0.
- **`fsck.ext4 -p`** on a fresh ext4 file system on `/dev/sdc`: `/dev/sdc:
  clean, 11/327680 files, 42078/1310720 blocks`, exit 0.
- Exercise 3's `vim` keystrokes on a copy of `/etc/fstab` in `/tmp`, through
  `vim -Es` with the system `vimrc`: only the `/boot` line changed, its UUID
  now ending in `zzz`. The copy was removed.

Restored: `/etc/fstab` copied back from its backup (checksum matches),
systemd reloaded, `/mnt/w12probe` unmounted and removed (no unit left),
`/dev/sdb` and `/dev/sdc` wiped (`wipefs` and `blkid -p` find no signature),
and the backup removed from `/root`.

**Round 5**, 2026-10-31, on the Round 3 lab copy, `servera` only. One script
with a trap; `/etc/shadow` and `/etc/shadow-` were copied to `/root` first.
No hash was printed beyond its first eight characters.

- `bash` 5.2.26, so the `init=/bin/bash` prompt is `bash-5.2#`.
  `/sbin/init` links to `../lib/systemd/systemd`; `/usr/sbin/reboot` links to
  `../bin/systemctl`.
- `/proc/cmdline` starts `... root=/dev/mapper/rhel_servera-root ro ...` and
  has no `console=` options.
- `root` before: `passwd -S` prints `root P never 0 99999 7 -1`; the hash
  starts `$y$j9T$`; `/etc/shadow` is `shadow_t`; `ENCRYPT_METHOD YESCRYPT`;
  SELinux enforcing. `passwd` belongs to `shadow-utils-4.15.0-5.el10`.
  `grep root /etc/shadow` matches one line, `root:<hash>::0:99999:7:::`.
- `passwd -l root`: `passwd: password changed.`, exit 0; `passwd -S` prints
  `root L never ...`; the hash starts `!$y$j9T$`.
- `passwd` as `root`, driven through `script` with the input fed after a
  delay: `New password:`, `BAD PASSWORD: The password is shorter than 8
  characters`, `Retype new password:`, `passwd: password updated
  successfully`, exit 0. There is no "Changing password for user root." line.
  Afterwards `passwd -S` prints `root P 2026-10-31 ...`, the hash starts
  `$y$j9T$` without the `!`, and `/etc/shadow` is still `shadow_t` (SELinux was
  enforcing; in the `init=/bin/bash` shell it is not loaded).
- The relabel: `selinux-autorelabel-generator.sh` checks for `/.autorelabel`
  and points `default.target` at `selinux-autorelabel.target`;
  `selinux-autorelabel.service` runs `/usr/libexec/selinux/selinux-autorelabel`,
  which runs `fixfiles restore`, removes `/.autorelabel`, and runs `systemctl
  reboot`.

Restored: both files copied back from `/root`, `restorecon` run on them; both
checksums match the baseline (`a2532004...` and `7541dbe1...`), both are
`shadow_t`, `passwd -S` prints `root P never ...` again, and the copies were
removed from `/root`. No `/.autorelabel` exists.

**Round 6**, 2026-10-31 and 2026-11-01: Decision 26's prototype, on the Rounds
1 and 2 lab copy, which runs on the machine with Kitty (`servera`'s machine ID
`62e8bf6f...`; `virsh domuuid` and the guest's `product_uuid` agree). The
instructor ran every console step in a Kitty window at the presentation font
size, 120 by 24, recorded with `asciinema rec -c 'virsh -c qemu:///system
console servera'`; I set up the lab through `pnpm lab` and read the casts. The
casts and a fuller log are in the session scratchpad, not the repository.

Baseline, read-only: `servera` at exercise 1's end state (`menu_auto_hide`
unset, the running kernel booted with `ipv6.disable=1`; its `/proc/cmdline`
is the line on 1.4a). SHA-256: `/etc/default/grub` `74bbee55...`, `grub.cfg`
`7bbcb132...`, `grubenv` `7bc3e837...`, the kernel entry `1f8fd90a...`, the
rescue entry `39bdfd7a...`, `/etc/fstab` `b96e219b...`. The domain has a `pty`
serial device and a console on serial port 0; `/proc/consoles` lists only
`tty0`; `serial-getty@ttyS0` is inactive. `virsh -c qemu:///system console`
attaches without `sudo`; plain `virsh` sees no VM.

- **GRUB2 on serial** (step 2). `grub2-mkconfig` left `grubenv` and both entry
  files byte for byte as they were, and dropped `grub.cfg`'s
  `12_menu_auto_hide` block: the script exits when `GRUB_TERMINAL_INPUT` or
  `GRUB_TERMINAL_OUTPUT` includes `serial`. The menu: 80 columns in the
  120-column window, a frame of `+`, `-`, and `|`, `^` and `v` in the help
  line, the highlighted entry in reverse video with `*`, the rescue title cut
  with `>`, and the countdown. Any key stops it; the arrows move the `*` with
  the highlight; <kbd>e</kbd>, <kbd>End</kbd> and <kbd>Ctrl</kbd>+<kbd>E</kbd>
  (both to the end of the `linux` line), <kbd>Esc</kbd>, and
  <kbd>Ctrl</kbd>+<kbd>X</kbd> ("Booting a command list") work. The editor
  shows `load_video`, `set gfxpayload=keep`, `insmod gzio`, the `linux` line
  wrapped at 78 columns with `\`, and the `initrd` line.
- **The kernel on serial** (step 3). `grubby --update-kernel=ALL --args=...`
  also appended to `GRUB_CMDLINE_LINUX`. A boot prints about 1,260 lines to
  the serial console in 6.5 seconds, since `servera` has no `quiet` and
  `kernel.printk` is `7 4 1 7`. The serial login gets `TERM=vt220` and `stty
  size` `24 120` (`agetty` asks the terminal); `systemctl` shows colour, `ls`
  does not (`/etc/DIR_COLORS` has no `vt220` entry).
- **Exercise 3 by hand** (step 4). From `systemctl reboot`: the start job
  showed by 18 seconds, the banner at 105. The banner and prompt as in Round
  3; `mount | grep root` shows `rw`; `mount --all` prints `mount: /boot: can't
  find UUID=...zzz.`; after the fix it prints nothing, but the kernel adds
  `XFS (sda2): Mounting V5 Filesystem ...` to the console. `systemctl reboot`
  there prints `Failed to connect to system scope bus via local transport: No
  such file or directory` twice, in red, and reboots. The emergency shell had
  `vt220` and `stty size` `24 80`, so `vim` drew at 80 columns and left a
  stray character at column 81 on wrapped lines; the drop-in under "Console
  delivery" fixed both (`24 120`, then the alternate screen with
  `TERM=xterm-256color`). A boot with `systemd.unit=emergency.target` leaves
  `/` read-only (`vim` opens `[readonly]` and raises `E138` on `:q`). The VM
  window showed only kernel messages during the wait, and `sulogin`'s
  password prompt as well.
- **Exercise 4 by hand** (step 5). A console login as the locked `root`:
  `Login incorrect`. A first attempt typed `,init=/bin/bash`: the kernel took
  it as part of `console=ttyS0,115200` and booted normally, without error.
  The second reached `bash-5.2#` 3 seconds after <kbd>Ctrl</kbd>+<kbd>X</kbd>,
  with `TERM=linux`, `24 120`, and no job-control warnings. `mount | grep
  root`: `ro`, then `rw`, without `seclabel`. `passwd`'s output as in Round 5.
  The relabel took about 6 seconds from `exec /sbin/init` to the reboot,
  printing `*** Warning -- SELinux targeted policy relabel is required.` and
  `Running: /sbin/fixfiles -T 0  restore`; the login prompt came about 15
  seconds after `exec`. The `root` login then printed `Last failed login:
  ... on ttyS0` and `There was 1 failed login attempt since the last
  successful login.`
- **Exercise 2's console steps on `workstation`** (step 6). The same settings
  and drop-ins (its machine ID is `f1819db0...`; it was at the snapshot, with
  `menu_auto_hide=1` and `rhgb quiet`). The menu showed anyway. The `quiet`
  boot printed about 210 lines, mostly `[  OK  ]`, with three kernel warnings.
  The rescue banner and prompt as in Round 3; `stty size` `24 120`; `mount |
  grep ' / '` shows `rw`; `exit` printed `Reloading system manager
  configuration.` and `Starting default.target`, then a serial login prompt.
  The VM window kept its own `sulogin` prompt after the serial one was
  answered.
- **`kitty-demo`** (step 7), with a trial copy of exercise 3. The SSH session
  ends 0.02 seconds after the reboot's Enter, and GRUB2 draws its menu at 1.7
  seconds. The first trial attached `virsh` 6 seconds after the Enter and
  caught only `in 0s`; it also lacked `clear` lines before the console
  headers, which was my omission. The second, with the attach pattern under
  "Console delivery", attached at 0.6 seconds and caught the whole menu and
  countdown; `kitty-demo` typed the password, and the run was unattended.
  `#@ key ctrl+]` detaches. `node scripts/process-casts.mjs` trimmed the cast,
  cleared 330 whitespace dots (the console `vim` included), added 8 markers,
  and found no local identity; `--check` passes.

Restored: `servera`'s `/etc/fstab` and `/etc/shadow` match their baselines
(`b96e219b...`; `9e7233b0...` and `9638ad4f...` for `shadow` and `shadow-`).
The serial settings and drop-ins stay on both VMs, with the files they
replaced in `/root/w12-serial-backup/`.

**Round 7**, 2026-11-01: disk names on `servera`, the same lab copy. Its
10 GB OS disk sits on SATA port 3, the blank disks on ports 4 to 6. 51 boots,
the OS disk's name read after each (from `lsblk`, or from the kernel lines in
a cast):

- Nothing reading the serial console: 20 boots, all `sda` (10 of them, by a
  quoting slip of mine, with only `console=ttyS0,115200`).
- No `console=` arguments at all: 10 boots, one `sdd`.
- The serial console attached: 21 boots, five `sdd` (none of the 7 by hand,
  2 of 10 with a headless `virsh console`, 3 of the 4 `kitty-demo` trial
  boots; the second trial's last boot, the one its `mount | grep /boot`
  shows, was `sda`).

The SCSI devices always register in port order, but `sd` takes its names in
the order its asynchronous probes finish; each time, the OS disk finished last
and the blank disks took `sda` to `sdc` in port order. None of the 64
published casts was recorded on a shuffled boot. `docs/lab-environments.md`
is corrected (Decision 30). The slip: arguments quoted inside `pnpm lab --
servera sudo grubby --args='a b'` lose their quotes on the remote side, so
`grubby` saw only `console=tty0`; restored with the script form (see
"Authoring notes"), and a reboot confirmed `console=tty0
console=ttyS0,115200` and `ttyS0` as `/dev/console`.

**Round 8**, 2026-11-01: the VDI dry run (prototype step 8 and Open question
1), by the instructor on the SCC lab, following the written exercises. Screenshots
V01 to V16 except V11 and V14; four are now slide images (Decision 31), and the
other eleven are kept in the ch12 topic's `assets/` under `scc-` names.

- `servera`'s `/proc/cmdline` after exercise 1's edit: `root=/dev/mapper/rhel-root
  ... rd.lvm.lv=rhel/root rd.lvm.lv=rhel/swap rhgb quiet ipv6.disable=1`. The
  volume group is `rhel`, and `rhgb quiet` is on the line. `ip -br addr`:
  `lo`, `enp0s3` at `10.0.2.15/24`, and `enp0s8` at `172.25.250.10/24`, no
  IPv6. <kbd>Ctrl</kbd>+<kbd>E</kbd> works.
- The menu (V01): 720 by 400 VGA text, a line-drawing frame, arrows in the
  help line, `*` on the highlighted entry. The editor (V02, V03, V15): the
  same 78-column wrap with `\` as on serial; the `initrd` line ends in
  `$tuned_initrd`.
- Exercise 3: about 40 seconds from the reboot to the start job, and the
  Plymouth splash hid it until <kbd>Esc</kbd>. V04 shows `(39s / 1min 30s)`;
  V05 shows `[ TIME ] Timed out waiting for device`, three `[DEPEND]` lines
  (`boot.mount`, `local-fs.target`, `selinux-autorelabel-mark.service`),
  `[FAILED] Failed to start kdump.service`, then the banner. `Warning:
  Unmaintained driver is detected: e1000` lines. In the shell, `TERM=linux`
  and `stty size` `50 160`; `/` `rw`; the `mount --all` error as expected;
  the second `mount --all` printed nothing, with no XFS line, since `quiet`
  lowers the console log level. The two red D-Bus lines appeared after
  `systemctl reboot`. Afterwards `/boot` was `/dev/sda2`.
- Exercise 2 on `workstation`: after the `unset`, `grub2-editenv - list`
  showed `saved_entry`, `boot_success=0`, and `boot_indeterminate=0`. A
  Plymouth splash came first; the rescue screen (V12) carries three
  `vmwgfx ... [drm] *ERROR*` lines about an unsupported hypervisor above the
  banner; `/` `rw` (V13); `exit` led to the graphical login.
- Exercise 4: no `console=` options to remove. The `bash-5.2#` session (V16)
  as on the instructor lab. The relabel took 2 minutes 3 seconds.
- `serverb`, freshly booted and untouched by the exercises (checked
  afterwards): `rhgb quiet` on its kernel line, and `grub2-editenv - list`
  with `menu_auto_hide=1`, `boot_success=0`, and `boot_indeterminate=0`
  (Open question 3).
- Also seen, and left alone (Decision 31): the SCC prompt is
  `root@servera:~#` in green, where the instructor lab shows RHEL's
  `[root@servera ~]#`, and `vim` there has no line numbers or whitespace dots.

**Still to verify over SSH**: nothing for this week.

**Console only**, still unverified: <kbd>Ctrl</kbd>+<kbd>D</kbd> at the
rescue prompt, and whether the SCC lab's `root` login in exercise 4 reads `on
tty1`. The rest of what this list held is covered by Rounds 6 and 8, and the
SCC lab's `menu_auto_hide=1` by the instructor's check on `serverb` (Open
question 3).

**Where the lab is.** Two copies now carry this week's checks. The copy used
in Rounds 1, 2, 6, and 7 is in the prototype state: both VMs carry the serial
settings and drop-ins; `servera`'s `/etc/fstab` and `/etc/shadow` match
Round 6's baseline, and its `menu_auto_hide` is still unset from exercise 1.
On the copy used in Rounds 3 to 5, `servera` and `workstation` are at their
starting state. Before recording, the recording lab must go back to the
week's start (`start-latest-snapshot -a`), which also discards the serial
settings until step 9 makes them part of the snapshot.

## Authoring notes

- **Long lines are wrapped once, at a space.** A full-width terminal frame
  holds 120 columns at 1920x1080 (measured: 13.76px per character in a
  1,679px frame). `grubby --info`'s `args` line is 148 columns (159 with `rhgb
  quiet`) and `--set-default-index`'s confirmation 167, and code does not wrap
  in this theme: the first build ran both past the frame's right edge, and on
  1.8 the cut-off end was `rhgb quiet` itself. Each is now broken once at the
  last space before column 118, and 1.8 and 1.9 highlight both lines. A real
  terminal would break mid-word at its edge; breaking at a space reads better
  but adds a line number, so the continuation looks like a new line. If you
  prefer, the alternatives are a mid-word break at 118, or cutting the line
  with a visible `...`. `TextExplainer` at `sm` gains only about six columns.
- **`/proc/cmdline` is 234 columns** on the lab, too long for any frame, which
  is why 1.4 teaches it in a sentence.
- **`TextExplainer` shifts marked lines.** On 1.11 the three lines a step marks
  sit a few pixels right of the two that no step marks, in every state. It
  looks like the mark's padding; a theme question, not a fragment one.
- **Capturing slides.** `pnpm run capture:course -- course/w12-draft.md <range>
  --with-clicks` writes every click state to `exports/course-review-png/`
  without the fade that a hash change in the review browser catches. In the
  browser, the first screenshot after a reload comes back blank; take it again.
- **Scripts on the lab.** Do not pipe a script into `pnpm lab -- --tty ...
  bash -s`: it runs as an interactive shell, and if the local side dies the
  remote side finishes the script unseen (Round 2). Send it as one argument
  instead: `pnpm lab -- servera "echo $(base64 -w0 script.sh) | base64 -d |
  sudo bash"`.
- **Mermaid.** Both diagrams were checked by eye at 1920x1080, not only by
  `check:slides`.
- `rows` belongs only on a Magic Move terminal. Fragment 1 has none; every
  `TerminalWindow` is fixed. If Decision 11's text rebuild of the editor
  animates the append, that Magic Move takes `rows`.
- A line that starts with `AccentText` loses its paragraph; start such lines
  with text.
- No presenter notes. Anything learned on the lab goes under "Verification".
- No em dashes. Search the new files for U+2014 before handing work back.
- **Placeholders in a fresh clone.** `*.placeholder.*` files are ignored by
  Git, so a clone made after fragment 1 was committed lacked
  `grub-menu.placeholder.png` and `grub-editor.placeholder.png`, and 1.3 and
  1.4 showed broken images. Moot since 2026-11-01: every placeholder in the
  week was replaced by a tracked image and deleted.
- **`<kbd>` in captures** renders as letter-spaced monospace ("C t r l"), on
  1.3 as well as 2.8. A theme question, not a fragment one.
- **A full-width `TextExplainer` holds about 90 columns** at `sm`, fewer than
  a `TerminalWindow`'s 120: on 1.4a a 110-column line overflowed by 154px and
  a 95-column one by 34.56px. 1.4a wraps at 77.
- **The theme rounds image corners.** A console crop whose text starts at its
  edge loses the corner characters (3.2a's first crops lost a `[`, a `Y`, and
  a `(`), so pad a crop with a 16-pixel black border (`magick ... -bordercolor
  black -border 16`).
- **Quoting through `pnpm lab`.** `pnpm lab -- servera sudo grubby
  --args='a b'` reaches the remote shell as one string with the quotes gone,
  so only `a` is passed (Round 7). Anything with spaces goes in the base64
  script form above.
- **Reading a cast.** `asciinema convert -f txt` on a cast cut at a given
  line prints the scrollback and the screen together, so text above a
  `clear` still shows; and an escape sequence such as `\e[H\e[2J` can be split
  across two events, so search the joined output, not single events.

## Decisions

Decisions 1 to 24 were proposed on 2026-10-29, and the instructor accepted
every one the same day except Decision 9, which was rejected. Decision 25,
proposed on 2026-10-31, was overtaken the same day: the instructor will redraw
the diagram. Each is reversible.

1. **Four fragments**, one per source section, in two chapter directories,
   `rh134-ch12-controlling-and-troubleshooting-the-boot-process/` and
   `rh134-ch13-recovering-superuser-access/`, with the alignments under
   "Deck-level decisions". Accepted; fragment 1 built.
2. **Section titles** kept from the source: "GRUB2 Boot Loader", "systemd
   Targets", "Repairing File Systems at Boot", "Recovering Superuser Access".
   Accepted.
3. **Accent `green`**. Accepted; in `course/w12-draft.md`.
4. **Title** "Controlling the Boot Process and Root Password Reset".
   Accepted.
5. **Cover agenda of four lines**, one per fragment. Accepted; built.
6. **VM reminder** "Start `workstation` and `servera` on your VDI". Accepted;
   built.
7. **Combine the two decks**: Slidev sequence, commands, and exercises; ODP
   O8 as 1.1a, O4 and O5 folded into 2.2 and 2.3, O6 as optional 2.8a; O10
   not ported. Accepted.
8. **Rebuild the boot diagram in Mermaid, split across 1.2 (firmware to
   GRUB2) and 1.2a (GRUB2 to login).** Accepted; built.
9. ~~**Split fragment 1's exercise**~~ to meet the ten-slide guideline.
   Rejected 2026-10-29: pushing past ten content slides is acceptable
   sometimes. Fragment 1 keeps the source order and one exercise, so the
   week has four exercises.
10. **Console steps and recordings.** Every command file keeps the console
    steps as `#!` notes for live delivery, and the written exercises carry
    them as prose, with screenshots from a VDI dry run once they exist.
    Recordings for exercises 1 and 2, whose results show over SSH; none for
    exercises 3 and 4, which happen almost entirely at the console. Accepted.
    Superseded by Decision 26, whose prototype passed on 2026-11-01: every
    exercise is recorded, console steps included, and the `#!` console notes
    become typed lines once the command files are rewritten.
11. **GRUB screens.** Recapture the menu (1.3) on the VDI, and rebuild the
    editor (1.4, 2.8, 4.4) as text from a VDI capture. Placeholders until
    then. Accepted. On 2026-11-01 the VDI screenshots replaced the
    placeholders on 1.3, 1.4, and 4.4 as images (Decision 31); 2.8 has no
    image. Rebuilding the editor as text remains possible.
12. **Use the two unreferenced console captures on a new slide 3.2a.**
    Accepted.
13. **The exercises use `ipv6.disable=1`**, while the slides keep RH134's
    `rhgb quiet`. Accepted; built in exercise 1 and verified (Round 2).
14. **Teach `cat /proc/cmdline` on 1.4** and use it as exercise 1's check.
    Accepted; built as a sentence, since the line is 234 columns.
15. **Exercise 2 unhides `workstation`'s GRUB2 menu** before it needs it.
    Accepted.
16. **Hide the menus again in cleanup** (`grub2-editenv - set
    menu_auto_hide=1`): exercise 2's on `workstation`, exercise 4's on
    `servera`. Accepted.
17. **One reboot command in fragment 3**, whichever works from the emergency
    shell on the console. Accepted. Built as `systemctl reboot` on 2026-10-31:
    the emergency banner itself tells the user to type it (Round 3, and the
    instructor's capture on 3.2a), and RH134 uses it. Still to run on the
    console.
18. **Exercise 4 locks `root` with `passwd -l`**, as its command file does.
    Accepted; built.
19. **The `init=/bin/bash` shell** shows its commands in a `bash` fence inside
    a `TerminalWindow` titled "servera console", and the text names the
    `bash-5.2#` prompt. Accepted; built on 4.5, 4.7, and 4.8. 4.6 uses a
    `text` fence instead, because it holds `passwd`'s output.
20. **Exercise titles**: "Change Kernel Arguments" (built; the two split titles
    went with Decision 9), "Switch systemd Targets", "Repair a File System at
    Boot", "Recover Root Access". Accepted.
21. **Slide 2.8a, the O6 command table**, optional. Accepted.
22. **Slide 1.1a, the O8 intro.** Accepted; built.
23. **The corrections** under "Corrections", each pending its check where
    marked. Accepted.
24. **Cut nothing until built.** Accepted.
25. **Correct 1.2's BIOS path for a GPT disk.** Proposed 2026-10-31, open.
    1.2's node "GRUB2 core image before partition 1" follows B2's presenter
    notes, which describe an MBR disk, where the core image sits in the gap
    before the first partition. The lab disks are GPT: partition 1 is a 1 MB
    BIOS boot partition (`bios_grub`), and the core image lives there
    (Round 3; the same layout as `docs/lab-environments.md` gives). Proposed:
    relabel the node "GRUB2 core image in the BIOS boot partition". The
    "Boot sector (MBR)" node stays, since the protective MBR still holds
    GRUB2's boot code (`pmbr_boot`). Overtaken 2026-10-31: the instructor
    will redraw fragment 1's boot diagram by hand (tldraw, Inkscape, or
    similar), since Mermaid is not quite doing it. The GPT fact goes to that
    redraw; the Mermaid version stays until then.
26. **Serial console for the console steps.** Present and record them through
    `virsh console` in the Presentation window, with the VM's graphical
    console as the fallback. Accepted 2026-10-31, the instructor's own call:
    the recordings are worth the different kernel line and wrapping. A
    prototype comes first; see "Console delivery". The prototype passed
    (2026-11-01, Rounds 6 to 8); making the settings permanent and rewriting
    the command files remain.
27. **Serial console settings.** Keep the GRUB2 serial terminal, `console=tty0
    console=ttyS0,115200`, and the `emergency.service` and `rescue.service`
    drop-ins (`TTYColumns=120`, `TTYRows=24`, `TERM=xterm-256color`) on the
    instructor lab. Colour on the serial login is not fixed: its `vt220`
    shows no `ls` colour, and the console recordings can live without it.
    The `TERM` drop-in was chosen over accepting `vim`'s whitespace dots in
    casts. Accepted 2026-11-01.
28. **GRUB2 timing.** No BIOS boot delay and no console-only exercises to
    catch the menu. Record with the attach pattern under "Console delivery"
    and re-record a take that misses; live, reboot again if the countdown is
    missed. Accepted 2026-11-01; the second trial caught the whole menu.
29. **Lab passwords in command files.** The `root` and `student` passwords may
    be typed as lines in the command files, since the slides already show
    them and this is a lab. Accepted 2026-11-01. `AGENTS.md` still allows
    them only in slide content, so its allowance must be widened before a
    command file carries one.
30. **Disk names.** No lab change for the `sd` naming race (Round 7). A
    snapshot revert keeps the snapshot's names, so only exercises that reboot
    are exposed, and a shuffled boot is obvious. `docs/lab-environments.md`
    corrected; re-record a take that shows a shuffled name. Accepted
    2026-11-01.
31. **VDI follow-ups.** Add 1.4a and `passwd -S` on 4.3; add the three notes
    to the written exercises and the <kbd>Esc</kbd> line on 3.2a; replace the
    placeholders on 1.3, 1.4, 3.2a, and 4.4 with the VDI screenshots, renamed
    descriptively. The prompt and `vim` differences between the labs stay as
    they are. Accepted 2026-11-01; built.
32. **Making the serial settings permanent** (prototype step 9). Add them to
    `/source/rhel-lab/configure_vms.yml`, the playbook in the instructor's lab
    repository (branch `ansible_kickstart`), and apply them to all four VMs,
    `workstation`, `servera`,
    `serverb`, and `serverc`, so every VM behaves the same; the instructor
    then takes the new snapshot. Not by hand. Accepted 2026-11-01; not done.
    What the playbook has to do, from Round 6:
    - In `/etc/default/grub`, set `GRUB_TERMINAL_INPUT="console serial"` and
      `GRUB_TERMINAL_OUTPUT="console serial"`, add `GRUB_SERIAL_COMMAND="serial
      --unit=0 --speed=115200"`, and run `grub2-mkconfig -o
      /boot/grub2/grub.cfg`.
    - Run `grubby --update-kernel=ALL --args="console=tty0
      console=ttyS0,115200"`, only when the arguments are absent. It also
      updates `GRUB_CMDLINE_LINUX`, so no separate edit is needed. Pass the
      arguments as one string; the quoting slip in Round 7 passed only
      `console=tty0`.
    - Install `serial-size.conf` in `/etc/systemd/system/emergency.service.d/`
      and `rescue.service.d/` with `TTYColumns=120`, `TTYRows=24`, and
      `Environment=TERM=xterm-256color` under `[Service]`, then reload
      systemd.
    - Reboot, so the snapshot holds a kernel that uses the new arguments.

    Before the snapshot, on each VM: `/proc/cmdline` ends with
    `console=tty0 console=ttyS0,115200`; `/proc/consoles` lists `ttyS0` with
    `C`; `serial-getty@ttyS0` is active; `systemctl show -p Environment
    emergency.service rescue.service` includes `TERM=xterm-256color`;
    `grub2-editenv - list` still has `menu_auto_hide=1`; and on `servera` and
    `serverb` the 10 GB OS disk is `sda` (Round 7), since a snapshot keeps the
    names it was taken with. Run the playbook on the `lab_config` state
    (`start-latest-snapshot -a` first), and on both lab copies.

## Open questions

1. ~~**Console verification.**~~ Answered 2026-11-01: the instructor ran the
   console steps over the instructor lab's serial console (Round 6) and on
   the VDI with screenshots (Round 8). The original question follows.
   Deferred 2026-10-31: continue building and
   decide later. I can verify only what SSH reaches. Decision 26's prototype
   covers most of it, run by you over the serial console, and its step 8 is
   the VDI dry run below.
   Two ways to cover the rest; both would help:
   - **A VDI dry run** with screenshots, as in w10: the GRUB menu, the editor
     with the `linux` line, the editor after an append, the rescue prompt,
     the 90-second wait, the emergency prompt, the `init=/bin/bash` prompt,
     and the relabel. That is also where Decision 11's captures come from, and
     it shows the SCC lab's real boot times.
   - **Me driving the instructor lab's console** with `virsh -c
     qemu:///system` (`screenshot` and `send-key` against `servera` and
     `workstation` only). It is not in the approved command list and not the
     `pnpm lab` path, so I have not touched it. If you want it, it would be a
     one-off approval or a rule added for all three harnesses.
2. ~~**`workstation`.**~~ Answered 2026-10-29 for the instructor lab: graphical
   login with `gdm` (see "Verification", Round 2). Confirmed for the SCC lab
   on 2026-11-01: a Plymouth splash, then a graphical login (Round 8).
3. ~~**The SCC lab's GRUB environment.**~~ Answered 2026-11-01: yes. On a
   freshly booted SCC `serverb`, which had run neither exercise,
   `grub2-editenv - list` printed `saved_entry=e6d97f29...`,
   `menu_auto_hide=1`, `boot_success=0`, and `boot_indeterminate=0` (Round 8),
   so exercises 1 and 2's first step is right as written. `serverb` also
   boots with `rhgb quiet`, like `servera`. The `/etc/fstab` half of this
   question was already gone: exercise 3's `vim` edit searches for `/boot`
   instead of counting lines from the end.
4. ~~**The GRUB screenshots' origin.**~~ Moot since 2026-11-01: the VDI
   screenshots replaced all three (Decision 31).
5. ~~**Recording exercises 1 and 2.**~~ Superseded 2026-10-31 by Decision 26:
   over the serial console, `kitty-demo` types the console steps itself, so no
   take depends on editing the console by hand during a pause. The recording runs unattended, but
   exercise 1's step 2 needs the argument typed at the GRUB2 menu, or
   `/proc/cmdline` in step 3 will not show it. The command file pauses 45
   seconds after that reboot so you can make the edit in the console during
   the take. Exercise 2 asks more: after step 6's reboot, 45 seconds for the
   edit and the boot to the rescue shell, then 45 on step 7's header to log
   in, run `mount`, and `exit`, before the take reconnects. Does that work for
   you, or should those steps stay out of the recordings? The pauses are
   timed on the instructor lab; the VDI is slower.

6. ~~**3.2a's capture and 3.4's UUID.**~~ Answered 2026-10-31: they do not
   have to match. Since 2026-11-01 3.2a shows the SCC lab's `2cd783eb-...`
   (Round 8). As first written: the stalled-boot capture on 3.2a waits
   on UUID `b688d484-3d0c-...`; 3.4 shows the Round 3 copy's `/boot`,
   `5c381752-...`, and the home copy's `/boot` UUID was never recorded. Do you
   want them to agree? If so, either 3.4 is recaptured on the lab the capture
   came from, or the capture is retaken on the lab 3.4 came from, which also
   settles the placeholder.

## Status

As of 2026-11-01.

**Done:**

- This plan; your decisions 1 to 24 (all accepted except 9); Decision 25
  overtaken by your redraw of the boot diagram; Decisions 26 to 32 accepted;
  Open questions 1 to 4 and 6 answered.
- `course/w12-draft.md`: cover, VM reminder, and the imports for all four
  fragments.
- Fragments 1 to 4 and exercises 1 to 4: complete (`616d13c`, `784ed53`,
  `f4ef2e1`, `974a737`).
- Decision 26's prototype, steps 1 to 8 (Rounds 6 to 8).
- Decision 31's changes, unstaged for your review: 1.4a, `passwd -S` on 4.3,
  the VDI images on 1.3, 1.4, 3.2a, and 4.4, the <kbd>Esc</kbd> line on 3.2a,
  the notes in exercises 3 and 4 (and two `#!` notes in exercise 3's command
  file), and Prettier's reflow of the three exercise pages that failed
  `check:format` in HEAD. Checked with `check:entry`, `check:exercises`,
  `check:slides` (no overflow), `check:format`, and captures of every changed
  slide and click state.
- `docs/lab-environments.md` corrected on disk names (Decision 30),
  unstaged.

All 46 non-recording slides now exist (48 in "Answer in brief", less the two
recording slides).

**Next:**

1. Your review of the unstaged changes. Before staging, decide what happens to
   the unreferenced VDI screenshots in the ch12 topic's `assets/`.
2. Decision 26's implementation: prototype step 9 through the `rhel-lab`
   playbook and your new snapshot (Decision 32), then the `AGENTS.md`
   allowance for lab passwords (Decision 29), the four command files,
   recording slides 3.7a and 4.9a, and the `docs/lab-environments.md` and
   `docs/course-authoring.md` entries listed under "Console delivery". Your
   call on 4.4's `console=` step is still open there.
3. The remaining deferred item: your boot diagram.
4. Step 5 of the porting skill: recordings, then publication.

No review server was started; the slides were captured with
`pnpm run capture:course`.

## Flatpak

I want to cover Flatpak from RH124. The reason I want to do this is: flatpak is only covered in the RHEL 10 version of RH124. I think the Intro to Linux (IT-130) course is still teaching the RHEL 9.4 version. I am encouraging students to take the version 10 exam, so I need to make sure I cover this gap.

The RHA motivation for this chapter is not right in my opinion. RHA says the montivation is to solve underlying dependency requirements. I think a better motivation is to get fresher packages. RHA repeats over and over that Flatpak is only for desktop apps. I agree with this, it is not totally accurate but it is a good way for the students to distinguish between flatpak and rpm. For desktop software you usually want the newest version to get the latest features and bug fixes. RHEL releases usually do not upgrade software as quickly as upstream desktop apps. So to get that newest version of firefox, inkscape, etc. get it from flatpak and flathub.

Another motivation is that flatpak is installable without sudo. This means regular users can install flatpak. This is allowed because the flatpaks are self-contained. Everything that is needed to run an application is included in the flatpak. Also, installing a flatpak won't make any changes to the system that any other user will notice.

I want to skip the auth part. I just want to use flathub unauthenticated. I only want to teach the mask command if it can be ran by an administrator to prevent users from installing a certain version of a flatpak.

I do want to teach doing things like adding/removing a remote from cli. Same for installing/removing a flatpak. Then at the end show it can also be done through Gnome Software.
