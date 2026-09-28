# W07 - Port

## Prompt

Port the w07 material from `~/s/IT-230/w07` into this repository. Read the Red
Hat Academy chapter, then the existing slides and demonstrations, and produce
this plan, which states how many topic fragments the material becomes and gives
a title, a summary, and the `slidev-theme-it230` components for every slide.
The w06 port (`w06-porting.md`, `course/w06.md`) is the precedent.

This file began during the w06 port, when the SELinux port labeling material
was moved out of w06 and left here. That material is now fragment 6 below, and
the firewall material that surrounds it is planned for the first time.

## Answer in brief

**Seven topic fragments** in one chapter directory, with **five exercises** and
a deck of **44 slides**: 26 of the 30 source slides, the two entry slides, five
recording slides, two section slides, and the additions the instructor
accepted. Thirty-eight render before the casts are recorded.

Fragments 1 through 6 are built: 34 slides on disk, plus the two entry slides.
The recording slides for fragments 2, 4, 5, and 6 wait on their casts.
Fragment 1 is built and signed off; its slide list below is what shipped rather
than what was planned.

| # | Fragment                          | Section title                  | Slides | Exercises |
|--:|-----------------------------------|--------------------------------|-------:|----------:|
| 1 | `firewall-concepts.md`            | Firewalls                      |     10 |         0 |
| 2 | `firewall-zones.md`               | Assign the Interface to a Zone |      8 |         1 |
| 3 | `firewall-configuration.md`       | Permanent and Runtime Config   |      3 |         0 |
| 4 | `firewall-services.md`            | Open Services                  |      5 |         1 |
| 5 | `firewall-ports.md`               | Open Ports                     |      5 |         1 |
| 6 | `selinux-port-labels.md`          | SELinux Port Labels            |      7 |         1 |
| 7 | `network-security-practice.md`    | Practice                       |      3 |         1 |
|   | Entry file: cover and VM reminder |                                |      2 |           |
|   | **Total**                         |                                | **44** |     **5** |

Every slide is described under "Topic fragments", each with its own heading. An
added slide carries a letter, such as 1.5a, so the numbering of the slides that
come from the source deck never moves.

## Scope

The week covers RH134 chapter 14, *Managing Network Security*, which is
firewalld and SELinux port labeling. The lesson plan's agenda lists a third
item, "Midterm Review", which this plan does not cover. See "Open questions".

The source deck is one file, `~/s/IT-230/w07/slides/network_security.md`, with
30 slides, and five `kitty-demo` command files in
`~/s/IT-230/w07/demonstrations/network_security/`. Only one demonstration has a
slide in the source deck; the other four are run from the terminal during class.

w06 finished at 80 slides for a similar block of class time, so w07 is thin by
comparison. "Additions" lists the material that would fill it, drawn from
RH134 ch14 section 01 and *RHCSA Cert Guide* chapter 23, but none of it is
planned as built until the instructor picks from the list.

## Port fidelity

The source order is kept slide for slide. Nothing is split, merged, reordered,
or dropped in this plan except where a heading says "propose", and each of
those is listed again under "Decisions" so the instructor can refuse it.

Two things force real changes rather than preferences:

- **Four of the seven images cannot be published as they are.** See
  "Third-party images". Each one has a proposed replacement; none is silently
  dropped.
- **The lab has one network interface per host.** The source slides show a
  two-interface host, `enp1s0` in the `internal` zone and `enp2s0` in the
  `public` zone, and no lab machine looks like that. See "The two-interface
  problem".

## The two-interface problem

`servera` has exactly one Ethernet interface, verified today:

```text
enp1s0:ethernet:connected
lo:loopback:connected (externally)
```

Source slides 9 through 14 show `firewall-cmd` output for a host with
`enp1s0` in one zone and `enp2s0` in another. That output cannot be captured on
this lab, and `docs/course-authoring.md` requires output that matches RHEL 10
as students will see it.

Three ways to handle it, in the order I would pick them:

1. **Capture everything from `servera` and let the zone move, not the
   interface, carry the story.** The single `enp1s0` starts in `public`, the
   default zone changes to `internal`, the interface moves to `dmz`, and every
   transcript is real. The Traffic Flow diagram on slide 1.5 keeps the
   two-interface picture, because a diagram is explicitly an illustration.
2. **Keep the source transcripts and mark them as an example host**, with a
   `root@host:~#` prompt rather than a lab host name. Honest, but it gives up
   the week's only chance to show real zone output.
3. **Use `servera` and `serverb` as the two interfaces of one story.** Closest
   to the source, and the most work, because every transcript needs two hosts.

This plan is written for option 1, and marks the affected slides.

## Sequencing and framing

The source deck teaches firewalld as a numbered procedure, and the section
slides are the spine: "Step 1: Assign the Interface to a Zone", "Permanent
Config vs Runtime Config", "Step 2: Open Services", "Step 3: Open Ports". Each
section fills one step in, and the fragments follow those section breaks
exactly.

The source previewed the whole procedure on a 2-step pattern slide before
explaining any of it. That slide is cut: it jumped from the high-level picture
straight to the nitty-gritty with nothing in between (instructor, 2026-09-26).
The numbered section titles stay as they are. Slide 1.8, "Traffic Flow", is
what anchors them, because it already spells out interface, then zone, then
decision, which is the order the sections then work through.

The week lands after w06, which means:

- **SELinux is review, not new.** w06 taught contexts, `semanage fcontext`,
  `restorecon`, and booleans. Fragment 6 needs one sentence to connect ports to
  the target-domain idea from w06 rather than an introduction. The source slide
  title, "Guess Who's Back, Back Again. SELinux", already does this.
- **The lesson plan's "SELinux Booleans" agenda item is already spent.** w06's
  `selinux-booleans.md` covers them. w07 can mention `httpd_can_network_connect`
  in passing if the instructor wants the callback.
- **`httpd` is absent from `servera` at the start of the week**, because w06's
  last exercise removes it on each host. w07's first web exercise installs it,
  which is what the source already does.
- **w05 does not hand off to this week.** The Apache week's `curl` slide stands
  on its own, and the instructor does not want firewalls raised there
  (2026-09-25). So w07 introduces the firewall from scratch rather than opening
  with "remember when this timed out". If `apache-basics.md` still mentions
  `firewalld`, that mention is removed as separate work on w05, not here.

## Deck-level decisions

- **Entry file:** `course/w07-draft.md` while it is being built, renamed to
  `course/w07.md` at publication.
- **Accent:** `pink`, changed from `red` by the instructor (2026-09-28) so
  that `red` is free for the Final and `yellow` for the Midterm. `red` was
  chosen on 2026-09-25, with two consequences to watch while building: `red` is
  also the theme's danger colour, so check that `DangerText` and
  `Callout type="danger"` still read as warnings beside it, and the Carbon
  icons on slide 1.3 inherit the accent, so that diagram needs re-rendering in
  the current accent before class. The preview reviewed on 2026-09-25 was
  purple.
