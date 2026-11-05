# W13 - Port

## Prompt

Port w13 from `~/s/IT-230/w13` with the week-porting skill: read the Slidev
deck, the lesson plan, and the demonstrations, and produce this plan. Nothing
is built until the plan is approved.

## Answer in brief

**Six topic fragments** in one chapter directory, one per source section,
**seven exercises**, one per source exercise, and a deck of **55 slides**: 44
from the source (42 content, section, and exercise slides plus the cover and
VM reminder), 4 additions (5.5a, which teaches `usermod -u` before exercise 6
uses it, and 1.2a, 3.3a, and 3.4a from the coverage check), and 7 recording
slides, one per exercise.

| # | Fragment                      | Section title            | Slides | Exercises |
|--:|-------------------------------|--------------------------|-------:|----------:|
| 1 | `network-file-system.md`      | Network File System      |      4 |         0 |
| 2 | `nfs-server.md`               | NFS Server               |      9 |         1 |
| 3 | `mounting-nfs-exports.md`     | Mounting NFS Exports     |     10 |         1 |
| 4 | `automounting-with-autofs.md` | Automounting with autofs |     15 |         2 |
| 5 | `nfs-permissions.md`          | NFS Permissions          |     11 |         2 |
| 6 | `per-user-automounting.md`    | Per-User Automounting    |      4 |         1 |
|   | Entry file                    |                          |      2 |           |
|   | **Total**                     |                          | **55** |     **7** |

Slide counts include each fragment's recording slide and the accepted
additions.

Where things stand on 2026-11-05:

1. **The plan is written; nothing is built.**
2. **The slide claims are verified** on the instructor lab (Rounds 1 to 6
   under "Verification"). Four of the source's facts are wrong and two of my
   first corrections were wrong too; both are recorded under "Corrections".
   The exercises themselves are verified as each is written, during the
   build.
3. **The lab is back at the week's start**: both hosts were reverted to the
   2026-11-03 snapshot after the side tests and match the baseline.
4. **There is no LibreOffice deck for w13.** The Slidev deck is the only
   deck, so there is nothing to combine.
5. **Decisions 1 to 23 are accepted** and the open questions answered.
6. **A coverage check against RH134 and the Cert Guide** added three slides
   (1.2a, 3.3a, 3.4a), a `-fstype=` row on 4.8, five one-line additions, and
   one sentence on 6.2 tying per-user automounting to home directories, all
   accepted 2026-11-05 (Decisions 24 and 26 to 29 and 31). The
   `use_nfs_home_dirs` callout and systemd automount were left out
   (Decisions 25 and 30). See "Coverage check against RH134 and the Cert
   Guide".
7. **Every decision is settled.** The next step is building fragment 1.

## Scope

The lesson plan's agenda is "Share directories using NFS", "Mount directories
using NFS", and "Configure NFS shares to Automount". It assigns the RHA lab for
chapter 15 section 05, SCC Lab chapter 15 lab 01, and the optional *RHCSA
Cert Guide* chapter 24.

The source material is in `~/s/IT-230/w13/slides/`:

- **Slidev Markdown:** `slides.md` (cover and VM reminder) and
  `accessing_network_attached_storage.md` (42 slides, six sections, seven
  exercise slides). No presenter notes.
- **`slide-summary.md`** is an earlier 37-slide outline. The deck has moved on
  since (the UID mismatch slide became two, the autofs sequence diagram and
  "Why Use the Automounter?" were added, Direct Maps became two slides, and
  `root_squash` moved from the export options to NFS Permissions). The deck is
  the spec; the summary is read only for intent.
- **`slides/public/`** holds only the college and Red Hat logos. The deck
  references no images.
- **`~/s/IT-230/w14/slides/accessing_network_attached_storage.md`** is a
  byte-identical copy of the deck (checked with `diff`), so it adds nothing.

The demonstrations are seven `kitty-demo` command files in
`demonstrations/accessing_network_attached_storage/`, one per exercise slide,
plus `troubleshooting.md`, the instructor's list of diagnostic commands
(`journalctl -fu`, `systemctl status`, `rpcinfo -p`, `nfsstat`, `dmesg`,
`firewall-cmd --list-all`). None of the command files has a cleanup step.

The curriculum is RH134 chapter 15, *Accessing Network-Attached Storage*, and
*RHCSA Cert Guide* chapter 24, *Accessing Network Storage*. RH134 teaches the
client only: `mount`, `/etc/fstab`, `umount` and `lsof`, and `autofs` direct,
indirect, and wildcard maps. The Cert Guide also sets up a server, says that
doing so is not an exam objective, and explains the UID problem the source's
NFS Permissions section teaches. Nothing from either is copied. RHCSA
objectives covered: mount and unmount network file systems using NFS;
configure autofs. Fragment 5 also uses "create, delete, and modify local user
accounts".

The SCC lab has no NFS server, so the source teaches students to build one on
`servera` (fragment 2) before anything can be mounted. That is why a server
section sits in a client-side chapter.

## Port fidelity

Source slides are numbered by file. **S1 and S2** are `slides.md`, and **N1 to
N42** are `accessing_network_attached_storage.md` in order (N21 is the autofs
sequence diagram, which has no heading). Planned slides are numbered by
fragment, such as 2.4, following the source. A slide this repository adds
carries a letter, such as 5.5a, so the source numbering never moves.

The source order is kept slide for slide. Nothing is split, merged, reordered,
or dropped in this plan except where a heading says "propose", and each
proposal is listed again under "Decisions".

Forced changes, not choices:

- **Output that is not real or not RHEL 10.** N8 and N27 show `systemctl
  enable` symlink lines without the quotes RHEL 10's systemd prints, N15
  elides the mount options with `...`, and N17's busy message is the one for
  a local file system, not NFS. N10 and N14 match the lab. Every transcript
  is recaptured on the lab.
- **Facts the source gets wrong.** See "Corrections": `sync` is a default
  export option, `mount | grep autofs` cannot show an NFS mount, a wildcard
  needs the subdirectory exported, an unreachable server delays the boot
  rather than halting it, and more, all checked on the lab.
- **Theme expression.** The source's `<br />` spacers, `[[root@servera ~]#]`
  fence titles, `<div>` wrappers, and logo footer give way to the theme's
  layouts, `TerminalWindow`, titled `text` fences, and footer.
- **Em dashes.** The source copy carries about eight and the command files
  more. Every one is rewritten.

## Sequencing and framing

- **W13 starts from the lab snapshot.** Verified (Round 1): on the instructor
  lab neither host has `nfs-utils`, `autofs`, or `rpcbind`; `workstation` has
  `lsof` and `servera` does not; `/etc/exports` is empty; the firewall allows
  `cockpit`, `dhcpv6-client`, and `ssh`; there is no `/nfs`; and UIDs 1100,
  1101, 2001 to 2003 and GIDs 1200, 1201, 2000 are free on both. So every
  install step in the week installs something on the instructor lab. Whether
  the SCC lab matches is Open question 2.
- **Two hosts, as in the source.** `servera` is the NFS server and
  `workstation` the client. Every exercise except the first uses both, moving
  between them with `exit` and `ssh` as the source's command files do.
- **What earlier weeks taught.** W07: `firewall-cmd --add-service` and
  `--runtime-to-permanent`. W10: `mount`, `umount`, the six `/etc/fstab`
  fields, `systemctl daemon-reload`, and `mount -av`. W04: `systemctl enable
  --now` and `restart`. IT-130: `useradd`, `id`, `su -`, `chown`, `chmod`.
  This week relies on all of them without reteaching.
- **Generic names on slides, meaningful ones in exercises** (Decision 9).
  The source uses the same `/srv/share` and `/nfs/share` on its slides and in
  exercises 1 and 2, and teaching labels (`direct`, `indirect`, `east`,
  `west`) in exercises 3 and 4.
- **The exercises chain through the lab state.** See "Exercises".

## Deck-level decisions

- **Entry file:** `course/w13-draft.md`, renamed to `course/w13.md` at
  publication.
- **Accent:** `slate` (Decision 3). Cool, which suits a Bash-heavy deck, and
  used once, in w05. Used so far: teal (w01, w06), purple (w02, w11), blue
  (w03, w10), green (w04, w12), slate (w05), pink (w07), yellow (w08).
  `orange` is unused but warm; `red` is reserved for the Final.
- **Title:** "Accessing Network-Attached Storage", the source's own
  (Decision 4).
- **Cover agenda:** six lines, one per fragment (Decision 5).
- **Cover summary:**

  ```yaml
  courseInfo:
    summary: >-
      This week we will share a directory from servera over NFS, mount it on
      workstation by hand and at every boot, let autofs mount shares only when
      someone uses them, and see why NFS trusts user ID numbers rather than
      user names.
  ```

- **VM reminder:** "Start `workstation` and `servera` on your VDI", as in w10
  and w12 (Decision 6). The source says "Start your VDI" and "Start Up the
  `workstation` and `servera` VMs".
- **Chapter directory:**
  `course/chapters/rh134-ch15-accessing-network-attached-storage/`.
- **Alignments** (Decision 1):
  - Fragments 1, 3, 4, and 6: RH134 chapter `"15"`, *Accessing
    Network-Attached Storage*, and cert guide chapter `"24"`, *Accessing
    Network Storage*.
  - Fragment 2: cert guide `"24"` only, since RH134 does not cover the server.
  - Fragment 5: cert guide `"24"` (its "Understanding NFS Security"), plus
    RH124 `"10"`, *Managing Local Users and Groups*, and cert guide `"06"`,
    *User and Group Management*, for `useradd -u`, `groupadd -g`, and
    `usermod -u`. Those two titles match the ones `sudo.md` already declares.

## Source-to-fragment map

From `accessing_network_attached_storage.md`:

