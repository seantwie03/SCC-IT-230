# W06 - Port

## Prompt

Port w06 from `~/s/IT-230/w06` to this repository. Material reviewed:

- `~/s/IT-230/w06/w06-lesson_plan.md`
- `~/s/IT-230/w06/rh134-ch06-managing_security_with_selinux/` (ten sections)
- `~/s/IT-230/w06/slides/` (`slides.md`, `selinux.md`, and the `public/selinux/` assets)
- `~/s/IT-230/w06/demonstrations/selinux/` (seven command files)
- `~/s/IT-230/cert_guide_rhcsa_10/ch22-managing-selinux.md`, for ideas only

For the archiving section:

- `course/chapters/rh134-ch07-archiving-files/` (the existing port: two
  fragments, two command files, two exercise documents, one image)
- `~/s/IT-230/w02/w02-lesson_plan.md`
- `~/s/IT-230/w02/rh134-ch07-archiving_files/` (three sections)
- `~/s/IT-230/w02/slides/archive_files.md` and its `public/archive_files/` assets
- `~/s/IT-230/w02/demonstrations/archive_files/` (two command files and an
  Ansible setup playbook)
- `~/s/IT-230/cert_guide_rhcsa_10/ch03-essential-file-management-tools.md`,
  "Working with Archives and Compressed Files"

Repository guidance applied: `AGENTS.md`, `NOTICE.md`,
`docs/course-authoring.md`, `docs/design-system.md`, the `lab-verification`
skill, `course/w05.md`, the w05 fragments, and `w05-porting.md`.

Follow-up directions from the instructor:

1. The layout of `~/s/IT-230/w06/slides` is the model. Keep its content,
   order, and layout intact, and port the Geocities screenshot.
2. The Geocities screenshot uses the attribution under "Third-party images".
3. The SELinux port labeling material stays in w07; what was planned for it
   moved to `w07-porting.md`. In its place, w06 covers RH134 ch07, Archiving
   Files, which was cut from w02 for time. Use the existing port as the base
   and bring it up to the current theme and `kitty-demo` standards.
4. Include every image from the w02 archiving source.
5. The answers to the plan's questions are recorded under "Decisions".

## Answer in brief

**Eight topic fragments** in two chapter directories, six new and two
modernized, with **nine exercises** and a deck of **77 slides**:

| # | Fragment                          | Section title           | Slides | Exercises |
|--:|-----------------------------------|-------------------------|-------:|----------:|
| 1 | `selinux-concepts.md`             | Manage SELinux Security |     13 |         1 |
| 2 | `selinux-troubleshooting.md`      | Troubleshooting SELinux |      8 |         1 |
| 3 | `selinux-file-policies.md`        | SELinux File Policies   |      7 |         1 |
| 4 | `custom-file-policies.md`         | Custom File Policies    |      6 |         1 |
| 5 | `selinux-booleans.md`             | SELinux Booleans        |     12 |         1 |
| 6 | `selinux-practice.md`             | SELinux Practice        |      5 |         2 |
| 7 | `archives.md` (modernized)        | Archives                |     13 |         1 |
| 8 | `compression.md` (modernized)     | Compression             |     11 |         1 |
|   | Entry file: cover and VM reminder |                         |      2 |           |
|   | **Total**                         |                         | **77** |     **9** |

Every slide is described under "Topic fragments", each with its own heading.

## Scope: this week needs more, not less

w05's problem was size, and w06 has the opposite one. The lesson plan's
"Future" notes say the source deck ran **ten minutes short**, class filled
another twenty with unrelated discussion, and the week needs **about thirty
more minutes**.

The lesson plan suggested pulling w07's SELinux port material forward. The
instructor chose archiving instead. The w02 lesson plan shows why it is
available: w02 ran out of time with 20 to 30 minutes of content left, and its
notes say to move archiving to another night.

The SELinux source deck is **33 slides**: one section slide, 25 content slides
(one hidden, one a full-screen image), and seven exercise slides. The port
keeps all 33. The archiving port is 20 slides today and grows to 24:

|                                                            | Slides |
|------------------------------------------------------------|-------:|
| SELinux source content slides, one for one                 |     25 |
| SELinux additions, listed under "Additions"                |      6 |
| SELinux section slides (the source's one is among them)    |      6 |
| SELinux exercise slides (seven exercises, two slides each) |     14 |
| Archiving fragments, modernized (20 today)                 |     24 |
| Cover and VM reminder                                      |      2 |
| **Deck**                                                   | **77** |

**That makes w06 the longest deck so far.** Slidev's parser counts the
published w04 at 62 slides and w05 at 65. The instructor has decided that is
fine for now: everything is ported first, then reviewed and trimmed.
"Trim candidates" lists where to start.

## Port fidelity

### SELinux

**Every source slide keeps its title, its text, its place in the sequence,
and its layout.** The source's order already teaches the week's loop (break
something, prove SELinux did it, read the explanation, fix it), so no slide is
split, merged, or dropped, and every source exercise is ported. The one
reorder is the instructor's: source slide 5 (context labels) now follows
slides 6 and 7 (process and file labels), as 1.5 to 1.7 show. The source's
hidden regex slide (3.3) is now shown.

What changes is limited to four things:

1. **Expression.** Theme layouts and components replace bare Markdown, `<br />`
   spacing, the old `compact-two-cols-header` layout, and images of text. Each
   slide below names its components.
2. **Corrections**, where a command, output, label, or typo is wrong. Each is
   noted on its slide and collected under "Corrections".
3. **Section slides.** Every fragment opens an agenda topic, so each needs a
   `layout: section` slide carrying `topicInfo`. The source has one; five are
   added at the topic boundaries, and none changes a source slide.
4. **Additions**, six slides marked "Addition" below. Each sits beside the
   source slide it supports, and any of them can be cut without touching the
   source material.

### Archiving

**The existing port is the base**, not the w02 source. It was one of the
first ports (commit `ff6ff56`, 2026-08-23), and no published week imports it,
so both fragments are modernized in place. Their route aliases (`archives`,
`compression`), alignments (RH134 ch07, cert guide ch03), exercise titles,
and file names stay as they are. Every port slide stays, in its order. One
port slide (7.3) splits in two, so each of the w02 source's two pictures has
its own slide again, as it did in the source.

Modernizing means:

1. **`CommandExplainer` becomes `TextExplainer`** on its three slides (7.5,
   7.7, 8.6). The old component is deprecated.
2. **Each exercise becomes the two-slide `layout: exercise` pair**, replacing
   the port's single slide with `## Requirements` and `## Steps`.
3. **Recordings are made.** Neither exercise has a `.cast` yet.
4. **The command files move to current conventions**: a `#^ Exercise:` header
   with its requirement and step lines, like w05's; steps that match the
   slide; `#@` directives where needed; and cleanup rules. Details under
   "Exercises". Both files already pass `kitty-demo --check` (38 and 51
   presses), so the changes are conventions, not syntax.
5. **The exercise documents follow their command files.** Their HTML shell and
   styles already match the current template (compared against w05's), so
   only the content changes.
6. **Transcripts follow the current rules.** Growing terminals get `rows`,
   elided output reads `...output omitted...` rather than `...`, and every
   transcript is recaptured, because the port's sizes and listing order are
   stale on RHEL 10.0.
7. **Slide copy follows the current style**: no sentence-ending punctuation in
   ordinary copy, no em dashes (six in `archives.md`, four in
   `compression.md`), and `vertical` props only where the default does not fit.
8. **Slides and exercises stop sharing an example.** Today both use
   `/tmp/etc-backup.tar` of `/etc`, which the current standard rules out. The
   slides go back to the w02 source's `/var/log` example, and the exercises
   keep `/etc` (decided).
9. **One addition** (7.11) connects archives to this week's SELinux material.
10. **Every image from the w02 source comes over** (decided): the three icons
    on 7.2, the archive illustration on 7.3, and the tape photograph (already
    in the port) on 7.4. The five `tar_create` images come over as the text
    of 7.5's explainer. See "Images from the w02 archiving source".

## Sequencing and framing

**The SELinux source deck's order is kept.** It departs from RH134 ch06, which
teaches modes, file contexts, booleans, and then troubleshooting. The source
teaches troubleshooting right after the concepts so every later section can
use it.

**The source's two closing exercises stay at the end** of the SELinux
material, after the booleans section, in their own "SELinux Practice"
fragment. They run on `servera` after five exercises on `workstation`, so they
repeat the formulas on a fresh host. A separate fragment keeps each exercise
declared under an accurate agenda topic.

**Archiving closes the week**, following RHA's own order (ch06, then ch07).
It stands on its own; only addition 7.11 refers back to SELinux. Its
exercises run on `servera` as `root` and do not touch Apache.

**Everything in the SELinux half runs against Apache.** w05 put Apache in the
course for this week. Callbacks that need only a phrase or a presenter note:

- w05's component table (content, configuration, logs) matches the "what does
  `httpd` need" diagram on the third slide.
- w05 ends with "SELinux is the other gatekeeper, and that is next week". The
  Allowing UserDir slide pays that off.
- w05 taught rsyslog, the journal, and `/var/log/messages`. The audit log is a
  third log beside them, and `/var/log` is the archiving slides' example.
- w02's "Groups: A Real SELinux Pattern" slide already explained
  `/website(/.*)?`, the same idea as the regex slide (3.3), which is why that
  slide can go quickly.
- w02's `scp` and `rsync` move files between hosts; an archive is the single
  file they would move. A presenter note on 7.2 can say so.
- w01 taught `man -k`, which the Allow Apache to Send Email exercise uses, and
  the `>` overwrite warning that 7.10's `Callout` compares `-c` to.

**Host state.** The w05 exercise uninstalls `httpd` from `servera`, and
`workstation` never had it. The lab confirms both. The first exercise installs
it on `workstation`, and the first `servera` exercise needs an install step
that the source lacks (see "Exercises").

## Deck-level decisions

- **Entry file:** `course/w06-draft.md`, renamed to `course/w06.md` only after
  publication review.
- **Title:** Managing Security with SELinux and Archiving Files.
- **Summary (`courseInfo.summary`):** This week we will see how SELinux limits
  every process to the files its job needs, fix the denials a web server runs
  into, and bundle and compress files with `tar`.
- **Accent (`it230Accent`):** `teal`, restarting the cool rotation (decided).
- **Cover slide:** `kicker` is `Week 06`, and the body lists the eight section
  titles.
- **VM reminder:** a `layout: section` slide, "Start `workstation` and
  `servera` on your VDI", matching w05 and the source's "Start your VDI" slide.

## Source-to-fragment map

Source slide numbers count every `---`-separated slide in `selinux.md` from 1.

| Source                           | Destination                                 |
|----------------------------------|---------------------------------------------|
| `slides.md` headmatter and cover | `course/w06-draft.md`                       |
| `slides.md` "Start your VDI"     | VM reminder in `course/w06-draft.md`        |
| `selinux.md` slides 1 to 12      | `selinux-concepts.md`                       |
| `selinux.md` slides 13 to 15     | `selinux-troubleshooting.md`                |
| `selinux.md` slides 16 to 19     | `selinux-file-policies.md`                  |
| `selinux.md` slides 20 to 22     | `custom-file-policies.md`                   |
| `selinux.md` slides 23 to 31     | `selinux-booleans.md`                       |
| `selinux.md` slides 32 and 33    | `selinux-practice.md`                       |
| existing `archives.md`           | the same file, modernized                   |
| existing `compression.md`        | the same file, modernized                   |
| w02 `archive_files.md`           | example paths for 7.5 to 7.9 and 8.3 to 8.9 |
| w02 `public/archive_files/` images | 7.2 to 7.5 |

## File inventory

| Kind                     | New | Changed | Location                              |
|--------------------------|----:|--------:|---------------------------------------|
| Weekly composition entry |   1 |       0 | `course/w06-draft.md`                 |
| Topic fragments          |   6 |       2 | see below                             |
| Exercise command files   |   7 |       2 | `<chapter>/exercises/*-exercise.sh`   |
| Exercise HTML documents  |   7 |       2 | `<chapter>/exercises/*-exercise.html` |
| Exercise recordings      |   9 |       0 | `<chapter>/exercises/*-exercise.cast` |
| Slide images             |   6 |       0 | `<chapter>/assets/`, listed below     |

Recordings are `.cast` files embedded with `AsciinemaPlayer`, per the current
`docs/course-authoring.md`. `w05-porting.md` still says GIF; that guidance has
since changed.

Chapter directories:

- `course/chapters/rh134-ch06-managing-security-with-selinux/`, new,
  fragments 1 to 6
- `course/chapters/rh134-ch07-archiving-files/`, existing, fragments 7 and 8

New slide images:

- `rh134-ch06-managing-security-with-selinux/assets/selinux-floor-plan.svg`,
  from `selinux-floor_plan.svg`. It is the instructor's own drawing, but it
  needs the two fixes under "Verification".
- `rh134-ch06-managing-security-with-selinux/assets/geocities-personal-page.png`,
  from `personal_pages.svg`. That file is only an 832 x 569 PNG wrapped in SVG,
  so the PNG is extracted and published directly (about 485 KB instead of
  690 KB). Its attribution is under "Third-party images".
- `rh134-ch07-archiving-files/assets/icon-storage.svg`, `icon-handling.svg`,
  and `icon-integrity.svg`, from the w02 source, for 7.2.
- `rh134-ch07-archiving-files/assets/tar-visual.png`, from the w02 source, for
  7.3. It is 2816 x 1504 and 4.8 MB, so it is resized to about 1400 px wide and
  compressed before it lands.

The archiving port's `assets/data-tape.jpg` is byte-identical to the w02
source's `data_tape.png`, so it already covers that image. It stays as it is,
with its existing CC BY-SA 3.0 caption. Provenance for the new archiving
images is under "Images from the w02 archiving source".

## Third-party images

`AGENTS.md` bars any asset whose publication rights are unclear, and
`docs/course-authoring.md` requires a clear publication basis and any required
attribution at or near a third-party asset.

### Geocities screenshot

The instructor has chosen to port it with this attribution:

- **In-text attribution:** "Jane's Place personal recipe website (circa
  2000), showing classic Web 1.0 design paradigms."
- **Image caption:** "Jane's Place (2000). Archived screenshot of an early
  personal culinary homepage. Author unknown."

Where each goes on slide 5.2:

- **Caption.** A plain paragraph directly beneath the image, the same pattern
  `rh134-ch07-archiving-files/archives.md` uses for its tape photograph, so it
  sits next to the asset as `docs/course-authoring.md` requires.
- **In-text attribution.** It opens the image's alt text, followed by a short
  description of what the page shows (the "Welcome!" banner, the recipe
  category links, and the guestbook request). Presenter notes use the same
  sentence when referring to the image.

The source slide's visible text ("1990s Geocities" and "Allowed anyone to
create their own web page") stays as it is. The page itself carries a
separate credit on its sidebar art; it stays visible in the screenshot, and
the caption does not cover it. No archive or license is recorded for the
screenshot, so the attribution is the whole record. If the archive it came
from turns up, add it to the caption.

`personal_sites.svg` (a second Geocities screenshot) is not referenced
anywhere in the SELinux source deck, so it is not ported.

### Images from the w02 archiving source

Every image in `~/s/IT-230/w02/slides/public/archive_files/` comes over
(decided):

- **The three icons** (`icon-storage.svg`, `icon-handling.svg`,
  `icon-integrity.svg`) go on 7.2. Their shapes match the Lucide icon set's
  `archive`, `package`, and `shield-check` (the first two came from Feather
  Icons), drawn in pure blue, red, and green. Lucide is ISC-licensed and
  carries Feather's MIT license, so each SVG keeps that license notice as a
  comment. They are decorative, so they take empty alt text, and their strokes
  are recolored to the theme's fixed palette, since pure hues clash with it.
  See "Open questions" to confirm where they came from.
- **The archive illustration** (`tar-visual.png`) goes on 7.3. It shows a
  folder tree labeled IT-230 being packed into a box labeled "Compressed
  Archive" by `tar -czvf archive.tar.gz`. Its lower-right corner carries the
  sparkle mark Google Gemini adds to generated images, and no source is
  recorded. Before it lands, record who generated it and with what tool, and
  caption it the same way the tape photograph is captioned (for example,
  "Illustration generated with Google Gemini"). See "Open questions".
- **The tape photograph** (`data_tape.png`) is already in the port as
  `data-tape.jpg`, with its photographer, CC BY-SA 3.0 license, and Wikimedia
  Commons link beneath it. It moves to 7.4. Correction: the port's alt text
  describes "a reel of magnetic data tape mounted on a tape drive", but the
  photograph shows three data tape cartridges and a floppy disk on top of an
  external tape drive.
- **The five `tar_create_0{1..5}.svg` images** are pictures of the command
  `tar -cvf etc-backup.tar /etc`, each marking one part with a caption. They
  come over as the text of 7.5's explainer, keeping all five captions in
  order, the same treatment as the SELinux label images on 1.7. Two reasons:
  they are images of a command, and they show `/etc`, which the slides no
  longer use. If you want the image files themselves, their command text has
  to be edited to the `/var/log` example first.
- **The two GIFs** (`in_class_exercise-archive_files.gif` and
  `create_a_compressed_archive.gif`) are terminal recordings rather than
  pictures. `docs/course-authoring.md` embeds recordings as `.cast` files with
  `AsciinemaPlayer`, not GIFs. The new casts on 7.13 and 8.11 replace the
  first, and the second records the Documents demo, which is not ported. See
  "Open questions".

## Topic fragments

Every fragment opens with a `layout: section` slide that carries `routeAlias`
and `topicInfo`. Fragments 1 to 6 align to RH134 chapter `"06"`, *Managing
Security with SELinux*, and RHCSA Cert Guide chapter `"22"`, *Managing
SELinux*. Fragments 7 and 8 keep their alignment to RH134 chapter `"07"`,
*Archiving Files*, and RHCSA Cert Guide chapter `"03"`, *Essential File
Management Tools*.

In the component lists, a "fixed" `TerminalWindow` shows a transcript that
never changes and takes no `rows`. A "Magic Move" terminal grows across clicks
and takes `rows` equal to its final line count, banners included. Source
prompts such as `[user@host ~]$` become the theme's `user@host:~$` form with
the real lab host.

### `rh134-ch06-managing-security-with-selinux/`

#### 1. `selinux-concepts.md` (13 slides)

`routeAlias: selinux-concepts`

##### 1.1 Manage SELinux Security

Source slide 1, the source's own section slide, kept as the section opener.
Carries `routeAlias` and `topicInfo`, declaring the Set Up a Basic Web Server
exercise.

Components: `section`.

##### 1.2 Principle of Least Privilege: Applied to People

Source slide 2. A new accountant is hired. A click reveals the question "What
access do they need to do their job?", the rule "Grant only that access,
nothing more", and the diagram: the accountant needs the payroll system and
the financial software, and has no reason to reach the server room, the source
code repository, or customer records.

Components: default layout with the subtitle line, `v-click`, Mermaid with
`{scale}`. The green and red nodes use the theme's success and danger colors;
the "needs" and "no reason" edge labels carry the meaning in text.

##### 1.3 Principle of Least Privilege: Processes

Source slide 3. The callout "SELinux applies Principle of Least Privilege to
processes", then: the Apache web server is installed, what access does the
`httpd` process need, grant only that access. The diagram shows `httpd`
needing `/var/www/html`, `/etc/httpd`, and `/var/log/httpd`, and having no
reason to reach `/etc` or `/tmp`. Presenter notes can recall w05's component
table and the compromised-web-server scenario from RHA s01 and the cert
guide's opening.

Components: default layout, blockquote, Mermaid with `{scale}` and the same
colors as 1.2.

##### 1.4 Principle of Least Privilege: DAC vs MAC

Source slide 4. "Don't file permissions already do this?" Yes, but the file
owner sets them: Discretionary Access Control, up to the owner's discretion.
"Only system administrators can change SELinux policy": Mandatory Access
Control, mandated by the administrator.

Components: default layout, two headings with their bullet lists. The source's
`###` headings become `##` so no heading level is skipped.

##### 1.5 Every Process Has a Label

Source slide 6. "Viewed using `ps -auxZ`", the heading "View Process Label",
and `ps -auxZ | grep httpd` with its output, recaptured on RHEL 10.

Components: default layout, `TerminalWindow` (fixed) holding the command and
its output. If the full-width `ps` lines overflow, see "Still to verify".

##### 1.6 Every File Has a Label

Source slide 7. "Viewed using `ls -lZ`", the heading "View File Label", and
`ls -lZ /var/www/html/` showing the `about` directory and `index.html` with
`httpd_sys_content_t`, recaptured.

Components: default layout, `TerminalWindow` (fixed).

##### 1.7 SELinux Context Labels

Source slide 5. The same four-step reveal on
`system_u:object_r:httpd_sys_content_t:s0`, with the source's captions: "SELinux
User", "Role", "Type - Most commonly used!", and "Level".

Components: `TextExplainer` (`lg`), replacing the four `v-switch` images. The
reveal, order, and captions are unchanged, and the label becomes real text.


##### 1.8 SELinux Policy: List of Rules

Source slide 8. Left: a rule has a source domain (usually a process), a target
domain (usually a file or directory), and a list of permissions (read, write,
and so on). Right: the diagram of a source domain granting permissions to a
target domain.

Components: `two-cols-header`, nested list, Mermaid.

##### 1.9 View SELinux Rule

Source slide 9. "Viewed using `sesearch -A`", the heading, the command, the
truncated output with its two `allow` lines, and the two diagrams: `httpd_t`
reads `httpd_sys_content_t`, and `httpd_t` creates, renames, and writes
`httpd_sys_rw_content_t`.

Components: default layout, `TerminalWindow` (fixed), two Mermaid diagrams
side by side. Correction: `sesearch` comes from `setools-console`, which the
lab does not install. A one-line `Callout type="warning"` says so if it fits;
otherwise the note goes in presenter notes.

##### 1.10 Source Domain, Target Domain, SELinux Rule

Source slide 10. Three headed blocks with no slide title, as in the source:
"Source Domain" (the `httpd` process line), "Target Domain" (the `html`
directory line), and "SELinux Rule" (the `allow` line, with the
"Source / Target / Access" annotation above it).

Components: default layout, two `TerminalWindow`s (fixed, titled "httpd
process" and "html directory"), and a titled fence (`sesearch -A output`)
keeping the annotation as a comment line.

##### 1.11 Floor Plan

Source slide 11. The instructor's floor-plan drawing fills the slide with no
title, as in the source. Presenter notes carry the narrative.

Components: default layout with a lone Markdown image, which the theme sizes
to the slide, and alt text describing the rooms, their type labels, and the
doors.

##### 1.12 Exercise: Set Up a Basic Web Server

Source slide 12. Host `workstation`. Goal: install a basic web server. Steps:
install the `httpd` package, create a web page, enable and start the systemd
service, verify the results.

Components: `exercise`.

##### 1.13 Exercise: Set Up a Basic Web Server (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`, and the
Written exercise link. Command file from `setup_basic_web_server.sh`.

#### 2. `selinux-troubleshooting.md` (8 slides)

`routeAlias: selinux-troubleshooting`

##### 2.1 Troubleshooting SELinux

New section slide. "Why is this not working? SELinux?" Named to
differ from the source slide that follows it.

Components: `section`.

##### 2.2 Troubleshoot SELinux Issues

Source slide 13. Manage the SELinux mode temporarily: for troubleshooting
only, since these changes do not persist through a reboot; `setenforce 0` sets
permissive mode (logging only); `setenforce 1` sets enforcing mode (blocking
and logging); `getenforce` shows the current mode. The log file is
`/var/log/audit/audit.log`, and it is very dense, followed by one AVC record.

Components: default layout, nested list, `DangerText` on "for troubleshooting
only", and a titled fence (`/var/log/audit/audit.log`) for the recaptured
record. Correction: the source says "State", but enforcing and permissive are
modes; RHA reserves "state" for enabled and disabled. If `check:slides`
reports overflow, the slide continues on a second slide of the same title at
the "Log file" item, without rewording.

##### 2.3 Setting the Mode at Boot

**Addition** (RHA s01, cert guide, RHCSA objective "Set enforcing and
permissive modes"). `/etc/selinux/config` holds `SELINUX=enforcing` and
`SELINUXTYPE=targeted`, and `sestatus` shows the current and configured modes
together. RHEL 10 no longer supports `SELINUX=disabled` there; only the
`selinux=0` kernel argument disables SELinux, and disabled mode also stops
files from being labeled.

Components: titled fence with highlighted lines, `Callout type="warning"`.

##### 2.4 Reading an AVC Denial

**Addition** (RHA s07, cert guide). The record from 2.2, wrapped at field
boundaries. Steps mark `denied`, the permission, `comm`, the file name,
`scontext`, `tcontext`, `tclass`, and `permissive=0`.

Components: `TextExplainer` (`md` or `sm`).

##### 2.5 Troubleshooting SELinux Issues: There Is an Easier Way!

Source slide 14. `sealert`: install the `setroubleshoot-server` package, run
`sealert -a /var/log/audit/audit.log`, and read the output, which names the
file, the restorecon plugin's confidence, the default label, and the
`restorecon` command to run. Presenter notes add RHA's warning that a
suggestion can be technically right and still wrong for the situation.

Components: default layout, list, titled fence (`Output`), recaptured.

##### 2.6 Following the Alert

**Addition** (RHA s07, and the assigned RHA lab in s09). While
`setroubleshoot-server` is installed, each new denial also produces a one-line
summary in the journal and `/var/log/messages`, naming a `sealert -l <id>`
command for that denial. The assigned RHA lab starts from this line.

Components: `TerminalWindow` (fixed), `Callout` (only denials after
installation are summarized).

##### 2.7 Exercise: Add New Web Page

Source slide 15. Host `workstation`. Goal: the developer wants you to add
`about.html` to the web site. Environment note: simulated, the developer put
the file in `/tmp/about.html`. Steps: move `/tmp/about.html` to
`/var/www/html/`, attempt to access `http://localhost/about.html`, then
troubleshoot three ways: switch SELinux to permissive temporarily, view the
audit log, and use `sealert`.

Components: `exercise`. The source's "Turn SELinux Off Temporarily" step reads
"Switch SELinux to Permissive Temporarily" (decided; see "Corrections").

##### 2.8 Exercise: Add New Web Page (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `add_new_page.sh`.

#### 3. `selinux-file-policies.md` (7 slides)

`routeAlias: selinux-file-policies`

##### 3.1 SELinux File Policies

New section slide, named from source slide 16. Subtitle "What decides a
file's label".

Components: `section`.

##### 3.2 View SELinux File Policies

Source slide 16. "What determines the context that is applied to a file?"
`semanage fcontext -l` shows every file policy, and there are a lot. The
abridged listing (`/tmp`, `/var/www`, `/etc/httpd`, `/var/log/httpd`,
`cgi-bin`, `git`, `uploads`), then the heading "`/var/www/html`'s Policy" with
its one line.

Components: default layout, two titled fences (`semanage fcontext -l
(Abridged)` and `Output`), recaptured. The source's `##` title becomes the
slide's `#` title.

##### 3.3 Regex Breakdown: `/var/www(/.*)?`

Source slide 17, unhide. "`/var/www`
and any files or directories beneath it", then the six-row table explaining
the literal, the group, the slash, the dot, the star, and the question mark.

Components: default layout, table. The source's `class: text-xs` is dropped,
because the theme does not shrink type. The slide is shown but covered
quickly (decided), since w02's "Groups: A Real SELinux Pattern" slide already
taught the pattern; a presenter note points back to it. If the six rows
overflow at the theme's type size, ask before splitting the table.

##### 3.4 restorecon: Apply the Policy to Files

Source slide 18. `semanage fcontext` only updates the policy, and
`restorecon` reads the database and stamps the label onto the files.
`sudo restorecon -v /var/www/html/about.html` with its `Relabeled` line, then
a table of `-v` (verbose) and `-R` (recursive).

Components: default layout, `TerminalWindow` (fixed), table. Correction to
verify: the source output changes the user field to `system_u`, which
`restorecon` normally leaves alone without `-F`.

##### 3.5 chcon Skips the Policy

**Addition** (RHA s03, cert guide). `chcon -t` sets a label directly on a
file, and the next `restorecon` or full relabel puts the policy's label back.
Useful for a quick test and never the fix. Students meet it in older
documentation.

Components: `TerminalWindow` (Magic Move), `Callout type="danger"`.

##### 3.6 Exercise: Fix SELinux Label on about.html File

Source slide 19. Host `workstation`. Goal: apply the correct label to
`about.html`. Steps: inspect the policy for `/var/www`, use `restorecon` to
apply the policy to `/var/www` recursively, verify access to `about.html`, and
test `cp` against `mv` to see what would have happened with a copy.

Components: `exercise`.

##### 3.7 Exercise: Fix SELinux Label on about.html File (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `fix_selinux_label.sh`.

#### 4. `custom-file-policies.md` (6 slides)

`routeAlias: custom-file-policies`

##### 4.1 Custom File Policies

New section slide. Subtitle "Teach the policy about a new location".

Components: `section`.

##### 4.2 Files Created in the html Directory Have the Correct Context. How?

Source slide 20. Policies are applied when a file is created, most are
defined for you, you can make custom policies, and `semanage` is the command
that manages them. This answers what the `cp` against `mv` step of the
previous exercise showed.

Components: default layout with `listSpacing: padded`, the source's bold
words kept. The source's `##` title becomes the slide's `#` title.

##### 4.3 Add a Custom Directory

Source slide 21. `semanage fcontext` options: `-a` to add, `-l` to list (with
`-C` for local customizations only), and `-d` to delete. Then the command
`sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'` as a large
line, followed by: this only changes the policy, and `restorecon` must apply
it to the files.

Components: default layout, nested list, the command as a `##` heading of
inline code as in the source.

##### 4.4 Pointing Apache at the Directory

**Addition** (cert guide exercise 22-2). The exercise edits two lines of
`/etc/httpd/conf/httpd.conf` that no slide shows: `DocumentRoot` and the
matching `<Directory>` block. Without the `<Directory>` change, Apache refuses
on its own, which looks like SELinux but is not. Recalls w05's "Two Directives
Matter Today".

Components: titled fence with highlighted lines, `Callout`.

##### 4.5 Exercise: Configure a New DocumentRoot for Apache

Source slide 22. Host `workstation`. Goal: configure Apache to serve content
from `/web`. Steps: make `/web` with an HTML file, configure Apache to serve
it, test and troubleshoot by temporarily switching SELinux to permissive,
troubleshoot with `sealert`, configure a policy that sets `httpd_sys_content_t` on
`/web(/.*)?`, apply the policy to the files, and verify.

Components: `exercise`. Seven steps, as in the source; combine two only if
`check:slides` reports overflow.

##### 4.6 Exercise: Configure a New DocumentRoot for Apache (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `new_document_root.sh`.

#### 5. `selinux-booleans.md` (12 slides)

`routeAlias: selinux-booleans`

##### 5.1 SELinux Booleans

New section slide. Subtitle "Switches for behavior the policy already
describes".

Components: `section`.

##### 5.2 Apache UserDir: Personal Web Directories

Source slide 23. Left: Apache lets users have their own page, created in
`~/public_html/` and viewable at `http://server/~username/`. "Why is this
useful?" Academic environments (students and faculty publish pages, such as
`http://cs.university.edu/~jsmith/`), several developers sharing one server
with their own test environments, and limiting access to `/var/www/html`.
Right: "1990s Geocities", "Allowed anyone to create their own web page", and
the Geocities screenshot.

Components: `two-cols-header` (title and subtitle in the shared header). In
the right column, the screenshot is a Markdown image whose alt text opens with
the in-text attribution, followed by a caption paragraph: "Jane's Place
(2000). Archived screenshot of an early personal culinary homepage. Author
unknown." Because the image shares its column with a heading, a sentence, and
the caption, the theme's lone-image fit does not apply, so check its size
with `check:slides`. See "Third-party images".

##### 5.3 Configuring Apache UserDir

Source slide 24. Edit `/etc/httpd/conf.d/userdir.conf`. The Magic Move
comments out `UserDir disabled` and uncomments `UserDir public_html`. Then
"Restart Apache and create the directory", with the four commands:
restart `httpd`, `mkdir ~/public_html`, and two `echo` lines writing the page,
the second being the research line about categorizing boogers.

Components: default layout, Magic Move on a titled fence (`userdir.conf`),
`TerminalWindow` (fixed) with the four commands. Prompts become
`student@workstation:~$`.

##### 5.4 Allowing UserDir

Source slide 25. Besides the UserDir configuration, Apache must be given
access twice: 1. Discretionary Access Control, permission to traverse home
directories; 2. Mandatory Access Control, an SELinux policy letting `httpd_t`
reach the content.

Components: default layout, numbered list with sub-bullets. Correction: the
source names the target `user_home_t`. The lab labels `~/public_html`
`httpd_user_content_t` and the home directory `user_home_dir_t`, so the type
names are corrected once the boolean's rules are checked (see "Still to
verify"). The same fix applies to 5.6 and 5.10.

##### 5.5 1. Discretionary Access Control: Permissions

Source slide 26. Home directories normally have `700` permissions, so only the
user may traverse them (the execute bit on a directory). `711` lets Apache
reach `/home/student/public_html`. The command `chmod 711 /home/student`,
then "Notice: No `sudo` required!" and "The `student` has discretion to
control the permissions on their home directory".

Components: default layout, `TerminalWindow` (fixed). The "Notice" heading
becomes `##`. Correction: the source prompt's `workstaiton` typo.

##### 5.6 2. Mandatory Access Control: SELinux Boolean

Source slide 27. The callout "Set the boolean to allow `httpd_t` to read home
content", then "What kind of complex policy modifications will I need to
make?" None, thanks to SELinux booleans: Red Hat developers already wrote
hundreds of policies for common scenarios, and you just flip the switch.

Components: default layout, blockquote, `AccentText` on "None!" and "flip the
switch". The source's `####` inside the list becomes bold text.

##### 5.7 SELinux Booleans

Source slide 28. There are hundreds of prewritten boolean policies:
`sudo semanage boolean -l | wc -l` prints 318. Many are for Apache:
`sudo semanage boolean -l | grep httpd | wc -l` prints 45. Then the table of
`httpd_enable_homedirs`, `httpd_can_sendmail`, and `httpd_use_nfs` with the
source's descriptions.

Components: default layout, two `TerminalWindow`s (fixed), table. Both counts
were confirmed on the lab.

##### 5.8 Adjust SELinux Policy with Booleans

Source slide 29. "Easier configuration of commonly changed SELinux rules":
`semanage boolean -l` lists every boolean, `getsebool NAME` gets one value,
`setsebool NAME on|off` sets it temporarily, and `-P` writes it to the policy
permanently.

Components: default layout with the subtitle line, nested list.

##### 5.9 Runtime or Persistent

**Addition** (RHA s05, cert guide exercise 22-6). One `semanage boolean -l`
line shows the current value, then the default. `setsebool` without `-P`
changes only the first, and `semanage boolean -l -C` lists what you changed.

Components: `TextExplainer` (`sm`), `Callout type="warning"`.

##### 5.10 2. Mandatory Access Control: SELinux Boolean

Source slide 30. Set the boolean that lets `httpd_t` read home content:
`sudo setsebool -P httpd_enable_homedirs on`, then `getsebool
httpd_enable_homedirs` printing `httpd_enable_homedirs --> on`.

Components: default layout, `TerminalWindow` (fixed) with both commands and
the output.

##### 5.11 Exercise: Allow Users to Have Personal Web Pages

Source slide 31. Host `workstation`. Goal: configure Apache's UserDir feature.
Steps: create a personal web page for `student`, enable UserDir, test, fix
permissions (DAC), test again to see a different failure, troubleshoot with
`sealert` and `getsebool`, turn on the boolean (MAC), and verify.

Components: `exercise`. Eight steps, as in the source; combine two only if
`check:slides` reports overflow.

##### 5.12 Exercise: Allow Users to Have Personal Web Pages (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `httpd_home_dirs.sh`.

#### 6. `selinux-practice.md` (5 slides)

`routeAlias: selinux-practice`. Declares both exercises in its `topicInfo`.

##### 6.1 SELinux Practice

New section slide. Subtitle "The same formulas on `servera`".

Components: `section`.

##### 6.2 Exercise: Configure a New DocumentRoot for Apache on servera

Source slide 32. Host `servera`. Goal: configure Apache to serve content from
`/website`. Steps as in the source, with three changes: an install step
comes first, because `httpd` is not on `servera`; step 1 names `/website`,
not `/app1`; and the troubleshooting step says "switch SELinux to permissive
temporarily". The title adds "on servera" so it differs from 4.5 (decided).

Components: `exercise`.

##### 6.3 Exercise: Configure a New DocumentRoot for Apache on servera (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `new_document_root2.sh`, corrected to connect to `servera` as its
slide says.

##### 6.4 Exercise: Allow Apache to Send Email

Source slide 33. Host `servera`. Goal: allow Apache to send email. Steps: find
the appropriate boolean, view its current value, set it permanently, and
verify.

Components: `exercise`.

##### 6.5 Exercise: Allow Apache to Send Email (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `allow_email.sh`, which installs `selinux-policy-doc` and finds the
boolean with `man -k _selinux` and `httpd_selinux(8)`.

### `rh134-ch07-archiving-files/`

Both fragments already exist. Each slide below is the port's slide, with what
modernizing changes on it. Where a slide's example changes from `/etc` to
`/var/log`, it uses the w02 source's names: `/tmp/log-backup.tar` and an
extraction directory under `/tmp`. Every image from the w02 source's
`public/archive_files/` comes over, on 7.2 to 7.5.

#### 7. `archives.md` (13 slides; 10 today)

`routeAlias: archives`, unchanged. Declares the Creating and Extracting
Archives exercise, unchanged.

##### 7.1 Archives

Port section slide, unchanged. Subtitle "Many files in, one file out".

Components: `section`.

##### 7.2 Why Bundle Files at All?

Port slide. Left: simpler handling, since one file is easier to back up, move,
and keep track of than ten thousand; and preserved characteristics, since an
archive keeps the directory structure, ownership, permissions, and timestamps.
Right: room for compression, and a `Callout` saying that bundling and
compressing are separate jobs, with `tar` doing the first and calling a
compressor for the second.

Components: `two-cols-header`, `Callout`, and the w02 source's three icons,
one beside each heading as the source had them above its three columns:
`icon-handling.svg` for simpler handling, `icon-integrity.svg` for preserved
characteristics, and `icon-storage.svg` for room for compression. Modernize:
drop sentence-ending periods, and remove `vertical: start` unless the default
leaves a gap. If the icons read poorly in two columns, the fallback is the
source's three-column arrangement, which needs a small HTML grid.

##### 7.3 tar: Tape ARchive

The first half of the port's slide, paired with the w02 source's
illustration as the source's "Archives" slide was. Left: what an archive is
(one file that contains many, the Unix ancestor of a Windows `.zip`), and
that `tar` is the command that makes one. Right: `tar-visual.png`, a folder
tree packed into a compressed box.

Components: `two-cols-header` (`leftWidth: 55`), Markdown image with alt text
and a caption paragraph (see "Images from the w02 archiving source").
Modernize: the title's em dash becomes a colon, and periods go.

##### 7.4 Yes, They Really Used to Put Data on Cassette Tapes!

The second half of the port's slide, under the w02 source's title for the
photograph. "Why the odd name?": `tar` was written to send data to magnetic
tape, one file after another in a single continuous stream. Right: the tape
photograph with its existing caption.

Components: `two-cols-header`, Markdown image with caption paragraph.
Correction: the alt text describes the cartridges, floppy disk, and tape drive
the photograph actually shows.

##### 7.5 Creating an Archive (explainer)

Port slide, and where the w02 source's five `tar_create` images come over.
Steps through `tar -cvf /tmp/log-backup.tar /var/log` with those images'
captions, in their order: "The Tape ARchive Command" (`tar`), "Create
archive" (`-c`), "Verbose Output" (`v`), "Filename flag and the target file"
(`f /tmp/log-backup.tar`), and "Source Directory" (`/var/log`).

Components: `center`, `TextExplainer` (`lg`; the line is 37 columns).
Modernize: `CommandExplainer` becomes `TextExplainer`, and the source
captions replace the port's explanations, which had em dashes. `tar` needs
`occurrence: 1` and `v` needs `occurrence: 1`, since both also appear in the
paths.

##### 7.6 Creating an Archive (transcript)

Port slide. The create command, its leading-slash warning and first members,
then `ls -lh` on the archive to show its size. A `Callout` explains that `tar`
strips the leading `/` so extracting somewhere else cannot overwrite the
original.

Components: `TerminalWindow` (Magic Move), `Callout type="warning"`.
Modernize: `rows`, `...output omitted...` in place of `...`, recaptured for
`/var/log` (about 6.4 MiB on the lab), and no period in the `Callout`.

##### 7.7 Listing What Is Inside

Port slide. "Read the contents without unpacking anything", an explainer on
`tar -tf` (`-t` list, `f` file), then `tar -tf ... | head -n4`.

Components: default layout, `TextExplainer`, `TerminalWindow` (fixed).
Modernize: `TextExplainer`, and member names recaptured (they begin
`var/log/`).

##### 7.8 Extracting an Archive

Port slide. `tar` unpacks into the current working directory, so change into
an empty one first. The transcript makes a directory, changes into it,
extracts, and lists the result. "`-x` is extract, and `-f` names the archive,
exactly as before".

Components: `TerminalWindow` (Magic Move), `DangerText` on "current working
directory". Modernize: `rows`, the `/var/log` paths, and no periods.

##### 7.9 Extracting One File

Port slide. "Name the member you want, exactly as `-t` printed it", then
extracting one member and listing it. The `Callout` says to use the path
without its leading slash, because that is how the archive stores it.

Components: `TerminalWindow` (Magic Move), `Callout`. Modernize: `rows`, the
member becomes `var/log/secure` (the w02 source's `log/secure` is wrong for an
archive of `/var/log`; the lab confirms `var/log/secure`), and the em dash
goes. Correction: the port extracts into the directory 7.8 already filled, so
its `ls` could not show one file. Extract into a fresh empty directory, as
the exercise does.

##### 7.10 The Three Operations

Port slide. A table of `-c` (create), `-t` (list), and `-x` (extract); "`-f`
always names the archive file, and `-v` always makes the operation verbose";
and a `Callout` that `-c` overwrites its target without asking, like the `>`
operator from w01.

Components: table, `Callout type="danger"`. Modernize: no periods, and review
`vertical: start`.

##### 7.11 Archives and SELinux Labels

**Addition** (RHA s01's warning). By default, an archive does not keep SELinux
contexts, ACLs, or other extended attributes; `--selinux`, `--acls`, and
`--xattrs` store them. Without them, extracted files are labeled like any new
file (4.2), so run `restorecon` after restoring files into place. `-p`
preserves permissions and is already on for `root`.

Components: table of the options, `Callout type="success" title="Sound
familiar?"` pointing back to the file policies section. If the fragment is
ever reused in a week before SELinux is taught, leave this slide out.

##### 7.12 Exercise: Creating and Extracting Archives

Replaces the port's single exercise slide. Host `servera`. Goal: back up
`/etc` and restore it somewhere safe. Steps, from the port with two
adjustments: bundle all of `/etc` as `root` into one uncompressed archive
under `/tmp`; check the archive's size; read its contents without unpacking
it; unpack it into an empty directory; confirm the extracted tree matches the
original; extract a single file into a fresh directory.

Components: `exercise`. The port's "Become root" step folds into the first
step, and the last step is added because the command file already does it.
The port's environment line about needing administrative privileges goes,
because `sudo` is a standard lab capability.

##### 7.13 Exercise: Creating and Extracting Archives (recording)

New. Components: `exercise` with `variant: recording`, `AsciinemaPlayer`, and
the Written exercise link to `archives-exercise.html`. The cast is recorded
from the rewritten `archives-exercise.sh`.

#### 8. `compression.md` (11 slides; 10 today)

`routeAlias: compression`, unchanged. Declares the Comparing Compression
Algorithms exercise, unchanged.

##### 8.1 Compression

Port section slide, unchanged. Subtitle "Trading CPU time for disk space".

Components: `section`.

##### 8.2 Compression Buys Smaller Files

Port slide: "Compression buys smaller files" and "It pays for them in CPU
time".

Components: `center`. Modernize: no periods.

##### 8.3 The Trade

Port slide. Left, uncompressed: its size on disk, costs almost no CPU to read,
takes the most space. Right, compressed: its size, the space saved, and CPU
spent once to compress and again every time anyone reads it.

Components: `two-cols-header`, `SuccessText` and `DangerText` on whole lines.
Modernize: the port's 41 MB and 9 MB are stale; with `/var/log` the lab shows
about 6.4 MiB against 634 KiB with gzip. The em dash is rewritten, and
periods go.

##### 8.4 Is Compression Worth It?

Port slide. "It depends", then: which algorithm, how much spare CPU, how much
storage is left, and how often the file will be read.

Components: `center`, `DangerText` heading. Modernize: no periods. Small
addition from RHA s01: a fifth question, "What kind of data is it?", because
already-compressed files such as images and RPM packages barely shrink.

##### 8.5 Three Compressors, One Option Each

Port slide. "Add one letter to the `tar` options you already know", a table of
`-z` (gzip, `.gz`), `-j` (bzip2, `.bz2`), and `-J` (xz, `.xz`) with a line on
each, and a `Callout` that `-j` and `-J` are different options.

Components: table, `Callout type="warning"`. Modernize: the em dash in the
gzip row and the periods go. The lab confirms `bzip2` is still missing from a
fresh install.

##### 8.6 Creating a Compressed Archive

Port slide. Steps through the create command with `z` added: create, gzip,
verbose, file, and the `.gz` suffix, which `tar` does not add for you.

Components: `center`, `TextExplainer` (`lg`; 42 columns). Modernize:
`CommandExplainer` becomes `TextExplainer`, the command becomes
`tar -czvf /tmp/log-backup.tar.gz /var/log`, and em dashes go. `z` and `v`
each need `occurrence: 1`.

##### 8.7 Comparing the Results

Port slide. `ls -lh --sort=size /tmp/log-backup.tar*` lists all four archives,
then a click reveals a sentence about what changed.

Components: `TerminalWindow` (Magic Move), `v-click`. Modernize: `rows` and
recaptured sizes. Correction: the port's sentence says only the build time
changed, but the listing shows the sizes changing. Reword to "Same content
every time; only the size, and the time to build it, changed".

##### 8.8 Extracting Is Simpler Than Creating

Port slide. "`tar` inspects the file and picks the right decompressor itself",
a fixed transcript extracting the `.xz` archive, and a `Callout`: no `-J`
needed, since the same `tar -xf` extracts all four archives.

Components: `TerminalWindow` (fixed), `Callout`. Modernize: the `/var/log`
paths and no periods. Optional, from RHA s01: add to the `Callout` that naming
the wrong compressor fails, if the RHEL 10 error text fits.

##### 8.9 Checking a Compressed Archive

Port slide. `gzip -l` and `xz -l` report the ratio without unpacking anything.

Components: `TerminalWindow` (Magic Move). Modernize: `rows` and recaptured
output. Correction: the port says "each compressor ships a tool", but `bzip2`
has no `-l`; RHA credits only `gzip` and `xz`. RHA's reason to use it, checking
there is room before extracting, fits the same sentence.

##### 8.10 Exercise: Comparing Compression Algorithms

Replaces the port's single exercise slide. Host `servera`. Prerequisite
exercise: Creating and Extracting Archives. Goal: find which compressor makes
the smallest `/etc` backup, and at what cost. Steps, from the port: bundle
`/etc` once with each compressor; install the missing compression package
before using it; list all four archives sorted by size; ask `gzip` and `xz`
for their ratios; extract one compressed archive without naming its
algorithm; note which archive was smallest and which took longest.

Components: `exercise`. The port's environment note about `bzip2` goes,
because the second step already covers installing it. The command file runs
each compressed `tar` under `time`, so "took longest" is something students
see rather than guess (decided).

##### 8.11 Exercise: Comparing Compression Algorithms (recording)

New. Components: `exercise` with `variant: recording`, `AsciinemaPlayer`, and
the Written exercise link to `compression-exercise.html`. The cast is recorded
from the rewritten `compression-exercise.sh`.

## Exercises

| # | Exercise                                           | Host          | Fragment                     |
|--:|----------------------------------------------------|---------------|------------------------------|
| 1 | Set Up a Basic Web Server                          | `workstation` | `selinux-concepts.md`        |
| 2 | Add New Web Page                                   | `workstation` | `selinux-troubleshooting.md` |
| 3 | Fix SELinux Label on about.html File               | `workstation` | `selinux-file-policies.md`   |
| 4 | Configure a New DocumentRoot for Apache            | `workstation` | `custom-file-policies.md`    |
| 5 | Allow Users to Have Personal Web Pages             | `workstation` | `selinux-booleans.md`        |
| 6 | Configure a New DocumentRoot for Apache on servera | `servera`     | `selinux-practice.md`        |
| 7 | Allow Apache to Send Email                         | `servera`     | `selinux-practice.md`        |
| 8 | Creating and Extracting Archives                   | `servera`     | `archives.md`                |
| 9 | Comparing Compression Algorithms                   | `servera`     | `compression.md`             |

SELinux titles, hosts, goals, and steps come from the source slides. The two
archiving titles are the port's. `topicInfo` titles carry the repository's
"Exercise" suffix, and the slide `h1` omits it because the layout prints
"Exercise:". Step lists stay as written; the only reason to combine steps is
an overflow that `check:slides` reports.

Prerequisites, for each exercise's Environment slot:

- Exercises 2 to 5 need exercise 1, since they use its web server. Exercise 3
  also needs exercise 2's misplaced page.
- Exercise 9 needs exercise 8's uncompressed archive.
- Exercises 1, 6, 7, and 8 need nothing earlier.

File names (each as `.sh`, `.html`, and `.cast`):
`set-up-a-basic-web-server-exercise`, `add-new-web-page-exercise`,
`fix-selinux-label-exercise`, `configure-a-new-document-root-exercise`,
`allow-personal-web-pages-exercise`,
`configure-a-document-root-on-servera-exercise`, and
`allow-apache-to-send-email-exercise` for SELinux; the existing
`archives-exercise` and `compression-exercise` for archiving.

### SELinux command files

None of these changes touch the slides.

- **All seven:** replace `jj:wq` with `#@ key escape` followed by `:wq`, mark
  pager and editor keystrokes with `#@ noenter`, and remove em dashes from
  `#^` and `#!` lines.
- **Exercise 2:** `setroubleshoot-server` is already installed on
  `workstation`, so its install step prints "already installed". Keep the step
  for anyone on a fresh host.
- **Exercise 6:** add the `httpd` install and enable steps, and the
  `setroubleshoot-server` install before `sealert`; neither is on `servera`.
  Connect to `servera`, not `workstation`.

### Archiving command files

Both are rewritten from the port's files.

- **Header.** `#^ Task: ...` becomes `#^ Exercise: <title>` followed by `#`
  lines for the host, requirements, and numbered steps, the form w05's files
  use.
- **Steps match the slide.** `archives-exercise.sh` keeps its six steps, now
  in the slide's order and wording; `sudo -i` joins step 1.
- **`compression-exercise.sh`.** Keep the `dnf info` checks and
  `dnf install -y bzip2`. Time the tars with `time` (decided). End with
  `exit` to leave the `root` shell.
- **Validation.** Run `kitty-demo --check` after each edit. On this machine
  the tool is installed as `kitty-demo`, not `kitty-demo.py`.
- **Exercise documents.** `archives-exercise.html` and
  `compression-exercise.html` are rewritten to match, including the timing
  step, and lose their three em dashes.

### Cleanup

The source files have none. Per `docs/course-authoring.md`, an exercise cleans
up its own changes when no later exercise depends on them. None of this
appears on the slides.

- Exercise 4: restore `DocumentRoot`, delete the `/web` rule with
  `semanage fcontext -d`, and remove `/web`.
- Exercise 5, the end of the `workstation` chain: turn the boolean off,
  restore `700` on the home directory, revert `userdir.conf`, remove
  `~/public_html`, then disable and remove `httpd` (decided).
- Exercise 6, the only `httpd` exercise on `servera`: restore `DocumentRoot`,
  delete the `/website` rule, remove `/website`, then disable and remove
  `httpd` (decided), as the last w05 exercise does, so w07 starts from a known
  state.
- Exercise 7: turn `httpd_can_sendmail` off again.
- Exercise 8: none, because exercise 9 uses its archive.
- Exercise 9: the port's cleanup already removes every archive and extraction
  directory from both exercises. It also removes `bzip2`, returning `servera`
  to its starting state.

## Additions

Seven slides, each beside the slide it supports. All seven stay (decided).
Any can still be cut during the post-port review without changing a source or
port slide.

1. **Setting the Mode at Boot** (2.3). The RHCSA objective on modes, RHA s01's
   guided exercise, and the RHEL 10 change to `SELINUX=disabled`.
2. **Reading an AVC Denial** (2.4). Source slide 13 shows a record without
   explaining it.
3. **Following the Alert** (2.6). The assigned RHA lab starts from this
   message.
4. **chcon Skips the Policy** (3.5). In RHA s03 and the cert guide, and in
   older documentation students will find.
5. **Pointing Apache at the Directory** (4.4). Exercise 4 edits two lines no
   slide shows.
6. **Runtime or Persistent** (5.9). Reading the two value columns that
   `semanage boolean -l` prints.
7. **Archives and SELinux Labels** (7.11). RHA warns that `tar` drops labels
   by default, and it ties the week's two halves together.

Two smaller additions sit inside port slides: the fifth question on 8.4, and
the optional wrong-compressor note on 8.8.

## Corrections

SELinux:

- Em dashes in source copy are rewritten, for example "Grant only that access,
  nothing more" and "restorecon: Apply the Policy to Files".
- "Manage SELinux State" becomes "mode" (2.2).
- `workstaiton` becomes `workstation` (5.5).
- `user_home_t` is replaced with the labels the lab actually uses (5.4, 5.6,
  5.10), once verified.
- The `restorecon -v` output's user field, if RHEL 10 confirms it (3.4).
- `sesearch` needs `setools-console` (1.9).
- `new_document_root2.sh` connects to `workstation` but its slide says
  `servera`, and its slide says `/app1` where the script uses `/website`
  (6.2).
- The exercise steps "Turn SELinux Off Temporarily" (2.7, 4.5, 6.2) become
  "Switch SELinux to Permissive Temporarily" (decided), because
  `setenforce 0` sets permissive mode rather than turning SELinux off, as
  slide 2.2 itself teaches.

Archiving:

- The port's sizes (41 MB, 9.4 MB, 8.6 MB, 6.7 MB) and its verbose listing
  order are stale on RHEL 10.0 (7.6, 8.3, 8.7, 8.9).
- 7.9 extracts one file into a directory that already holds the whole archive.
- The w02 source's member `log/secure` is `var/log/secure` (7.9).
- The tape photograph's alt text describes a reel of tape, but the photograph
  shows data tape cartridges, a floppy disk, and a tape drive (7.4).
- 8.7's sentence says only the build time changed.
- 8.9 says every compressor can report its ratio; `bzip2` cannot.
- The archives exercise slide lists "Become root" as a step and omits the
  single-file extraction that its command file performs (7.12).

## Not ported

SELinux source:

- `slides/global-bottom.vue`, `layouts/compact-two-cols-header.vue`,
  `setup/mermaid.ts`, `package.json`, `pnpm-lock.yaml`, `.npmrc`,
  `netlify.toml`, `vercel.json`, and `node_modules/`. The theme and repository
  build supply all of this.
- `slides/public/Red_Hat_Logo_2019.png` and `SCC-Primary-Logo-CMYK.png`. Text
  references only.
- `selinux_label_explainer_0{1,2,3,4}.svg`. Their content moves into
  `TextExplainer` on slide 1.7, unchanged.
- `personal_sites.svg`, which the deck never references.
- The lesson plan's suggestion to move w07's SELinux port material here. It
  stays in w07; see `w07-porting.md`.

w02 archiving source. Every image comes over (see "Images from the w02
archiving source"); these do not:

- The `tar_create_0{1..5}.svg` files themselves. Their captions come over as
  the text of 7.5.
- The three-column "Why Archive Files?" arrangement, unless the icons need it
  (7.2).
- "Demo: Create a Compressed Archive of Documents" and its `setup.yml`. It
  repeats the exercise's workflow and depends on an Ansible-staged directory
  tree, and the repository does not allow exercises that depend on pre-staged
  machines. The lab confirms `/home/student/Documents` does not exist.
- The two GIF recordings, replaced by casts, plus the asciinema.org links and
  `ansible.cfg`.

Both halves:

- RH134 chapter text, `.md_assets` figures, guided exercises, labs, and
  transcripts. They inform additions and sequencing only. The RHA web console
  SELinux page is GUI-only and absent from the source.
- Cert guide text and review questions. Ideas are paraphrased.
- The lesson plans' topical-discussion notes.

## Verification

### Already checked on the lab (RHEL 10.0, 2026-09-17)

On `servera` and `workstation`:

- Both are RHEL 10.0 and `Enforcing`. `/etc/selinux/config` holds
  `SELINUX=enforcing` and `SELINUXTYPE=targeted`, and
  `/etc/sysconfig/selinux` is a symlink to it.
- **`httpd` is installed on neither.** `setools-console` and
  `selinux-policy-doc` are missing on both. `setroubleshoot-server` is
  **installed on `workstation`** and missing on `servera`. All are available
  from the lab repositories (`httpd` 2.4.63, `setroubleshoot-server` 3.3.35,
  `selinux-policy-doc` 40.13.26, `setools-console` 4.5.1).
- `policycoreutils-python-utils` is installed, so `semanage`, `ausearch`,
  `sestatus`, and `matchpathcon` are present.
- `/home/student` is mode `700` on both.

SELinux, on `servera`:

- `sudo semanage boolean -l | wc -l` prints **318** and
  `sudo semanage boolean -l | grep httpd | wc -l` prints **45**, matching
  slide 5.7 exactly. `getsebool` shows `httpd_enable_homedirs`,
  `httpd_read_user_content`, and `httpd_can_sendmail` all `off`.
- `matchpathcon` labels `/home/student/public_html` as `httpd_user_content_t`
  and `/home/student` as `user_home_dir_t`, not `user_home_t`.
- A file `student` creates in `/tmp` is `unconfined_u:object_r:user_tmp_t:s0`.
- `semanage fcontext -l` maps `/var/www(/.*)?` to `httpd_sys_content_t`.
- `man -k _selinux` returns only `pam_selinux (8)` before
  `selinux-policy-doc` is installed.
- `ps -auxZ` runs without a syntax warning.
- `sudo` needs no password for `student`.

Archiving, on `servera`:

- `tar` 1.35, `gzip` 1.13, and `xz` 5.6.2 are installed. **`bzip2` is not**,
  and neither are `zstd` or `tree`.
- `du -sh` reports 23M for `/etc` and 7.0M for `/var/log`.
- An archive of `/etc` is 22,364,160 bytes (21 MiB); gzip brings it to
  5,628,167 (5.4 MiB) and xz to 4,116,012 (3.9 MiB).
- An archive of `/var/log` is 6,727,680 bytes (6.4 MiB); gzip brings it to
  648,833 (634 KiB) and xz to 311,308 (304 KiB).
- `tar -cv` on `/etc` still prints "tar: Removing leading `/' from member
  names", then lists `/etc/`, `/etc/mtab`, `/etc/fstab`, `/etc/crypttab`, in
  that order (the port shows `fstab` before `mtab`).
- An archive of `/var/log` stores `var/log/secure` and `var/log/messages`.

### Still to verify while authoring

SELinux:

- Every transcript, captured fresh. The source is RHEL 9 era, including the
  `ps` output, the `ls -lZ` dates, the AVC record, and the `sealert` text.
- **`ps -auxZ` width** on 1.5. If the lines overflow, the choices are
  `ps -eZ | grep httpd`, which prints the same label in fewer columns, or
  keeping `ps -auxZ` with its output trimmed to the label and command columns.
  Both change the slide, so ask before choosing.
- **Which types `httpd_enable_homedirs` opens.** Check with
  `sesearch -A -s httpd_t -b httpd_enable_homedirs` before rewording 5.4, 5.6,
  and 5.10.
- **The AVC permission.** The source record shows `{ read }`, and RHA's first
  denial is `{ getattr }`. Use whatever RHEL 10 logs.
- **The `restorecon -v` user field** on 3.4.
- **The symptom of a denied DocumentRoot.** The source's notes expect Apache's
  test page, and RHA shows `403 Forbidden`.
- **Whether the setroubleshoot summary appears** for a denial on `workstation`
  (installed) and on `servera` after installation. Slide 2.6 depends on it.
- `sesearch -A` output with setools 4.5.1, including the two `allow` lines on
  1.9 and 1.10.
- The `<Directory "/var/www/html">` block in `httpd.conf` on 2.4.63, which the
  DocumentRoot exercises edit.
- The `userdir.conf` lines on 5.3.
- The `httpd_selinux(8)` search path in exercise 7.
- **Mermaid emoji.** The source diagrams on 1.2, 1.3, 1.8, and 1.9 use emoji,
  which fall outside the theme's bundled fonts and may render as empty boxes
  in CI or the PDF export. Check with `pnpm run check:slides` and the PDF. If
  they fail, drop only the emoji and leave the diagrams as they are.
- **The floor plan.** Its six type labels (`tmp_t`, `httpd_t`,
  `httpd_sys_content_t`, `httpd_sys_rw_content_t`, `etc_t`, `user_home_t`) are
  in the SVG as text but did not appear in either an Inkscape or an
  ImageMagick export; check it in the browser. It also embeds a 600 x 600 PNG
  burglar icon whose origin is not recorded; confirm it is original or
  replace it.
- The Geocities screenshot at column width on 5.2, with its caption.

Archiving:

- Every transcript, captured fresh with the `/var/log` examples.
- The `bzip2` size, after installing it.
- `gzip -l` and `xz -l` output (8.9).
- The output of `time` on the three compressed runs.
- **The labels on extracted files** without `--selinux` (7.11). The slide
  claims they are labeled like new files.
- The three icons at heading size on 7.2, after recoloring, and the resized
  illustration on 7.3.
- The wrong-compressor error text on RHEL 10 (8.8, optional).
- Both command files, played back live and recorded, then processed with
  `pnpm run casts`.

## Authoring notes

- `rows` goes only on Magic Move terminals, set to the final state's line
  count including banners. Fixed terminals get none. Confirm with
  `pnpm run check:slides -- course/w06-draft.md --verbose`.
- `TextExplainer`, never the deprecated `CommandExplainer`. A literal that
  appears more than once needs `occurrence`.
- Mermaid diagrams get an explicit `{scale: n}`.
- Headings: a source `###` under a slide title becomes `##`, and a `####`
  inside a list becomes bold text, so no level is skipped.
- No em dashes in slides, notes, command files, or exercise documents.
- Process each recording with `pnpm run casts -- <path>`.

## Trim candidates

Everything is ported first; the instructor reviews the 77-slide deck and
trims afterward (decided). When that review needs time back, cut additions
first, since no source or port slide depends on them.

- **chcon Skips the Policy** (3.5) is the weakest: it teaches a command
  students are told not to use.
- **Compression Buys Smaller Files** (8.2) says what 8.1's subtitle and 8.3
  already say.
- **The Three Operations** (7.10) summarizes the three slides before it.
- **Creating an Archive** (7.5 and 7.6) could become one slide if the
  explainer and the transcript fit together.

## w07

The SELinux port labeling material stays in w07. What was planned for it,
along with the lab facts already checked, is in `w07-porting.md`.

## Decisions

Answered by the instructor on 2026-09-17.

1. **Exercise 6's title** is "Configure a New DocumentRoot for Apache on
   servera", so the week page does not show two identical links.
2. **"Turn SELinux Off Temporarily"** becomes "Switch SELinux to Permissive
   Temporarily" in the three exercise workflows.
3. **The accent is `teal`**, restarting the cool rotation (w01 teal, w02
   purple, w03 blue, w04 green, w05 slate).
4. **All seven additions stay.**
5. **The regex slide (3.3) is shown**, not hidden, and covered quickly.
6. **Exercises 5 and 6 finish by disabling and removing `httpd`** on their
   hosts, so w07 starts from a known state.
7. **Archiving slides use `/var/log`, and the exercises keep `/etc`.**
8. **Exercise 9 times its compressed runs** with `time`. Its cleanup also
   removes `bzip2`.
9. **Port everything, then trim.** A 77-slide deck is fine at this stage; the
   instructor reviews it once the port is complete.
10. **Every image from the w02 archiving source comes over.**

## Open questions

1. **Where did `tar-visual.png` come from?** Its corner carries Google
   Gemini's mark. If you generated it, the caption can say so; either way the
   source needs recording before it lands (7.3).
2. **Are the three icons from Lucide or Feather Icons?** Their shapes match
   Lucide's `archive`, `package`, and `shield-check`. Confirming the source
   settles which license notice each SVG carries (7.2).
3. **Are the two GIFs covered by the casts?** The plan leaves them out: the
   in-class GIF is replaced by the two new casts, and the other records the
   Documents demo, which is not ported. Say so if you want either one on a
   slide anyway.