- **Title:** "Managing Network Security".
- **Cover agenda:** six lines, decided 2026-09-25. Seven fragments is one more
  than w06's cover carried comfortably, so "Assign the Interface to a Zone" and
  "Permanent and Runtime Config" share one line, such as "Zones and
  Configuration".
- **Chapter directory:** `course/chapters/rh134-ch14-managing-network-security/`.
- **Alignments:** every fragment aligns to RH134 chapter `"14"`, *Managing
  Network Security*. Fragments 1 through 5 and 7 also align to *RHCSA Cert
  Guide* chapter `"23"`, *Configuring a Firewall*; fragment 6 aligns to cert
  guide chapter `"22"`, *Managing SELinux*, which is where port labeling lives.

## Source-to-fragment map

| Source slide | Title                                             | Goes to |
|-------------:|---------------------------------------------------|---------|
|            1 | Firewalls (hero image)                            | 1.1     |
|            2 | Firewall, controls who can connect                | 1.2     |
|            3 | Network diagram (image only)                      | 1.3     |
|            4 | Server ports (image only)                         | 1.4     |
|            5 | Traffic Flow                                      | 1.5     |
|            6 | The 2-Step Pattern of Firewalld Configuration     | cut     |
|            7 | Section: Step 1, Assign the Interface to a Zone   | 2.1     |
|            8 | Firewalld Predefined Zones                        | 2.2     |
|            9 | Check Active Zones                                | 2.3     |
|           10 | Inspect the Active Configuration                  | 2.4     |
|           11 | Default Zone for `firewall-cmd`                   | 2.5     |
|           12 | Now Commands Show Internal Zone                   | 2.6     |
|           13 | Run Commands Against Non-Default Zone             | 2.7     |
|           14 | Add an Interface to a Zone                        | 2.8     |
|           15 | Exercise: Change an Interface to Drop Zone        | 2.9     |
|           16 | Section: Permanent Config vs Runtime Config       | 3.1     |
|           17 | Firewalld Configuration                           | 3.2     |
|           18 | Making Changes Permanent                          | 3.3     |
|           19 | Section: Step 2, Open Services                    | 4.1     |
|           20 | Firewalld Services                                | 4.2     |
|           21 | Some Predefined Services                          | 4.3     |
|           22 | Exercise: Allow HTTP Traffic                      | 4.4     |
|           23 | Demo: Allow HTTP Traffic (GIF and asciinema link) | 4.5     |
|           24 | Section: Step 3, Open Ports                       | 5.1     |
|           25 | Non-standard Ports                                | 5.2     |
|           26 | Specifying a Port in a URL                        | 5.3     |
|           27 | Exercise: Configure Apache to Listen on 8888      | 5.4     |
|           28 | Guess whose Back, Back Again. SELinux             | 6.2     |
|           29 | Exercise: Configure SELinux to Allow HTTP on 8888 | 6.4     |
|           30 | Exercise: Serve HTTP Traffic on Port 3456         | 7.2     |

Slides with no source row: 2.10, 4.5, 5.5, 6.5, and 7.3 are the recording
slides; 6.1 and 7.1 are the proposed section slides; and 1.2, 1.3, 1.4, 1.9,
2.2a, 2.8a, 6.3, and 6.3a are additions.

## File inventory

New, under `course/chapters/rh134-ch14-managing-network-security/`:

| File                           | Slides | Exercise                                |
|--------------------------------|-------:|-----------------------------------------|
| `firewall-concepts.md`         |     10 | none                                    |
| `firewall-zones.md`            |      8 | Move an Interface to Another Zone       |
| `firewall-configuration.md`    |      3 | none                                    |
| `firewall-services.md`         |      5 | Allow HTTP Traffic                      |
| `firewall-ports.md`            |      5 | Configure Apache to Listen on 8888      |
| `selinux-port-labels.md`       |      6 | Configure SELinux to Allow HTTP on 8888 |
| `network-security-practice.md` |      3 | Serve HTTP Traffic on Port 3456         |

Also new: `exercises/` with five `.sh` command files and five `.html` written
exercises, `assets/` for whatever survives the image review, and
`course/w07-draft.md`.

Fragment 1 was planned at seven slides and shipped at nine. If the other
fragments grow at the same rate the deck lands nearer 50 than 45, which is
fine: the instructor trims after the port rather than before it.

## Third-party images

The source deck carries seven images from `slides/public/network_security/`.
Four of them cannot be published as they are.

**`server_ports.png`, cannot be used, and is now replaced.** It is a page from a
Dell PowerEdge hardware manual, showing a rear panel with numbered callouts and
the caption "Figure 3. Back panel features of 2 x 3.5-inch (rear) drive system
with full-height riser", with two Ethernet port entries highlighted in yellow.
That is vendor documentation with no publication basis here.

**Replacement, chosen 2026-09-25:** `assets/server-rear-panel.jpg`, 1023 x 215,
a photograph of the rear of a BlueArc Mercury 100 rack server. The source frame
also shows a switch strip across the top, which is cropped away, leaving the
server itself: two hot-swap power supplies, the motherboard I/O panel, and
**two RJ-45 jacks**, which is the `enp1s0` and `enp2s0` picture the Traffic Flow
diagram uses on slide 1.5.

- Photograph by ChrisDag, CC BY 2.0, via
  <https://www.flickr.com/photos/8558461@N08/4524625686>
- Caption beneath the image on the slide: "Photograph by ChrisDag, CC BY 2.0,
  via Flickr", following the cassette tape photograph in
  `rh134-ch07-archiving-files/archives.md`
- Plain CC BY rather than share-alike, so an annotated version carries no extra
  licensing obligation
- 1023 x 215 is the largest size published. It fills the slide width at roughly
  1:1 and goes soft if enlarged beyond that, so the slide uses it as a band
  rather than a full-bleed image.

**`firewalld_zones.png`, cannot be used.** It is a screenshot of RH134 Table
14.1 with red arrows drawn on three rows. Restricted curriculum material.
Propose rebuilding it as our own Markdown table in our own words, keeping the
zones the class touches and marking the three the source pointed at.

**Replacement, decided:** our own table, our own wording. The facts about each
zone are not the problem; reproducing Red Hat's table as an image is.

**`firewall_hero.jpg` and `ports_hero.jpg`, provenance unknown.** Stock-style
illustrations, a glowing brick ring around a laptop and a photograph used behind
the non-standard ports slide. No source recorded. `AGENTS.md` bars assets whose
publication rights are unclear, so either the instructor records where they came
from and their license, or both slides become text. Neither image carries
teaching weight.