| Source | Title                                | Goes to     |
|-------:|--------------------------------------|-------------|
|     N1 | Section: Network File System         | 1.1         |
|     N2 | What Is Network File System (NFS)?   | 1.2         |
|     N3 | NFS in the Lab                       | 1.3         |
|     N4 | Section: NFS Server                  | 2.1         |
|     N5 | Install the `nfs-utils` Package      | 2.2         |
|     N6 | The /etc/exports File                | 2.3         |
|     N7 | Common Export Options                | 2.4         |
|     N8 | Enable the NFS Server                | 2.5         |
|     N9 | Configure the Firewall for NFS       | 2.6         |
|    N10 | Manage Exports with `exportfs`       | 2.7         |
|    N11 | Exercise: Configure an NFS Server    | 2.8         |
|    N12 | Section: Mounting NFS Exports        | 3.1         |
|    N13 | Install the `nfs-utils` Package      | 3.2         |
|    N14 | Discover Available Exports           | 3.3         |
|    N15 | Manually Mount an NFS Export         | 3.4         |
|    N16 | Persistent Mount via /etc/fstab      | 3.5         |
|    N17 | Unmount an NFS Export                | 3.6         |
|    N18 | Exercise: Mount NFS Exports          | 3.7         |
|    N19 | Section: Automounting with autofs    | 4.1         |
|    N20 | What Is the Automounter?             | 4.2         |
|    N21 | autofs sequence diagram (no heading) | 4.3         |
|    N22 | Why Use the Automounter?             | 4.4         |
|    N23 | Install `autofs`                     | 4.5         |
|    N24 | The Master Map File                  | 4.6         |
|    N25 | Direct Maps                          | 4.7         |
|    N26 | Direct Maps (fields)                 | 4.8         |
|    N27 | Enable the `autofs` Service          | 4.9         |
|    N28 | Exercise: Direct Map                 | 4.10        |
|    N29 | Indirect Maps                        | 4.11        |
|    N30 | Wildcard Maps                        | 4.12        |
|    N31 | Exercise: Indirect Map               | 4.13        |
|    N32 | Section: NFS Permissions             | 5.1         |
|    N33 | NFS Trusts UIDs, Not Usernames       | 5.2         |
|    N34 | UID Mismatch (list)                  | 5.3         |
|    N35 | UID Mismatch (table)                 | 5.4         |
|    N36 | Synchronizing UIDs                   | 5.5         |
|    N37 | What about the SuperUser UID (0)?    | 5.6         |
|    N38 | Exercise: UID-Based Access Control   | 5.7         |
|    N39 | Exercise: Observe a UID Mismatch     | 5.8         |
|    N40 | Section: Per-User Automounting       | 6.1         |
|    N41 | Per-User Shares with Indirect Maps   | 6.2         |
|    N42 | Exercise: Per-User Automounting      | 6.3         |

From `slides.md`: S1 (cover) and S2 (VM reminder) go to the entry file.

From `demonstrations/accessing_network_attached_storage/`:

| Source file                    | Goes to    |
|--------------------------------|------------|
| `configure_nfs_server.sh`      | Exercise 1 |
| `mount_nfs_exports.sh`         | Exercise 2 |
| `direct_map.sh`                | Exercise 3 |
| `indirect_map.sh`              | Exercise 4 |
| `uid_based_access_control.sh`  | Exercise 5 |
| `observe_uid_mismatch.sh`      | Exercise 6 |
| `per_user_automounting.sh`     | Exercise 7 |
| `troubleshooting.md`           | not ported |

Slides with no source row: the additions 1.2a, 3.3a, 3.4a, and 5.5a, and the
recording slides 2.8a, 3.7a, 4.10a, 4.13a, 5.7a, 5.8a, and 6.3a.

## File inventory

New, under `course/chapters/rh134-ch15-accessing-network-attached-storage/`:

| File                          | Slides | Exercises |
|-------------------------------|-------:|----------:|
| `network-file-system.md`      |      4 |         0 |
| `nfs-server.md`               |      9 |         1 |
| `mounting-nfs-exports.md`     |     10 |         1 |
| `automounting-with-autofs.md` |     15 |         2 |
| `nfs-permissions.md`          |     11 |         2 |
| `per-user-automounting.md`    |      4 |         1 |

Plus, in the topic's `exercises/`, one `.sh` command file, one `.html`
written exercise, and one processed `.cast` per exercise (seven of each). No
`assets/` directory: the week has no images.

Also new: `course/w13-draft.md`, published as `course/w13.md`, when
`tests/site.test.mjs` gains `"w13"` in its published-week list.

No theme change is planned.

## Third-party images

None. The deck references no images, and `public/` holds only the college and
Red Hat logos, which the theme's footer replaces. The three Mermaid diagrams
(N3, N20, N21) are the instructor's own source and are rebuilt as Mermaid in
the theme, so no placeholder is needed.

## Topic fragments

Each fragment opens with its `layout: section` slide, which carries the
`routeAlias` and `topicInfo`. A "fixed" `TerminalWindow` shows a transcript
that never changes and takes no `rows`. Every prompt takes the theme form,
`root@servera:~#`. The slide transcripts come from one slide chain on the
lab, using the slides' generic names (`/srv/share`, `/nfs/share`), so they
agree from slide to slide.

Where the source shows output, the slide shows recaptured output. Where it
shows commands only, the slide keeps a plain `bash` fence, since
`docs/course-authoring.md` forbids a transcript that implies a command printed
nothing when its output was only left out.

### 1. `network-file-system.md` (4 slides)

`routeAlias: network-file-system`. Alignments: RH134 chapter 15, cert guide
chapter 24. No exercise: the source section has none, and the next section's
exercise is the first thing students can do with NFS.

##### 1.1 Network File System

Source N1. Section slide carrying the `topicInfo`.

Components: `section`.

##### 1.2 What Is Network File System (NFS)?

Source N2. Six facts: a protocol for sharing directories over a network,
built into the Linux kernel, using native Linux permissions; the server
*exports* a directory, the client *mounts* it on a local path, and the client
then reads and writes files normally.

Components: default layout with `vertical: center`; `IconGrid` of six items
in two rows of three, Carbon icons chosen at build. The source's bullet list
is the fallback if you prefer it.

##### 1.2a NFS Versions

**Addition, accepted 2026-11-05** (Decision 26), from RH134 section 1 and
its lecture. RHEL 10 mounts with NFS 4.2 by default and supports versions 3
and 4. Side by side:

- **NFSv3:** TCP or UDP; each export stands alone; a client asks `rpcbind`
  (port 111) where `mountd` listens and asks `mountd` what is exported,
  which is what `showmount` does.
- **NFSv4:** TCP only, everything on port 2049; the server presents its
  exports as one export tree.

The slide is the reason 2.6 opens three firewalld services: `nfs` alone is
enough for an NFSv4 mount, and `rpc-bind` and `mountd` are there for
`showmount`. It also sets up the `vers=4.2` students see on 3.4 and the
export tree on 3.3a. Verified (Rounds 3 and 7): every mount on the lab
negotiated `vers=4.2`, and with only `nfs` open an NFSv4 mount worked while
`showmount` failed.

Components: `two-cols-header`, NFSv3 left and NFSv4 right, each a short list,
with the RHEL 10 default in the header.

##### 1.3 NFS in the Lab

Source N3. The lab's two roles: `servera` exports `/srv/share`, `workstation`
mounts it on `/nfs/share`, over NFS on TCP port 2049. The table repeats it as
Role, Machine, Action.

Components: default layout; Mermaid `flowchart LR` with the two hosts as
subgraphs and the port on the link; the source's three-column table.

### 2. `nfs-server.md` (9 slides)

`routeAlias: nfs-server`. Alignment: cert guide chapter 24. Exercise:
Configure an NFS Server Exercise.

##### 2.1 NFS Server

Source N4. Section slide carrying the `topicInfo`.

Components: `section`.

##### 2.2 Install the `nfs-utils` Package

Source N5. One package provides the server and the client tools. Table of
what it provides: the `nfs-server` service, `exportfs`, `showmount`, and
`mount.nfs`.

Two proposals (Decision 10):

- **Add a `dnf install nfs-utils` fence** above the table. The outline says
  this slide shows the command; the deck lost it.
- **Drop the `nfs-idmapd` row.** It says NFS maps UIDs to names, which 5.2's
  "NFS Trusts UIDs, Not Usernames" contradicts for the course's setup: with
  the default `sec=sys`, RHEL's client and server pass numeric IDs (verified:
  `nfs4_disable_idmapping` is `Y` in both the `nfs` and `nfsd` modules).

Verified: the package provides `/usr/sbin/exportfs`, `showmount`,
`mount.nfs`, and the `nfs-server` unit, and pulls in `rpcbind`, `gssproxy`,
`libnfsidmap`, `quota`, and five more on `servera`.

Components: default layout, `bash` fence, table.

##### 2.3 The /etc/exports File

Source N6. Each line exports one directory to the clients that may mount it:
`/path  client(options)`, with the field table (path, client as a subnet,
host name, or `*`, options) and the example
`/srv/share  172.25.250.0/24(rw,sync)`.

Components: default layout; a `text` fence titled `/etc/exports` for the
format; the field table; the example in a second titled fence. Decision 11
offers `TextExplainer` over the example line in place of the table.

One-line addition (Decision 31, accepted): files ending in `.exports` in
`/etc/exports.d/` are read too. Verified (Round 8): the directory comes with
`nfs-utils`, and a `share.exports` file there was exported; `exports(5)`
says the same.

Proposed addition (Decision 12): a `Callout` that no space may sit between a
client and its options. With one, `/srv/share  172.25.250.0/24 (rw,sync)`
exports to the subnet read-only and to everyone else read/write (`exports(5)`:
"No whitespace is permitted between a client and its option list"). Verified
(Round 2): `exportfs -r` only warns, exits 0, and `exportfs -v` then lists
`172.25.250.0/24(...,ro,...)` and `<world>(...,rw,...)`. It is the classic
`/etc/exports` mistake and costs one line.

##### 2.4 Common Export Options

Source N7. The example line again, and a table of Option, Default, Meaning:
`rw`, `ro` (default), and `sync`.

Correction: `sync` is a default too. `exports(5)`: "In all releases after
1.0.0, sync is the default". Verified (Round 2): a line with only `(rw)`
shows `sync` in `exportfs -v`, and a line with no options at all shows `sync`
and `ro`, after the warning `exportfs: No options for /srv/share
172.25.250.0/24: suggest 172.25.250.0/24(sync) to avoid warning`.

Proposed addition (Decision 13): a `root_squash` row, default, "Client `root`
is treated as `nobody`", with a pointer to 5.6. Exercise 1 gives its export
to `student`, and exercise 2 drops from `root` to `student` to write a file;
neither makes sense until `root_squash` is on a slide. The outline put
`root_squash` on this slide before it moved to NFS Permissions.

Components: titled `text` fence, table.

##### 2.5 Enable the NFS Server

Source N8. `systemctl enable nfs-server --now` starts the server and enables
it at boot.

Components: fixed `TerminalWindow` with the recaptured symlink line; a
`Callout` for the dependencies.

Verified (Round 2): the output is one line,
`Created symlink '/etc/systemd/system/multi-user.target.wants/nfs-server.service' → '/usr/lib/systemd/system/nfs-server.service'.`,
with the quotes the source lacks.

