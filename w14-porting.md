# W14 - Port

## Prompt

Port w14 from `~/s/IT-230/w14` with the week-porting skill. Use the LibreOffice deck, `ManagingContainers.odp`, as the primary source, not the Slidev deck: the Slidev slides were never finished, and the ODP is what was taught. Nothing is built until the plan is approved.

## Answer in brief

**Built 2026-11-14, reordered and extended 2026-11-15, recorded 2026-11-16: six topic fragments, six exercises, and a deck of 63 slides,** all built, with a recording slide after each exercise and every recording checked. The ODP's topics stay in its order. An added fragment, Containerfiles, sits between Running Containers and Volume Mounts and teaches the image-building half of RH134 chapter 17 that the ODP never had, and that both this week's graded RHA lab and the SCC lab assignment require. The ODP's last two slides, O28 and O29, were left out at first and are now the sixth fragment, Containers as Services (Decision 49). Every ODP content and task slide is kept except the two video cues.

|  # | Fragment                | Section title          | Slides | Exercises |
|---:|-------------------------|------------------------|-------:|----------:|
|  1 | `why-containers.md`     | Why Containers         |     17 |         1 |
|  2 | `container-images.md`   | Container Images       |     12 |         1 |
|  3 | `running-containers.md` | Running Containers     |      9 |         1 |
| 3a | `containerfiles.md`     | Containerfiles         |      8 |         1 |
|  4 | `volume-mounts.md`      | Volume Mounts          |      7 |         1 |
|  5 | `container-services.md` | Containers as Services |      8 |         1 |
|    | Entry file              |                        |      2 |           |
|    | **Total**               |                        | **63** |     **6** |

Slide counts include each fragment's recording slide, not built until its cast exists. Before the audit the plan was four fragments, three exercises, and 34 slides.

Where things stand on 2026-11-13:

1. **Nothing is built.** This plan is the only new file.
2. **The ODP is the spec.** The Slidev deck is read only to note where it went; none of its slides, layouts, or command files are ported (see "Scope").
3. **The ODP's own command files were found** in the source repository's history and in its `9.3/` directory: four `run_containers-*.sh` files, three of them recorded as the ODP's asciinema links. They are the exercise sources, not the current `demonstrations/managing_containers/` files, which belong to the Slidev deck.
4. **Round 1 of verification is done**, read-only, on the instructor lab (see "Verification"). It found that `container-tools` no longer exists on RHEL 10, that Podman is installed on `workstation` but not `servera`, that the ODP's `ubi9/httpd-24` has a RHEL 10 successor, `ubi10/httpd-24`, that needs no login, and that `podman generate systemd` is marked deprecated.
5. **There is no Cert Guide chapter.** The RHEL 10 Cert Guide has no containers chapter, and its RHCSA objective table has no containers section. The lesson plan's "Chapter 26" is the RHEL 9 book's; in the RHEL 10 book it is Final Preparation. The week aligns to RH134 chapter 17 only.
6. **Your answers to Open questions 1 to 5** (2026-11-13) set the host to `servera` with Podman installed in class, keep the cube image, drop the video cues, and supplied the SCC lab assignment.
7. **The audit is done** (see "Audit against RH134 chapter 17"): 19 proposals, A1 to A19, as Decisions 31 to 43. Round 2 verified the assignment's workflow on the lab, including the HTTP 403 a missing `:Z` causes, and restored the host.
8. **Approved 2026-11-14**, every decision as recommended, and built the same day, fragment by fragment. You dropped `podman login` during fragment 2.
9. **Everything but the recordings is built**: 44 slides, five command files, and five written exercises. `check:entry`, `check:slides` (no overflow), `check:exercises` (no violations), and `kitty-demo --check` on all five pass, and every slide was exported and looked at. Nothing is staged.
10. **The whole exercise chain was verified** on the instructor lab in order, cleanup included (Rounds 3 to 5), and the lab is at the week's start. "Exercises" gives the recording order and lengths.
11. **The logout callout (Decision 38) is closed** by fragment 5, which teaches lingering and shows the logout in its exercise (Decision 50).
12. **Reordered 2026-11-15** at your suggestion (Decisions 44 to 46): Containerfiles now comes before Volume Mounts, its exercise bakes the page into `intranet:1.0`, changes it, and rebuilds `intranet:1.1`, and the Volume Mounts exercise mounts a page into that `intranet:1.1` so edits show live. Two slides were added (3a.4a, 4.1a), both exercises were rewritten and re-verified (Round 6), and the lab is back at the week's start. You also changed the accent to `teal` (Decision 47).
13. **Gap scan, 2026-11-15** (Decision 48): every command, flag, and idea the five exercises use was checked against the slides before each exercise. Four slides were added where an exercise relied on something the slides only named in a table or never showed (2.7c, 3.2d, 3.2e, 4.2b), and 2.5 now names `unqualified-search-registries`. Transcripts from Round 7.
14. **Fragment 5, Containers as Services, built 2026-11-15** (Decisions 49 to 53), after you planned w15 around an application whose app tier runs as a rootless container service, and because some students take the RHEL 9 RHCSA exam, which still has containers. It ports O28, O29, and the ODP's `run_containers-as_a_regular_user.sh`: `podman generate systemd --new --files --name`, `systemctl --user`, logging in with SSH rather than `su -`, and `loginctl enable-linger`, with an exercise that creates the user `webapp`, logs out, enables lingering, and reboots. Round 8 found that on RHEL 10 a generated unit starts its container before the network is up at boot, so the published port gives empty replies; the slides and the exercise add Podman's network wait with `--wants` and `--after` (Decision 52). Exercise 5's cleanup now leaves Podman installed for exercise 6, whose cleanup removes it. No `skopeo` (Decision 51). The lab is at the week's start.
15. **Recorded 2026-11-16, and the six recording slides added.** Exercises 4 to 6 are kept. Exercise 1's take is broken, because `dnf` outlasted its hold and swallowed the next commands, so its hold is now 30 seconds, and exercises 1 to 3 were recorded again from the week's start the same day; all six recordings are now kept (see "Exercises"). The lab is at the week's start.
16. **Published 2026-11-17** by renaming the draft to `course/w14.md` and adding `"w14"` to `tests/site.test.mjs`, after the shipping-container photograph was replaced (Decision 17) and you kept exercise 2's Docker Hub pull (Decision 54). `pnpm check` first failed on w13, not w14: `configure-nfs-server-exercise.cast`, re-recorded on 2026-11-11 and committed in `05e1537`, had never been processed, so it still carried the recording machine's shell identity. That commit's CI run failed, so production never served it, but it is in the public repository's history. The cast was processed with `pnpm run casts`, which removed the identity.

## Scope

The lesson plan's agenda is "All about containers!". It assigns the RHA lab for chapter 17 section 07, SCC Lab chapter 17 lab 01, and the optional *RHCSA Cert Guide* chapter 26.

The source material is in `~/s/IT-230/w14/slides/` and the source repository's history:

- **LibreOffice deck:** `ManagingContainers.odp` (29 slides), last year's deck as taught, updated for RHEL 10 in its diagrams. It has no section slides and no presenter notes beyond page-number placeholders. An older copy at `~/s/IT-230/9.3/rh134-ch13-run_containers/slides/ManagingContainers.odp` differs only in version numbers (RHEL 9.3 and Python 3.10 where w14 has RHEL 10 and Python 3.12) and in the position of "Container Engines", which w14 moved after "Container Registries".
- **ODP command files:** `run_containers-manage_container_images.sh`, `run_containers-manage_containers.sh`, `run_containers-mount_web_content.sh`, and `run_containers-as_a_regular_user.sh`. They are byte-identical in `~/s/IT-230/9.3/rh134-ch13-run_containers/demonstrations/` and in commit `843f220` of the source repository, which added them to `w14/demonstrations/` before `40a592b` deleted them. The first three are the recordings behind O20, O24, and O27. The fourth matches O28 and O29 but has no task slide and no recording. All four run on `servera`.
- **Last year's notes:** a `.md` beside each of the first three command files, giving the asciinema link, the host (`servera`), and a reset.
- **Slidev deck, not ported:** `slides.md` (cover and VM reminder), `managing-containers.md` (about 60 slides, unfinished), `slide-summary-v1.md` and `-v2.md`, and the five command files in `demonstrations/managing_containers/`. The Slidev deck went its own way after the motivation section: it builds an image from a Containerfile in every exercise and never pulls from Docker Hub. Its VM reminder ("Start Up the `workstation` VM") is the only convention borrowed.
- **`slides/public/`** holds the college and Red Hat logos and the Slidev deck's images. The ODP embeds its own four images (see "Third-party images").
- **`slides/accessing_network_attached_storage.md`** is w13's deck, copied in by mistake.

The curriculum is RH134 chapter 17, *Managing Containers with Podman*: introduction to containers, running containers with Podman, and creating and managing container images. RH134's RHEL 10 chapter no longer teaches persistent storage or containers as systemd services, both of which the RHEL 9.3 chapter (13) did, and which the ODP's last three topics come from. Nothing from RH134 is copied.

RHCSA objectives covered: none. The RHEL 10 exam objectives, as the Cert Guide's Table 1 lists them, have no containers section. Practice Exam B's task 13 mentions a bind-mounted container started by systemd, but the sentence is fused with a Flatpak task and looks left over from the RHEL 9 book. Some students take the RHEL 9 exam instead, which still has containers, including a container started as a systemd service; RH134 for RHEL 9 teaches that with `podman generate systemd` and `loginctl enable-linger`, which is why fragment 5 exists (Decision 49).

## Port fidelity

Source slides are numbered by ODP page: **O1 to O29**. Planned slides are numbered by fragment, such as 2.4, in ODP order. A slide this repository adds carries a letter, such as 2.7a, so the ODP numbering never moves.

The ODP's order is kept slide for slide. Nothing is split, merged, reordered, or dropped in this plan except where a heading says "propose", and each proposal is listed again under "Decisions".

Forced changes, not choices:

- **Theme expression.** The ODP's gradients, arcs, ovals, and title-left layouts give way to the theme's layouts. Its hand-drawn stack diagrams are rebuilt as Mermaid. Its three asciinema links become recording slides with casts served from this site.
- **Commands that no longer work on RHEL 10.** `dnf install container-tools` installs nothing, and `podman generate systemd` is deprecated and, as generated, breaks a published port after a reboot. See "Corrections".
- **Inconsistent versions inside the ODP.** Its bullets still say Python 3.10 where its RHEL 10 diagrams say 3.12, and O9 still says RHEL 9.3. See "Corrections".
- **A sentence quoted from RH134.** O2 and O11 are RH134's definition of a container word for word. It is paraphrased (Decision 10).
- **Dashes.** The ODP has no em dashes, but it uses en dashes as dashes (O16, O17, O21, O28). The port rewrites them as commas, colons, or parentheses.

## Sequencing and framing

- **W14 starts from the lab snapshot.** Verified (Round 1): on the instructor lab `workstation` has Podman 5.4.0 and Buildah from the "Container Management" group, which its "Server with GUI" install includes; `servera` has neither. Neither has `skopeo` or `httpd`. `student` on `workstation` has no images and no containers. `/etc/containers/registries.conf` searches `registry.access.redhat.com`, `registry.redhat.io`, and `docker.io`, in that order, with `short-name-mode = "enforcing"`. Both registries answer from `workstation`.
- **Two hosts, `servera` and `workstation`** (Decision 6, revised 2026-11-13). Containers run on `servera`, as in the ODP, where students install Podman themselves; `workstation` reaches a published port across the network (A9). Assume neither student host has Podman, as an exam VM might not (your answer to Open question 1).
- **Everything runs rootless, as `student`,** except in exercise 6, which creates the user `webapp` and runs its container as `webapp`. No `sudo` is needed after the install question is settled, apart from creating and removing that user and managing its lingering. Each user has their own image store, so images `student` pulls are invisible to other users, which the ODP's O29 makes a point of and exercise 6 shows with `podman images` as `webapp` and `podman ps` as `student`.
- **What earlier weeks taught.** W04: `systemctl`. W05: Apache, `curl`, and `/var/www/html` as the document root. W06: SELinux contexts and `ls -Z`, which `:Z` (4.2a) relies on. W07: ports. IT-130: `vim`, `ps`, `id`, `mkdir`, `echo` redirection. This week relies on all of them without reteaching.
- **Generic names on slides, meaningful ones in exercises** (Decision 27).
- **The exercises chain through the lab state.** See "Exercises".
- **W15 builds on this week.** As planned on 2026-11-15 (see `w15-porting.md`), w15 deploys Forgejo as a three-tier application for a semester review, and its app tier is a rootless container run as a user of its own and made a service with fragment 5's `podman generate systemd` and lingering. The lesson plan's RH134 chapter 18, *Working with Image-Based RHEL*, which builds a bootable image from a Containerfile, is what w15 assigned before.

## Deck-level decisions

- **Entry file:** `course/w14-draft.md`, renamed to `course/w14.md` at publication.
- **Accent:** `teal`, set by you in the entry file by 2026-11-15 (Decision 47). The plan had proposed `orange` (Decision 3): it is the only accent no week has used (`red` is reserved for the Final), and it is the ODP's own color and the color of a shipping container. `docs/course-authoring.md` reserves warm accents for decks with little syntax; this deck is about half diagrams, and its command slides are short `podman` lines, so the risk is modest. The cool alternative is `pink`, used once (w07). Used so far: teal (w01, w06, and now w14), purple (w02, w11), blue (w03, w10), green (w04, w12), slate (w05, w13), pink (w07), yellow (w08).
- **Title:** "Managing Containers", the ODP's own (Decision 4). RH134's is "Managing Containers with Podman".
- **Cover agenda:** six lines, one per fragment (Decisions 5, 41, and 49).
- **Cover summary:**

  ```yaml
  courseInfo:
    summary: >-
      This week we will see why containers exist, install Podman and run our
      first containers, find and download images from registries, run and
      explore containers, build our own images from a Containerfile, serve web
      pages from a host directory mounted into a container, and run a container
      as a service that starts at boot.
  ```