**Replacement, decided:** neither is ported. Source slide 1 becomes a section
slide, so `firewall_hero.jpg` needs nothing in its place. Slide 5.2, where
`ports_hero.jpg` sat, is a content slide and simply runs at full width as text
and terminal.

**`selinux_hero.jpg`, provenance unknown.** The dial photograph, 2048 x 1457,
three dials on grey. Same question, carried over from the w06 port. If it stays,
it needs a caption beside it the way `rh134-ch07-archiving-files/archives.md`
captions its cassette tape photograph.

**Replacement, decided:** not ported. Slide 6.2 is a content slide, not a
section slide, and runs at full width as text and terminal. The new section
slide at 6.1 opens that fragment.

**`network_diagram.png`, not ported, replaced 2026-09-25.** A clean network
topology diagram that looks like an export from a diagramming tool's template
library, with no recorded provenance. Slide 1.3 now carries our own Mermaid
diagram built from Carbon icon shapes, so the licensing question disappears and
the diagram says only what the week teaches.

**`allow_http_traffic.gif` and `serve_http_8888.gif`, not ported.** w06 replaced
its GIFs with asciinema recordings, and the five command files give the same
demonstrations as real casts.

## Topic fragments

Each fragment is one file with `layout: section` headmatter, a `routeAlias`,
and `topicInfo` alignments. In the component lists, a "fixed" `TerminalWindow`
shows a transcript that never changes and takes no `rows`; a "Magic Move"
terminal grows across clicks and takes `rows` equal to its final line count.

### 1. `firewall-concepts.md` (10 slides, built 2026-09-26)

`routeAlias: firewall-concepts`. Alignments: RH134 chapter 14, cert guide
chapter 23. No exercise.

This fragment is finished and reviewed. What follows describes the slides as
built, including the changes the instructor made during the build.

##### 1.1 Firewalls

Section slide, subtitle "Who can connect, and how". Source slide 1 was a
full-bleed hero image; the image has no recorded provenance, so the slide
became the theme's section slide.

Components: `section`.

##### 1.2 What a Firewall Does

**Addition.** Every firewall asks one question about a connection, allow it or
refuse it, and the answer comes from a list of rules that match on where the
traffic came from, where it is going, and which port it wants.

Components: default layout, `listSpacing: padded`, `SuccessText` and
`DangerText` on the two answers, `AccentText` on the three match criteria.

##### 1.3 A Network Firewall

**Addition.** "Stands between two networks and asks: can this network talk to
that network?" Rules name both ends, and each direction needs its own rule,
shown as a two-row rule table. The diagram is two networks either side of a
firewall, each with its own router and two hosts, drawn with Carbon icons and
bidirectional links.

Components: `two-cols-header` (`leftWidth: 45`), titled `text` fence for the
rules, Mermaid `flowchart LR` with icon shapes and subgraphs for the two
networks.

##### 1.4 A Server Firewall

**Addition.** The same picture zoomed in: the right-hand network with both
hosts opened up, each running its own `firewalld` in front of one service. Two
rule tables, one per host, with `me` in the destination column.

Components: `two-cols-header` (`leftWidth: 65`), two titled `text` fences,
Mermaid `flowchart LR` with nested subgraphs.

##### 1.5 Firewall

Source slide 2. The firewall table: source networks, ports, and allowed or
blocked, ending in the any-any row.

Components: default layout, Markdown table with `SuccessText` and `DangerText`
in the decision column, `Callout title="Deny by Default"`.

##### 1.6 Why Multiple Firewalls?

Source slide 3, which was an untitled network diagram. Rebuilt as our own
Mermaid because the source image has no recorded provenance, and retitled as
the question it answers: if we have network firewalls, why do we also need
firewalls on the server? The edge firewall allows 443, 3306, and 445 because
all three services sit behind it; each server allows only its own port. Closes
on defense in depth and lateral movement.

Components: default layout with `horizontal: center`, Mermaid `flowchart LR`
with icon shapes, allowed ports carried in each node's label through `<br/>`,
`AccentText` on the closing line.

##### 1.7 Ports on the Back of the Server

Source slide 4, whose Dell manual figure could not be published. Replaced with
`assets/server-rear-panel.jpg`, the rear of a BlueArc Mercury 100 cropped to
the server itself, showing two RJ-45 jacks.

Components: default layout, Markdown image with descriptive alt text, and the
attribution line beneath it: photograph by ChrisDag, CC BY 2.0, via Flickr.

##### 1.7a Interface Names

**Addition**, 2026-09-26, after the three lab environments were surveyed.
Placed straight after the rear-panel photograph, where a student has just seen
two physical jacks. Two lines on why a name describes where the card sits
rather than what it does, a table naming the interface to use in each
environment, and a warning to leave the others alone because only one carries
the session.

Needed because the three environments disagree: `ens3` on RHA, `enp0s8` on the
SCC lab, `enp1s0` in this deck's transcripts. See `docs/lab-environments.md`.

Components: default layout, `listSpacing: padded`, Markdown table,
`Callout type="warning"`.

##### 1.8 Traffic Flow

Source slide 5. Traffic arrives on an interface, the interface belongs to a
zone, the zone decides what is allowed, with the interfaces, zones, and ports
listed under each step. The zone allow lists moved out of the diagram into a
table, so the diagram carries only which zone each interface sits in.

Components: `two-cols-header` (`leftWidth: 60`), nested list, Markdown table,
Mermaid `flowchart LR` with subgraphs for the two zones.

##### 1.9 RHEL Firewall Components

**Addition**, from RH134 ch14 section 01, planned as "What `firewalld` Sits
On". Three layers, top down: `firewalld` the manager you configure, `nftables`
which classifies packets and applies rules, and `netfilter`, the kernel
framework underneath.

Components: default layout, `listSpacing: padded`, nested list.

##### Not ported from this fragment

Source slide 6, "The 2-Step Pattern of Firewalld Configuration", was built and
then removed by the instructor: it jumped from the high-level picture straight
to the nitty-gritty with nothing in between. Slide 1.8 carries the framing the
numbered sections need, and fragments 2 and 4 teach each step in full.

### 2. `firewall-zones.md` (8 slides, restructured 2026-09-26)

`routeAlias: firewall-zones`. Exercise: Move an Interface to Another Zone.

**Restructured twice, and cut.** The first build followed the source deck:
change the default zone, watch the interface follow it, run a command against
another zone, then lock the host out with `drop`. Verifying that raised two
problems. An interface follows the default zone only while nothing has claimed
it, and what claims it is NetworkManager rather than `firewalld`, which is
deeper than RHCSA needs and reads as arbitrary to a student. The lockout
exercise then spends its time on recovery rather than on the commands.