Correction: the callout says `rpcbind` and `nfs-mountd` are "started and
enabled automatically". Verified: both start with `nfs-server`, which
requires `nfs-mountd` and wants `rpcbind.socket`. `rpcbind` is enabled by its
package preset when `nfs-utils` pulls it in, not by this command, and
`nfs-mountd` is `static`, so it cannot be enabled at all. The callout becomes
"`rpcbind` and `nfs-mountd` start with it".

##### 2.6 Configure the Firewall for NFS

Source N9. Three firewalld services in one command, then
`--runtime-to-permanent`, and a table of what each service is for: `nfs`
carries the data on TCP 2049, `rpc-bind` tells clients where `mountd`
listens (TCP and UDP 111), and `mountd` answers mount requests.

Components: fixed `TerminalWindow` with both commands and their `success`
lines; the table. Proposed: give `mountd` its port in the table like the
other two rows.

Verified (Round 2): the three-service command prints one `success`, and so
does `--runtime-to-permanent`. `firewall-cmd --info-service` gives `nfs`
2049/tcp, `rpc-bind` 111/tcp and 111/udp, and `mountd` 20048/tcp and
20048/udp.

One-line addition (Decision 31, accepted): the client opens no ports; only
the server's firewall changes (Cert Guide review question 10).

##### 2.7 Manage Exports with `exportfs`

Source N10. Two ideas: `exportfs -r` re-reads `/etc/exports` and applies the
changes without restarting the server, so clients stay connected;
`exportfs -v` lists the active exports with every option, including the
defaults.

Components: `v-switch` at 1 with two templates, as the source has it. Each
template keeps its own sentence and a fixed `TerminalWindow`; the second
repeats the first command and adds `exportfs -v` with its recaptured output,
highlighting `sync`, `rw`, and `root_squash`, which ties back to 2.4.

Verified (Round 2): `exportfs -r` prints nothing. `exportfs -v` prints
`/srv/share`, padding, a tab, then
`172.25.250.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)`:
111 columns, which fits a 120-column terminal frame but not a full-width
`TextExplainer` (about 90 at `sm`, per w12), so it is highlighted rather than
explained.

##### 2.8 Exercise: Configure an NFS Server

Source N11. Goal: share a directory on `servera` with the lab network.
Environment: **Host:** `servera`. Workflow, the source's six steps with the
exercise names from Decision 9:

1. Install `nfs-utils`
2. Create `/srv/reports` and give it to `student`
3. Export it read/write to `172.25.250.0/24`
4. Enable and start the `nfs-server` service
5. Open the firewall for NFS
6. Verify the export with `exportfs -v`

Step 2 names `student` because the command file does `chown student:student`
and the slide says nothing about why; with Decision 13, 2.4 has said why.

##### 2.8a Exercise: Configure an NFS Server (recording)

Addition. Recording slide, built once the cast exists.

### 3. `mounting-nfs-exports.md` (10 slides)

`routeAlias: mounting-nfs-exports`. Alignments: RH134 chapter 15, cert guide
chapter 24. Exercise: Mount NFS Exports Exercise.

##### 3.1 Mounting NFS Exports

Source N12. Section slide carrying the `topicInfo`.

Components: `section`.

##### 3.2 Install the `nfs-utils` Package

Source N13. The same package as the server, which also provides the client
tools: `mount.nfs` and `showmount`.

Components: default layout, two bullets, table. Verified: `workstation`
lacks the package on the instructor lab, so the install is real there; on
the SCC lab it may print "already installed" (Open question 2), which is
fine.

##### 3.3 Discover Available Exports

Source N14. `showmount --exports servera` lists what `servera` exports and to
whom. The callout: `showmount` asks over RPC, so the server's firewall must
allow `mountd` and `rpc-bind`.

Components: fixed `TerminalWindow` with the recaptured output; `Callout`.