- **VM reminder:** "Start `workstation` and `servera` on your VDI", as in w13 (Decision 6).
- **Chapter directory:** `course/chapters/rh134-ch17-managing-containers-with-podman/`.
- **Alignments** (Decision 2): every fragment declares RH134 chapter `"17"`, *Managing Containers with Podman*, and no Cert Guide chapter. Fragment 4 goes beyond the RHEL 10 chapter (see "Scope") but extends it, so it keeps the same alignment.

## Source-to-fragment map

From `ManagingContainers.odp`:

| Source | Title                                 | Goes to               |
|-------:|---------------------------------------|-----------------------|
|     O1 | Managing Containers (title)           | cover                 |
|     O2 | What is a Container?                  | 1.2                   |
|     O3 | Why Containers? (dev laptop)          | 1.3                   |
|     O4 | Why Containers? (works on my machine) | 1.4                   |
|     O5 | Why Containers? (ops deploys)         | 1.5                   |
|     O6 | Why Containers? (manager mandate)     | 1.6                   |
|     O7 | Why Containers? (upgrade request)     | 1.7                   |
|     O8 | Why Containers? (two VMs)             | 1.8                   |
|     O9 | VM as the unit of Isolation           | 1.9                   |
|    O10 | Traditional Apps vs Containerized     | 1.10                  |
|    O11 | What is a Container? (repeat of O2)   | 1.11                  |
|    O12 | Registry, image, container diagram    | 2.2                   |
|    O13 | Images vs Instances                   | 2.3                   |
|    O14 | Container Images                      | 2.4                   |
|    O15 | Container Registries                  | 2.5                   |
|    O16 | Container Engines                     | 2.6                   |
|    O17 | "13.5 Video" cue                      | not ported            |
|    O18 | Podman Image Actions                  | 2.7                   |
|    O19 | Task: Manage Container Images         | 2.8                   |
|    O20 | asciinema link (images)               | 2.8a                  |
|    O21 | "13.1 Video" cue                      | not ported            |
|    O22 | Podman Container Actions              | 3.2 and 3.2a          |
|    O23 | Task: Manage a Container              | 3.3                   |
|    O24 | asciinema link (container)            | 3.3a                  |
|    O25 | Volume Mounts                         | 4.2                   |
|    O26 | Task: Mount web content               | 4.3                   |
|    O27 | asciinema link (mount)                | 4.3a                  |
|    O28 | Run Containers with Systemd           | 5.2 (Decision 49)     |
|    O29 | Run Containers as a Regular User      | 5.3, and `:Z` on 4.2a |

From the ODP's command files:

| Source file                                 | Goes to    |
|---------------------------------------------|------------|
| `run_containers-manage_container_images.sh` | Exercise 1 |
| `run_containers-manage_containers.sh`       | Exercise 2 |
| `run_containers-mount_web_content.sh`       | Exercise 3 |
| `run_containers-as_a_regular_user.sh`       | Exercise 6 |

Slides with no source row: the section slides 1.1, 2.1, 3.1, 3a.1, 4.1, and 5.1, the VM reminder, and the slides each fragment's entry marks as additions.

## File inventory

New, under `course/chapters/rh134-ch17-managing-containers-with-podman/`:

| File                    | Slides | Exercises |
|-------------------------|-------:|----------:|
| `why-containers.md`     |     17 |         1 |
| `container-images.md`   |     12 |         1 |
| `running-containers.md` |      9 |         1 |
| `containerfiles.md`     |      8 |         1 |
| `volume-mounts.md`      |      7 |         1 |
| `container-services.md` |      8 |         1 |

Plus, in `exercises/`, one `.sh` command file, one `.html` written exercise, and, after recording, one processed `.cast` per exercise (six of each); and in `assets/`, `podman-cube.webp` and `shipping-containers.webp` (Decision 17). No placeholder remains.

Also new: `course/w14-draft.md`, published as `course/w14.md`, when `tests/site.test.mjs` gains `"w14"` in its published-week list.

No theme change was needed: Mermaid's `block-beta` draws the stacks, with label blocks for the machines' names.

## Third-party images

The ODP embeds four images. None has a recorded source.