A second version added a service and a default-zone change, which failed for a
different reason: `--add-service` has not been taught yet at this point in the
week, and `--set-default-zone` writes the permanent configuration, so the
reload at the end did not wipe what the slide claimed it wiped.

The fragment now does one thing. Everything about the default zone is cut
except reading it, because the week is 2.5 hours and this is the material that
pays least (instructor, 2026-09-26).

1. Look at the zones: what exists, what is active, which is the default.
2. Inspect what the active zone allows.
3. Move the interface into `dmz` and watch the allowed services change from
   `cockpit dhcpv6-client ssh` to `ssh`.
4. In the exercise, `--reload` puts it all back, which is the question fragment
   3 answers.

##### 2.1 Step 1: Assign the Interface to a Zone

Source slide 7, a section slide.

Components: `section`.

##### 2.2 Firewalld Predefined Zones

Source slide 8, the screenshot of the RHA zone table, rebuilt as our own table
in our own words: `trusted`, `internal`, `public`, `dmz`, `block`, and `drop`,
with a line saying `home` and `work` start as near copies of `internal` and
`external` adds masquerading.

Keep this table distinct from the one on slide 1.8. That one is "these two
zones, on this host, allow these ports". This one is "these are the zones
firewalld ships, and here is what each starts with".

Components: default layout, Markdown table, `SuccessText` and `DangerText` in
the allow column.

##### 2.3 View the Zones

Sources slides 9 and 11, merged. Three read-only questions in one transcript:
`--get-zones` for what exists, `--get-active-zones` for what is in use, and
`--get-default-zone` for where an unassigned interface lands. On `servera` the
answers are the ten shipped zones, `public (default)` holding `enp1s0`, and
`public`.

One line carries what the cut zone-selection slide would have said: an
interface nobody has assigned belongs to the default zone.

Components: `TerminalWindow` (fixed).

##### 2.4 Inspect the Active Configuration

Source slide 10. `firewall-cmd --list-all` abridged, with the zone line, the
interface line, the services line, and the empty ports line pointed at in turn.

Components: `TextExplainer` (`size="md"`) carrying the command and four output
lines. The first build had a `TerminalWindow` as well and overflowed; one block
does both jobs.

##### 2.5 Move an Interface to Another Zone

Source slide 14, and the point of the fragment. `firewall-cmd --zone=dmz
--change-interface=enp1s0`, then `--get-active-zones` showing two active zones,
then `--list-all --zone=dmz` showing `services: ssh` where `public` allowed
`cockpit dhcpv6-client ssh`.

The services list shrinking is the observable result, and it needs no command
the week has not taught.

Components: `TerminalWindow` as a Magic Move with `#^` step banners.

##### 2.6 `firewall-cmd` Options

**Addition.** The option table, split across two columns: zone options on the
left, contents and persistence on the right. `--set-default-zone` appears here
as a row, which is the only place the week spends on it, so the name is not new
if a student meets it on an exam.

Components: `two-cols-header`, two Markdown tables.

##### 2.7 Exercise: Move an Interface to Another Zone

Replaces the source's drop-zone exercise. Hosts `workstation` to `servera`.
Steps: list the zones, inspect the active one, move `enp1s0` into `dmz`, see
the allowed services shrink, then `firewall-cmd --reload` and find everything
back where it started.

The last step is the hand-off into fragment 3, so the class needs to have run
it before that section opens.

Components: `exercise`.

##### 2.8 Exercise recording (pending)

Command file `move-interface-to-another-zone.sh`. Recorded after the slides,
with the rest of the casts.

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`.

##### Not ported from this fragment

- **Source slide 15, "Exercise: Change an Interface to Drop Zone".** The
  lockout and the console recovery are the wrong shape for this week, and a
  cast cannot reboot a VM. `drop` and `block` stay on slide 2.2 as table rows.
- **Source slide 12, "Now Commands Show Internal Zone"** and **source slide 13,
  "Run Commands Against Non-Default Zone".** Both exist to demonstrate changing
  the default zone, which is cut.
- **The planned zone-selection-logic slide**, cut on 2026-09-26. The week never
  binds a source address, so two thirds of it covered a case students do not
  meet. Its one useful line lives on 2.3.

### 3. `firewall-configuration.md` (3 slides)

Opens on the question slide 2.8 leaves hanging: the service vanished on reload
and the default zone did not.

`routeAlias: firewall-configuration`

##### 3.1 Permanent Config vs Runtime Config

Source slide 16, a section slide.

Components: `section`.

##### 3.2 Firewalld Configuration

Source slide 17. Two configurations: permanent, which survives reboots, and
runtime, which is active now. Then when the permanent configuration loads: when
`firewalld.service` starts or restarts, which at boot means whenever the service
is enabled, and when `firewall-cmd --reload` runs.

Components: default layout with `listSpacing: padded`, nested list.

##### 3.3 Making Changes Permanent

Source slide 18. Approach 1 tests first and then promotes, with
`--add-service=https` followed by `--runtime-to-permanent`. Approach 2 writes
the permanent configuration and then reloads, with `--add-service=https
--permanent` followed by `--reload`. The source keeps the inline comments.

Components: `two-cols-header`, one approach per column, each with a
`TerminalWindow` (fixed). Propose the two columns rather than the source's
stacked pair, because the slide's point is that the two orders reach the same
place.

### 4. `firewall-services.md` (5 slides, built 2026-09-27)

`routeAlias: firewall-services`. Exercise: Allow HTTP Traffic.

##### 4.1 Step 2: Open Services

Source slide 19, a section slide.

Components: `section`.

##### 4.2 Firewalld Services

Source slide 20. `firewall-cmd --get-services`, whose real output is a single
wall of service names, then where the definitions live:
`/usr/lib/firewalld/services/` for the shipped ones and
`/etc/firewalld/services/` for local ones.

Built as two columns. The left holds a fixed `TerminalWindow` with the output
abridged to two lines and `...output omitted...`, then
`firewall-cmd --get-services | wc -w`, which answers 259 on the lab rather than
the source's "about 400". The right holds `http.xml` as a titled `xml` block, so
a service name and the file behind it sit beside each other. The two directory
paths run the full width underneath, where they read as belonging to both
columns rather than to the terminal.

Components: `two-cols-header` with `leftWidth: 64` and `::bottom::`,
`TerminalWindow` (fixed), fenced `xml`.

##### 4.3 Some Predefined Services

Source slide 21. Table of `ssh` 22/tcp, `http` 80/tcp, `https` 443/tcp,
`cockpit` 9090/tcp, `dns` 53/tcp and udp, `dhcpv6-client` 546/udp, with a
description column.

Built as planned. The three services already open on `servera`, `cockpit`,
`dhcpv6-client`, and `ssh`, close the slide as a line of text rather than a
presenter note; the students last saw them on slide 2.4.

Components: default layout, Markdown table.

##### 4.4 Exercise: Allow HTTP Traffic

Source slide 22. From `workstation`, connect to the web server on `servera`.
Seven steps: install `httpd` and write a page, enable and start it, request the
page and watch it fail, inspect what the zone allows, allow the `http` service,
request the page again, then keep the change with `--runtime-to-permanent`.

Built with `exercises/allow-http-traffic-exercise.html` and its 75-line command
file, both on disk. Every command and every line of output was traced on the lab
first, and `servera` was restored afterwards.

Components: `exercise`.

##### 4.5 Exercise recording (pending)

Source slide 23 is the source's own demo slide, a GIF linked to asciinema. It
becomes a recording slide, recorded with the rest of the casts at the end. Command file from `allow_http_traffic.sh`.

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. The command
file's troubleshooting sequence is worth keeping exactly: it rules out SELinux
with `setenforce 0`, re-enables it, then moves the interface to `trusted` to
prove the firewall is the blocker, then reverts with `--reload`. That is the
method, not just the answer.

### 5. `firewall-ports.md` (5 slides, built 2026-09-27)

`routeAlias: firewall-ports`. Exercise: Configure Apache to Listen on 8888.

##### 5.1 Step 3: Open Ports

Source slide 24, a section slide.

Components: `section`.

##### 5.2 Non-standard Ports

Source slide 25. Why non-standard ports appear: only one process can listen on a
port, and one server may run several web services. Then
`firewall-cmd --add-port=8888/tcp` and `--list-all` abridged to the line where
`ports: 8888/tcp` now appears.

Built as planned: two bullets, a fixed `TerminalWindow` holding the verified
`--add-port` and `--list-all` transcript, and a closing line that a port is
written `port/protocol`. The source used `image-right` with `ports_hero.jpg`;
without a license for that image the slide is text and terminal at full width.

Components: default layout with `listSpacing: padded` and a `TerminalWindow`
(fixed).

##### 5.3 Specifying a Port in a URL

Source slide 26. The pattern `http://hostname:port/path` as a blockquote, then a
table of the default, with-port, and with-path forms for `servera`, then "if no
port is given, the browser uses the default for the scheme, 80 for `http` and
443 for `https`".