Verified (Round 2): the output is `Export list for servera:` then
`/srv/share 172.25.250.0/24`, as the source shows. With only `nfs` open in
`servera`'s firewall it fails at once with `clnt_create: RPC: Unable to
receive` (exit 1). Proposed: quote that error in the callout, since it is
what a student who skipped two of the three services will see.

##### 3.3a Browse the NFSv4 Export Tree

**Addition, accepted 2026-11-05** (Decision 27, which reverses Decision 19),
from RH134 section 1 and the Cert Guide (Exercise 24-2, quiz question 2,
review question 4). When `showmount` is blocked, mount the root of the
server's export tree and look around: `mount servera:/ /mnt`, `ls /mnt`,
`ls /mnt/srv`, then `umount /mnt`. Entering an export mounts it; nothing is
mounted for good.

Verified (Round 7), with only `nfs` open on `servera` and three exports:
`mount servera:/ /mnt` printed nothing, `ls /mnt` showed `srv`, `ls
/mnt/srv` showed `homes`, `ro`, and `share`, `ls /mnt/srv/share` added
`servera:/srv/share on /mnt/srv/share type nfs4`, and `umount /mnt` released
all of them. For the slide, the capture is redone with the slide chain's one
export, `/srv/share`.

Components: fixed `TerminalWindow`; one closing line that the `/` is the
export tree's root, not `servera`'s root file system. It uses `mount` and
`umount` before 3.4, which is fine: w10 taught both, and RH134 orders it the
same way.

##### 3.4 Manually Mount an NFS Export

Source N15. A manual mount lasts until the next reboot, which makes it the way
to test an export before writing it into `/etc/fstab`.

Components: default layout, three bullets, fixed `TerminalWindow` with
`mkdir -p /nfs/share`, the `mount -t nfs -o rw,sync` line, and the check.

Verified (Round 3): `mount` prints nothing, and the mount appears as type
`nfs4` with `vers=4.2`. The source's `mount | grep nfs` is right on the
client: it matches only the share's line, because the `rpc_pipefs` and `nfsd`
lines appear on the server alone. (I first proposed changing it; withdrawn.)
The line is 209 columns, so it is wrapped once at a space as w12 did, with
`nfs4` and `vers=4.2` highlighted, and the source's `...` goes. After the
mount, `ls -ld /nfs/share` shows the server directory's owner (`student`)
instead of the local mount point's (`root`).

One-line addition (Decision 31, accepted): `-t nfs` is optional, since the
`server:/export` form implies it (RH134; Cert Guide review question 3). Round
7's root mount used no `-t` and mounted `nfs4`.

##### 3.4a The Server Has the Final Say

**Addition, accepted 2026-11-05** (Decision 28), from RH134 section 3 and the
section 1 lecture. The client's `-o rw` is a request; an export marked `ro`
wins.

Verified (Round 7): `/srv/ro` exported `(ro)` and mounted with `mount -t nfs
-o rw,sync servera:/srv/ro /nfs/ro`; the mount succeeds, `mount` lists `rw`
among its options, and `student` gets `touch: cannot touch
'/nfs/ro/newfile': Read-only file system` (exit 1). That `rw` in `mount`'s
output is the point of the slide: the client cannot tell from its own side.

Components: fixed `TerminalWindow` (the mount, `mount | grep`, the failed
`touch`), and a one-line `Callout`. The capture is redone in the slide chain,
which adds a read-only export to `servera` for this slide and removes it
after.

##### 3.5 Persistent Mount via /etc/fstab

Source N16. The `/etc/fstab` line `servera:/srv/share  /nfs/share  nfs
rw,sync,_netdev,nofail  0 0`, then `systemctl daemon-reload` and
`mount /nfs/share` to apply it without rebooting.

Components: default layout; `TextExplainer` over the line (Decision 14),
marking what differs from w10's local line: the `server:export` device, the
`nfs` type, `rw,sync`, and `nofail`; then a fixed `TerminalWindow` for the
two commands, which print nothing (verified), so bare prompts are honest.

Proposal (Decision 14): drop `_netdev` and explain `nofail`. Neither is
explained on the source slide, yet the exercise types both. The Cert Guide
says `_netdev` "is no longer required". The lab agrees and shows why `nofail`
earns its place (Rounds 3 and 4):

- **`_netdev` changes nothing for an `nfs` line.** The generated
  `nfs-share.mount` has identical dependencies with and without it:
  `After=` and `Wants=network-online.target` and `After=remote-fs-pre.target`
  either way.
- **`nofail` decides whether the boot waits.** Without it the mount is
  `RequiredBy=remote-fs.target` and ordered before it; with it, only
  `WantedBy=remote-fs.target`.
- **The cost, measured.** With `servera`'s NFS port closed, `workstation`
  without `nofail` reached its graphical login 1 min 34 s into userspace,
  after the mount timed out at 90 seconds; SSH answered 120 seconds after the
  reboot. With `nofail` it reached the login 3.4 seconds into userspace and
  SSH answered after 15 seconds, while the mount still failed quietly at 90
  seconds. Both boots ended `degraded`, neither stopped.

That makes `nofail` a lesson in itself for a lab where `servera` is often
off when `workstation` boots. The lab's own `/mnt/dvd` line uses
`defaults,nofail`, which makes a good aside.

##### 3.6 Unmount an NFS Export

Source N17. Three steps in a `v-switch`: `umount /nfs/share` (the
`/etc/fstab` line stays, so the share mounts again at boot); "target is busy"
when a process has a file open or a shell sits inside the mount point; and
`lsof /nfs/share` to find that process.

Components: `v-switch` at 1, three templates, each a sentence and a fixed
`TerminalWindow` with recaptured output.

Correction (Round 3): an NFS unmount reports
`umount.nfs4: /nfs/share: device is busy` (exit 16), not the source's
`umount: /nfs/share: target is busy`, which is the message for a local file
system. The source's template heading, "Device Is Busy", already matches the
real message.

Verified: `lsof` is on `workstation`, and with a `student` shell sitting in
the mount point it prints
`bash    4221 student  cwd    DIR   0,56       22 12960328 /nfs/share (servera:/srv/share)`
under its header. Run as `root` while `student` has a desktop session open,
it first prints four warning lines about the desktop's FUSE file systems
(`lsof: WARNING: can't stat() fuse.gvfsd-fuse file system
/run/user/1000/gvfs`, then the same for `fuse.portal` at
`/run/user/1000/doc`, each followed by "Output information may be
incomplete."). Students working at `workstation`'s desktop will see them too.
Decision 21: show them, with a one-line note that they are harmless, or
capture without a desktop session and say nothing.

One-line addition (Decision 31, accepted), on the third template: first
leave the mount point or close the program; `umount -f` forces the unmount
and can lose unwritten data (RH134 section 1).

##### 3.7 Exercise: Mount NFS Exports

Source N18. Goal: mount `servera`'s export on `workstation` by hand, then at
every boot. Environment: **Hosts:** `servera` (server), `workstation`
(client); **Prerequisite exercise:** Configure an NFS Server. Workflow, the
source's seven steps with Decision 9's names:

1. On `workstation`, install `nfs-utils`
2. Verify `servera`'s export is visible with `showmount --exports`
3. Mount it on `/nfs/reports` and confirm `student` can write a file
4. Unmount the export
5. Add the export to `/etc/fstab` with `rw,sync` options
6. Mount it from `/etc/fstab` and verify it is mounted
7. Reboot `workstation` and confirm the export mounts automatically

##### 3.7a Exercise: Mount NFS Exports (recording)

Addition. Recording slide, built once the cast exists.

### 4. `automounting-with-autofs.md` (15 slides)

`routeAlias: automounting-with-autofs`. Alignments: RH134 chapter 15, cert
guide chapter 24. Exercises: Configure a Direct Map Exercise and Configure an
Indirect Map Exercise. Eight content slides before the first exercise, inside
the ten-slide guideline.

##### 4.1 Automounting with autofs

Source N19. Section slide carrying the `topicInfo`.

Components: `section`.

##### 4.2 What Is the Automounter?

Source N20. `autofs` watches configured directories, mounts a share just in
time when someone enters one, and unmounts it after an idle timeout. A
flowchart walks the cycle: access, mount, read and write, idle, unmount.

Components: default layout, four bullets, Mermaid `flowchart LR`. Proposed:
name the default timeout in the last bullet, five minutes (verified:
`timeout = 300` in `/etc/autofs.conf`, and `timeout=300` on every `autofs`
mount line).

##### 4.3 autofs Mounts on First Access

Source N21. The same cycle as a sequence diagram between the user, `autofs`,
and `servera`.

Components: default layout, Mermaid `sequenceDiagram`.

Two changes (Decision 15). **A title:** the source slide has none, and the
theme's default layout and the page's heading structure need one; "autofs
Mounts on First Access" is a placeholder for your wording. **The unmount
arrow:** the source draws `autofs->>servera: unmount`, but unmounting happens
on `workstation` and sends nothing to the server, so it becomes a note over
`autofs`. 4.2 and 4.3 show one cycle twice; both stay, as in the source.

##### 4.4 Why Use the Automounter?

Source N22. Compared with `/etc/fstab`: an `/etc/fstab` mount is always
mounted, even when nobody uses it, and an unreachable server at boot slows
the boot; `autofs` mounts on demand, unmounts after a timeout, and lets
non-root users trigger the mount.

Components: default layout with `listSpacing: padded`, the source's nested
list.

Correction: "can delay or halt the boot process" becomes "can delay the
boot". Verified (Round 4, the test under 3.5): with `servera`'s NFS port
closed and no `nofail`, `workstation` waited 90 seconds for the mount, then
carried on to its graphical login and finished `degraded`. A failed network
mount fails `remote-fs.target`, not `local-fs.target`, so there is no
emergency shell. "Delays the boot by 90 seconds" is now a measured claim if
you want the number.

##### 4.5 Install `autofs`

Source N23. `dnf install autofs`, and a table of what matters in the package:
the `autofs` service, `/etc/auto.master`, and `/etc/auto.master.d/`.

Components: `bash` fence, table.

Correction: the table calls `/etc/auto.master` a "legacy" master map. It is
the default master map, and its `+dir:/etc/auto.master.d` line is what reads
the drop-in directory; RH134 recommends the directory. The row becomes
"Default master map; reads `/etc/auto.master.d/`".

Verified (Round 5): the installed `/etc/auto.master` has four active lines,
`/misc  /etc/auto.misc`, `/net  -hosts`, `+dir:/etc/auto.master.d`, and
`+auto.master`. `dnf install autofs` also pulls in `libsss_autofs`.

##### 4.6 The Master Map File

Source N24. A file in `/etc/auto.master.d/` with an `.autofs` extension; each
line pairs a base directory with a map file, `base-directory  map-file`, with
the field table (`/nfs`, `/etc/auto.nfs`).

Components: three bullets, titled `text` fence, the field table (Decision 11
offers `TextExplainer`).

One-line addition (Decision 31, accepted): name the map file
`/etc/auto.name` after what it mounts, as the slide's `/etc/auto.nfs` does
(RH134; Cert Guide quiz question 8).

##### 4.7 Direct Maps

Source N25. A direct map mounts a share at a fixed, known path: the master map
entry uses `/-` as its base directory, and the map file gives the full path.

Components: three bullets; two titled `text` fences,
`/etc/auto.master.d/direct.autofs` (`/-  /etc/auto.direct`) and
`/etc/auto.direct` (`/nfs/share  -rw,sync  servera:/srv/share`).

##### 4.8 Direct Maps

Source N26. The direct map line again with its field table: mount point (a
full path), options (led by `-`), and source (`server:export`).

Components: titled `text` fence and table (Decision 11 offers
`TextExplainer`). The title repeats 4.7's as in the source; "Direct Map
Entries" would tell them apart if you want.

Addition (Decision 29, accepted): a row for `-fstype=`, "names the file
system type, such as `-fstype=nfs4`; optional, NFS is the default". The RHA
guided exercise writes `-fstype=nfs,rw,sync` and the RHA lab students are
assigned writes `-rw,sync,fstype=nfs4`, so they meet it in the homework.
Verified (Rounds 5 and 8): maps without it mount `nfs4`, and
`-fstype=nfs4,rw,sync` mounts the same way.

##### 4.9 Enable the `autofs` Service

Source N27. `systemctl enable autofs --now`; the mount point need not exist,
since `autofs` creates it; and nothing is mounted until the path is first
used.

Components: fixed `TerminalWindow` with the recaptured symlink line; two
bullets.

Correction (Decision 16): the callout says to verify with `mount | grep
autofs` before and after access. Verified wrong (Round 5): it prints four
lines both times, `systemd-1` on `/proc/sys/fs/binfmt_misc`, `/etc/auto.misc`
on `/misc`, `-hosts` on `/net`, and `/etc/auto.direct` on `/nfs/share`, and
never the share, whose type is `nfs4`. Before `autofs` is even installed it
already matches the `binfmt_misc` line. Proposed replacement: a second
template in a `v-switch` showing the real check on first access, `mount |
grep /nfs/share` (one `autofs` line), `ls /nfs/share`, and `mount | grep
/nfs/share` again (the `autofs` line and the `nfs4` line), as a Magic Move
with `rows`. Verified exactly so, with `ls` run as `student`, which also shows
a non-root user triggering the mount. Exercise 3's last two steps use it.

Also verified: the `enable` line has the quoted form 2.5 shows, and `autofs`
created both `/nfs` and `/nfs/share` itself, so the first bullet holds.

##### 4.10 Exercise: Configure a Direct Map

Source N28. Goal: have `workstation` mount a share at a fixed path the first
time it is used. Environment: **Hosts:** `servera` (server), `workstation`
(client); **Prerequisite exercise:** Mount NFS Exports. Workflow, the
source's eight steps with Decision 9's names:

1. On `servera`, create `/srv/manuals` and export it
2. Reload the exports and verify with `showmount --exports`
3. On `workstation`, install `autofs`
4. Create the master map file in `/etc/auto.master.d/`
5. Create the direct map for `/nfs/manuals`
6. Enable and start the `autofs` service
7. Verify the share is not mounted, then access the mount point
8. Verify the share is now mounted

Step 8 drops the source's "with `mount | grep autofs`" (Decision 16).

##### 4.10a Exercise: Configure a Direct Map (recording)

Addition. Recording slide, built once the cast exists.

##### 4.11 Indirect Maps

Source N29. An indirect map mounts shares in subdirectories of a base
directory: the master map names the base, `/nfs  /etc/auto.indirect`, and the
map file gives a relative name, `share  -rw,sync  servera:/srv/share`, so the
share appears at `/nfs/share` and `autofs` creates and removes `share`.

Components: three bullets, two titled `text` fences, closing line.

Verified (Round 5): an indirect map takes over its whole base directory. A
directory `/nfs/other` made beforehand vanished from `ls -la /nfs` while the
map was active and came back when it was removed, and `ls /nfs` lists only
keys already mounted (`browse_mode = no`). Proposed (Decision 22): a
one-line `Callout` saying to give an indirect map a base directory of its
own, which is what the exercises do.

##### 4.12 Wildcard Maps

Source N30. One entry covers every subdirectory: `*` is the key and `&`
repeats it in the source, so `/nfs/docs` mounts `servera:/srv/docs`, each on
first access. The callout: the server must have the requested subdirectory.

Components: two bullets, titled `text` fence, two bullets, `Callout`.

Verified (Round 5): exporting the parent (`/srv/regions`) is enough for the
client to mount its subdirectories (`servera:/srv/regions/east` mounted on
`/nfs/regions/east`), which the source's exercise relies on. A key with no
directory behind it fails with `ls: cannot access '/nfs/regions/nope': No
such file or directory`.

Correction to the callout: the subdirectory must be *exported*, not only
present. With the slide's own `*  -rw,sync  servera:/srv/&`, `/srv/share`
(exported) mounted, but `/srv/docs`, which existed on `servera` and was not
exported, gave the same "No such file or directory". So the slide's
`/nfs/docs` and `/nfs/data` work only if `servera` exports `/srv/docs` and
`/srv/data`, or `/srv` itself. The callout becomes "`servera` must export each
requested directory, or a directory above it".

##### 4.13 Exercise: Configure an Indirect Map

Source N31. Goal: mount each subdirectory of a share on demand with one map
entry. Environment: **Hosts:** `servera` (server), `workstation` (client);
**Prerequisite exercise:** Configure a Direct Map. Workflow, the source's
eight steps with Decision 9's names:

1. On `servera`, create `/srv/regions` with `east` and `west` subdirectories
   and export it
2. Reload the exports and verify with `showmount --exports`
3. On `workstation`, add a master map entry for `/nfs/regions`
4. Create the indirect map file with a wildcard entry
5. Restart the `autofs` service
6. Verify `/nfs/regions` is empty before accessing any subdirectory
7. Access `east` and verify only it is mounted
8. Access `west` and verify both are mounted

##### 4.13a Exercise: Configure an Indirect Map (recording)

Addition. Recording slide, built once the cast exists.

### 5. `nfs-permissions.md` (11 slides)

`routeAlias: nfs-permissions`. Alignments: cert guide chapter 24, RH124
chapter 10, cert guide chapter 06. Exercises: UID-Based Access Control
Exercise and Observe a UID Mismatch Exercise.

##### 5.1 NFS Permissions

Source N32. Section slide carrying the `topicInfo`.

Components: `section`.

##### 5.2 NFS Trusts UIDs, Not Usernames

Source N33. The server receives a UID number and checks it against the file
permissions on disk. The client's `alice` is UID 1001, and so is the
server's; the server also has `bob` as 1007.

Components: `two-cols-header`, the two titled fences (Client, Server) side by
side, the callout "NFS trusts the UID the client sends" in the `bottom` band.

Correction, small: the client sends its group IDs as well, and group
permissions are checked against them; exercise 5's group-owned directories
depend on that. The first bullet becomes "a UID and GID numbers".

##### 5.3 UID Mismatch

Source N34. UIDs are assigned locally on each machine with no automatic
synchronization, so one user name can have different UIDs on different
machines, and a mismatch gives a user someone else's permissions on the
server.

Components: nested list, `listSpacing: padded`.

##### 5.4 UID Mismatch

Source N35. The worked case: `servera` has `alice` 1001 and `bob` 1002,
`workstation` has them the other way round, so `workstation`'s `bob` reaches
the share as UID 1001 and gets what `alice` should.

Components: the source's four-row table and two lines. The title repeats
5.3's as in the source.

##### 5.5 Synchronizing UIDs

Source N36. Central accounts (LDAP or Active Directory) are the real answer
and outside RHCSA; otherwise create users and groups with explicit IDs, the
same on both machines: `groupadd -g` and `useradd -u ... -g ...`.

Components: two bullets; `two-cols-header` with the `servera` commands left
and the `workstation` commands right, each in a fixed `TerminalWindow` with
`id` after them, and the callout ("same UID, same GID, same username") in the
`bottom` band. Verified (Round 6): `groupadd -g` and `useradd -u ... -g ...`
print nothing, and `id alice` gives `uid=2001(alice) gid=2000(developers)
groups=2000(developers)`.

Proposed (part of Decision 9): move the slide's IDs off the exercise's. The
slide creates `developers` as GID 1100 and `alice` as UID 1101, while
exercise 5 uses 1100 and 1101 for `con_john` and `dev_jane` and 1201 for
`developers`. GID 2000 and UID 2001 on the slide keep each number meaning one
thing.

##### 5.5a Change an Existing User's UID

**Addition, proposed** (Decision 17). Exercise 6 runs `usermod -ou 1101
con_john` and later `usermod -u 1100 con_john`, and no slide teaches
`usermod`. This slide would: `usermod -u` changes an existing account's UID
and re-owns the files in its home directory, and `-o` allows a UID another
account already has. One fixed `TerminalWindow`: `id`, `usermod -u`, `id`
again on the slide's `alice`.

Verified (Round 6):

- `usermod -u 2002 alice` prints nothing and re-owns `/home/alice` and its
  files to 2002.
- Without `-o`, a UID in use is refused: `usermod: UID '1000' already
  exists`, exit 4. That error is the reason `-o` exists, so it belongs on the
  slide.
- `usermod` refuses to change a UID while any process runs under it:
  `usermod: user alice is currently used by process 1476`, exit 8. I hit it
  by moving `alice` onto `student`'s UID 1000 while my own `student` SSH
  session was open, and put her back by editing `/etc/passwd`. In exercise 6
  it would bite only if `dev_jane` had a session open on `workstation`
  during the restore. `su -` leaves nothing behind: `usermod` succeeded
  straight after a `su - bob` session ended, with no `user@` service
  lingering.
- With two accounts on one UID, `id` names whichever comes first in
  `/etc/passwd`: after `usermod -o -u 2001 bob`, `id bob` printed
  `uid=2001(alice) gid=2003(bob) groups=2000(developers)`. In exercise 6
  `con_john` was created before `dev_jane`, so `id con_john` will still say
  `con_john`; worth one line in the written exercise.

The alternative is two lines added to 5.5, at the cost of a fuller slide.

##### 5.6 What about the Superuser UID (0)?

Source N37. By default NFS applies `root_squash`: a client's `root` (UID 0)
becomes `nobody`, an unprivileged account, on the server, which limits what a
compromised client can do. Table of `root_squash` (default) and
`no_root_squash`.

Components: three bullets, table, `Callout`. "SuperUser" becomes
"Superuser".

Verified (Rounds 3 and 6): `root` on `workstation` gets `touch: cannot touch
'/nfs/share/rootfile': Permission denied` in a directory owned by
`student`; in a mode 777 directory its new file belongs to `nobody nobody`,
UID and GID 65534, on both hosts. Optional (Decision 23): those two results
as a fixed `TerminalWindow` under the table, which shows the squash rather
than describing it.

##### 5.7 Exercise: UID-Based Access Control

Source N38. Goal: give two users their own directories on one share and prove
each reaches only their own. Environment: **Hosts:** `servera` (server),
`workstation` (client); **Prerequisite exercise:** Configure an NFS Server.
Workflow, the source's six steps:

1. On `servera`, create two groups and two users with explicit UIDs and GIDs
2. Create a directory for each group, owned by it, that only its members can
   enter
3. Export the parent directory to the subnet
4. On `workstation`, create the same groups and users with the same UIDs and
   GIDs
5. Mount the export on `workstation`
6. As each user, verify you can use your own directory but not the other

The names are the source's: `consultants` (GID 1200) with `con_john` (UID
1100), `developers` (GID 1201) with `dev_jane` (UID 1101), `/srv/teams`
mounted on `/nfs/teams`.

Verified with the slide names (Round 6): each user reads their own 770
directory and gets `Permission denied` on the other's. The command file's note
is right: `root`'s `ls -l` on the share prints `ls: /nfs/share/alice:
Permission denied` for each 770 directory, then lists them anyway (exit 0),
because the squashed `root` cannot read their attributes. (I first proposed
removing that note; withdrawn.)

##### 5.7a Exercise: UID-Based Access Control (recording)

Addition. Recording slide, built once the cast exists.

##### 5.8 Exercise: Observe a UID Mismatch

Source N39. Goal: break one user's UID on `workstation` and watch the server
apply someone else's permissions. Environment: **Hosts:** `servera`
(server), `workstation` (client); **Prerequisite exercise:** UID-Based Access
Control. Workflow, the source's four steps:

1. On `workstation`, give `con_john` the UID `dev_jane` has on `servera`
2. Without remounting, access the share as `con_john`
3. Note which files you can reach, and whose permissions apply
4. Restore `con_john`'s UID and verify his access is back to normal

Correction to the command file's note: `con_john` keeps his primary group,
`consultants` (GID 1200), so with `dev_jane`'s UID he reaches both
directories, `developers` as its owner and `consultants` through his group.
Verified with the slide names (Round 6): `bob`, moved onto `alice`'s UID
2001 but still in group `bob`, read both `alice`'s notes and his own. Also
worth showing: during the mismatch `ls -l` listed `bob`'s directory as owned
by a bare `2003`, since no local account had that UID any more; in the
exercise, `consultants` will show `1100`.

##### 5.8a Exercise: Observe a UID Mismatch (recording)

Addition. Recording slide, built once the cast exists.

### 6. `per-user-automounting.md` (4 slides)

`routeAlias: per-user-automounting`. Alignments: RH134 chapter 15, cert guide
chapter 24. Exercise: Per-User Automounting Exercise.

##### 6.1 Per-User Automounting

Source N40. Section slide carrying the `topicInfo`.

Components: `section`.

##### 6.2 Per-User Shares with Indirect Maps

Source N41. A wildcard indirect map and group-owned directories together: each
user reaches `/nfs/username`, `autofs` mounts `servera:/srv/shares/username`,
and the server's permissions decide who can use it. The callout: the mount
succeeds for everyone; permissions decide what happens next.

Components: three bullets, two titled `text` fences, `Callout`.

Addition (Decision 24, accepted 2026-11-05 in this reduced form): one closing
sentence tying the slide to the RHCSA task. Draft: "Point a user's home
directory at this path and the same map serves home directories, which is
how the RHCSA practice exams phrase this task." No new slide, and exercise 7
does not change. Verified (Round 7): `useradd -d` on a wildcard map's path
works and `su -` lands in the NFS home.

##### 6.3 Exercise: Per-User Automounting

Source N42. Goal: give each user an automounted directory of their own from
one map entry. Environment: **Hosts:** `servera` (server), `workstation`
(client); **Prerequisite exercises:** Configure an Indirect Map and UID-Based
Access Control. Workflow, the source's seven steps, corrected:

1. On `servera`, create `/srv/usershares` with a directory for each user,
   owned by that user's group
2. Export the parent directory to the subnet
3. On `workstation`, confirm `con_john` and `dev_jane` have the same UIDs and
   GIDs as on `servera`
4. Configure a wildcard indirect map for `/nfs/usershares`
5. Restart `autofs`
6. As each user, verify your own directory mounts on access
7. Verify neither user can use the other's directory

Corrections: the source's step 3 creates the users, who already exist on both
hosts since exercise 5 (the command file says so and does not create them);
and its step 4 names `servera:/srv/shares/&` under `/nfs`, the slide's
example, where the command file uses `/srv/usershares` under
`/nfs/usershares`.

##### 6.3a Exercise: Per-User Automounting (recording)

Addition. Recording slide, built once the cast exists.

## Exercises

| # | Title                    | Frag | Hosts               | Command file                            |
|--:|--------------------------|-----:|---------------------|-----------------------------------------|
| 1 | Configure an NFS Server  |    2 | servera             | `configure-nfs-server-exercise.sh`      |
| 2 | Mount NFS Exports        |    3 | servera, workstation | `mount-nfs-exports-exercise.sh`        |
| 3 | Configure a Direct Map   |    4 | servera, workstation | `configure-direct-map-exercise.sh`     |
| 4 | Configure an Indirect Map |   4 | servera, workstation | `configure-indirect-map-exercise.sh`   |
| 5 | UID-Based Access Control |    5 | servera, workstation | `uid-based-access-control-exercise.sh` |
| 6 | Observe a UID Mismatch   |    5 | workstation         | `observe-uid-mismatch-exercise.sh`      |
| 7 | Per-User Automounting    |    6 | servera, workstation | `per-user-automounting-exercise.sh`    |

Each declared title ends in "Exercise". The command files port the source's
seven, rewritten to the current `kitty-demo` format: `#@ key escape` and
`:wq` for `jj:wq`, a 10-second pause on each requirements block, `#!` notes
for the source's inline remarks, and pauses where "Pausing for the audience"
calls for them.

