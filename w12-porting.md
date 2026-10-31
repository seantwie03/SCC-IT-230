# W12 - Port

## Prompt

Port w12 from `~/s/IT-230/w12` with the week-porting skill: read the Slidev
deck, the LibreOffice deck, the lesson plan, and the demonstrations, and
produce this plan. Nothing is built until the plan is approved.

## Answer in brief

**Four topic fragments** in two chapter directories, **four exercises**, one
per source exercise, and a deck of **47 slides** under the decisions accepted
on 2026-10-29: 41 from the source (39 content, section, and exercise slides
plus the cover and VM reminder), 4 added (1.1a, 1.2a, 2.8a, 3.2a), and 2
recording slides (1.14a, 2.9a) that wait on the casts (Decision 10).

| # | Fragment                             | Section title                  | Slides | Exercises |
|--:|--------------------------------------|--------------------------------|-------:|----------:|
| 1 | `grub2-boot-loader.md`               | GRUB2 Boot Loader              |     17 |         1 |
| 2 | `systemd-targets.md`                 | systemd Targets                |     11 |         1 |
| 3 | `repairing-file-systems-at-boot.md`  | Repairing File Systems at Boot |      8 |         1 |
| 4 | `recovering-superuser-access.md`     | Recovering Superuser Access    |      9 |         1 |
|   | Entry file                           |                                |      2 |           |
|   | **Total**                            |                                | **47** |     **4** |

Slide counts include the recording slides Decision 10 gives casts (fragments 1
and 2). The fragments follow the Slidev deck's sections one for one, in source
order. The LibreOffice deck contributes an intro slide for GRUB2 (1.1a), detail
for the targets slides, and an optional command table (2.8a).

Where things stand on 2026-10-29:

1. **Fragment 1 is built**: 16 of its 17 slides (the recording slide waits on
   the cast), its exercise's command file and written version, and the draft
   entry. It waits on your review.
2. **The console steps are still unverified.** The GRUB2 menu and editor, the
   rescue and emergency shells, and the `init=/bin/bash` shell cannot be
   reached through `pnpm lab`. Open question 1 is still open; fragment 1's
   exercise step 2 is the first step it affects.
3. **Long output lines are wrapped once, at a space** (1.5, 1.6, 1.8, 1.9).
   A terminal frame holds 120 columns and `grubby --info`'s `args` line is
   148; see "Authoring notes". Review that choice before fragment 2.

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
| `grub2-boot-loader.md`              |     17 |         1 |
| `systemd-targets.md`                |     11 |         1 |
| `repairing-file-systems-at-boot.md` |      8 |         1 |

New, under `course/chapters/rh134-ch13-recovering-superuser-access/`:

| File                             | Slides | Exercises |
|----------------------------------|-------:|----------:|
| `recovering-superuser-access.md` |      9 |         1 |

Plus, in each topic's `exercises/`, one `.sh` command file and one `.html`
written exercise per exercise (four of each), and a `.cast` beside each
exercise that gets a recording (Decision 10). `assets/` holds the
placeholders for the GRUB screenshots until they are replaced (Decision 11),
and the two SCC console screenshots if 3.2a is accepted (Decision 12).

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
above. Placeholder until then.

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