Components: default layout, blockquote, Markdown table. The w06 draft of this
plan asked whether this slide belonged here or with the SELinux material. It
stays here, where the source has it, one slide before the exercise that needs
it.

##### 5.4 Exercise: Configure Apache to Listen on 8888

Source slide 27. Hosts `workstation` to `servera`. The exercise is designed to
fail, and the failure is SELinux.

Built with five steps rather than the source's four, because the source's fourth
step holds two separate ideas. Allow `8888/tcp` permanently and reload, point
the `Listen` line at 8888, restart and read the bind failure, prove the cause by
dropping to permissive and putting it straight back, then read the `sealert`
report that names `semanage port -a`. It ends one command short of the fix,
which is fragment 6's exercise.

`exercises/configure-apache-to-listen-on-8888-exercise.html` and its 75-line
command file are on disk. Every command was run on the lab first, and the
failure output on slide 5.4's HTML is quoted from that run.

Components: `exercise`.

##### 5.5 Exercise recording (pending)

New slide, recorded with the rest of the casts at the end. Command file from
`configure_apache_to_listen_on_8888.sh`, which ends at the `sealert` diagnosis,
"SELinux is preventing /usr/sbin/httpd from name_bind access on the tcp_socket
port 8888", and hands off to fragment 6.

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`.
Correction: the file's header says "workstation ---> servera" but it never
connects to `servera` before its `firewall-cmd` and `httpd.conf` steps. It needs
`ssh student@servera` at the start.

### 6. `selinux-port-labels.md` (7 slides, built 2026-09-27)

`routeAlias: selinux-port-labels`. Exercise: Configure SELinux to Allow HTTP on
8888. Covers the RHCSA objective "manage SELinux port labels".

##### 6.1 SELinux Port Labels

Propose a section slide, subtitle "Ports are targets too". The source has no
section break here, so this is an addition; the case for it is that the other
three steps announce themselves and this one is the step where the exercise from
fragment 5 gets fixed.

Components: `section`.

##### 6.1a Guess Who's Back, Back Again. SELinux

**Addition**, accepted 2026-09-27. Repeats w06 slide 10, "SELinux Policy", so
the week opens on a shape the students already know, and puts a second diagram
under it where the target is a port instead of a file. The left column keeps
w06's rule bullets with "Or a port" added under Target Domain. The instructor
took the title from 6.2 for this slide and made both diagrams concrete:
`httpd` to `/web/index.html`, from w06's own exercise, and `httpd` to port 80.

The `bottom` slot closes the slide in plain language: SELinux policy allows the
`httpd` process to reach ports like 80 and 443. The draft carried the policy
rule itself there, `allow httpd_t http_port_t:tcp_socket name_bind;`, and the
instructor replaced it with the sentence. The rule stays under "Verification",
where it is confirmed on the lab; its `name_bind` is what the students meet in
the denial during fragment 5's exercise.

Components: `two-cols-header` with `::bottom::`, `vertical: center`,
`horizontal: center`, and two Mermaid diagrams drawn with Carbon icon shapes
rather than w06's emoji: `carbon:gears` for the source, `carbon:document` and
`carbon:plug` for the two targets, both at full scale.

##### 6.2 (continues 6.1a)

Source slide 28. SELinux controls what processes can access, ports are a target
domain just as files are, and target domains need labels so source domains can
reach them. Then "view port labels" with `semanage port -l | grep http` and its
abridged output.

Built as text and terminal at full width: three bullets, the verified
`semanage port -l | grep ^http` transcript, and a closing line that 8888 is on
none of those lines. The dial photograph was not licensed, so there is no second
column. Correction: "whose" becomes "Who's".

The title now sits on 6.1a, so this slide carries none and reads as the second
half of that one.

Components: default layout with `listSpacing: padded` and a `TerminalWindow`
(fixed).

##### 6.3 Labeling a Port

**Addition**, from the cert guide and RH134 ch14 section 03. The next exercise
runs `semanage port -a` with no slide having introduced it. Walks
`semanage port -a -t http_port_t -p tcp 8888`: add a rule, the type it assigns,
the protocol, and the port. It takes effect immediately, with no `restorecon`
step, which is the contrast with w06's file labels. `semanage port -l -C` lists
local changes and `-d` removes one.

Built with the explainer over the bare command rather than a prompt line, so
the text fits at the automatic `md` size; at `lg` with a prompt it ran off the
slide. Three bullets close it: the rule applies with no `restorecon`, `-m`
changes an existing label and `-d` removes one, and `semanage port -l -C` lists
local changes alone. No `Callout`: the `-m` question is settled under
"Verification" and reads as one bullet rather than a warning.

Components: `TextExplainer` (automatic size).

##### 6.3a When SELinux Blocks the Other Direction

**Addition**, accepted 2026-09-25. A callback to w06's booleans: port labels
cover a service listening on a port, and `httpd_can_network_connect` covers the
opposite case, a service making an outbound connection. One slide, so students
know which tool answers which failure.

Built as planned. `httpd_can_network_connect` is `off` on `servera`, confirmed
on the lab.

Components: default layout with `listSpacing: padded`, short list,
`TerminalWindow` (fixed).

##### 6.4 Exercise: Configure SELinux to Allow HTTP on 8888

Source slide 29. Hosts `workstation` to `servera`. Three steps in the source:
inspect the SELinux configuration, allow `http` on 8888, verify.

Built with a fourth step, the cleanup that decision 16 calls for. It disables and
removes `httpd`, deletes the port label, closes the port and the `http` service
in the firewall, and undoes the `Listen` edit before the package is removed, so
`/etc/httpd` goes with the package instead of leaving an `.rpmsave` file behind.
Verified on the lab: after the cleanup, `servera` has no `httpd`, no local port
label, and a firewall allowing `cockpit`, `dhcpv6-client`, and `ssh`.

`exercises/configure-selinux-for-http-on-8888-exercise.html` and its 68-line
command file are on disk.

Components: `exercise`.

##### 6.5 Exercise recording (pending)

New slide, recorded with the rest of the casts at the end. Command file from
`configure_selinux_for_http_on_8888.sh`, whose `curl http://servera:8888` runs
from `workstation` and is the moment the whole chain pays off.

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`.

### 7. `network-security-practice.md` (3 slides)

`routeAlias: network-security-practice`. Exercise: Serve HTTP Traffic on Port
3456.

##### 7.1 Practice

Propose a section slide, matching w06's `selinux-practice.md`, so the last
exercise is announced as practice rather than arriving after the SELinux
exercise with no break.

Components: `section`.

##### 7.2 Exercise: Serve HTTP Traffic on Port 3456

Source slide 30. Configure Apache on `serverb` to serve on port 3456, reachable
from `workstation`, surviving a reboot. Six steps: install `httpd` and create an
`index.html`, configure Apache to listen on 3456, allow the port in firewalld
permanently, label the port for SELinux persistently, enable and start `httpd`,
verify. This is every idea of the week in one task, and it mirrors the assigned
RHA lab for chapter 14.

Components: `exercise`.

##### 7.3 Exercise recording

New slide. Command file from `serve_http_on_3456.sh`.

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`.