**The chain.** One pass, in order, with no resets. Each exercise ends in the
state the next expects:

1. `servera`: `nfs-utils` installed, `/srv/reports` exported, `nfs-server`
   enabled, the three firewalld services permanent.
2. `workstation`: `nfs-utils`, `/nfs/reports` in `/etc/fstab`, mounted after
   a reboot.
3. `servera`: `/srv/manuals` exported. `workstation`: `autofs` installed and
   enabled, a direct map for `/nfs/manuals`.
4. `servera`: `/srv/regions` with `east` and `west` exported. `workstation`:
   an indirect map for `/nfs/regions`.
5. Both hosts: `consultants` 1200, `developers` 1201, `con_john` 1100,
   `dev_jane` 1101. `servera`: `/srv/teams` exported. `workstation`:
   `/nfs/teams` mounted by hand.
6. `workstation`: `con_john`'s UID changed and restored, so it ends where 5
   ended.
7. `servera`: `/srv/usershares` exported. `workstation`: an indirect map for
   `/nfs/usershares`. Its cleanup returns both hosts to the week's start.

**Cleanup** (Decision 18). The source has none. Proposed: each exercise
removes, at its end, what no later exercise uses, and exercise 7 removes the
rest. Exercise 2 removes its `/etc/fstab` line, the mount, and exercise 1's
export; 3 and 4 remove their maps and exports; 6 unmounts `/nfs/teams` and
removes its export; 7 removes its map and export, the users and groups on both
hosts, the firewalld services, disables `nfs-server` and `autofs`, and removes
the packages the week installed that the snapshot lacked, as w05 to w07 do
with `httpd`. Every cleanup uses commands students already know.