- **O12, `10000000000003E800000222EBF9098E.png`** (1000x546). A Docker-style diagram: Registry/Hub, Pull, Push, Dockerfile, Build, Images, Run, Container, two "Container Engine" boxes. **Rebuild** as a Mermaid flowchart with Carbon icons (2.2). Never a placeholder.
- **O15, `1000000000000800000005FE20484C48.jpg`** (2048x1534). A stock photograph of red pins on a map. Decorative. **Dropped**: its column carries the `podman info` transcript (Decision 16).
- **O16, `1000000000000800000005556F2FAD1C.jpg`** (2048x1365). A stock photograph of stacked shipping containers and a forklift. Decorative, but it carries the week's metaphor. **Replaced** (Decision 17) on 2026-11-17 with a photograph you chose from Commons' [Stacks of shipping containers](https://commons.wikimedia.org/wiki/Category:Stacks_of_shipping_containers) category: [Different colored containers pic2](https://commons.wikimedia.org/wiki/File:Different_colored_containers_pic2.JPG), a wall of colored shipping containers in Antwerp by Alf van Beem (`Alfvanbeem`), released under CC0, so no credit is legally required. It gets the course's Commons credit line anyway. The Commons API gave the license, author, and SHA-1 (`dd3c8bd8...`), which the download matched. The 2560x1920 original was resized, uncropped, to `assets/shipping-containers.webp` (1600x1200, WebP quality 82, 179 KB, camera metadata dropped). The containers carry their shipping lines' painted logos (Evergreen, Textainer, and others), left as photographed.
- **O18 and O22, `1000000000000400000004009A90F51B.jpg`** (1024x1024). A glowing translucent cube on a circuit board, cropped to a circle. **Yours**, made with an LLM (answered 2026-11-13). **Kept**, with no credit line, and copied in as a final asset rather than a placeholder (Decision 18).

No `*.placeholder.*` file or reference may remain at publication.

## Topic fragments

**All six fragments are built** (fragments 1 to 4 on 2026-11-14, fragment 5 on 2026-11-15), and these entries describe what shipped. The six recording slides were added on 2026-11-16, one after each exercise, each waiting for its cast.

Each fragment opens with its `layout: section` slide, which carries the `routeAlias` and `topicInfo`. A "fixed" `TerminalWindow` shows a transcript that never changes and takes no `rows`. Every prompt takes the theme form, `student@workstation:~$`. Transcripts are captured at build from one slide chain on the lab, using the slides' generic names.

### 1. `why-containers.md` (17 slides), built 2026-11-14

`routeAlias: why-containers`. Alignment: RH134 chapter 17. Exercise: Run Your First Container Exercise. Built to "Proposed outline after the audit": the ODP's O2 to O11, with O16 moved to the end (A17), and the additions 1.10a, 1.11a, and 1.11b. The recording slide 1.12a was added on 2026-11-16. `check:slides` reports no overflow, and every slide was exported with `capture:course` and looked at.

The stacks on 1.3 to 1.10 are Mermaid `block-beta` diagrams (Decision 13). The machine's name is a label block with no fill or border at the top of its stack, and each layer keeps one hue throughout: Bins/Libs `blue`, Operating System `purple`, Infrastructure neutral grey, Container Engine `slate` (1.10 only; `teal` until 2026-11-15, when it became the deck accent), App3 `pink`, App1 and App2 white. Every box names its layer in words.

##### 1.1 Why Containers

Section slide carrying the `topicInfo`.

##### 1.2 What Is a Container?

Source O2, paraphrased (Decision 10): "A process packaged with everything it needs to run", with "process" and "everything it needs" in `AccentText`. `center` layout.

##### 1.3 Why Containers?

Source O3. "Dev installs Python 3.12" and "Dev creates App3" beside the Dev Laptop stack (App3; Bins/Libs (Python 3.12); Operating System (Windows); Infrastructure (Laptop)). `two-cols-header`, diagram at `scale: 1.4`.

##### 1.4 Why Containers?

Source O4. Developer's laptop, Python 3.12; Server, Python 2.7; Dev: "Works on my machine!". The Dev Laptop stack above the Server stack (App1, App2; Bins/Libs (Python 2.7); Operating System (RHEL 8); Infrastructure (Virtual Machine)), `scale: 0.8`, as in the ODP.

##### 1.5 Why Containers?

Source O5. Ops tries to deploy App3; Server, Python 2.7; Ops: "Doesn't work on server!"; Dev: "Works on my machine!". The Server stack with a third box labeled "App3 (fails)", drawn with a dashed red border in place of the ODP's "not allowed" symbol, so the words carry the meaning.

##### 1.6 Why Containers?

Source O6. Manager: "All developers must use Python 2.7!"; Dev: rewrites App3 in Python 2.7, not happy about it; Later: Python 2.x goes End of Life. Both stacks on Python 2.7, App3 now on the Server.

##### 1.7 Why Containers?

Source O7. The three lines of dialogue, with 3.12 for the ODP's 3.10, over the Server stack carrying App1, App2, and App3. Default layout.

##### 1.8 Why Containers?

Source O8. "Different VMs to isolate workloads" over Server 1 (App1, App2, Python 2.7, RHEL 8) and Server 2 (App3, Python 3.12, RHEL 10) side by side, both on Infrastructure (CPU, RAM, Storage). `horizontal: center`.

##### 1.9 VM as the Unit of Isolation

Source O9, with Server 3 on Python 3.12 and RHEL 10 (see "Corrections"). Three stacks in one row. To fit three across, each layer is named by its content alone: "Python 2.7", "RHEL 8", "CPU, RAM, Storage", where the ODP writes "Bins/Libs (Python 2.7)" and the like; the colors match the full names on 1.3 to 1.8. One line under the diagram, "Every app carries a whole operating system", states what the ODP left to the picture.

##### 1.10 Traditional Apps vs Containerized Apps

Source O10. `two-cols-header` with `vertical: start`, so the two bold column labels line up. Left, the three stacks of 1.9 at `scale: 0.8`, with "Hardware" for "Infrastructure (CPU, RAM, Storage)" to fit. Right, three containers drawn as dashed teal boxes, each holding its app and its Python, on Container Engine (Docker/Podman), Operating System (RHEL 8/9/10/+), and Hardware. The containers and the three base layers are each wrapped in an invisible group block; without that, `block-beta` gives every row the height of the tallest and stretches the base layers to double height.

##### 1.10a Containers and Virtual Machines (addition, A3)

A six-row table in our own words: runs on a hypervisor or a container engine; carries a whole OS (boot loader, kernel, init) or the app and its libraries; its own kernel or the host's; gigabytes or megabytes; starts by booting an operating system or by starting a process; moves to the same kind of hypervisor or to any OCI container engine. Under it: "At scale, Kubernetes and Red Hat OpenShift run containers across many hosts". "Starts by" replaces the plan's "minutes or seconds", since the lab's own VMs boot in seconds.

##### 1.11 What Is a Container?

Source O11, the exact repeat of 1.2 (Decision 11).

##### 1.11a How Containers Are Isolated (addition, A2)

`IconGrid` of four: namespaces, a private view of the system (`view-off`); cgroups, limits on CPU and memory (`dashboard`); SELinux, a label that confines it (`security`); seccomp, fewer kernel calls allowed (`locked`). Under it: "All four are features of the host's kernel".

##### 2.6 Container Engines (moved, A17)

Source O16, moved here from fragment 2 and keeping its number. Docker: 2013, client and server, with a daemon. Podman: 2019, from Red Hat, fork and exec with no daemon, runs like a regular Linux process. Both run standard images, OCI. Podman's date is its 1.0 release, 16 January 2019 (podman.io). `two-cols-header`, `leftWidth: 55`, with the shipping-container photograph at right as `assets/shipping-containers.webp`, empty alt text since it is decorative, and a `text-xs` credit line under it: "Photograph by Alf van Beem, CC0, via Wikimedia Commons", each part linked (Decision 17). 34px of clearance, checked in a capture at 1920x1080.

##### 1.11b Installing Podman and Running a Container (addition, A17)

A plain `bash` fence, `sudo dnf install -y podman`, then a fixed `TerminalWindow` with `podman -v` and a first `podman run registry.access.redhat.com/ubi10/ubi echo Hello`, including the pull lines a student sees on a first run. Under it: "The first run downloads the image, and the container stops when its command ends" (A7). Transcript from Round 3.

##### 1.12 Exercise: Run Your First Container (A17)

Goal: see what a container brings with it and what it shares with its host. Host: `servera`. Workflow: install Podman; check the Podman version; compare the RHEL release in a UBI 10 container and on `servera`; compare the kernel in a UBI 10 container and on `servera`. The slide's `echo` and the exercise's `cat /etc/redhat-release` and `uname -r` use the same formula with different commands, and the exercise adds the comparison that teaches the shared kernel.

Files: `exercises/run-your-first-container-exercise.sh` (22 presses; `kitty-demo --check` passes) and `exercises/run-your-first-container-exercise.html` (`check:exercises` reports no violations). The written exercise says the release number depends on when the image is pulled.

##### 1.12a Exercise: Run Your First Container (recording)

Built 2026-11-16: `exercises/run-your-first-container-exercise.cast`, imported with `?url` into an `AsciinemaPlayer` whose label describes the recorded workflow, and the written exercise under `resources`. The first take was broken and was recorded again on 2026-11-16 with the longer install hold: 1m 46s, 5 markers. See "Exercises".

### 2. `container-images.md` (12 slides), built 2026-11-14, 2.7c added 2026-11-15

`routeAlias: container-images`. Alignment: RH134 chapter 17. Exercise: Manage Container Images Exercise. Built to the post-audit outline, with two changes made during the build: `podman login` (2.5a) is out at your request, and `inspect --format` got a slide of its own (2.7b) because the command table had no room for it. The recording slide 2.8a was added on 2026-11-16. `check:slides` reports no overflow, and every slide was exported and looked at.

##### 2.1 Container Images

Section slide carrying the `topicInfo`.

##### 2.2 Images, Registries, and Containers

Source O12, rebuilt (Decision 14): a Mermaid flowchart with Carbon icons. Inside a "Container engine" box, Containerfile, then **build**, then Image, then **run**, then Container; below it, a Registry joined to the Image by **pull** and **push**. `scale: 1`; at 1.3 it overflowed.

##### 2.3 Images vs Instances

Source O13. The two statements as a list on the left; on the right, one image fanning out to three containers in Mermaid, `scale: 0.9`.

##### 2.4 Container Images

Source O14 as an `IconGrid` of five: read-only layers (`layers`), the application (`application`), its binaries and libraries (`package`), its runtimes, such as Python (`code`), and the command to run (`terminal`). "Read-only layers" replaces "Single File (TAR)" (see "Corrections").

##### 2.3a Image Layers (addition, A1)

Four lines on the left (a stack of read-only layers; each adds files to the one below; a container adds one writable layer on top; removing the container deletes it) beside a `block-beta` stack: a dashed "Container layer (writable)" above three blue image layers, web content, httpd, and the UBI 10 base.

##### 2.5 Container Registries

Source O15. Left: where images come from, searched in order, with `registry.access.redhat.com` (no login), `registry.redhat.io` (login required), and `docker.io`. Right: a fixed `TerminalWindow` of `podman info | grep -A4 registries` from `servera` (Decision 16; the ODP's photograph is gone). A `::bottom::` band carries the two configuration files, naming the setting `unqualified-search-registries` that exercise 2 greps for (added 2026-11-15), and A6's line: browse Red Hat's images at catalog.redhat.com, keep your own on Quay.io. The files moved to the bottom band because, in the left column, they pushed the terminal's command past the slide's edge.

##### 2.7 Podman Image Actions

Source O18. `two-cols-header` with `leftWidth: 28`: your cube image (`assets/podman-cube.webp`, from the ODP, resized to 800x800, empty alt text) left, a seven-row table right: `podman info`, `podman search TERM`, `podman search --list-tags IMAGE`, `podman pull IMAGE`, `podman images`, `podman image inspect IMAGE`, `podman rmi IMAGE`. `podman image prune` moved to fragment 3a, where the first dangling image appears; with it the table overflowed by 19px.

##### 2.7a Image Names and Tags (addition, A12)

`TextExplainer` over `registry.access.redhat.com/ubi10/ubi:latest` in three steps: the registry, the repository, and the tag ("latest when none is given"). Under it: "UBI images are Red Hat's Universal Base Images, free to use and share". The slide uses `ubi10/ubi`, the exercise `ubi10/httpd-24`.

##### 2.7c Pulling, Listing, and Removing Images (addition, Decision 48)

Between 2.7a and 2.7b in the deck, so the order runs pull, list, inspect. A fixed `TerminalWindow` of a real `podman pull registry.access.redhat.com/ubi10/ubi-minimal` (with its blob and config lines), `podman images` (one image, 87.9 MB), and `podman rmi` (`Untagged:` and `Deleted:`). `ubi10/ubi-minimal` keeps the slide apart from the exercise's httpd images. One line under it: Docker Hub keeps its official images under `library/`, as in `docker.io/library/httpd`, which exercise 2 pulls. Transcript from Round 7.

##### 2.7b Inspecting an Image (addition, A13)

A fixed `TerminalWindow` of `podman image inspect --format '{{.Created}}' ubi10/ubi` and `--format '{{.Config.ExposedPorts}}' ubi10/ubi` (`map[]`), with two lines: without `--format` the command prints about 180 lines of JSON; with it, one field. The exercise applies the second field to the two httpd images.

##### 2.8 Exercise: Manage Container Images

Source O19, with its command file's content. Goal: find, download, inspect, and remove web server images. Host: `servera`. Prerequisite exercise: Run Your First Container. Workflow: find the registries Podman searches (`grep ^unqualified /etc/containers/registries.conf`); search the registries for an `httpd-24` image (33 lines, against 51 for `httpd`); pull `ubi10/httpd-24` from `registry.access.redhat.com` and `httpd` from `docker.io`; list the local images; find the ports each exposes (8080 and 8443 for Red Hat's, 80 for Docker Hub's); remove the `docker.io` image. The ODP's install step went to exercise 1; its `skopeo` step is gone (Decision 9). The written exercise explains why the search lists Red Hat's image under `registry.redhat.io` while the pull uses `registry.access.redhat.com`.

Files: `exercises/manage-container-images-exercise.sh` (30 presses; `kitty-demo --check` passes) and `.html` (`check:exercises` reports no violations).

##### 2.8a Exercise: Manage Container Images (recording)

Source O20. Built 2026-11-16 like 1.12a, from `manage-container-images-exercise.cast`: 2m 00s, 7 markers, recorded again with exercises 1 and 3 since the chain runs through it.

### 3. `running-containers.md` (9 slides), built 2026-11-14, 3.2d and 3.2e added 2026-11-15

`routeAlias: running-containers`. Alignment: RH134 chapter 17. Exercise: Manage a Container Exercise. O22 needed eleven rows once `ps`, `logs`, `restart`, `kill`, and `rm -a` and `-f` were added (A8, A10), so it became three tables rather than two, and the slides were renumbered in teaching order: 3.2a and 3.2b are O22's second half, 3.2c is Port Mapping. The logout callout (A11) is not on the slides; see Decision 38. The recording slide 3.3a was added on 2026-11-16.

##### 3.1 Running Containers

Section slide carrying the `topicInfo`.

##### 3.2 Podman Container Actions

Source O22, first half. Your cube image left (`leftWidth: 28`), and a table of `podman run` options right: `-d`, `-it`, `--rm`, `-p 8000:8080` (host port 8000 to container port 8080, for the ODP's `8080:80`; Decision 21), `-e GREETING=Hello`, `--name con01` (for the ODP's `web1`), and `IMAGE /bin/bash` (another command instead of the image's own, for the ODP's `/bin/sh`). A7's "the container stops when its command ends" is on 1.11b, where the first `run` appears.

##### 3.2d Foreground and Background (addition, Decision 48)

After 3.2 in the deck. A fixed `TerminalWindow`: `podman run -d --name con01 -p 8000:8080 registry.access.redhat.com/ubi10/httpd-24` printing the ID, `podman ps --format "{{.Names}}  {{.Status}}  {{.Ports}}"` showing `con01  Up 4 seconds  0.0.0.0:8000->8080/tcp, 8443/tcp`, and `curl -s localhost:8000 | grep '<title>'` returning the test page's title. Under it: without `-d` a container runs in the foreground, holds the terminal, and prints its log until Ctrl+C stops it; plain `podman ps` adds ID, image, command, and age; `curl -s` drops the progress meter. The `--format` keeps `podman ps` inside the slide; exercise 3 uses plain `podman ps`. Transcript from Round 7.

##### 3.2a Listing and Entering Containers (split from O22)

`podman ps`, `ps -a`, `logs con01`, and `exec -it con01 /bin/bash`, with one line: a stopped container is still there until it is removed.

##### 3.2e Looking Inside a Container (addition, Decision 48)

After 3.2a in the deck. The slide `podman exec` lacked: a fixed `TerminalWindow` of `podman exec -it con01 /bin/bash`, then `id` (`uid=1001(default) gid=0(root) groups=0(root)`), `ps aux` (`bash: ps: command not found`), and `exit`, back at the host prompt. The container's own `bash-5.2$` prompt does not match the theme's prompt pattern, so those lines render as plain text, which matches what students see. Under it: `exec` runs a command in a container that is already running, and the prompt changes because the shell is inside it; the image carries what httpd needs, not every tool, and `exit` leaves the shell while the container keeps running. Transcript from Round 7, where `con01` was still up four minutes after the `exit`.

##### 3.2b Stopping and Removing Containers (split from O22)

`stop` (SIGTERM, then SIGKILL after 10 seconds), `stop --all`, `kill`, `restart` (also starts a stopped container), `rm`, `rm -a`, and `rm -f`. The SIGTERM and 10-second facts are RH134's; in Round 5, `podman rm -f` on a `sleep` container, which ignores SIGTERM, warned that SIGTERM failed to stop it in 10 seconds and resorted to SIGKILL.

##### 3.2c Port Mapping (addition, A9 and Decision 21)

A Mermaid flowchart: `workstation` runs `curl servera:8000`, reaching host port 8000 on `servera`, which is mapped by `-p` to httpd on port 8080 inside the dashed container box. Under it, that `-p 8000:8080` takes the host port first, and that other hosts reach it once the firewall allows the port, with `sudo firewall-cmd --add-port=8000/tcp` in a `bash` fence. `scale: 0.9`; at 1.1 the diagram ran past the slide's right edge, which `check:slides` does not see.

##### 3.3 Exercise: Manage a Container

Source O23 and its command file. Goal: run, explore, and remove containers. Hosts: `servera`, `workstation`. Prerequisite exercise: Manage Container Images. Workflow: remove the stopped containers left from the first exercise (`ps -a`, `rm -a`); run the httpd image in the foreground with `--rm`, then stop it with Ctrl+C; run it in the background as `intranet`, publishing host port 8081; check it with `curl` (the test page's title, through `grep`) and `podman logs`; open a shell in it and run `id`, `ps aux`, and `ls /var/www/html`; reach it from `workstation` after `firewall-cmd --add-port=8081/tcp`; print an environment variable from a `ubi10/ubi` container that removes itself (`--rm -e GREETING=Hello ... printenv GREETING`); stop and remove `intranet`. The command file closes the port again as cleanup.

Files: `exercises/manage-a-container-exercise.sh` (63 presses, Ctrl+C sent as `#@ key ctrl+c`; `kitty-demo --check` passes) and `.html` (no violations).

##### 3.3a Exercise: Manage a Container (recording)

Source O24. Built 2026-11-16 like 1.12a, from `manage-a-container-exercise.cast`: 3m 53s, 9 markers. Recorded again, because the first take's opening step showed one stopped container where the written exercise expects two, after exercise 1's broken take ran only one of its two `podman run` commands.

### 3a. `containerfiles.md` (8 slides), built 2026-11-14, reordered 2026-11-15

`routeAlias: containerfiles`. Alignment: RH134 chapter 17. Exercise: Build a Container Image Exercise. The whole fragment is an addition (A14, A15, A16, A19). First built after Volume Mounts as "4a"; on 2026-11-15 it moved ahead of Volume Mounts and was renumbered 3a (Decision 44), so that students build an image with its page baked in, feel what a change costs, and then meet volume mounts as the answer. No ODP slide moved. The recording slide 3a.6a was added on 2026-11-16.

##### 3a.1 Containerfiles

Section slide carrying the `topicInfo`.

##### 3a.2 The Containerfile

A table of six instructions: `FROM`, `RUN` (such as `dnf install`), `COPY`, `EXPOSE` (records the port; opens nothing, the video's point), `CMD` (unless `podman run` names another command), and `ENTRYPOINT` (like `CMD`, but a command on `podman run` cannot replace it). One line: each instruction adds a layer.

##### 3a.3 A Containerfile, Line by Line

`TextExplainer` over RH134's kind of example in our own five lines (`FROM` the UBI 10 base, `RUN dnf install -y httpd`, `COPY index.html /var/www/html/`, `EXPOSE 80`, `CMD ["/usr/sbin/httpd", "-DFOREGROUND"]`), one step per line, the last saying httpd runs in the foreground because the container stops when it does. Under it: saved as `Containerfile` in a directory of its own with `index.html` beside it.

##### 3a.4 Building an Image

A fixed `TerminalWindow` of a real rebuild in `~/img01`: `podman build -t img01:1.0 .`, five steps each answered `Using cache`, `COMMIT img01:1.0`, and `Successfully tagged localhost/img01:1.0`. A first build prints all of `dnf`'s install and does not fit a slide; the rebuild shows the steps and the layer cache in 18 lines. Under it: `-t` names and tags the image, `.` is the build directory, and a rebuild reuses each unchanged layer. Transcript from Round 5.

##### 3a.4a Every Change Is a New Image (addition, Decision 44)

A Mermaid loop of four boxes: edit `index.html`, `podman build -t img01:1.1 .` (blue, the costly step), `podman stop` and `podman rm`, `podman run img01:1.1`, and a dotted "the next change" back to the start. Under it: a page copied in with `COPY` is part of the image, so the running container never sees an edit until you rebuild, retag, and replace it. Labels are broken over two lines; on one line the last box ran off the slide.

##### 3a.5 Tags and Registries

A table: `podman tag img01:1.0 img01:latest`; `podman image push img01:1.0 REGISTRY/img01:1.0`, to a registry you can log in to; `podman image prune`, dangling images left as `<none>`; `podman image prune -a`, every image no container uses. Under it: rebuilding a tag leaves the old image as `<none>`, and `push` is practiced in the RHA lab, which has a registry (Decision 39). `tag` and both `prune` forms were run in Round 5; `push` was not, since there is no registry to push to, and its syntax is `podman image push --help`'s (`IMAGE [DESTINATION]`).

##### 3a.6 Exercise: Build a Container Image (Decision 44)

Goal: build your own web server image, then change the page it serves. Host: `servera`. Prerequisite exercise: Manage a Container. Workflow: write a page and a Containerfile that copies it into a UBI 10 image with httpd; build it as `intranet:1.0`, run it with host port 8082, and test it ("under construction"); change the page and test again (still "under construction": the container serves the image's copy); build `intranet:1.1` (step 2 from the cache, `COPY` and after rebuilt) and replace the container with one from it; test again ("open for business") and list your images (both versions). One rebuild, by your choice (Decision 45). The `procps-ng` step of the first build of this exercise is gone; exercise 3 already shows `ps` missing. The command file stops and removes the container and keeps the images.

Files: `exercises/build-a-container-image-exercise.sh` (62 presses; the Containerfile typed in `vim` with `#@ noenter` on the `i` and the last line) and `.html` (no violations).

##### 3a.6a Exercise: Build a Container Image (recording)

Built 2026-11-16 like 1.12a, from `build-a-container-image-exercise.cast`: 4m 06s, 6 markers. Kept.

### 4. `volume-mounts.md` (7 slides), built 2026-11-14, reworked and 4.2b added 2026-11-15

`routeAlias: volume-mounts`. Alignment: RH134 chapter 17. Exercise: Mount Web Content Exercise. Now the week's last section, it answers the cost fragment 3a shows. The recording slide 4.3a was added on 2026-11-16.

##### 4.1 Volume Mounts

Section slide carrying the `topicInfo`.

##### 4.1a Baked In vs Mounted (addition, Decision 44)

`two-cols-header` with `vertical: start` so the two headings line up. Left, "Baked in with `COPY`": edit `index.html`; `podman build -t img01:1.1 .`; `podman stop` and `podman rm` the old container; `podman run` a new one from `img01:1.1`. Right, "Mounted with `-v`": edit `index.html`. Bottom band: a mounted directory is read live from the host, with no rebuild, no new tag, and no new container.

##### 4.2 Volume Mounts

Source O25 as an `IconGrid` of three: treat containers as immutable (`locked`), mount a host directory into the container (`folder-move-to`), back up the data on the host (`save`). One line under it: what a container writes inside itself is gone when it is removed; what it writes to a mounted directory stays on the host.

##### 4.2a Mounting a Host Directory (addition, Decision 22)

`TextExplainer` over `-v ~/html:/var/www/html:Z`: the host directory, where it appears in the container, and `:Z`, which relabels it so SELinux lets this container use it (O29's bullet). Under it, the whole command in a `bash` fence, now with fragment 3a's generic image, `podman run -d --name con01 -p 8000:80 -v ~/html:/var/www/html:Z img01:1.1` (verified in Round 6, where the mounted page replaced the one copied into `img01:1.1`), and one line: the mount covers whatever the image has at that path, a copied-in page included; Podman calls it a bind mount (Decision 23).

##### 4.2b What `:Z` Changes (addition, Decision 48)

A fixed `TerminalWindow`: `ls -dZ ~/html` showing `unconfined_u:object_r:user_home_t:s0`, the 4.2a command run with `img01:1.1`, and `ls -dZ ~/html` again showing `system_u:object_r:container_file_t:s0:c365,c532`. Under it: SELinux keeps containers out of `user_home_t` files, so without `:Z` httpd is refused and serves its test page; `:Z` relabels the directory `container_file_t` with two categories only this container gets. Exercise 5 has students meet the refusal and find the label themselves; this slide teaches what they find. Transcript from Round 7.

##### 4.3 Exercise: Mount Web Content (Decisions 44 and 46)

Goal: serve a page straight from the host's disk through your own `intranet:1.1` image. Host: `servera`. Prerequisite exercise: Build a Container Image. Workflow: create a web page in `~/intranet/html`; run `intranet:1.1` with that directory mounted, and test it (the test page, neither ours nor the baked-in one); find out why (in a shell from `podman exec -it`, even `root` gets `Permission denied` on `cat /var/www/html/index.html`, and `ls -dZ` shows `user_home_t`); run it again with `:Z` and test it (the mounted page covers the baked-in one; `container_file_t` with the container's categories); edit the page on the host twice, testing after each edit (each change live, no rebuild). The diagnosis no longer uses `podman logs`: this image's httpd writes its errors to files inside the container, and `podman logs` shows only a start-up warning. Its cleanup removes the container, every image (`podman image prune -a`), and both directories. Since 2026-11-15 it leaves Podman installed for exercise 6, whose cleanup removes it (Decision 53).

Files: `exercises/mount-web-content-exercise.sh` (58 presses) and `.html` (no violations).

##### 4.3a Exercise: Mount Web Content (recording)

Source O27. Built 2026-11-16 like 1.12a, from `mount-web-content-exercise.cast`: 3m 42s, 7 markers. Kept.

### 5. `container-services.md` (8 slides), built 2026-11-15

`routeAlias: container-services`. Alignment: RH134 chapter 17, as for Volume Mounts, though the topic is RH134 for RHEL 9's (chapter 13, "Manage Containers as System Services"). Exercise: Run a Container as a Service Exercise. Sources O28, O29, and the ODP's `run_containers-as_a_regular_user.sh` (Decision 49). Slides use `student` and `con01`; the exercise uses the user `webapp` and the container `intranet`. The recording slide 5.4a was added on 2026-11-16.

##### 5.1 Containers as Services

Section slide carrying the `topicInfo`.

##### 5.2 Run Containers with Systemd

Source O28, "podman generate – generates systemd units of running containers" and `podman generate systemd --name web –files`, as a `TextExplainer` over the full command in three lines: `podman generate systemd --new --files --name \`, `--wants podman-user-wait-network-online.service \`, `--after podman-user-wait-network-online.service con01`. Seven steps: `generate systemd` writes a unit that runs a container; `--new` creates a fresh container at each start and removes it at each stop; `--files` saves the unit in the current directory instead of printing it; `--name` names the unit after the container rather than its ID; `--wants` also starts the unit that waits for the host network; `--after` starts only once the network is up, so the published port works after a reboot; `con01` is the running container whose `podman run` command the unit copies. One line under it: Podman 5 marks the command deprecated in favor of Quadlet, but it still works on RHEL 10, and it is how RHEL 9 teaches containers as services. `--new` is the RHEL 9 chapter's and the ODP command file's; the two network options are Decision 52; O28's `–files` en dash is corrected.

##### 5.2a Generating a Unit (addition)

A fixed `TerminalWindow`, captured in Round 8: `mkdir -p ~/.config/systemd/user`, `cd` into it, the 5.2 command with its two continuation lines, the four-line DEPRECATED warning ("It is recommended to use Quadlets for running containers and pods under systemd."), the path `/home/student/.config/systemd/user/container-con01.service`, and `podman rm -f con01`. Two lines under it: a user's own units live in `~/.config/systemd/user`, and the warning is expected; with `--new`, the unit runs its own copy of the `podman run` command, so remove the container you started by hand.

##### 5.2b Managing a User Service (addition)

A table of `systemctl --user` commands on `container-con01`: `daemon-reload`, `enable --now` (start it now and each time you log in), `status`, `stop` (with `--new`, the container is removed too), `start` (in a fresh container), and `disable --now`. One line under it: `--user` manages your own services, so no `sudo`; otherwise these are week 4's `systemctl` commands. Every row was run in Round 8.

##### 5.3 Run Containers as a Regular User

Source O29 as an `IconGrid` of three: each user has their own images, containers, and services (`user`); log in as that user with SSH, not `su -` or `sudo -iu` (`login`, O29's "Must ssh, yes its weird"); `loginctl enable-linger` starts them at boot and keeps them after logout (`power`). Two lines under it: without a login session, `systemctl --user` fails with "Failed to connect to user scope bus via local transport" (Round 8); a mounted directory still needs `:Z`, as in Volume Mounts (O29's last bullet, already on 4.2a).

##### 5.3a Lingering (addition)

A fixed `TerminalWindow`: `loginctl enable-linger` as `student`, then `loginctl list-users` showing `1000 student yes    active`. Two lines under it: without lingering, systemd stops a user's services about 10 seconds after their last session ends and starts them again only at their next login (measured in Round 8); for another user, `sudo loginctl enable-linger USERNAME`, and `disable-linger` undoes it.

##### 5.4 Exercise: Run a Container as a Service (Decisions 49, 52, and 53)

Goal: serve a page from a container that starts at boot, as a service of a user of its own. Host: `servera`. Prerequisite exercise: Mount Web Content. Workflow: create the user `webapp` with a password (`useradd`, and `passwd` with `redhat`, which warns that it is short and sets it); log in as `webapp` with SSH and run a web container on host port 8083 (`podman images` is empty, since `webapp` has its own store; `ubi10/httpd-24` with `-p 8083:8080` and `~/html` mounted with `:Z`); generate a unit for the container and start it as a service (5.2's command, `podman rm -f`, `daemon-reload`, `enable --now`); log out and test the page (refused after 15 seconds; plain `curl` shows why); enable lingering for `webapp` with `sudo` and test again (served with nobody logged in as `webapp`); reboot `servera` and test again (served; `podman ps` as `student` lists nothing). Its cleanup turns lingering off, deletes `webapp` with `userdel -r`, which also removes its `/etc/subuid` and `/etc/subgid` lines, and removes Podman, returning `servera` to the week's start.

Files: `exercises/run-a-container-as-a-service-exercise.sh` (77 presses) and `.html` (no violations).

##### 5.4a Exercise: Run a Container as a Service (recording)

The ODP's command file has no recording. Built 2026-11-16 like 1.12a, from `run-a-container-as-a-service-exercise.cast`: 5m 25s, 8 markers, including the reboot and reconnection. Kept.

## Exercises

All six are built and were verified on the lab in chain order: exercises 1 to 3 on 2026-11-14 (Rounds 3 to 5), the reordered 4 and 5 on 2026-11-15 (Round 6), and 6 on 2026-11-15 from exercise 5's new end state (Round 8).

| # | Title                        | Frag | Hosts       | Command file, in `exercises/`              |
|--:|------------------------------|-----:|-------------|--------------------------------------------|
| 1 | Run Your First Container     |    1 | servera     | `run-your-first-container-exercise.sh`     |
| 2 | Manage Container Images      |    2 | servera     | `manage-container-images-exercise.sh`      |
| 3 | Manage a Container           |    3 | servera, ws | `manage-a-container-exercise.sh`           |
| 4 | Build a Container Image      |   3a | servera     | `build-a-container-image-exercise.sh`      |
| 5 | Mount Web Content            |    4 | servera     | `mount-web-content-exercise.sh`            |
| 6 | Run a Container as a Service |    5 | servera     | `run-a-container-as-a-service-exercise.sh` |

Each declared title ends in "Exercise". The command files use the current `kitty-demo` format, written new from the ODP's command files: the `kitten @ action --self` opening, `#@ key escape` and `:wq` for edits, `#@ key ctrl+c` for the foreground container, a pause on each requirements block, and pauses on installs, pulls, builds, and wide output.

**The chain.** One pass, in order, with no resets, starting from the snapshot:

1. Installs Podman on `servera`, pulls `ubi10/ubi`, and leaves two stopped containers.
2. Pulls `ubi10/httpd-24` and Docker Hub's `httpd`, and removes the latter.
3. Removes the two stopped containers, runs and removes `intranet` from `ubi10/httpd-24`, opens port 8081 and closes it again.
4. Builds `intranet:1.0` with its page copied in, changes the page, builds `intranet:1.1`, and removes its container; keeps both images and `~/intranet-image`.
5. Runs `intranet:1.1` with `~/intranet/html` mounted; its cleanup removes the container, every image, and both directories, and leaves Podman installed.
6. Creates `webapp`, runs its container as a service, enables its lingering, and reboots `servera`; its cleanup turns lingering off, deletes `webapp` and its home directory, and removes Podman, returning `servera` to the week's start.

`workstation` ("ws" in the table) is used only in exercise 3, for one `curl`, and changes nothing there. Exercise 6 also leaves `servera`'s host key in `student`'s `~/.ssh/known_hosts` on `servera`, from `ssh webapp@servera`; it is harmless, and the instructor lab's `StrictHostKeyChecking=accept-new` adds it without asking. On a lab that asks, the written exercise says to answer `yes`; the command file has no `yes` line.

**Recording**, in this order, from the week's start, after `kitty-demo --check` on each file (all pass). Estimates are the press count times 3 seconds plus the `#@ pause` holds:

| Exercise                     | Presses | Pauses | Estimate |
|------------------------------|--------:|-------:|---------:|
| Run Your First Container     |      22 |    51s |   1m 57s |
| Manage Container Images      |      30 |    35s |   2m 05s |
| Manage a Container           |      63 |    32s |   3m 41s |
| Build a Container Image      |      62 |    48s |   3m 54s |
| Mount Web Content            |      58 |    23s |   3m 17s |
| Run a Container as a Service |      77 |    75s |   5m 06s |

Exercise 4's first build holds 15 seconds; it took about 10 on the instructor lab. Exercise 3's foreground container needs the 6-second hold before Ctrl+C so httpd has started. Exercise 6 holds 12 seconds after `webapp`'s `podman run`, which pulls `ubi10/httpd-24` again; 15 after `exit`, since the service stops about 10 seconds after logout; 5 after `loginctl list-users`, since the service starts about a second after lingering is enabled and httpd a second or two later; 15 after `sudo systemctl reboot`, before `ssh servera` (the instructor lab's `servera` boots in about 5); and 5 after `disable-linger`, so `webapp`'s processes have ended before `userdel -r`.

**Recorded 2026-11-16,** in one pass from the week's start, each cast processed with `pnpm run casts` and passing `--check`:

| Exercise                     | Cast   | Markers | Status              |
|------------------------------|--------|--------:|---------------------|
| Run Your First Container     | 1m 46s |       5 | retaken             |
| Manage Container Images      | 2m 00s |       7 | retaken (the chain) |
| Manage a Container           | 3m 53s |       9 | retaken             |
| Build a Container Image      | 4m 06s |       6 | kept                |
| Mount Web Content            | 3m 42s |       7 | kept                |
| Run a Container as a Service | 5m 25s |       8 | kept                |

**Exercise 1's take is broken.** `sudo dnf install -y podman` took 23.5 seconds in the recording, longer than its 10-second hold plus the 3-second step pause, so the next lines were typed while `dnf` was still running: `podman -v` was lost, and `podman run` was cut from the first container command, leaving the shell to run the image name (`-bash: registry.access.redhat.com/ubi10/ubi: No such file or directory`). The hold is now 30 seconds. Exercise 1 therefore left one stopped container instead of two, and exercise 3's recording shows one where its written version expects two, so exercises 1 to 3 are recorded again from the week's start; exercise 2 only because the chain runs through it. Exercise 3 ends in the same state either way (it removes every stopped container), so exercises 4 to 6 were kept. The retakes, recorded the same day from the reverted `servera`, are clean: exercise 1 shows `podman version 5.4.0`, `Red Hat Enterprise Linux release 10.3` in the container and `10.0` on `servera`, and the same kernel in both; exercise 3 lists both stopped containers before `podman rm -a`. The table shows the kept takes.

Every other recording was checked against its command file: each command appears at a shell prompt, except lines typed into `vim`, passwords, the `y` for `podman image prune -a`, commands typed inside the container's `bash-5.2$` shell, and the continuation lines of exercise 6's `generate systemd`. The only error messages are expected ones: `dnf`'s "Unable to read consumer identity" on the unregistered lab, exercise 3's `AH01276` and missing `ps`, exercise 5's `Permission denied`, exercise 6's refused `curl` after logout, and its "Permanently added 'servera'" on the first `ssh webapp@servera`.

## Additions

Four slides, each because an exercise uses something the ODP does not teach (Decisions 19 to 22):

- **2.7a Image Names:** registry, repository, and tag, needed to pull and remove by full name.
- **3.2a Managing Containers:** O22's second half, plus `podman ps`.
- **3.2b Port Mapping:** what `-p` connects to what.
- **4.2a Mounting a Host Directory:** the `-v` syntax and O29's `:Z`.

One-line additions to ODP slides: login notes on 2.5 (Decision 15), `image inspect` on 2.7 (Decision 19), and the size and start-up line on 1.10 (Decision 11).

Fragment 5 adds three slides to O28 and O29 (Decision 49): **5.2a Generating a Unit** and **5.3a Lingering**, transcripts of what O28 and O29 only name, and **5.2b Managing a User Service**, the `systemctl --user` commands the exercise uses. 5.2 adds the network-wait options O28 lacks (Decision 52).

## Corrections

All verified on 2026-11-13 (Round 1) unless marked "at build".

- **`container-tools` does not exist on RHEL 10.** `dnf repoquery container-tools` finds nothing on `servera`. RHEL 9 shipped it as a meta-package; RHEL 10's nearest equivalent is the "Container Management" group (`podman` and `buildah` mandatory). `workstation` already has that group, so the ODP's install step becomes a version check, `podman -v`, as RH134 shows (Decision 8).
- **`ubi9/httpd-24` has a RHEL 10 successor.** `registry.access.redhat.com/ubi10/httpd-24` answers without a login, with `10.0` and `10.1` tags and `latest`. RH134's own example, `rhel10/httpd-24`, is refused there ("This repo requires terms acceptance and is only available on registry.redhat.io"), so it would need a Red Hat login.
- **Python and RHEL versions disagree inside the ODP.** O3 and O4 say "Python 3.10" beside diagrams that say 3.12; O7 asks for 3.10 and O8 delivers 3.12; O9's Server 3 is still "RHEL 9.3, Python 3.10" while O8 and O10 say RHEL 10 and 3.12. The update from the 9.3 deck changed the diagrams and missed the text. RHEL 10's `python3` is 3.12.9, so every slide says 3.12 and RHEL 10.
- **O2 and O11 quote RH134.** "In computing, a container is an encapsulated process that includes the required runtime dependencies for the program to run" is RH134 chapter 17's first sentence, one word changed. Paraphrased (Decision 10).
- **O14's "Single File (TAR)".** An image is a stack of read-only layers that the engine merges, plus a writable layer at run time (RH134 chapter 17, "Container Technology Overview"). It can be saved as one tar archive, but that is an export, not what an image is. The slide says "read-only layers".
- **O12 says "Dockerfile".** RH134 and Podman call the same format a Containerfile (`Containerfile(5)`); Podman reads either name.
- **O22's `-p 8080:80`.** See 3.2. At build: confirm that `ubi10/httpd-24` exposes 8080 (and 8443), which `podman image inspect` shows.
- **The command file's registries are swapped.** In `run_containers-manage_container_images.sh`, the header for step 5 says Docker Hub and the step pulls from Red Hat; step 8's header says `httpd-24` from Docker Hub and the step pulls Docker Hub's `httpd`. O19's order (Docker Hub at 5, Red Hat at 8) is the slide's; the exercise pulls both in one step.
- **`podman search` cannot search `registry.access.redhat.com`.** `podman search --limit 3 httpd` returned results from `registry.redhat.io` (RHEL 7 and 8 era `httpd-24` images) and `docker.io`, and none from `registry.access.redhat.com`. At build: find the search term that turns up `ubi10/httpd-24`, or have the exercise search and then pull a name it was given.
- **`skopeo` is not installed** on either host, though AppStream carries 1.18.0. RH134 for RHEL 10 inspects an image after pulling it and does not teach `skopeo` (Decision 9).
- **`podman generate systemd` is deprecated.** Its own help opens "[DEPRECATED] Generate systemd units" on Podman 5.4.0; Quadlet (`/usr/libexec/podman/quadlet`, in the `podman` package) replaces it. It still works: on 2026-11-15 (Round 8) it printed a four-line "DEPRECATED command" warning, wrote the unit, and exited 0. O28 also writes `–files` with an en dash for `--files`. Ported anyway (Decision 49).
- **As generated, the unit breaks a published port after a reboot** (Round 8, at build). A user unit's `After=network-online.target` refers to the user manager's own target, which does not wait for the host's network. With lingering, the container starts about 5 seconds into boot, before `servera`'s network is up; `pasta`, the rootless network helper, then gives it the fallback address 169.254.2.1, and host port 8083 answers with empty replies (curl exits 52 and 56) until the service is restarted. Reproduced on two boots. Podman ships `podman-user-wait-network-online.service` for this (podman issue 22197), and Quadlet units depend on it automatically; `generate systemd` adds it with `--wants podman-user-wait-network-online.service --after podman-user-wait-network-online.service`, after which the service waited about half a second and served the page right after boot (Decision 52). RHEL 9 systems with Podman 5 also use `pasta`.
- **O28's `--name web`.** `--name` is a switch ("Use container/pod names instead of IDs"); `web` is the container, the command's last argument. O28's line works because the two happen to sit together. 5.2 explains the two separately.
- **`su -` and `sudo -iu` break user services.** As O29 says, the user must log in with SSH. Round 8: under `sudo -iu webapp` or `su - webapp`, `systemctl --user` fails with "Failed to connect to user scope bus via local transport: $DBUS_SESSION_BUS_ADDRESS and $XDG_RUNTIME_DIR not defined", and `podman` warns that there is no systemd user session. Worse, Podman then keeps that user's runtime files in `/tmp/storage-run-1001` for good, which survives a reboot, so after the next boot the service failed with "current system boot ID differs from cached boot ID; an unhandled reboot has occurred". A user who logs in with SSH first gets `/run/user/1001/containers`.
- **The ODP's command file enables lingering from a root shell without a user name.** `loginctl enable-linger` with no argument applies to the caller's own session's user, not to `fancy_app`. The exercise names the user, `sudo loginctl enable-linger webapp`; 5.3a shows the user's own form.
- **The ODP's command file uses `ubi9/httpd-24` and port 8080:8080.** The exercise uses `ubi10/httpd-24` (Decision 7) and host port 8083, the next after exercises 3 to 5.
- **The lesson plan's Cert Guide chapter.** "Chapter 26" is the RHEL 9 book's *Managing Containers*. In the RHEL 10 book, chapter 26 is *Final Preparation*, and no chapter covers containers (its README notes the gap). This is your lesson plan, not the deck, so it is noted rather than changed.

## Not ported

- **O17 and O21, video cues.** "13.5 Video, 0m 0s to 11m 30s" and "13.1 Video, 7m 45s to 16m 27s" appear to be cues to play Red Hat Academy's RHEL 9.3 lecture videos for RH134 chapter 13, sections 1 and 5. They cannot be published and the deck carries no notes, and you would rather not play them (Decision 25, accepted 2026-11-13).
- **O28 and O29 were not ported until 2026-11-15.** Decision 24 left them out; Decision 49 reversed it, and they are fragment 5 with the ODP's `run_containers-as_a_regular_user.sh` as its exercise. Quadlet, the replacement Podman recommends, is still not taught.
- **The Slidev deck and its five command files**, per the prompt.
- **The ODP's decorative shapes**: gradients, arcs, ovals, the three-bar ornament on O13, and connector lines.

## Audit against RH134 chapter 17

Requested 2026-11-13: audit last year's material against the RHA chapter so the week covers everything it needs to. Containers left the RHCSA objectives, but you want them taught as a core IT skill, so the bar is RH134's chapter, not the exam.

Audited: RH134 chapter 17's three teaching sections (1, *Introduction to Containers*; 3, *Running Containers with Podman*; 5, *Creating and Managing Container Images*), its quiz (2), both guided exercises (4 and 6), the graded lab this week assigns (7), and the lecture-video transcripts for sections 1 and 3 to 7. Each item is marked **Covered**, **Partial**, **Wrong**, or **Missing** against the ODP as taught, and each proposal is numbered A1 to A19 and listed again under "Decisions" (31 to 43).

**In brief.** The ODP covers the "why" well and the container lifecycle in outline. It misses RH134's whole image-building half (the Containerfile, `podman build`, `tag`, `push`), which the graded RHA lab requires; it misses `podman login`, which the graded lab starts with; it never names the kernel features behind the isolation, which the quiz asks about; it gets an image's structure wrong ("Single File (TAR)"); and it never shows `ps`, `inspect`, `logs`, `restart`, or `kill`. Its last two topics, volume mounts and systemd services, are not in the RHEL 10 chapter at all.

### Section 1, Introduction to Containers

Objective: explain container concepts and core technologies.

- **Covered:** what a container is (O2, O11, paraphrased under Decision 10); images versus instances (O13); the cost of VMs, shown as the story O3 to O10; OCI (O16).
- **Wrong:** O14's "Single File (TAR)" (see "Corrections").
- **Missing, layers and the writable layer.** An image is read-only layers merged into one file system; a container adds a writable layer on top, discarded when the container is removed, which is what "ephemeral" means and why volume mounts exist. **A1:** add 2.3a "Image Layers", a Mermaid `block-beta` stack (a base image, an added package, added content, and the container's writable layer on top), and say "read-only layers" on 2.4.
- **Missing, the kernel features.** Namespaces isolate processes, cgroups limit CPU and memory, SELinux and seccomp restrict what a container may do. The quiz asks about them. **A2:** add 1.11a "How Containers Are Isolated", an `IconGrid` of four, after 1.11 repeats the definition. This replaces Decision 11's alternative.
- **Partial, the VM comparison.** The story shows the cost without naming it: container engine versus hypervisor, megabytes versus gigabytes, seconds versus minutes to start, a shared kernel versus a full operating system with its own kernel and boot loader (the video's point), and any OCI engine versus one hypervisor. **A3:** add 1.10a "Containers and Virtual Machines", a five-row comparison in our own words, with one line on Kubernetes and OpenShift running containers at scale. This replaces Decision 11's one-line addition to 1.10.
- **Partial, benefits and challenges.** The benefits are the story. Of the challenges, persistence is fragment 4, networking is 3.2b, and the shared kernel is A2; no slide of its own.
- **Partial, registries.** RH134 names three Red Hat registries; O15 names two plus Docker Hub. `registry.connect.redhat.com`, for partner images, is left out. Login notes are Decision 15.
- **Not needed:** `chroot` history, the names of OCI's two specifications, and containers on non-Linux hosts.

### Section 3, Running Containers with Podman

Objective: run an existing image from a registry as a container.

- **Covered:** Podman needs no daemon (O16); `run` with `-d`, `--name`, `--rm`, `-p`, and another command (O22); `stop` and `rm` (O22).
- **Wrong:** O22's port example (see "Corrections").
- **Changed, installing Podman.** RH134 says RHEL 10 installs Podman by default. A "Server with GUI" install does (the instructor lab's `workstation`); a minimal server does not (`servera`), and neither may an exam VM. **A4:** teach `sudo dnf install podman`, and that RHEL 9's `container-tools` package no longer exists (your answer to Open question 1). This revises Decisions 6 and 8.
- **Missing, `podman login`.** Username and password prompts, the credential saved per user in `${XDG_RUNTIME_DIR}/containers/auth.json`, and `podman logout`. The graded lab starts with it. **A5:** add 2.5a "Logging In to a Registry". Our registries need no login, so the RHA lab is where students practice it. At build: check whether `podman login registry.access.redhat.com` with empty credentials succeeds, as RH134 shows; if it does, the images exercise logs in and out once.
- **Missing, finding Red Hat images.** RH134 finds them in the Red Hat Ecosystem Catalog (`catalog.redhat.com`), which matters here because `podman search` cannot search `registry.access.redhat.com` (see "Corrections"). Quay.io is where your own images would live. **A6:** two lines and the catalog link on 2.5.
- **Missing, `podman ps` and `ps -a`**, stopped versus removed, IDs, generated names. Already proposed as 3.2a (Decision 20).
- **Missing, a container stops when its command ends.** RH134's `echo` example; it is why httpd runs in the foreground inside a container. **A7:** one line on 3.2.
- **Missing, `restart`, `kill`, `stop --all`, and `rm -f`**, and that `stop` sends SIGTERM and then SIGKILL after 10 seconds. **A8:** rows on 3.2a. The exercise already uses `stop --all`; `restart` and `kill` stay on the slide.
- **Missing, reaching the container from another host.** RH134 says a published port serves the network. On RHEL the firewall blocks it until the port is opened, which w07 taught. **A9:** a line on 3.2b, and a step in the running-containers exercise that opens the port on `servera` and runs `curl` from `workstation`.
- **Missing from the text, in the video, `podman logs`.** It shows a container's standard output and error, not the application's log files, and it is the first thing to check when a detached container misbehaves. **A10:** a row on 3.2a and one exercise step.
- **Missing, containers stop when you log out.** The graded lab warns that containers do not persist after the SSH session ends and calls persistent containers out of scope. That is rootless Podman under a user session without lingering. **A11:** verify at build, and if it holds, a `Callout` on 3.2a that names it and `loginctl enable-linger` as the fix. That is the part of O29 that matters without systemd units. Superseded on 2026-11-15: fragment 5 teaches it on 5.3 and 5.3a, and exercise 6 shows it (Decision 50).
- **Beyond RH134, kept:** `exec -it` and `-e` (O22). RH134 for RHEL 10 teaches neither, but both are everyday tools.
- **Not needed:** the REST API and Podman Desktop.

### Section 5, Creating and Managing Container Images

Objective: manage downloaded images and create a simple image.

- **Covered:** `search`, `pull`, `images`, and `rmi` (O18).
- **Partial, tags.** Already proposed as 2.7a (Decision 19).
- **Missing, Universal Base Images.** UBI images are freely redistributable RHEL bases, the usual `FROM` line, and what `ubi10/httpd-24` is built on. **A12:** a caption on 2.7a.
- **Missing, `image inspect` and `--format`.** RH134 shows three `--format` templates (name, creation date, description), and the guided exercise uses `--format` with `ps -a`. **A13:** an `--format '{{.Created}}'` example on 2.7's inspect row, and one formatted field in the images exercise. `search --list-tags`, which the guided exercise uses to list a remote image's tags, joins the search row if it works against `registry.access.redhat.com` (at build).
- **Missing, the Containerfile and `podman build`.** The section's main subject, the guided exercise's, and the graded lab's: write `FROM` and `RUN` (and `COPY`, `EXPOSE`, `CMD` or `ENTRYPOINT`), build with `podman build -t name:tag DIR`, run the result. W15 builds a bootable image the same way. **A14:** fragment 3a "Containerfiles" (see "Proposed outline after the audit"), which replaces Decision 26's sketch.
- **Missing, `podman tag` and `podman image push`.** The graded lab pushes its image to a registry and runs it from there. **A15:** a slide in fragment 3a. We have no registry to push to, so the options are to teach it on the slide and practice it in the RHA lab (recommended), or to run a registry as a container on `servera` and push to that, which needs `--tls-verify=false` and its own explanation (Decision 39).
- **Missing, `podman image prune`** and the dangling images a rebuilt tag leaves behind. **A16:** a row on 2.7, shown in fragment 3a's exercise after a rebuild.
- **Missing, in the video, `EXPOSE` is metadata** and opens no port; `-p` does. Part of A14.
- **Not proposed:** `skopeo`, named once in the video (Decision 9).

### The RHA lab this week assigns

The graded lab (section 7) is the week's "You Do". Each of its steps against where the plan teaches it:

| Graded lab step                     | Before the audit | After the audit      |
|-------------------------------------|------------------|----------------------|
| Log in to a registry                | not taught       | not taught (dropped) |
| Search a registry                   | 2.7              | 2.7                  |
| Pull an image and list images       | 2.7              | 2.7                  |
| Write a Containerfile               | not taught       | 3a (A14)             |
| Build an image with a tag           | not taught       | 3a (A14)             |
| Push an image to a registry         | not taught       | 3a (A15)             |
| Remove a local image                | 2.7              | 2.7                  |
| Run detached, named, port published | 3.2              | 3.2                  |
| Check with `podman ps` and `curl`   | 3.2a             | 3.2a                 |

Before the audit, students met four of the lab's nine steps in class; after it, eight, all but `podman login`, which you dropped on 2026-11-14. The guided exercises add `ps --format` and `search --list-tags` (A13) and `CMD` (A14).

### The SCC lab this week assigns

SCC Lab chapter 17 lab 01 (Open question 5, answered 2026-11-13) runs on `workstation`. It is one workflow: write a Containerfile that installs httpd, exposes its port, and starts it; build and tag the image; make a host directory holding a page; run a named container from the image with a published port and that directory mounted as the document root; check with `curl`. Each part against where the plan teaches it:

| Assignment part                       | Before the audit | After the audit  |
|---------------------------------------|------------------|------------------|
| Containerfile: install, expose, start | not taught       | 3a.2, 3a.3 (A14) |
| Start httpd in the foreground         | not taught       | 3.2 (A7), 3a.3   |
| Build and tag an image                | not taught       | 3a.4 (A14)       |
| Run named, port published             | 3.2, 3.2b        | 3.2, 3.2b        |
| Mount a host directory as doc root    | 4.2a             | 4.2a             |
| `:Z` for SELinux                      | O29, after use   | 4.2a             |
| Check with `curl`                     | exercises        | exercises        |

Verified (Round 2): the workflow works on RHEL 10 as `student`, with `dnf install -y httpd` inside a `ubi10/ubi` build pulling httpd from UBI's own repositories. Without `:Z`, the page returns **HTTP 403**, because the directory keeps its `user_home_t` label; with `:Z` it returns 200 and the directory becomes `container_file_t` with the container's categories. A student who misses `:Z` on the assignment gets a 403 and no obvious reason, so:

- **A18:** the web-content exercise runs the container once without `:Z`, sees the 403, checks the label with `ls -dZ`, and runs it again with `:Z`. It is an edge case, but it is the one the assignment will hit, and w06 taught the tools to explain it.
- **A19:** fragment 3a's exercise is the whole workflow, build plus port plus mount, with its own names, ports, and page, so the assignment follows "I Do, We Do, You Do" with only the parameters changed. Fragment 3a stays after Volume Mounts, the ODP's order, so its exercise is where the two halves meet.

The assignment's host is `workstation`, where the instructor lab already has Podman and a student's may too. That does not change Decision 6: students install Podman on `servera` in class, and on `workstation` the same `dnf install podman` either installs it or reports it present.

### Beyond the RHEL 10 chapter

- **Volume mounts (O25 to O27): keep.** RH134 for RHEL 10 mentions volumes only as a challenge, but the RHEL 9 chapter taught bind mounts with `:Z`, w15's `bootc-image-builder` command mounts two host paths with `-v`, and keeping data outside the container is everyday practice.
- **Containers as services (O28, O29).** Your Open question 3: the RHEL 10 material does not cover them. Chapter 17 never mentions systemd units for containers, Quadlet, or lingering, and its lab calls persistent containers out of scope; chapter 18 (w15) does not cover them either. The RHEL 9 chapter did, with `podman generate systemd`, which Podman 5.4 marks deprecated. Recommended at first: leave them out and let A11's callout carry the practical part (Decision 24). Reversed on 2026-11-15 (Decision 49): fragment 5 ports them with `generate systemd`, for the students who take the RHEL 9 exam and for w15's app tier.

### Exercise spacing

The ODP puts 16 content slides (O2 to O16, and O18) before its first task, and A1, A2, A3, A5, and A6 would add four more slides to that stretch. The course guidance is about ten content slides between exercises. **A17:** move O16, Container Engines, to the end of fragment 1 (it keeps its number, 2.6), add 1.11b, a short slide that installs Podman and runs one command in a container, and end fragment 1 with a first exercise: install Podman, check its version, and run `cat /etc/os-release` in a `ubi10/ubi` container to compare with the host's (the image is a newer RHEL 10 release than the host's 10.0: 10.3 on 2026-11-14). It moves the install out of the images exercise and leaves a stopped container behind that the running-containers exercise later finds with `ps -a`. The alternative is to accept the long stretch, since six of its slides are one story (Decision 40).

## Proposed outline after the audit

Accepted 2026-11-14 and built the same day with three changes from this outline: no 2.5a (`podman login` dropped), an added 2.7b (`inspect --format`), and O22's second half split in two (3.2a and 3.2b, with Port Mapping renumbered 3.2c), for **49 slides**; the reorder of 2026-11-15 (Decision 44) moved Containerfiles ahead of Volume Mounts as fragment 3a and added two slides, for 51. "Topic fragments" describes what shipped. A moved slide keeps its number; an added one carries a letter.

|  # | Fragment                | Section title      | Slides | Exercises |
|---:|-------------------------|--------------------|-------:|----------:|
|  1 | `why-containers.md`     | Why Containers     |     17 |         1 |
|  2 | `container-images.md`   | Container Images   |     11 |         1 |
|  3 | `running-containers.md` | Running Containers |      7 |         1 |
|  4 | `volume-mounts.md`      | Volume Mounts      |      5 |         1 |
| 3a | `containerfiles.md`     | Containerfiles     |      7 |         1 |
|    | Entry file              |                    |      2 |           |
|    | **Total**               |                    | **49** |     **5** |

1. **Why Containers:** 1.1 section; 1.2 What Is a Container? (O2); 1.3 to 1.8 Why Containers? (O3 to O8); 1.9 VM as the Unit of Isolation (O9); 1.10 Traditional Apps vs Containerized Apps (O10); 1.10a Containers and Virtual Machines (A3); 1.11 What Is a Container? (O11); 1.11a How Containers Are Isolated (A2); 2.6 Container Engines (O16, moved, A17); 1.11b Installing Podman and Running a Container (A17); 1.12 Exercise: Run Your First Container (A17); 1.12a its recording.
2. **Container Images:** 2.1 section; 2.2 Images, Registries, and Containers (O12); 2.3 Images vs Instances (O13); 2.4 Container Images (O14); 2.3a Image Layers (A1); 2.5 Container Registries (O15, with A6 and the `podman info` transcript); 2.7 Podman Image Actions (O18, with `search --list-tags`); 2.7a Image Names and Tags (with UBI, A12); 2.7b Inspecting an Image (`--format`, A13); 2.8 Exercise: Manage Container Images (O19); 2.8a its recording (O20).
3. **Running Containers:** 3.1 section; 3.2 Podman Container Actions (O22, first half); 3.2a Listing and Entering Containers and 3.2b Stopping and Removing Containers (O22, second half, with `ps`, `logs`, `restart`, `kill`, `rm -a`, and `rm -f`, A8, A10); 3.2c Port Mapping (with the firewall, A9); 3.3 Exercise: Manage a Container (O23); 3.3a its recording (O24).
4. **Volume Mounts:** 4.1 section; 4.2 Volume Mounts (O25); 4.2a Mounting a Host Directory (with O29's `:Z`); 4.3 Exercise: Mount Web Content (O26); 4.3a its recording (O27).
3a. **Containerfiles** (A14, A15): 3a.1 section; 3a.2 The Containerfile (the instructions `FROM`, `RUN`, `COPY`, `EXPOSE`, `CMD`, and `ENTRYPOINT`, and that `EXPOSE` opens nothing); 3a.3 A Containerfile, line by line (an httpd image from a UBI base, in our own words, with `TextExplainer`); 3a.4 `podman build` (a real transcript: one step per instruction, each a layer, cached on a rebuild, tagged under `localhost/`); 3a.5 Tags and Registries (`podman tag` and `podman image push`); 3a.6 Exercise: Build a Container Image (A19: write a Containerfile from a UBI base that installs httpd, exposes its port, and starts it in the foreground; build and tag it; run it with a published port and a host directory mounted with `:Z`; check with `curl`; then rebuild under a second tag and prune the dangling image); 3a.6a its recording.

The exercise chain becomes: 1 installs Podman on `servera` and leaves one stopped container; 2 pulls the images and keeps `ubi10/httpd-24`; 3 removes the stopped containers, opens a port on `servera` and closes it again; 4 mounts web content, first without `:Z` (A18); 3a builds its own image and mounts content into it, and its cleanup removes every container and image, the web directories, and Podman itself, returning `servera` to the week's start.

## Fitting the class period

Rough costs, not measured: about 26 content and section slides at a minute or so each, about 30 minutes, the story in fragment 1 running quickest. Exercise 1 about 12 minutes, most of it two image pulls; exercise 2 about 15; exercise 3 about 10. That is about 70 minutes, well inside the 2.5-hour class before the VDI's start-up time.

With the audit's outline (49 slides as built, five exercises): about 37 content and section slides, about 40 minutes; the first-container exercise about 8 minutes (an install and a small pull), images about 12, running containers about 18 with the firewall and `logs` steps, web content about 10, and Containerfiles about 20. That is about 110 minutes, inside the class with some room. A Quadlet fragment on top would bring it to about 135 minutes, too tight once the VDI's start-up is counted.

The pulls are the unknown: each student downloads `ubi10/httpd-24` and Docker Hub's `httpd` over the VDI's link at the same moment. With about a dozen students, Docker Hub's anonymous limit is not a concern (confirmed 2026-11-13). The sizes are measured at build.

With fragment 5 (57 slides built, six exercises, 2026-11-15): about 49 content and section slides, about 50 minutes; exercises 1 to 5 as above, about 70 minutes with the gap-scan slides; exercise 6 about 18 minutes, most of it the image pull, the logout wait, and the reboot. That is about 135 to 140 minutes, which leaves little of the 2.5 hours once the VDI's start-up is counted.

Candidates if it runs long, with what each loses:

- **Drop the Docker Hub pull** from exercise 2 (Decision 54, declined 2026-11-17: kept). It saves one download per student and about three minutes: the pull, the second `inspect`, and the `rmi` step. It loses Docker Hub as a second registry in practice and the only hands-on `podman rmi`; slides 2.5, 2.7, and 2.7c still show both.
- **Run exercise 3 as a demonstration.** Loses hands-on exploration of a running container; exercises 4 to 6 still run containers.

Decided 2026-11-17: cut nothing (Decisions 30 and 54). If the week runs long when taught, the candidates above are still the first cuts, and either one means recording its exercise again.

## Verification

**Round 1, 2026-11-13, read-only,** through `pnpm lab` on the instructor lab. Both hosts answered `ping`; they had been up since 2026-11-12 13:46 UTC. Results quoted in this plan are the lab's own.

- Both hosts: RHEL 10.0 (Coughlan). `workstation`: `podman-5.4.0-1.el10` and `buildah-1.39.0-1.el10`, the "Container Management" and "Headless Management" groups under "Server with GUI", plus `cockpit-podman`, `conmon`, `crun`, `netavark`, `aardvark-dns`, `passt`, `container-selinux`. No `skopeo`, no `httpd`. `python3` is 3.12.9. 13 GB free on `/`, 4.0 GiB available memory.
- `servera`: no `podman`, no `skopeo`, no `httpd`. AppStream offers `podman-5.4.0` and `skopeo-1.18.0`; `container-tools` is not in any repository. 6.7 GB free on `/`, 1.3 GiB available memory. `student` has no lingering (`loginctl list-users`).
- `student` on `workstation`: no images, no containers. `podman info` lists the three search registries; `registries.conf` has `short-name-mode = "enforcing"` and three drop-ins (`000-shortnames.conf`, `001-rhel-shortnames.conf`, `002-rhel-shortnames-overrides.conf`). `containers-registries.conf(5)` says the per-user file is used "if it exists, otherwise" the system one.
- From `workstation`, `https://registry.access.redhat.com/v2/` answered 200 and Docker Hub's registry 401, its normal anonymous challenge. Tag lists: `ubi9/httpd-24`, `ubi10/httpd-24`, `ubi10/ubi`, and `ubi9/ubi` listed; `rhel10/httpd-24` refused without terms acceptance. `latest` resolves (200) for `ubi10/httpd-24`, `ubi10/ubi`, and `ubi9/httpd-24`. The first page of each tag list showed 10.1 builds; Round 3 found `latest` is 10.3, so images run a minor release or more ahead of the 10.0 hosts, and `latest` keeps moving.
- `podman search --limit 3 httpd`: see "Corrections".
- `podman generate systemd --help` opens with "[DEPRECATED]"; `/usr/libexec/podman/quadlet` exists, from the `podman` package.

**What Round 1 changed.** Nothing was pulled, run, installed, or configured. The first `podman images` as `student` on `workstation` rewrote Podman's empty index files (`images.json` and siblings) inside its existing per-user store, which the lab build created on 2026-10-17; they are the files any `podman` command writes, so they were left in place. The rootless pause process (`catatonit -P`, started 2026-11-12 13:48) and the runtime directories under `/run/user/1000` predate this session and were not touched.

**Round 2, 2026-11-13, side test, restored.** On `workstation`, as `student`, in a scratch directory under `~`: a four-line Containerfile (`FROM registry.access.redhat.com/ubi10/ubi`, `RUN dnf install -y httpd`, `EXPOSE 80`, and `CMD` running `/usr/sbin/httpd -DFOREGROUND`) built in 8.6 seconds including the base image's pull. The build installed `httpd-2.4.63-13.el10_2.8` and `redhat-logos-httpd` from UBI's repositories. The base image was 220 MB and the result 250 MB, with `ExposedPorts` `80/tcp`. A container with `-p 8090:80` and `-v ./html:/var/www/html` returned HTTP 403, with the directory labeled `unconfined_u:object_r:user_home_t:s0`. With `:Z` it returned the page and HTTP 200, and the directory became `system_u:object_r:container_file_t:s0:c899,c918`. Restored the same session: both containers removed, both images removed, `podman image prune -af`, the scratch directory deleted; `podman images -a` and `podman ps -a` then listed nothing, as before the test.

**Round 3, 2026-11-14, fragment 1.** On `servera`, as `student`, from the snapshot state (no Podman). Slide capture first, as a side test: `sudo dnf install -y podman` installed 17 packages from the instructor lab's `dvd-appstream` repository; `podman -v` printed `podman version 5.4.0`; the first `podman run registry.access.redhat.com/ubi10/ubi` pulled a 77.5 MiB blob. The `pnpm lab --tty` session has no window size, which hides Podman's progress bars entirely, so the pull was recaptured after `stty cols 100 rows 32`: the final screen then shows one `Copying blob 6cbfcbeb6614 done   |` and one `Copying config 7474288886 done   |` line, as a student's terminal would. `servera` was then reverted with `start-latest-snapshot servera` (snapshot `2026-11-03T05:57-06:00-grub_console`; the script set the clock to the host's).

Exercise 1 was then run in order from the snapshot: the install, `podman -v`, `cat /etc/redhat-release` in the container (`Red Hat Enterprise Linux release 10.3 (Coughlan)`) and on the host (`10.0`), and `uname -r` in both (`6.12.0-55.9.1.el10_0.x86_64`, the same). The shortened slide command, `echo Hello`, was captured afterward as a side test (both containers and the image removed, the `echo` run captured with its pull, then the exercise's two runs repeated), which left `servera` exactly as the exercise leaves it.

**Round 4, 2026-11-14, fragment 2.** On `servera`, as `student`, from the end of exercise 1. Read-only first: `podman info | grep -A4 registries` and `registries.conf` as on `workstation`; `podman search httpd` (51 lines) and `podman search httpd-24` (33 lines) both list Red Hat images only under `registry.redhat.io`, `ubi10/httpd-24` among them; `podman search --list-tags` works against `registry.access.redhat.com`; local images resolve by short name (`ubi10/ubi`); `podman image inspect ubi10/ubi` is 182 lines of JSON, and `--format` printed `2026-11-12 21:48:07.914391457 +0000 UTC` for `{{.Created}}` and `map[]` for `{{.Config.ExposedPorts}}`. `podman image prune` stops at a `[y/N]` prompt.

A side test of `podman login registry.access.redhat.com` with empty credentials, as RH134 shows, was stopped when you dropped the topic. The scripted prompts never completed in the wrapper's terminal, but a logout left an empty `/run/user/1000/containers/auth.json` (`"auths": {}`), which was removed; no credentials were used.

Exercise 2 was then run in order: `ubi10/httpd-24` pulled in 7.4 seconds (three layers, 286 MB, ID `c0cfc32ec96b`), Docker Hub's `httpd` in 3.3 seconds (121 MB, unsigned, so no signature lines), the exposed ports read `map[8080/tcp:{} 8443/tcp:{}]` and `map[80/tcp:{}]`, and `podman rmi docker.io/library/httpd` untagged and deleted it.

**Round 5, 2026-11-14, fragments 3, 4, and 3a.** On `servera` from the end of exercise 2, with side tests restored to the chain each time.

- Side tests for fragment 3: a foreground `ubi10/httpd-24` run driven through a real pseudo-terminal, where Ctrl+C after 8 seconds made httpd log `caught SIGTERM, shutting down` and `--rm` removed the container. A detached container on port 8091: `curl` gets Red Hat's test page (179 lines of HTML, status 403 because `/var/www/html` is empty), `podman logs` shows the start-up, an `AH01276` no-index error, and each request; inside, `id` is `uid=1001(default) gid=0(root) groups=0(root)`, `ps`, `getenforce`, `man`, and `less` are missing, and `ss`, `ip`, `curl`, `vi`, and `systemctl` are present; `-e GREETING=Hello ... printenv GREETING` prints `Hello`. From `workstation`, `curl servera:8091` was refused (exit 7) until `firewall-cmd --add-port=8091/tcp`, then got the test page. All removed, port closed. `podman rm -f` on a `sleep` container that ignores SIGTERM warned that SIGTERM failed in 10 seconds and resorted to SIGKILL.
- Logout test: inconclusive and not repeated. `student` stays logged in on `servera`'s tty1 on the instructor lab, so a container survived the SSH session ending; that console session was left alone. The follow-up test with a temporary user was blocked by permissions and never ran; a check confirmed no user, home directory, or `/etc/subuid` entry was created.
- Exercise 3 in order. A first piped run raced: `curl` ran before httpd was ready and the `firewall-cmd` line was swallowed by the container's shell. The timing-sensitive steps were then repeated with real pauses and all matched. End state: no containers, both images, firewall back to its defaults.
- Exercise 4 in order: without `:Z`, the test page and `(13)Permission denied: ... AH00035: access to /index.html denied` with `user_home_t`; with `:Z`, the page and `system_u:object_r:container_file_t:s0:c314,c629`; an edit on the host showed at once.
- Side tests for fragment 3a: the UBI base has no `ps`; a first build and a cached rebuild of the 3a.3 Containerfile as `img01:1.0` (the slide's transcript); `podman tag` prints nothing and lists both tags; rebuilding a tag that another tag still holds leaves nothing dangling, while rebuilding a tag no other tag holds leaves `<none>`, which `podman image prune` (after `y`) removed. All removed. Slide 4.2a's `con01` command was run on `workstation`, which then had its image and directory removed. On `workstation`, `PS1` in the UBI image is `[\u@\h \W]\$`. One interactive attempt there hung and was killed; it left only the image, which was removed.
- Exercise 5 in order: `intranet:1.0` built (`STEP 1/4` to `4/4`, `Complete!`), served the page on 8082, and failed `ps`; `intranet:1.1` with `procps-ng 4.0.4-13.el10` from UBI's BaseOS repository rebuilt from step 2 and listed httpd as PID 1 with four `apache` workers. Cleanup: `podman image prune -a` removed all four images and their layers; `sudo dnf remove -y podman` removed the same 17 packages exercise 1 installed. Only Podman's empty `~/.local/share/containers` remained.

`servera` was then reverted with `start-latest-snapshot servera` so the recording pass starts exactly at the snapshot.

**Round 6, 2026-11-15, the reordered exercises 4 and 5.** On `servera` from the snapshot. Exercise 3's end state was recreated directly rather than by rerunning exercises 1 to 3: `sudo dnf install -y podman` and pulls of `ubi10/ubi` and `ubi10/httpd-24`, which is exactly what those three exercises leave.

- Exercise 4 in order: `intranet:1.0` built in five steps and served `<h1>Intranet: under construction</h1>` on 8082; after `index.html` changed on the host, `curl` still returned the old page; `intranet:1.1` rebuilt with step 2 `Using cache` and `COPY` and after it run again, and a new container from it served `<h1>Intranet: open for business</h1>`. `podman images` listed both tags at 250 MB. In this image, `podman logs` shows only the `AH00558` start-up warning, since httpd logs to files inside the container.
- Exercise 5 in order: `intranet:1.1` with `~/intranet/html` mounted and no `:Z` served the test page (title "Test Page for the HTTP Server on Red Hat Enterprise Linux", as with Red Hat's image); `podman exec intranet cat /var/www/html/index.html` printed `cat: /var/www/html/index.html: Permission denied` as `root`, and `/var/log/httpd/error_log` inside the container held `(13)Permission denied ... AH00035`; `ls -dZ` showed `user_home_t`. With `:Z`, the mounted page replaced the baked-in one, the label became `system_u:object_r:container_file_t:s0:c806,c1014`, and both edits showed at once.
- Side test for 4.2a: `img01:1.1` built with a page copied in, then run as `con01` with `-p 8000:80 -v ~/html:/var/www/html:Z`, served the mounted page. All removed.
- Cleanup: `podman image prune -a` removed all four images; `sudo dnf remove -y podman` removed 17 packages. `servera` was then reverted with `start-latest-snapshot servera`.

**Round 7, 2026-11-15, transcripts for the gap-scan slides.** A side test on `servera` from the snapshot: Podman installed; `ubi10/ubi-minimal` pulled, listed (87.9 MB), and removed; `con01` run from `ubi10/httpd-24` on 8000, listed with `podman ps --format`, and checked with `curl -s`; `podman exec -it con01 /bin/bash` with `id`, `ps aux`, and `exit`, after which `con01` was still up; then `con01` removed, `img01:1.1` built with a page copied in, and `~/html` mounted with `:Z`, its label going from `user_home_t` to `container_file_t:s0:c365,c532`. A first attempt lost its typed-ahead input to `dnf` and was repeated with `dnf`'s standard input redirected. `servera` was then reverted with `start-latest-snapshot servera`.

**Round 8, 2026-11-15, fragment 5 and w15 planning.** Side tests on `workstation` and `serverb` first, each restored the same session; then exercise 6 on `servera`.

- **For w15, on `workstation`** (Podman 5.4.0, rootless, `pasta` the default network): two containers on the default network, or on the built-in `podman` network (`dns_enabled=false`), could not reach each other by name; on a network made with `podman network create`, they could. A container with `--network host` reached a server on the host's `127.0.0.1:3306` with SELinux enforcing. On the default network, `host.containers.internal` (169.254.1.2) reached the host only when the server listened on all addresses, and the server saw the host's own address. A Docker Hub `postgres:16` on a `:Z` bind mount from the home directory ran, but left the directory owned by UID 525286, mode 700, which `student` could neither list nor delete without `podman unshare`; a named volume ran with no such trouble. Every image, container, volume, network, and directory was removed.
- **For w15, on `serverb`:** a stand-in server on port 3306 was refused from a container on `workstation` until `firewall-cmd --add-service=mysql` (runtime only), then answered with both `--network host` and the default network, seeing the client as `workstation`'s address. The rule was removed and the server stopped; the firewall is back to `cockpit dhcpv6-client ssh`.
- **`podman generate systemd`** on `workstation` printed the DEPRECATED warning, wrote `container-gen1.service` with `Restart=on-failure` and `WantedBy=default.target`, and exited 0.
- **Exercise 6 on `servera`.** Exercise 5's new end state was set up directly: `sudo dnf install -y podman` and no images. A first run as `webapp` was spoiled by my own `su -` test, which left Podman's runtime files in `/tmp/storage-run-1001`; after the reboot the service failed on the boot ID (see "Corrections"). The user was deleted and recreated, and the second run, logged in with SSH, used `/run/user/1001/containers`. Its results: `useradd` gave `webapp` UID 1001 and `/etc/subuid` range 589824; `passwd` warned "BAD PASSWORD: The password is shorter than 8 characters" and printed "passwd: password updated successfully"; `webapp`'s `podman images` was empty; the container served `<h1>Intranet: running as a service</h1>` on 8083; the generated unit, `daemon-reload`, and `enable --now` (printing "Created symlink ...") served it again. After logout the page answered for about 10 seconds and was refused from 12 ("Failed to connect to localhost port 8083 after 0 ms: Could not connect to server"). `sudo loginctl enable-linger webapp` started the service 0.3 seconds later (`list-users` showed `opening`, then `lingering`). After a reboot, with the network-wait options, the page answered as soon as `servera` accepted SSH, and `student`'s `podman ps` was empty. Without those options, two reboots gave empty replies (see "Corrections"). Cleanup: `disable-linger`, then after 5 seconds `userdel -r webapp` (exit 0, home directory and `/etc/subuid` and `/etc/subgid` lines gone), then `sudo dnf remove -y podman` (17 packages).
- **Slide transcripts** as `student` on `servera`, each undone: 5.2a's `generate` and `rm -f` (a first take, with `rm -f` a second after `podman run`, waited 10 seconds for SIGTERM and warned, so it was retaken after a 6-second wait); 5.2b's `daemon-reload`, `enable --now`, `status`, `is-active`, `stop` (no container left), `start` (a fresh one), and `disable --now` ("Removed ..."); 5.3a's `loginctl enable-linger` as `student` without `sudo` (`yes    active`), then `disable-linger`. Under `sudo -iu webapp` and `su - webapp`, `systemctl --user` failed as quoted on 5.3.
- **Restored.** My SSH tests had created `~/.ssh/known_hosts` and `known_hosts.old` for `student` on `servera`; both were removed. `servera` was then reverted with `start-latest-snapshot servera`, and checked: no Podman, no `webapp`, no lingering.

**Round 9, 2026-11-16, the recordings.** After the recording pass, a read-only look found `servera` back at the week's start apart from what the exercises leave behind (Podman's storage under `~/.local/share`, `~/.cache`, `~/.lesshst`, `~/.viminfo`); no Podman, no `webapp`, no lingering. `servera` was reverted with `start-latest-snapshot servera` for the re-recording of exercises 1 to 3. After the retakes, `servera` held what exercise 3 leaves (Podman, `ubi10/ubi` and `ubi10/httpd-24`, no containers, no extra ports) and was reverted again. Each cast's text was compared with its command file (see "Exercises"). `check:entry` and `check:slides` pass with the six recording slides, and slide 63 was opened in the review browser at 1920x1080: the player loads with its eight markers and the written-exercise link.

**The lab is at the week's start:** `servera` has no Podman and an empty home directory, with no ports open beyond the defaults; `workstation` has no images or containers; `serverb` is untouched apart from the reverted firewall rule.

## Authoring notes

- **Prompts.** `student@workstation:~$` on every slide. A shell inside `ubi10/httpd-24` will not have that form (the image runs as UID 1001 with a generic prompt, to verify at build), and the theme's grammar recognizes only `user@host:dir$`. Slide transcripts stay outside the container; the exercises show the inside, where the recording draws the real prompt.
- **Foreground containers in command files** need `#@ key ctrl+c` to stop. A `podman run` in the foreground prints httpd's start-up lines, which need a pause before the Ctrl+C.
- **Pulls in recordings.** `--record` does not wait for a command to finish, so every `podman pull` and the first `podman run` of an image carry a pause as long as the pull takes on the instructor lab, measured at build.
- **Stack diagrams.** `block-beta`, as `partitions.md` uses it, with `classDef` per layer hue from `setup/accent.ts` (2px stroke, 22% fill) and labels in the theme's text color. Every box names its layer in words. Mermaid icon shapes load asynchronously, so diagrams leave headroom.
- **One image name everywhere.** `registry.access.redhat.com/ubi10/httpd-24`, written in full in commands, since `short-name-mode = "enforcing"` prompts for a registry when a short name is ambiguous.
- **No presenter notes**, as for every new slide.

## Decisions

All proposed 2026-11-13. Decision 25 was accepted and Decisions 6, 8, 18, and 24 revised the same day, after your answers to Open questions 1 to 4. Decisions 31 to 43 come from the audit. **On 2026-11-14 you approved the plan as it stands, so every decision is accepted as recommended** and its alternative set aside. Each is still reversible.

1. **Four fragments** in `rh134-ch17-managing-containers-with-podman/`, split at the ODP's own task boundaries: "Why Containers" (O2 to O11), "Container Images" (O12 to O20), "Running Containers" (O21 to O24), "Volume Mounts" (O25 to O27). The ODP has no section slides, so these titles are proposed; "Why Containers" is its recurring heading, the rest are its own slide titles.
2. **Alignment** RH134 chapter `"17"`, *Managing Containers with Podman*, on all four; no Cert Guide chapter.
3. **Accent `orange`**, or `pink`. Superseded by Decision 47: you set `teal`.
4. **Title** "Managing Containers", or RH134's "Managing Containers with Podman".
5. **Cover agenda of four lines**, one per fragment (five with Decision 26).
6. **Host `servera`**, as in the ODP, with `workstation` as the second host for the port test (A9), and the VM reminder "Start `workstation` and `servera` on your VDI". Revised 2026-11-13 from `workstation`: you want the install taught, and on the instructor lab only `servera` lacks Podman, so only there does the recorded install match what a student without Podman sees. On `workstation` it would print "already installed".
7. **`ubi10/httpd-24`** from `registry.access.redhat.com` in place of `ubi9/httpd-24`. Docker Hub's `httpd` stays.
8. **"Install container-tools" becomes `sudo dnf install podman`**, with one line that RHEL 9's `container-tools` no longer exists. Revised 2026-11-13; under A17 it moves to the first exercise.
9. **Drop the `skopeo` step** (the ODP's step 4, inspecting remote images); inspect after pulling, as RH134 does. The alternative installs `skopeo` first. Reaffirmed 2026-11-15 (Decision 51).
10. **Paraphrase O2 and O11's definition**, which quotes RH134.
11. **1.11 stays an exact repeat of 1.2.** Its proposed `IconGrid` alternative and 1.10's one-line addition are superseded by 1.11a and 1.10a (Decision 31).
12. **Versions harmonized** to Python 3.12 and RHEL 10 throughout fragment 1.
13. **Stack diagrams as Mermaid `block-beta`** with the hue map in fragment 1's notes, and "Why Containers?" kept as the title on all six of O3 to O8, as in the ODP.
14. **2.2 rebuilt as Mermaid**, titled "Images, Registries, and Containers", with "Containerfile" for "Dockerfile".
15. **2.5:** "(no login)" and "(login required)" after the two Red Hat registries.
16. **2.5's photograph gives way to the `podman info` transcript.** The alternative keeps a replaced photograph and adds the transcript as 2.5a.
17. **2.6's shipping-container photograph is replaced**, by your AI image or a Commons photograph, or dropped. Done 2026-11-17 with Alf van Beem's CC0 photograph from Antwerp, your choice (see "Third-party images").
18. **The cube image on 2.7 and 3.2 stays**, with no credit line: it is yours, made with an LLM (answered 2026-11-13).
19. **2.7 as a command table** with `podman image inspect` added, and **2.7a Image Names** added.
20. **Split O22** into 3.2 (`podman run` options) and 3.2a (`ps`, `exec`, `stop`, `rm`).
21. **Add 3.2b Port Mapping**, and use host port 8000 on the slides so it differs from the container's 8080. Exercises use their own host port, chosen at build.
22. **Add 4.2a**, the `-v` anatomy with O29's `:Z`.
23. **Keep "Volume Mounts"** as the section title, with "bind mount" named once on 4.2a. The alternative is "Bind Mounts", Podman's term.
24. **Do not port O28 and O29** or their command file; A11's callout carries the logout behavior and `loginctl enable-linger`. They were not taught last year, and the RHEL 10 RHA material does not cover them. The alternative is a Quadlet fragment, about 25 minutes. Reversed on 2026-11-15 by Decision 49.
25. **Do not port O17 and O21**, the video cues. Accepted 2026-11-13.
26. **Superseded by Decision 36**, the fuller fragment 3a the audit proposes.
27. **Names:** slides use `con01` and `~/html`; exercises use containers named `intranet` and `~/intranet/html`, and the image `intranet:1.0` under Decision 26.
28. **Exercise titles and files** as in the "Exercises" table, with per-exercise cleanup and exercise 3 (or 3a) returning the lab to the start.
29. **Record all three exercises** (four with Decision 26).
30. **Cut nothing until the week is built.**

From the audit (see "Audit against RH134 chapter 17"):

31. **A2 and A3:** add 1.11a How Containers Are Isolated (namespaces, cgroups, SELinux, seccomp) and 1.10a Containers and Virtual Machines (a five-row comparison and a line on orchestration).
32. **A1:** add 2.3a Image Layers, and say "read-only layers" on 2.4.
33. **A6:** the Red Hat Ecosystem Catalog and Quay.io lines on 2.5. A5, the `podman login` slide, was dropped on 2026-11-14 at your request: it is not an important concept for this class.
34. **A12, A13, and A16:** UBI on 2.7a; `search --list-tags` on 2.7 (it works against `registry.access.redhat.com`); `inspect --format` on 2.7b, added at build; one formatted field in the images exercise. `image prune` moved to fragment 3a (2026-11-14).
35. **A7, A8, and A10:** "a container stops when its command ends" on 1.11b, where `run` first appears; `ps`, `logs`, and `exec` on 3.2a; `stop`, `stop --all`, `kill`, `restart`, `rm`, `rm -a`, and `rm -f` on 3.2b (the split was forced by fit at build); a `logs` step in the running-containers exercise.
36. **A14:** add fragment 3a, Containerfiles, as outlined, seven slides with its exercise.
37. **A9:** a firewall line on 3.2b and an exercise step that reaches the container from `workstation`.
38. **A11, closed 2026-11-15 by Decision 50.** As proposed: a `Callout` that rootless containers stop when you log out, naming `loginctl enable-linger`. Not built: the instructor lab cannot show it with `student`, who stays logged in on `servera`'s console (tty1), and the test that would show it, a temporary user reached over SSH, was blocked by Claude Code's permission settings on 2026-11-14 because it creates and deletes an account. RH134's lab states the behavior, so the callout can cite that instead; or it can be left out, as `podman login` was.
39. **A15:** teach `podman tag` and `podman image push` on 3a.5 and leave the practice to the RHA lab. The alternative runs a registry container on `servera` to push to, with `--tls-verify=false`.
40. **A17:** move O16 to the end of fragment 1, add 1.11b, and add a first exercise, Run Your First Container. The alternative accepts about 20 content slides before the first exercise.
41. **Section and agenda:** five fragments, so a five-line cover agenda (revises Decision 5), with the alignment of Decision 2 on fragment 3a too.
42. **A18:** the web-content exercise shows the 403 without `:Z` before fixing it.
43. **A19:** the week's last exercise is the assignment's whole workflow with different parameters. Since the reorder (Decision 44), that is the Volume Mounts exercise, which mounts content into the image fragment 3a built.

Proposed and accepted 2026-11-15, from your idea that Volume Mounts would hit harder after an image with a page baked into it:

44. **Containerfiles before Volume Mounts.** Fragment "4a" became 3a and moved ahead of Volume Mounts; no ODP slide moved. Added 3a.4a Every Change Is a New Image and 4.1a Baked In vs Mounted. The Containerfiles exercise copies the page into the image and rebuilds for a change; the Volume Mounts exercise mounts the page instead. The `procps-ng` version step is gone.
45. **One rebuild**, `intranet:1.0` to `1.1`, with 3a.4a showing the loop.
46. **The Volume Mounts exercise uses the students' own `intranet:1.1`**, not `ubi10/httpd-24`, so the two sections connect and the mounted page visibly covers the baked-in one.
47. **Accent `teal`**, your change to the entry file. The diagrams' Container Engine layer and dashed container outlines moved from `teal` to `slate` so no diagram color matches the accent.
48. **Gap scan, 2026-11-15, at your request:** add the slides an exercise needs before it. Found and fixed: `podman exec` had only a table row (3.2e added); foreground runs and Ctrl+C, `podman ps` output, and `curl -s` were never shown (3.2d); `podman images` and `rmi` output and Docker Hub's `library/` were never shown (2.7c); the `unqualified-search-registries` setting was not named (2.5 caption); the `user_home_t` and `container_file_t` labels were never shown (4.2b). Everything else the exercises use was already taught: the install, `run` with a command, `-p`, `-e`, `--rm`, `--name`, `logs`, `stop`, `rm` and its flags, the firewall, `build`, the cache, tags, and `prune -a`.

Accepted 2026-11-15, after you planned w15 (see `w15-porting.md`):

49. **Port O28 and O29 as fragment 5, Containers as Services,** with the ODP's `run_containers-as_a_regular_user.sh` as exercise 6, using `podman generate systemd` despite its deprecation. Reverses Decision 24. Your reasons: some students take the RHEL 9 RHCSA exam, which has containers as systemd services and lingering, and w15 runs its app tier as a rootless container service, so you would rather not teach writing a unit file. Quadlet stays untaught.
50. **The logout behavior is taught, not cited.** 5.3a states it, and exercise 6 logs out and watches the page stop before enabling lingering. Closes Decision 38.
51. **No `skopeo`.** `podman image inspect` already covers what the ODP used it for. Decision 9 stands.
52. **Teach the network-wait options with `generate systemd`:** `--wants` and `--after podman-user-wait-network-online.service`, on 5.2 and in exercise 6. Forced by RHEL 10 (see "Corrections"): without them, the exercise's reboot step fails. The alternative is `--network host` for the exercise's container, which needs no wait but drops `-p`, which every other exercise uses.
53. **Exercise 6 runs as a user of its own, `webapp`,** as the ODP's command file does with `fancy_app`: on the instructor lab `student` stays logged in on the console, so lingering would show nothing for `student`. Exercise 5's cleanup leaves Podman installed, and exercise 6's cleanup deletes `webapp` and removes Podman. Host port 8083.

Proposed 2026-11-15:

54. **If the week runs long, drop the Docker Hub pull from exercise 2.** See "Fitting the class period" for what it loses. Declined 2026-11-17: you keep the pull. With 11 students, Docker Hub's anonymous rate limit is no concern, and exercise 2 is recorded as it stands.

## Open questions

Questions 1 to 4 were answered on 2026-11-13:

1. **The SCC lab.** Assume neither host has Podman, because an RHCSA exam VM might not, so students learn the package name and how to install it. The VDI's VMs reach public registries. A class is about a dozen students, so Docker Hub's anonymous limit is not a concern. (Decisions 6 and 8 revised; A4.)
2. **The cube image.** Yours, made with an LLM. It stays, with no credit line (Decision 18).
3. **O28 and O29** were not taught. The RHEL 10 RHA material does not cover them (see "Beyond the RHEL 10 chapter"; Decision 24). Revisited 2026-11-15: ported as fragment 5 (Decision 49).
4. **The video cues.** You would rather not play them (Decision 25 accepted).

5. **SCC Lab chapter 17 lab 01.** Answered 2026-11-13: you supplied it. See "The SCC lab this week assigns" (A18, A19).

Open:

6. **The time trim** (Decision 54). Answered 2026-11-17: keep the Docker Hub pull; the class has 11 students.