## Exercises

| # | Title                                   | Host      | Fragment | Command file                            |
|--:|-----------------------------------------|-----------|----------|-----------------------------------------|
| 1 | Move an Interface to Another Zone       | `servera` | 2        | `move_interface_to_another_zone.sh`     |
| 2 | Allow HTTP Traffic                      | `servera` | 4        | `allow_http_traffic.sh`                 |
| 3 | Configure Apache to Listen on 8888      | `servera` | 5        | `configure_apache_to_listen_on_8888.sh` |
| 4 | Configure SELinux to Allow HTTP on 8888 | `servera` | 6        | `configure_selinux_for_http_on_8888.sh` |
| 5 | Serve HTTP Traffic on Port 3456         | `serverb` | 7        | `serve_http_on_3456.sh`                 |

Exercises 2 through 4 form one chain on `servera`: install and fail, open the
firewall, move to a non-standard port and fail again, label the port. Exercise 5
repeats the whole chain unaided on `serverb`. Each becomes a `.sh` command file
in the current `kitty-demo` format and an `.html` written exercise, as in w06.

**Decided 2026-09-25:** `httpd` is removed at the end of the week, as w06 does.
Exercise 4 removes it from `servera` and exercise 5 removes it from `serverb`,
each restoring the port label and firewall change it made, so the hosts end the
week as they started.

State to settle when the exercises are written:

- Whether exercise 1 leaves the interface in `public`. It must, or exercise 2
  starts from a broken host. The `--reload` ending covers this.
- Exercise 5 needs `serverb` reachable and untouched by the earlier exercises.

## Additions

**Decided 2026-09-25: all five are accepted**, and can be trimmed after the port
if the deck runs long. Four become slides, described in place under "Topic
fragments" as 1.9, 2.2a, 2.8a, and 6.3a. The fifth, rich rules, is one sentence
and becomes a `Callout` on 2.8a rather than a slide of its own.

- **Zone selection logic.** RH134 ch14 section 01 gives the order: source
  address first, then incoming interface, then the default zone. The source deck
  never states it, and it explains why the drop-zone exercise behaves as it
  does. One slide, probably Mermaid.
- **`firewall-cmd` option reference.** A table of the dozen options the week
  uses, as a slide students can photograph. RH134 has one; ours would be our own
  wording and shorter.
- **What `firewalld` sits on.** One sentence connecting `firewalld` to
  `nftables` and the kernel's `netfilter`, so students know what the tool is a
  front end for. RH134 ch14 section 01 opens with it.
- **Rich rules exist.** One line saying complex rules are possible and out of
  scope, so nobody thinks zones and services are the whole product.
- **`httpd_can_network_connect`.** A callback to w06's booleans, for the case
  where SELinux blocks an outgoing connection rather than a listening port.

## Corrections

- "Guess whose Back" becomes "Guess Who's Back".
- `configure_apache_to_listen_on_8888.sh` needs `ssh student@servera` before its
  first privileged command.
- Prompts become the theme's form, `student@servera:~$` and
  `root@servera:~#`, rather than `[student@servera ~]$`.
- Source transcripts that show two interfaces are re-captured. See "The
  two-interface problem".
- The source's `<br />` spacers and inline `<img>` tags are dropped; the theme's
  layouts handle spacing.

## Not ported

- **Both GIFs**, replaced by casts.
- **The asciinema link on source slide 23**, replaced by the embedded player.
- **The web console screenshots** from RH134 ch14 section 01. The course teaches
  `firewall-cmd`, and the screenshots are curriculum material.
- **RHA's `ROL` zone warning** in the chapter 14 lab, which is specific to Red
  Hat's hosted environment and does not apply to this lab.

## Verification

Checked on the lab (RHEL 10.0), carried over from 2026-09-17 and extended
today:

- `semanage port -l | grep http` on `servera`:

  ```text
  http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
  http_cache_port_t              udp      3130
  http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443, 9000
  ```

- Ports 82, 8888, and 3456 are unlabeled on `servera`. Port 8008 is already
  `http_port_t`.
- `httpd` and `setroubleshoot-server` are not installed on `servera`.
  `setroubleshoot-server` is installed on `workstation`.