Tried by hand on 2026-11-05 (Round 6): `dnf remove -y nfs-utils` (with
`autofs` on `workstation`) also removes `rpcbind`, `gssproxy`, `libev`, and
`libverto-libev`, and on `servera` `libtirpc` and `quota`, but leaves
`libnfsidmap` and `sssd-nfs-idmap` (and `libsss_autofs` on `workstation`),
the `rpc` and `rpcuser` system accounts, and `/var/lib/nfs`. That is close
enough for students; naming the leftover libraries would teach package names
nobody needs. The instructor lab was then reverted to be exact.

**Reboots.** Exercise 2 reboots `workstation`, which ends the SSH session; the
command file reconnects with `ssh workstation` after a pause. On the VDI a
graphical `workstation` reboots far slower than on the instructor lab (Open
question 4).

**Nothing happens at a console.** Every step runs over SSH, so all seven are
recorded the ordinary way (Decision 8).

## Additions

Proposed, each with its decision:

1. **Slide 5.5a, Change an Existing User's UID** (Decision 17), so exercise 6
   uses no untaught command.
2. **A `dnf install nfs-utils` fence on 2.2** (Decision 10).
3. **The no-space `Callout` on 2.3** (Decision 12).
4. **A `root_squash` row on 2.4** (Decision 13), so exercises 1 and 2 can
   explain `student`.
5. **`nofail` explained on 3.5** (Decision 14).
6. **The first-access transcript on 4.9** (Decision 16), replacing a callout
   that is wrong.
7. **The `mountd` port on 2.6, and the five-minute timeout on 4.2**, each one
   table cell or bullet.
8. **Recording slides** for all seven exercises (Decision 8). The source has
   none.
9. **Cleanup steps** in the command files and written exercises
   (Decision 18). The source has none.

Accepted 2026-11-05 from the coverage check:

10. **Slide 1.2a, NFS Versions** (Decision 26).
11. **Slide 3.3a, Browse the NFSv4 Export Tree** (Decision 27).
12. **Slide 3.4a, The Server Has the Final Say** (Decision 28).
13. **A `-fstype=` row on 4.8** (Decision 29).
14. **One line each on 2.3, 2.6, 3.4, 3.6, and 4.6** (Decision 31).
15. **One sentence on 6.2** tying per-user automounting to home directories
    (Decision 24, reduced from a slide and two exercise steps).

Left out after discussion: the `use_nfs_home_dirs` callout (Decision 25) and
a systemd automount slide (Decision 30). See "Not ported".

## Corrections

Verified on the instructor lab on 2026-11-05 where marked with a round (see
"Verification"); the rest are wording, logic, or references.

- N7: `sync` is a default export option, not only `ro` (`exports(5)`;
  Round 2).
- N8: `rpcbind` and `nfs-mountd` start with `nfs-server`, but the command
  enables neither: `rpcbind` is enabled by its package preset and
  `nfs-mountd` is `static` (Round 2).
- N8, N27: RHEL 10's systemd quotes both paths in the symlink line
  (Rounds 2 and 5).
- N15: the options are elided with `...`; the real line is 209 columns
  (Round 3).
- N16: `_netdev` and `nofail` are typed but never explained, and `_netdev`
  changes nothing for an `nfs` line (Cert Guide; Round 3).
- N17: an NFS unmount says `umount.nfs4: /nfs/share: device is busy`, not
  `umount: /nfs/share: target is busy` (Round 3).
- N21: unmounting sends nothing to `servera`; the slide has no title.
- N22: an unreachable server delays the boot by 90 seconds and does not halt
  it (Round 4).
- N23: `/etc/auto.master` is the default master map, not a legacy one
  (Round 5).
- N27, N28: `mount | grep autofs` never shows the NFS mount, before or after
  access (Round 5).
- N30: the requested subdirectory must be exported (or sit under an export),
  not merely exist (Round 5).
- N33: the client sends GIDs too, and the group permissions in exercise 5
  depend on them (Round 6).
- N36: the slide's IDs overlap the exercise's with other meanings.
- N37: "SuperUser" casing.
- N39 and its command file: `con_john` keeps GID 1200, so he reaches both
  directories during the mismatch (Round 6, with the slide names).
- N42: step 3 creates users that already exist; step 4's paths are the
  slide's, not the exercise's.
- `mount_nfs_exports.sh`: `chown student:student /nfs/share` on the client's
  mount point is hidden once the share is mounted over it, which shows the
  server directory's owner (Round 3), so it goes.
- `observe_uid_mismatch.sh`: `usermod -ou` is untaught (Decision 17).
- Command files: `jj:wq` throughout; notes such as "squash_root" for
  `root_squash`; two `#^ 3.` headers in `per_user_automounting.sh`; no
  cleanup.
- Every em dash in the source copy is rewritten.

Withdrawn after verification, so the source stands:

- **N15's `mount | grep nfs`** is right on the client, where it matches only
  the share. I had said it also matched `rpc_pipefs`; that line appears only
  on the server (Round 3).
- **`uid_based_access_control.sh`'s note** that `root`'s `ls -l` shows
  "Permission denied" for the team directories is right (Round 6). I had
  expected the listing to be clean because the parent is mode 755.

## Not ported

- **`troubleshooting.md`**, the instructor's diagnostic list. It could become
  one optional reference slide at the end of fragment 4 or 6; say if you want
  it.
- ~~**The NFSv4 export tree**~~, now proposed as 3.3a (Decision 27).
- **`slide-summary.md`**, an out-of-date outline.
- **The logos, `global-bottom.vue`, and the custom layouts**
  (`compact-two-cols-header`, `two-cols-header-footer`).
- **Full automounted home directories** (Decision 24, reduced 2026-11-05).
  Exercise 7 already does the NFS half of the Cert Guide's home-directory
  task; the rest is account management (`useradd -d` or `usermod -d`, the
  skeleton warnings, and `userdel -r` on a squashed home), which would add
  steps that are not about NFS and commands no slide teaches. 6.2 gets one
  sentence instead.
- **`use_nfs_home_dirs`** (Decision 25). In neither source, and needed only
  for SSH key logins to an NFS home (Round 7).
- **systemd automount, `x-systemd.automount`** (Decision 30, 2026-11-05).
  RH134 section 3 teaches it as an alternative and the Cert Guide says it is
  not on the exam. Any task it solves, `/etc/fstab` or `autofs` also solves,
  and `autofs` also handles wildcards, which it cannot. Its behaviour is
  recorded under "Coverage check" and Rounds 7 and 9 in case it comes back.
- **Other RH134 and Cert Guide topics**: see "Coverage check against RH134
  and the Cert Guide", which lists what stays out.

## Coverage check against RH134 and the Cert Guide

Asked 2026-11-05: 52 slides is a tad light; what do the RHA material and the
Cert Guide cover that the slides do not? Read for coverage only, nothing
copied: RH134 chapter 15 sections 1 and 3 (text), 2 and 4 (guided
exercises), 5 (the lab students are assigned), 6 (summary), and the lecture
transcripts for sections 1 and 3; Cert Guide chapter 24, its quiz and review
answers in appendix A, practice exams A to D, and the pre-assessment exam in
chapter 27. Every gap below was tried on the lab (Rounds 7 and 8).

Already covered by the source: what NFS is, `nfs-utils`, manual mounts,
`/etc/fstab`, `umount` and `lsof`, `showmount`, why to automount, master
maps, direct, indirect, and wildcard maps, starting `autofs`, the server
setup (Cert Guide), the UID problem (Cert Guide), and `root_squash`.

Gaps, most important first. Each is a proposal under "Decisions".

### 1. Automounted home directories (Decision 24, reduced to one sentence; 25 rejected)

**The one that matters for the exam.** The Cert Guide motivates wildcard maps
with home directories ("have the home directory of a specific user
automounted when that user logs in"), ends the chapter with Lab 24.1 (share
`/home` and automount it with a wildcard), and asks for it again in practice
exam A (tasks 14 and 15), practice exam D (13 and 14), and the
pre-assessment exam (question 17): create users whose home directory is an
`autofs` path, so the share mounts when they log in. The source's section 6
builds per-user shares under `/nfs/usershares` but never makes them anyone's
home directory.

Verified (Round 7): with `/homes  /etc/auto.homes` and
`*  -rw,sync  servera:/srv/homes/&`, `useradd -u 2001 -g developers -d
/homes/alice alice` succeeds (exit 0) after two warnings, `useradd: warning:
the home directory /homes/alice already exists.` and `useradd: Not copying
any file from skel directory into it.`, because looking the path up made
`autofs` mount it. `su - alice` then starts in `/homes/alice`.

Proposed:

- **6.2a Automounted Home Directories**, after 6.2: point a user's home
  directory at the wildcard map's path with `useradd -d` (or `usermod -d`
  for an existing account), the two warnings and why they are harmless, and
  `su -` landing in the NFS home. A fixed `TerminalWindow`.
- **Two steps added to exercise 7**: set each user's home directory to their
  automounted directory, then `su -` to confirm it. Exercise 7 then rehearses
  the practice exams' task with this week's names. The steps go after
  step 6; its cleanup puts the home directories back before `userdel -r`
  (to verify during the build, since `root` is squashed on the share).