### 1. `grub2-boot-loader.md` (17 slides), built 2026-10-29

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
column: `assets/grub-menu.placeholder.png` (the source's `grub-menu-1.png`)
until the recapture (Decision 11), with alt text that will fit the
replacement. `check:slides`: 8.88px.

Components: `two-cols-header` with `vertical: center`; Markdown table with
`<kbd>`; image.

##### 1.4 Editing a GRUB2 Boot Entry

Source B4. Left column: the five steps (press <kbd>e</kbd>; move to the line
that starts with `linux`; <kbd>End</kbd>; type a space and the arguments;
<kbd>Ctrl</kbd>+<kbd>X</kbd>) and a `Callout`, "Changes apply to **this boot
only**". Right column: `assets/grub-editor.placeholder.png` until the editor is
rebuilt as text from a VDI capture (Decision 11). Decision 14 shipped as a
sentence in the `bottom` band rather than a terminal, since `/proc/cmdline`
on the lab is 234 columns: "After boot, `cat /proc/cmdline` shows the
arguments the running kernel received". `check:slides`: 0px, so the text
rebuild of the editor must not be taller than the placeholder.

Components: `two-cols-header` with `vertical: center` and a `bottom` band;
ordered list with `<kbd>`; `Callout` with `AccentText`; image.

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

### 2. `systemd-targets.md` (11 slides, proposed)

`routeAlias: systemd-targets` (to confirm unused; `systemd-services` exists).
Alignments: RH134 chapter 12, cert guide chapters 17 and 18. Exercise: Switch
systemd Targets Exercise.

##### 2.1 systemd Targets

Source B15. Section slide carrying the `topicInfo`.

Components: `section`.

##### 2.2 What Is a systemd Target?

Sources B16 and O4. The definition (a named group of units the system starts
to reach a state) and B16's four reasons, with O4's two additions: targets can
contain other targets, and one isolatable target is the boot default.

Components: default layout, or `IconGrid` for the reasons (five or six short
facts), whichever reads better.

##### 2.3 Common Boot Targets

Sources B17 and O5. The four-row table (`graphical`, `multi-user`, `rescue`,
`emergency`) and the nesting note. O5 adds "root password required" for
`rescue` and `emergency`, which RH134 also states. The "rw" and "ro" claims are
to verify on the console.

Components: default layout, Markdown table.

##### 2.4 Target Dependencies

Source B18. `systemctl list-dependencies graphical.target`, cut to its first
lines with `...output omitted...`. Verified on `servera`: the first lines
match the source (`display-manager.service` and
`systemd-update-utmp-runlevel.service` inactive, then `multi-user.target`
with `firewalld`, `NetworkManager`, and the rest, then `basic.target`). The
"Abridged Output" fence title becomes visible omission lines, as in w10 and
w11.

Components: fixed `TerminalWindow`; `Callout` for the closing line.

##### 2.5 View Default Boot Target

Source B19. `systemctl get-default` prints `multi-user.target` on `servera`
(verified).

Components: fixed `TerminalWindow`.

##### 2.6 Change Default Boot Target

Source B20. `systemctl set-default graphical.target` and its two lines
("Removed ...", "Created symlink ... → ..."), to recapture and then restore.

Components: fixed `TerminalWindow`.

##### 2.7 Switch Targets at Runtime

Source B21. `systemctl isolate multi-user.target`, what it stops and starts,
and the `AllowIsolate=yes` caveat. Verified: on `servera`, 22 targets carry
`AllowIsolate=yes`, including all four in 2.3.

Components: `bash` fence (isolate prints nothing), `Callout`.

##### 2.8 Boot to a Specific Target

Source B22. Three click states as the source: enter the GRUB2 editor; append
`systemd.unit=rescue.target`; a `rescue` versus `emergency` table and "Exit
the shell to continue the normal boot". The editor follows Decision 11. The
table's file-system and service claims are to verify on the console.

Components: `v-switch` templates; Markdown table.

##### 2.8a systemd Target Commands

**Addition, from O6, optional** (Decision 21). The five `systemctl`
subcommands in one table (`list-dependencies`, `isolate`, `list-units --type
target`, `get-default`, `set-default`), a summary before the exercise as w11's
1.3a was for LVM. Cut it if time is short.

Components: default layout, Markdown table.

##### 2.9 Exercise: Switch systemd Targets

Source B23. Host `workstation`. Workflow, as the source plus Decision 15:
inspect the default target; switch to `multi-user.target` without rebooting;
make it the default and reboot to confirm; restore `graphical.target`; boot
once into `rescue.target` from the GRUB2 menu and check the root file system,
then continue the boot. The step "make the GRUB2 menu appear" is added, since
`workstation` has never had it unhidden.

Components: `exercise`.

##### 2.9a Exercise recording

Pending the cast.

### 3. `repairing-file-systems-at-boot.md` (8 slides, proposed)

`routeAlias: repairing-file-systems-at-boot`. Alignments: RH134 chapter 12,
cert guide chapter 18. Exercise: Repair a File System at Boot Exercise.

##### 3.1 Repairing File Systems at Boot

Source B24. Section slide carrying the `topicInfo`.

Components: `section`.

##### 3.2 When the Boot Process Fails

Source B25. A bad `/etc/fstab` entry can stop the boot; the three-row cause
table; systemd drops to an emergency shell that asks for the root password.
Corrections, to verify: a missing mount point may not stop the boot at all,
since systemd creates the directory for a mount unit; and for XFS, `fsck.xfs`
does nothing at boot (RH134), so "systemd attempts repair" applies to ext4.

Components: default layout, Markdown table, `Callout`.

##### 3.2a What a Failed Boot Looks Like

**Addition** (Decision 12). Two click states over the instructor's two
console captures: systemd's 90-second wait on the missing UUID, then the
emergency-mode password prompt. Alt text quotes the key lines.

Components: default layout with an image per click state (`v-switch`).

##### 3.3 Remount Root Read/Write

Source B26. Check `mount | grep root` before assuming; remount with `mount -o
remount,rw /` if `ro` appears. Typo: the source's `rhel_servera_root` is
`rhel_servera-root` (verified). The claims "explicit `emergency.target`: read
only" and "fstab failure: usually already read/write" are to verify on the
console, and the transcript is captured there.

Components: fixed `TerminalWindow` (console capture), `bash` fence.

##### 3.4 Find the Failing Mount

Source B27. `mount --all` and its error. Verified with a scratch fstab
(`mount --all --fstab`), exit 32 both times: a missing mount point prints
"mount: /mnt/mountfolder: mount point does not exist." and a second line,
"       dmesg(1) may have more information after failed mount system call.",
which the source leaves out; a mistyped UUID prints "mount: /boot: can't find
UUID=...zzz." Proposed: show the UUID form, since that is what the exercise
produces, or both.

Components: fixed `TerminalWindow`, `Callout`.

##### 3.5 Fix `/etc/fstab` and Reload

Source B28. Two click states: edit the bad entry (three common fixes), then
`systemctl daemon-reload`, `mount --all`, and a reboot. The source's slide says
`systemctl reboot` and its exercise says `reboot -f`; which one works from the
emergency shell is to verify (Decision 17).

Components: `v-switch` templates, `bash` fences.

##### 3.6 Repairing a Corrupted Filesystem

Source B29. `xfs_repair` and `fsck.ext4 -p`, file system unmounted first.
Correction: the source uses `/dev/sda2` for both, which is the XFS `/boot` on
the lab; the slide uses a stand-in such as `/dev/sdb1` and says which
command goes with which file system. Heading "Filesystem" becomes "File
System". Commands only.

Components: default layout, `bash` fences.

##### 3.7 Exercise: Repair a File System at Boot

Source B30. Host `servera`; no prerequisite exercise, since systemd opens the
emergency shell without the menu (in the chain it follows exercise 1).
Workflow: break the UUID on one
`/etc/fstab` line; reboot and log in to the emergency shell; find the bad
entry with `mount --all`; fix it, reload systemd, and confirm `mount --all`
succeeds; reboot and confirm a normal boot. The source's "The system has been
pre-configured with a broken `/etc/fstab` entry" contradicts its own step 0
and is dropped.

Components: `exercise`.

### 4. `recovering-superuser-access.md` (9 slides, proposed)

`routeAlias: recovering-superuser-access`. Alignments: RH134 chapter 13, cert
guide chapter 18. Exercise: Recover Root Access Exercise.

##### 4.1 Recovering Superuser Access

Source R1. Section slide carrying the `topicInfo`.

Components: `section`.

##### 4.2 When Root Access Is Lost

Source R2. `init=/bin/bash` replaces systemd with bash as PID 1: no login, no
password, root at once, root file system read-only. The closing line "cannot
be done remotely" becomes "needs console access", which a remote console
also gives. RH134's recommended method, rescue media, is under "Not ported".

Components: default layout, `Callout`.

##### 4.3 Aside: Locking an Account

Source R3. `passwd -l root` puts `!` in front of the hash in `/etc/shadow`.
Corrections, verified on a throwaway user: RHEL 10 hashes with yescrypt
(`ENCRYPT_METHOD YESCRYPT`, hashes begin `$y$j9T$`), not the source's
`$6$rounds=4096$`; `passwd -l` prints "passwd: password changed."; `passwd -S`
reports `L`. The before and after lines keep the prefix and elide the rest of
the hash. The claim that setting a new password removes the `!` is to verify.

Components: two titled `text` fences (before and after) or a `TextExplainer`
marking the `!`.

##### 4.4 Edit the GRUB2 Entry

Source R4. Three click states: enter the editor; remove any `console=`
options; append `init=/bin/bash` and press Ctrl+X. The SCC and instructor
labs have no `console=` options (instructor lab verified; SCC to confirm), the
RHA lab does, so the step stays as "if present". Editor per Decision 11.

Components: `two-cols-header` or `v-switch` with the editor beside the steps.

##### 4.5 Remount Root Read/Write

Source R5. `mount -o remount,rw /`, since `passwd` must write `/etc/shadow`;
verify with `mount | grep ' / '`. Prompt per Decision 19.

Components: per Decision 19.

##### 4.6 Reset the Root Password

Source R6. `passwd` with no argument changes root's password. Corrections:
the typed password is never shown, so the source's "New password: redhat" is
not what the screen shows; whether `passwd` first prints "Changing password
for user root." and the exact `BAD PASSWORD` line for `redhat` are to verify
(see "Verification", Round 1, for why I could not capture it over `pnpm
lab`). The `Callout` keeps "short passwords are accepted with a warning when
run as root".

Components: per Decision 19, `Callout`.

##### 4.7 Trigger SELinux Relabeling

Source R7. `passwd` replaces `/etc/shadow` with a new file, and with SELinux
not yet loaded the file gets no context; `touch /.autorelabel` relabels every
file on the next boot. Ties back to w06.

Components: per Decision 19, `Callout`.

##### 4.8 Hand Control to systemd

Source R8. `exec /sbin/init` replaces bash with systemd, since `reboot` needs
systemd and `exit` would leave the kernel without PID 1 (Cert Guide chapter
18). The relabel and the automatic reboot that follows are to verify, with how
long they take.

Components: per Decision 19, `Callout`.

##### 4.9 Exercise: Recover Root Access

Source R9 and `recover_root_access.sh`. Host `servera`; prerequisite exercise
Change Kernel Arguments (1.14). Workflow: lock `root` and confirm a console login fails; boot with
`init=/bin/bash`; remount, reset the password, and schedule a relabel; hand
control to systemd and wait for the relabel; log in as `root` at the console.
The source's slide says the password "has been changed" and its command file
locks the account; Decision 18 proposes the lock, which 4.3 teaches.

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
2. (on `workstation`, independent of the chain)
3. One `/etc/fstab` UUID broken, the emergency shell, the line fixed
4. `root` locked, the password reset to `redhat` from `init=/bin/bash`, the
   relabel; cleanup sets `menu_auto_hide=1` again (Decision 16)

At the end `/etc/fstab`, the boot entry's arguments, and the GRUB environment's
variables are back to their starting values; `/etc/shadow` holds a new hash of
the same password. `grubby` rewrites the entry file when it changes it, which
drops the trailing space the installer left on its `options` line, so the
file's checksum does not return to the snapshot's (verified).

**Console steps.** Every exercise has steps at the console. The command files
write them as `#!` notes, which `kitty-demo` shows only to the instructor, and
the written exercises describe them as prose (Decision 10). Screenshots from a
VDI dry run go in once they exist.

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

### Exercises 2 to 4

Changes to the source command files, beyond the format, planned:

- `jj:wq` becomes `#@ key escape` and `:wq`.
- Several `#!` notes share one line (`#! Switch to ... #! When the GRUB2 menu
  appears ...`), and some console commands are written as notes
  (`#! mount --all #! The error message ...`). Each becomes one note per line.
- Exercise 3's `vim` keystrokes (`G`, `kk`, `E`, `azzz`) count lines from the
  end of the file, which lands on `/boot` only because the lab's `/etc/fstab`
  ends with the `/dev/sr1` line. Proposed: move by a search that does not
  depend on line count, or name the line in the written exercise.
- Exercise 3's final `reboot -f` against 3.5's `systemctl reboot`: one of them
  wins after the console test (Decision 17).
- Pauses per "Pausing for the audience", as in exercise 1.

## Additions

Accepted 2026-10-29 (Decisions 7, 8, 12, 14, 15, 16, 21, 22):

1. **Slide 1.1a, What Is GRUB2?** (O8), the GRUB2 section's intro. Built.
2. **Slide 1.2a**, the second half of the split boot diagram (Decision 8).
   Built.
3. **`cat /proc/cmdline` on 1.4** (Decision 14), as a sentence. Built.
4. **Slide 2.8a, systemd Target Commands** (O6), optional (Decision 21).
5. **Slide 3.2a, What a Failed Boot Looks Like** (Decision 12).
6. **Recording slides** for the exercises Decision 10 gives casts. The source
   has none.
7. **Unhiding `workstation`'s menu in exercise 2** (Decision 15), and hiding
   both menus again in cleanup (Decision 16).

## Corrections

Verified on the lab where marked; the rest are typos, logic, or to verify.

- B3: `*` marks the highlighted entry, not the default (to verify on the
  console).
- B5, B6, B8, B9, B11: output from an older build (machine ID
  `f0523084...`, swap UUID `f60c96c7...`); the instructor lab now prints
  `62e8bf6f...` and `c0d07a5b...` (verified). B8 and B9 elide and comment
  inside the output.
- B8: `rhgb` needs `plymouth`, which the lab servers do not have (verified),
  so only `quiet` changes the console.
- B12: the menu also hides when `boot_indeterminate=1`, and only after a
  successful boot as `grub-boot-success.timer` defines one (verified in
  `grub.cfg` and the unit).
- B13: `grubby --set-default-index` writes `saved_entry` in `grubenv`
  (verified: `GRUB_DEFAULT=saved`), so the table's "Stored in" row is wrong
  for the default.
- B25: a missing mount point may not stop the boot (to verify); XFS is not
  repaired at boot (RH134).
- B26: `rhel_servera_root` is `rhel_servera-root` (verified); the second
  fence title carries an em dash.
- B27: `mount --all` prints a second line, the `dmesg(1)` hint, and exits 32
  (verified).
- B28, B30: `systemctl reboot` on the slide, `reboot -f` in the exercise.
- B29: `/dev/sda2` is the lab's XFS `/boot`, so `fsck.ext4 -p /dev/sda2` is
  wrong; "Filesystem" becomes "file system".
- B30: "pre-configured with a broken `/etc/fstab` entry" contradicts step 0.
- B23 and its command file: `workstation`'s menu is never unhidden, so step 5
  cannot be done as written unless someone catches a one-second hidden
  timeout.
- R2: "cannot be done remotely": a remote console can.
- R3: RHEL 10 writes yescrypt (`$y$`), not `$6$rounds=4096$`; `passwd -l`
  prints "passwd: password changed." (verified on a throwaway user).
- R6: the typed password is not echoed.
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

**Still to verify over SSH**: `set-default` output on `servera` and
`workstation` (restored after); whether systemd creates a missing mount point
(on a scratch disk); `xfs_repair` and `fsck.ext4 -p` on scratch file systems;
whether a new password removes the `!`; the rest of `workstation`.

**Console only**, by Open question 1: the menu's `*`; the editor's text, for
1.4's text rebuild; End and Ctrl+E in the editor; exercise 1's step 2 itself;
the rescue and emergency shells' prompts and whether root is `rw` in each;
`exit` and Ctrl+D from rescue; the 90-second wait and emergency prompt after a
bad UUID; whether root is `rw` in that emergency shell; `systemctl reboot`
against `reboot -f` there; the `init=/bin/bash` prompt; `passwd` there; the
relabel's length and automatic reboot; a console login as a locked `root`.

**Where the lab is.** `servera` is at exercise 1's end state:
`menu_auto_hide` unset, the kernel line back to its original arguments (the
entry file without its trailing space), and the running kernel booted with
`ipv6.disable=1`, so IPv6 is off until its next boot. `boot_success` was 0 at
the last check. `workstation` is at the snapshot. Before recording, the lab
must go back to the week's start (`start-latest-snapshot -a`).

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

## Decisions

All proposed on 2026-10-29. The instructor accepted every one the same day
except Decision 9, which was rejected. Each is reversible.

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
11. **GRUB screens.** Recapture the menu (1.3) on the VDI, and rebuild the
    editor (1.4, 2.8, 4.4) as text from a VDI capture. Placeholders until
    then. Accepted; fragment 1 carries both placeholders.
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
    shell on the console. Accepted.
18. **Exercise 4 locks `root` with `passwd -l`**, as its command file does.
    Accepted.
19. **The `init=/bin/bash` shell** shows its commands in a `bash` fence inside
    a `TerminalWindow` titled "servera console", and the text names the
    `bash-5.2#` prompt. Accepted.
20. **Exercise titles**: "Change Kernel Arguments" (built; the two split titles
    went with Decision 9), "Switch systemd Targets", "Repair a File System at
    Boot", "Recover Root Access". Accepted.
21. **Slide 2.8a, the O6 command table**, optional. Accepted.
22. **Slide 1.1a, the O8 intro.** Accepted; built.
23. **The corrections** under "Corrections", each pending its check where
    marked. Accepted.
24. **Cut nothing until built.** Accepted.

## Open questions

1. **Console verification.** Still open. I can verify only what SSH reaches.
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
   login with `gdm` (see "Verification", Round 2). Still to confirm on the SCC
   lab.
3. **The SCC lab's `/etc/fstab` and GRUB environment.** Does it also end with
   the `/dev/sr1 /mnt/dvd` line, and do SCC hosts start with
   `menu_auto_hide=1`? Exercise 3's `vim` keystrokes and exercise 1's first
   step assume both.
4. **The GRUB screenshots' origin.** Are `grub-menu-1.png`, `grub-editor.png`,
   and `grub-cmdline-edit.png` your captures of the RHA lab? Either way they
   do not match the SCC lab (Decision 11).
5. **Recording exercise 1.** The recording runs unattended, but step 2 needs
   the argument typed at the GRUB2 menu, or `/proc/cmdline` in step 3 will not
   show it. The command file pauses 45 seconds after that reboot so you can
   make the edit in the console during the take. Does that work for you, or
   should step 2 stay out of the recording?

## Status

As of 2026-10-29.

**Done:**

- This plan; your decisions (all accepted except 9).
- `course/w12-draft.md`: cover, VM reminder, and fragment 1's import.
- Fragment 1, `grub2-boot-loader.md`: 16 slides built and checked
  (`check:entry`, `check:exercises`, `check:slides`, and captures of every
  click state), with `assets/grub-menu.placeholder.png` and
  `assets/grub-editor.placeholder.png`.
- Exercise 1's `change-kernel-arguments-exercise.sh` (`kitty-demo --check`:
  59 presses) and `change-kernel-arguments-exercise.html`, verified on
  `servera` except the console edit.
- The lab checks behind fragment 1, under "Verification". `servera` is at
  exercise 1's end state.

**Next:**

1. Your review of fragment 1, and Open questions 1 and 5.
2. Fragment 2, `systemd-targets.md`, and exercise 2 on `workstation`.

The review server started for this work on port 3131 was stopped afterwards.