- `servera` has one Ethernet interface, `enp1s0`, in the `public` zone, which is
  also the default zone.
- `firewall-cmd --list-all` on `servera` today: `services: cockpit
  dhcpv6-client ssh`, and every other list, including `ports`, is empty.

Still to verify, before the slides are written:

- Whether `serverb` needs `firewalld` started before exercise 5. It is the only
  question left; the zone output, the `dmz` session survival, and the `--reload`
  restore were all answered while fragment 2 was built.

Verified on `servera` while building fragments 2 and 3 (2026-09-26), and
recorded here because the slides carry no presenter notes.

The happy path on fragment 2, traced end to end:

| Step | `--get-active-zones` after it |
| --- | --- |
| baseline | `public (default)` holding `enp1s0` |
| `--zone=dmz --change-interface=enp1s0` | `dmz` holding `enp1s0`, plus `public (default)` |
| `--zone=dmz --add-service=http` | unchanged; `--list-services --zone=dmz` reports `http ssh` |
| `--set-default-zone=dmz` | `dmz (default)` holding `enp1s0`, one entry |
| `--reload` | unchanged, and `--list-services --zone=dmz` reports `ssh` |

So the reload erases the service and keeps the default zone. The interface also
stays in `dmz`, because `dmz` is now the default, which is why the slide points
at the service rather than the interface.

Zone assignment, tested three ways, and the reason the lockout exercise was
dropped:

- `firewall-cmd --set-default-zone` writes the runtime and the permanent
  configuration in one step, and prints `success`.
- `firewall-cmd --change-interface` is runtime only, so `--reload` drops the
  binding.
- `firewall-cmd --permanent --zone=dmz --change-interface=enp1s0` does persist,
  and survives a default-zone change. It prints "The interface is under control
  of NetworkManager, setting zone to 'dmz'" and writes nothing to
  `/etc/firewalld/zones/`, because firewalld hands the assignment to the
  NetworkManager connection profile.
- `nmcli connection modify enp1s0 connection.zone dmz` is the same thing by
  hand, and behaves identically.
- An interface moved with the runtime form still follows a later
  `--set-default-zone`, which is the behaviour that made the original slide
  sequence confusing and is now out of the deck.
- An interface that was never assigned by name follows the default zone: with
  the default set to `internal`, `--list-all` reported `internal (default,
  active)` holding `enp1s0`.
- `dmz` allows `ssh`, which is why moving an interface there does not end the
  session. `drop` has `target: DROP` and no services at all.
- `public` stays listed by `--get-active-zones` while it is the default, even
  with no interface in it.
- The ten zones on RHEL 10 are `block`, `dmz`, `drop`, `external`, `home`,
  `internal`, `nm-shared`, `public`, `trusted`, and `work`.
- The default value of `httpd_can_network_connect` on `servera`, for slide 6.3a.
- The three layers named on slide 1.9 against RHEL 10: that `nftables` is the
  firewall core and `firewalld` the front end.

Verified on `servera` while building fragment 4 (2026-09-27):

- `firewall-cmd --get-services | wc -w` reports 259, and the list begins
  `0-AD RH-Satellite-6 afp amanda-client amqp audit bacula bgp bitcoin ceph`.
- `/usr/lib/firewalld/services/http.xml` holds the `short`, `description`, and
  `port protocol="tcp" port="80"` elements quoted on slide 4.2.
- With `http` closed, `curl http://servera` from `workstation` fails with
  `curl: (7) Failed to connect to servera port 80 after 0 ms`, not the timeout
  w05 shows, because `public` rejects rather than drops. See "Corrections".
- `--add-service=http` then serves the page, and `--runtime-to-permanent`
  keeps it across `--reload`.
- `servera` was restored afterwards: `httpd` removed, `index.html` deleted, and
  the runtime and permanent services back to `cockpit dhcpv6-client ssh`.

Verified on `servera` while building fragments 5 and 6 (2026-09-27), with the
host restored to that same baseline afterwards:

- `httpd` is 2.4.63-1.el10 and its `Listen 80` line is line 47 of
  `/etc/httpd/conf/httpd.conf`.
- With `Listen 8888`, `systemctl restart httpd` fails and the status output
  reads `(13)Permission denied: AH00072: make_sock: could not bind to address
  0.0.0.0:8888` followed by `no listening sockets available, shutting down`.
- The denial is `avc: denied { name_bind }` with `tcontext=...
  unreserved_port_t`, which is the label 8888 carries by default.
- `setenforce 0` lets the same restart succeed, which is the proof step in the
  exercise. The host goes straight back to enforcing.
- With `setroubleshoot-server` installed, `/var/log/messages` gets one summary
  line: `SELinux is preventing /usr/sbin/httpd from name_bind access on the
  tcp_socket port 8888`.
- `sealert -a /var/log/audit/audit.log` reports `found 1 alerts` on this host,
  and the `bind_ports` plugin leads at 92.2 confidence with
  `semanage port -a -t PORT_TYPE -p tcp 8888`, listing `http_port_t` among the
  types.
- After `semanage port -a -t http_port_t -p tcp 8888`, the port joins the front
  of the `http_port_t` line, `semanage port -l -C` shows that one row, `httpd`
  starts, and `curl http://servera:8888` from `workstation` returns the page.
- **`semanage port -m` does relabel a port the base policy already labels.**
  `-m -t http_port_t -p tcp 8080` succeeds and shows up under `-l -C`, and `-d`
  puts 8080 back to `http_cache_port_t`. `semanage port -a` on a defined port
  prints `Port tcp/8009 already defined, modifying instead` and succeeds. The
  cert guide's advice holds on RHEL 10; RHA's claim that default port labels
  cannot be changed does not.
- `getsebool httpd_can_network_connect` reports `off`, for slide 6.3a.
- `sesearch -A -s httpd_t -t http_port_t -c tcp_socket` reports
  `allow httpd_t http_port_t:tcp_socket name_bind;`, which is the rule behind
  slide 6.1a's closing line. `setools-console` is not installed by default and
  was removed again afterwards.
- Restoring `Listen 80` before `dnf remove httpd` leaves no `/etc/httpd` at all.
  Removing the package with the edit still in place leaves
  `/etc/httpd/conf/httpd.conf.rpmsave` behind, which is why the cleanup undoes
  the edit first.

## Authoring notes

- Verify every transcript with `pnpm lab` before it lands, per the
  `lab-verification` skill.
- `pnpm run check:slides -- course/w07-draft.md` fails only on content that
  leaves the content box and on render errors; use `--verbose` while judging how
  full a slide is.
- Recording slides come last, after `kitty-demo.py --record` and
  `pnpm run casts`.
- Keep everything unstaged. The instructor stages and commits.