One more finding, in neither source. **`use_nfs_home_dirs`** is off on both
hosts. With it off, an SSH *key* login as `alice` fails (`Permission denied
(publickey,...)`), and the audit log shows `sshd-session` denied reading
`authorized_keys` of type `nfs_t`; with it on, the same login works. A
password login over SSH and `su -` both work with it off. So the exam-style
task works without it, and the boolean belongs in a one-line `Callout` on
6.2a at most (Decision 25).

**Outcome, 2026-11-05.** Exercise 7 is already a slimmed-down version of
this task: the server directories, matching UIDs, the export, and the
wildcard map are all there. What the full version adds is account
management, not NFS: `useradd -d` or `usermod -d` (on no slide), the
skeleton warnings, and a `userdel -r` cleanup on a squashed home. That would
muddy the section and bring in untaught commands. So 6.2a, the exercise
steps, and the boolean are out, and 6.2 gets one sentence linking the
per-user map to home directories (see 6.2).

### 2. NFS versions and the NFSv4 export tree (Decisions 26 and 27, accepted)

RH134 section 1 opens with the versions: RHEL 10 uses NFS 4.2 by default;
NFSv3 runs over TCP or UDP and asks `rpcbind` and `mountd` for everything,
while NFSv4 uses TCP alone and serves one *export tree*. It then shows
browsing that tree with `mount server:/ mountpoint`, and its video spends
two minutes on it. The Cert Guide asks it twice (quiz question 2, review
question 4, "Use an NFS root mount: `mount nfsserver:/ /mnt`") and does it
in Exercise 24-2. Its warning is the practical reason: `showmount` may not
get through a firewall, but the root mount does.

Verified (Round 7): with only `nfs` open in `servera`'s firewall,
`showmount --exports servera` failed with `clnt_create: RPC: Unable to
receive`, while `mount servera:/ /mnt` succeeded, `ls /mnt` showed `srv`,
and `ls /mnt/srv` showed all three exports; entering one mounted it
(`servera:/srv/share on /mnt/srv/share type nfs4`), and `umount /mnt`
released all of them.

Proposed:

- **1.2a NFS Versions**, after 1.2: NFSv3 and NFSv4 side by side
  (`two-cols-header`): transport, how exports are found, the ports involved,
  and that RHEL 10 mounts with 4.2 (the `vers=4.2` students will see on
  3.4). It also explains 2.6: `nfs` alone serves NFSv4, and `rpc-bind` and
  `mountd` are there for `showmount`.
- **3.3a Browse the NFSv4 Export Tree**, after 3.3: the root mount, `ls`,
  and `umount`, for when `showmount` is blocked. This reverses Decision 19.

### 3. The server has the final say (Decision 28, accepted)

RH134 section 3 says a client asking for `rw` on a read-only export gets
read-only, and the section 1 video says it again. The slides teach server
options (2.4) and client options (3.4) and never say which wins.

Verified (Round 7): `/srv/ro` exported `(ro)` and mounted with `-o rw,sync`;
the mount succeeds, `mount` even lists `rw`, and `student` gets `touch:
cannot touch '/nfs/ro/newfile': Read-only file system`.

Proposed: **3.4a The Server Has the Final Say**, after 3.4, with that
transcript. Two lines on 3.4 are the smaller alternative.

### 4. `-fstype=` in map files (Decision 29, accepted)

RH134 section 3 names `-fstype=` as a useful map option; its guided exercise
writes `-fstype=nfs,rw,sync` and the lab students are assigned writes
`-rw,sync,fstype=nfs4`; the video adds that options may follow it. The
slides never show it, so the homework's first map line has an option the
class never saw.

Verified (Rounds 5 and 8): maps without it mount `nfs4`, and
`-fstype=nfs4,rw,sync` works the same.

Proposed: a row in 4.8's field table (or a step in its `TextExplainer`):
"`-fstype=nfs4` names the type; optional, NFS is the default". No new slide.

### 5. systemd automount (Decision 30, rejected)

RH134 section 3 ends with "The Alternative Automount Method": an `/etc/fstab`
line with `x-systemd.automount`, `systemctl daemon-reload`, and `systemctl
start` on the generated `.automount` unit. The Cert Guide says it is not on
the exam because it cannot do wildcards (review question 7).

Verified (Round 7): `servera:/srv/share  /nfs/share  nfs
rw,sync,x-systemd.automount  0 0`, then `daemon-reload`, generates
`nfs-share.automount` and `nfs-share.mount`, both inactive. `systemctl start
nfs-share.automount` arms it (`systemd-1 on /nfs/share type autofs`), and
the first `ls` as `student` mounts the share. Unlike `autofs`, it never
unmounts an idle share unless given `x-systemd.idle-timeout`
(`TimeoutIdleUSec=0`).

Verified (Round 9): the generated `.automount` unit is
`RequiredBy=remote-fs.target`, so after a reboot it was active with no
`systemctl start`, the boot finished `running`, and only the trigger
(`systemd-1 on /nfs/share type autofs`) was mounted until the first access.
With `x-systemd.idle-timeout=30` added, the share unmounted itself after 45
seconds idle and the trigger stayed. `systemctl start` is needed only to arm
it without rebooting.

Proposed: optional **4.12a systemd Automount**, after 4.12, where "no
wildcards" makes sense: the `fstab` line, the two commands, and a short
comparison with `autofs`. No exercise uses it.

**Outcome, 2026-11-05: left out.** No RHCSA objective needs it. Any task it
solves, `/etc/fstab` or `autofs` also solves, and `autofs` also solves the
wildcard tasks it cannot. The findings above stay in case it comes back.

### 6. One-line additions to existing slides (Decision 31, accepted)

Each verified or quoted from a source, none a new slide:

- **2.3:** `/etc/exports.d/*.exports` files are read as well as
  `/etc/exports` (RH134 video; `exports(5)`; verified in Round 8, and the
  directory comes with `nfs-utils`).
- **2.6:** the client opens no firewall ports (Cert Guide review
  question 10).
- **3.4:** `-t nfs` is optional, since `server:/export` implies it (RH134;
  Cert Guide review question 3).
- **3.6:** leave the mount point or close the program first; `umount -f`
  forces it and can lose unwritten data (RH134).
- **4.6:** name the map file `/etc/auto.name` after what it mounts (RH134;
  Cert Guide quiz question 8).

Checked and left out: the RH134 video's claim that a package update replaces
an edited `/etc/auto.master` is wrong (Round 8: the file is marked
`noreplace`); SMB/CIFS, Kerberos, and LDAP, which both sources call out of
scope; `-strict`; and redundant servers.

### What it adds up to

Accepted: three new slides (1.2a, 3.3a, 3.4a), so **55 slides**, plus a row
on 4.8 and six single lines (2.3, 2.6, 3.4, 3.6, 4.6, 6.2). No exercise
changes. 6.2a and 4.12a were left out (Decisions 24, 25, and 30).

The SCC lab assignment (Open question 3) exports `/srv/lab_files`, opens the
firewall, and automounts it at `/nfs/lab`: exercises 1 and 3 teach that
formula with other names (`/srv/reports`, `/srv/manuals`, `/nfs/manuals`),
and nothing in the plan uses the assignment's names.

## Fitting the class period

Rough costs, not measured: about 42 content and section slides at a minute or
so each, about 40 minutes. Exercise 1 about 8 minutes, 2 about 12 plus the
`workstation` reboot, 3 about 10, 4 about 8, 5 about 12, 6 about 5, 7 about
10, and the cleanups about 8 in all. That is roughly two hours, inside the
2.5-hour class with some margin, before the VDI's start-up time.

Candidates if it runs long, with what each loses:

- **Drop exercise 2's reboot** and check with `mount -av` after
  `daemon-reload`. Loses the proof that the line mounts at boot.
- **Run exercise 6 as a demonstration.** Loses hands-on time with the
  mismatch; nothing later depends on it, since it ends where 5 ended.
- **Drop exercise 4.** Exercise 7 practises the same wildcard indirect map.
  Loses wildcard practice without the permissions layer; 4.11 and 4.12 still
  teach it.

Proposed: cut nothing until the week is built (Decision 20).

## Verification

All on 2026-11-05 through `pnpm lab`, on the instructor lab. The lab was down
when the plan was first written; the instructor brought it up with
`start-latest-snapshot -a` (snapshot `2026-11-03T05:57-06:00-grub_console`),
and the week-porting skill now says to do that rather than stop. Host clocks
matched the host's. Transcript text quoted in this plan is the lab's own;
the captures are scratch files, not committed.

**Round 1, baseline, read-only.** Both hosts: RHEL 10.0, kernel
`6.12.0-55.9.1.el10_0`, systemd 257. No `nfs-utils`, `autofs`, `rpcbind`, or
`libnfsidmap`; `lsof` on `workstation` only. `/etc/exports` empty, no
`/etc/exports.d`, no `/etc/auto.master`, no `/nfs`, `/srv` empty. Firewall
`cockpit dhcpv6-client ssh`. `student` is UID and GID 1000 on both;
`nobody` is 65534. UIDs 1100, 1101, 2001 to 2003 and GIDs 1200, 1201, 2000
free. SELinux booleans `nfs_export_all_rw` and `nfs_export_all_ro` on, so
no SELinux step is needed to export `/srv`. `/etc/fstab` holds the three OS
lines and `/dev/sr1 /mnt/dvd iso9660 defaults,nofail 0 0`. `mount | grep
autofs` already matches `systemd-1` on `/proc/sys/fs/binfmt_misc`.

**Round 2, the server (2.2 to 2.7, 3.3).** On `servera`: installed
`nfs-utils` (ten packages), exported `/srv/share` to `172.25.250.0/24(rw,sync)`,
enabled `nfs-server`, opened the three services, and captured the outputs
quoted under each slide. Side tests, each restored: `(rw)` alone, no
options, and the space before `(rw,sync)`. `showmount` from `workstation`
with only `nfs` open, then with all three.

**Round 3, the client (3.4 to 3.6).** On `workstation`: installed
`nfs-utils` (seven packages), mounted by hand, wrote as `student`, failed to
write as `root`, made `root`'s file in a 777 directory (owned `nobody`),
unmounted while a `student` shell sat in the mount point (`device is busy`,
`lsof`), then compared the generated mount unit for `rw,sync`,
`rw,sync,nofail`, and `rw,sync,_netdev,nofail`.

**Round 4, booting with the server unreachable (3.5, 4.4).** `servera`'s
`nfs` service removed at runtime, `workstation` rebooted once with
`rw,sync` and once with `rw,sync,nofail`, timings from `systemd-analyze` and
the journal; `nfs` added back after each.

**Round 5, autofs (4.2 to 4.12).** On `workstation`: installed `autofs`, a
direct map for `/nfs/share` (first access as `student`), an indirect map on
`/nfs` over an existing `/nfs/other`, a wildcard map under an exported
parent (`/srv/regions`), and the slide's `servera:/srv/&` with an exported
and an unexported directory. Restarting `autofs` five times in quick
succession tripped systemd's start limit ("start of the service was
attempted too often"); `systemctl reset-failed autofs` cleared it. The
exercises restart it once each, well under the limit.

**Round 6, users and UIDs (5.5 to 5.8).** `developers` 2000, `alice` 2001,
and `bob` 2003 on both hosts, 770 directories for each on the share, access
checked as each user and as `root`, then `bob` moved onto 2001 with
`usermod -o -u` and back. On `servera`, `usermod -u` with and without `-o`,
including the "currently used by process" refusal.

**Cleanup.** By hand on both hosts (unmount, remove maps, users, groups,
exports, directories, firewall services, disable both services, `dnf
remove`), which left the residue listed under "Exercises". Then both hosts
were reverted with `start-latest-snapshot servera workstation`, and Round 1
was run again: both match the baseline. **The lab is at the week's start.**

**Round 7, coverage check.** From the snapshot. `servera`: `nfs-utils`,
`alice` (2001, `developers` 2000), and three exports, `/srv/share` (rw),
`/srv/ro` (`ro`), and `/srv/homes` with `alice`'s 700 directory, behind
`nfs` alone. `workstation`: `showmount` blocked and the root mount
working; the read-only export mounted `rw`; `x-systemd.automount`; a
wildcard map on `/homes`, `alice` created with `-d /homes/alice`, `su -`,
and SSH logins by key and by password with `use_nfs_home_dirs` off and on
(the password login used `SSH_ASKPASS`). The boolean was set at runtime
only and turned off again. Then both hosts were reverted to the snapshot and
Round 1 was run again: both match.

**Round 8, three small claims.** From the snapshot: an `/etc/exports.d/`
drop-in, the RPM flags on `/etc/auto.master` (`cmn`: config, missing-ok,
no-replace), and a `-fstype=nfs4,rw,sync` direct map. Reverted again; both
hosts match the baseline.

**Round 9, systemd automount at boot.** From the snapshot. `servera`:
`nfs-utils`, `/srv/share` exported behind `nfs` alone. `workstation`: the
`fstab` line with `x-systemd.automount,x-systemd.idle-timeout=30`,
`daemon-reload`, the unit's dependencies, a reboot, the first access, and a
45-second idle wait. Reverted again; both hosts match the baseline. **The lab
is at the week's start.**

Still to verify, during the build:

- Each exercise's command file, run on the lab as it is written, leaving each
  host in that exercise's end state, recorded here.
- Exercise 7's cleanup, against this baseline.
- The `workstation` reboot in exercise 2 with `servera` up, for its pause.

## Authoring notes

- **Long lines are wrapped once at a space**, as w12 settled. `mount`'s
  options line for an NFS mount is 209 columns, and a full-width terminal
  frame holds 120. The `autofs` trigger line is about 130.
- **The `autofs` start limit.** Several `systemctl restart autofs` in a few
  seconds leave it failed until `systemctl reset-failed autofs`. Worth a note
  in the written exercises only if a student is likely to restart it in a
  loop; the command files restart it once.
- **`pnpm lab` and scripts**: the base64 form from w12's notes works; run
  `pnpm lab` from the repository root, since it needs the root
  `package.json`.
- **A full-width `TextExplainer` holds about 90 columns** at `sm` (w12), so
  `exportfs -v` output is highlighted rather than explained.
- **`rows` only on Magic Move**: 4.9's proposed first-access transcript is the
  only growing one planned. Every other `TerminalWindow` is fixed and omits
  it.
- **A line that starts with `AccentText` loses its paragraph**; start such
  lines with text.
- **Mermaid** diagrams (1.3, 4.2, 4.3) checked by eye at 1920x1080, not only
  by `check:slides`.
- **Fences with a file title** (`text [/etc/exports]`) for configuration
  lines; plain `bash` fences for commands shown without output.
- **Recordings show the instructor lab's prompt**, `[student@servera ~]$`;
  slides use the theme form.
- No presenter notes. Anything learned on the lab goes under "Verification".
- No em dashes. Search the new files for U+2014 before handing work back.

## Decisions

Decisions 1 to 23 were proposed and accepted on 2026-11-05. Decisions 24 to
31 were proposed later the same day, after the coverage check, and settled
the same day: 26 to 29 and 31 accepted, 24 accepted in a reduced form, 25
and 30 rejected. Each is reversible.

1. **Six fragments**, one per source section, in
   `rh134-ch15-accessing-network-attached-storage/`, with the alignments under
   "Deck-level decisions".
2. **Section titles** kept from the source: "Network File System", "NFS
   Server", "Mounting NFS Exports", "Automounting with autofs", "NFS
   Permissions", "Per-User Automounting".
3. **Accent `slate`**.
4. **Title** "Accessing Network-Attached Storage".
5. **Cover agenda of six lines**, one per fragment.
6. **VM reminder** "Start `workstation` and `servera` on your VDI".
7. **Exercise titles** kept from the source, except that "Direct Map" and
   "Indirect Map" become "Configure a Direct Map" and "Configure an Indirect
   Map", so each names a task like the other five. File names as in the
   "Exercises" table.
8. **Record all seven exercises.** Nothing happens at a console.
9. **Meaningful names in exercises 1 to 4**, generic ones on the slides:

   | Source                         | Proposed                            |
   |--------------------------------|-------------------------------------|
   | `/srv/share` (ex 1, 2)         | `/srv/reports`                      |
   | `/nfs/share` (ex 2)            | `/nfs/reports`                      |
   | `/srv/direct`, `/nfs/direct`   | `/srv/manuals`, `/nfs/manuals`      |
   | `/srv/indirect`, `/nfs/indirect` | `/srv/regions`, `/nfs/regions`    |
   | `indirect.autofs`, `auto.indirect` | `regions.autofs`, `auto.regions` |

   Exercise 3 keeps `direct.autofs` and `auto.direct`, since one direct map
   file serves every direct mount (RH134). Exercises 5 to 7 keep the source's
   names. 5.5's example IDs move to GID 2000 and UID 2001.
10. **2.2:** add the `dnf install nfs-utils` fence; drop the `nfs-idmapd`
    row.
11. **Field tables stay tables** on 2.3, 4.6, and 4.8, as in the source.
    The alternative is `TextExplainer` over each slide's example line, which
    shows each field on the line itself; your call.
12. **2.3:** add the no-space `Callout`.
13. **2.4:** mark `sync` as a default and add a `root_squash` row.
14. **3.5:** drop `_netdev`, keep and explain `nofail`, with `TextExplainer`
    over the line (the source slide has no table to keep).
15. **4.3:** give the diagram a title, and make the unmount a note on
    `autofs` rather than a message to `servera`.
16. **4.9:** replace the `mount | grep autofs` callout with a real
    first-access transcript, and correct exercise 3's step 8 to match.
17. **Add 5.5a** for `usermod -u` and `-o`, or fold the two lines into 5.5.
18. **Cleanup per exercise**, with exercise 7 returning both hosts to the
    week's start. The alternative is one long cleanup at the end of
    exercise 7.
19. ~~**The NFSv4 export tree stays out**~~ unless you want 3.3a.
    Reversed 2026-11-05 by Decision 27.
20. **Cut nothing until the week is built.**

Added 2026-11-05 after verification:

21. **3.6's `lsof` warnings:** show the four FUSE warning lines a desktop
    session causes, with a one-line note that they are harmless, or capture
    without a desktop session. I lean to showing them, since students at
    `workstation`'s desktop will see them.
22. **4.11:** add a one-line `Callout` that an indirect map hides whatever
    was already in its base directory (verified).
23. **5.6:** optionally show `root_squash` happening, `Permission denied` and
    a file owned by `nobody`, in a fixed `TerminalWindow` (verified).

Proposed 2026-11-05 after the coverage check (see "Coverage check against
RH134 and the Cert Guide"):

24. ~~**Automounted home directories:** add 6.2a, and two steps to exercise 7
    that make each user's automounted directory their home directory.~~
    Accepted 2026-11-05 as one sentence on 6.2 instead: exercise 7 already
    does the NFS half, and the rest is account management that no slide
    teaches.
25. ~~**`use_nfs_home_dirs`:** a one-line `Callout` on 6.2a that SSH key
    logins to an NFS home need it.~~ Rejected 2026-11-05 with 6.2a.
26. **Add 1.2a, NFS Versions.** Accepted 2026-11-05.
27. **Add 3.3a, Browse the NFSv4 Export Tree**, reversing Decision 19.
    Accepted 2026-11-05.
28. **Add 3.4a, The Server Has the Final Say.** Accepted 2026-11-05.
29. **`-fstype=`** as a row on 4.8. Accepted 2026-11-05.
30. ~~**Add 4.12a, systemd Automount**, optional.~~ Rejected 2026-11-05: no
    RHCSA objective needs it, since `/etc/fstab` and `autofs` solve every
    task it does, and `autofs` also solves wildcard tasks it cannot.
31. **The five one-line additions** to 2.3, 2.6, 3.4, 3.6, and 4.6.
    Accepted 2026-11-05.

## Open questions

1. ~~**The lab is down.**~~ Answered 2026-11-05: the instructor ran
   `start-latest-snapshot -a`, and the week-porting and lab-verification
   skills now say to do so whenever the lab is down.
2. **Packages on the SCC lab.** On the instructor lab neither host has
   `nfs-utils` or `autofs`, and only `workstation` has `lsof` (Round 1). Do
   SCC's hosts match? If SCC's `workstation` already has `nfs-utils`, its
   install step prints "already installed", which the written exercise can
   allow for.
   - We need to show the install commands in the exercises because those packages might not be installed on RHCSA exam hosts, so students need to know the package names.
3. **The SCC lab assignment for chapter 15.** It is not in the source's w13
   folder, so I cannot check that the exercise scenarios (`reports`,
   `manuals`, `regions`, `teams`, `usershares`) stay clear of it.
   - Checked 2026-11-05: exercises 1 and 3 teach this formula with other
     names, and no exercise uses `lab_files` or `/nfs/lab`. The assignment
     text above is graded material, so take it out of this plan before the
     plan is committed.
4. **Exercise 2's reboot on the VDI.** How long does a graphical
   `workstation` take to come back there? If it is minutes, the reboot is the
   first cut candidate.
   - It is about 2 minutes for are reboot. Keep it in for now.