**No presenter notes.** The instructor does not display them while teaching
(2026-09-26), so w07 carries none and the ten written during fragments 1
through 3 were removed. A fact worth keeping goes on the slide, or into this
document under "Verification" if it is something checked on the lab.

Learned while building fragment 1:

- **`check:slides` cannot see overflow inside a code block.** A fenced block
  sits in its own scrolling container, which the measurement skips, so a
  terminal or rule block can run through the footer while the check passes.
  Capture every slide that carries a fence and look at it. Fragments 2 and 3
  are seven terminal slides and two Magic Moves, so this is most of the work.
- **Give icon diagrams headroom.** Their measured height varies by a few pixels
  between runs, because the icon pack loads asynchronously, so a diagram that
  exactly fills its box passes and fails on identical runs. Keep icon diagrams
  at roughly `scale: 0.7` or below, and re-run the check two or three times
  before calling a slide done.
- **`--verbose` prints no clearance line for some `two-cols-header` slides**,
  so absence of a number there is not a pass.

House style fragment 1 set, which the rest of the port follows:

- Topology diagrams are Mermaid with Carbon icon shapes. `stroke` colours the
  glyph, `fill` the box, `color` the label, and `<br/>` adds a second line to a
  label, which is where a node's allowed ports go.
- Infrastructure that belongs to somebody else is drawn in neutral grey; the
  thing under discussion carries the accent.
- A firewall rule is a titled `text` fence with `FROM / TO / PORT / ACTION`
  columns rather than prose.
- `SuccessText` for allowed, `DangerText` for blocked, in tables and in prose.

## Decisions

Proposed here, each reversible, listed so the instructor can say no:

1. Seven fragments, split on the source's own section slides.
2. Accent `pink` (was `red` until 2026-09-28), chosen by the instructor. See
   "Deck-level decisions".
3. Source slide 1's hero image becomes a section slide.
4. Source slides 3 and 4 gain titles.
5. The zone table is rebuilt in our own words, trimmed to six rows.
6. Slide 3.3 becomes two columns.
7. A section slide is added at 6.1 and at 7.1.
8. `semanage port -a` gains a slide at 6.3.
9. Every exercise gains a recording slide.
10. Transcripts are re-captured from `servera` with one interface, per option 1
    of "The two-interface problem".

Settled since this plan was written:

11. **Slide 1.4 uses a photograph** of a BlueArc Mercury 100 rear panel, CC BY
    2.0 by ChrisDag, cropped to the server itself and saved as
    `assets/server-rear-panel.jpg` (2026-09-25).
12. **Slide 1.3 is our own Mermaid diagram** drawn with Carbon icon shapes
    (2026-09-25). The theme now registers that icon set for every deck.
13. **The three decorative hero images are not ported** (2026-09-25):
    `firewall_hero.jpg`, `ports_hero.jpg`, and `selinux_hero.jpg` have no
    recorded provenance and carry no teaching weight. Slide 1.1 becomes a
    section slide, and slides 5.2 and 6.2 run at full width as text and
    terminal.
14. **All five additions are built** (2026-09-25), four as slides and rich rules
    as a `Callout`. Fragment 1 gained three more during the build (2026-09-26):
    "What a Firewall Does", "A Network Firewall", and "A Server Firewall". The
    deck is 45 slides rather than 39.
20. **Source slide 6 is not ported** (2026-09-26). "The 2-Step Pattern of
    Firewalld Configuration" was built and then cut; fragments 2 and 4 teach
    both steps in full.
21. **Fragment 2 is a happy path** (2026-09-26). Move an interface, make that
    zone the default to stop typing `--zone`, open a service, reload, and let
    the reload raise the runtime-versus-permanent question that fragment 3
    answers. Source slides 12 and 13 fold into that sequence rather than
    standing alone.
22. **The drop-zone lockout exercise is not ported** (2026-09-26). It is
    replaced by "Move an Interface and Change the Default Zone", which follows
    the same path the slides take. `drop` and `block` stay on the zone table.
23. **NetworkManager's ownership of zone assignment stays out of the deck**
    (2026-09-26). It is accurate, it is recorded under "Verification", and it
    is deeper than RHCSA needs.
24. **The default zone is read but never changed** (2026-09-26). The week is
    2.5 hours and has been running out of time, so `--set-default-zone` and the
    two source slides that demonstrate it are cut. It survives as a row in the
    option table on 2.6.
25. **The zone-selection-logic addition is cut** (2026-09-26), for the same
    reason. Its one useful line, that an unassigned interface uses the default
    zone, moves onto 2.3.
26. **`two-cols-header` gained an optional `bottom` slot** (2026-09-27), added
    for slide 4.2 so a closing line can run the full width under both columns.
    The slot renders nothing when a slide omits it, and the 75 published slides
    on that layout were measured before and after to confirm they did not move.
27. **`horizontal` now governs the whole `two-cols-header` slide** (2026-09-27),
    not the columns alone. The instructor centered slide 6.1a and found its
    subtitle and closing band still left-aligned. The leading heading keeps its
    left anchor, as in the default layout, so only what follows it moves. Two
    published slides shift: w01's "Console" and "Terminal", whose subtitles are
    long enough that the change is a few pixels.
15. **The drop-zone exercise ends with `firewall-cmd --reload`** rather than a
    hypervisor reboot (2026-09-25).
16. **`httpd` is removed at the end of the week** on both `servera` and
    `serverb` (2026-09-25).
17. **The cover lists six agenda lines** (2026-09-25), with zones and
    configuration sharing one.
18. **The midterm review is not in this deck** (2026-09-25). The instructor
    hands it out separately.
19. **w05 is not used as a hand-off** (2026-09-25). The firewall is introduced
    from scratch here.

## Open questions

All six are settled as of 2026-09-25 and kept here for the record. What remains
unknown is in "Still to verify" under "Verification".

1. ~~**Midterm review.**~~ Not in this deck. The instructor hands it out
   separately.
2. ~~**The remaining images.**~~ Settled: `server_ports.png` is replaced by the
   BlueArc photograph, `network_diagram.png` by the Mermaid diagram on slide
   1.3, and the three decorative heroes are not ported.
3. ~~**Deck length.**~~ Settled: all five additions are accepted, which with
   1.1a brings the deck to 44 slides, and anything that runs long is trimmed
   after the port rather than before it.
4. ~~**The drop-zone reboot.**~~ The exercise and its recording end with
   `firewall-cmd --reload` rather than a hypervisor reboot.
5. ~~**`httpd` at the end of the week.**~~ Removed on both `servera` and
   `serverb`, as w06 does.
6. ~~**Cover agenda.**~~ Six lines, with zones and configuration sharing one.

## Ready to build

Nothing blocks the port. The next step is fragment 1, and every transcript gets
verified on the lab before it lands.
