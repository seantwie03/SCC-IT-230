# W04 - Port

## Prompt

I need to port w04 from ~/s/IT-230/w04 to this repository. Start by reviewing the following material in ~/s/IT-230

- ~/s/IT-230/w04/rh134-ch03-scheduling_user_tasks (the markdown files)
- ~/s/IT-230/w04/rh134-ch04-scheduling_system_tasks (the markdown files)
- ~/s/IT-230/w04/slides/*.md
- ~/s/IT-230/w04/demonstrations
- ~/s/IT-230/cert_guide_rhcsa_10/ch12-scheduling-tasks.md

Then analyze the following documentation in this repository

- /source/SCC-IT-230/README.md
- /source/SCC-IT-230/docs/course-authoring.md
- /source/SCC-IT-230/docs/design-system.md

## Ported Slide Structure

### Port fidelity

This is a port, not a rewrite. Every slide in `~/s/IT-230/w04/slides` lands in
the new deck with its content intact; what changes is the expression — theme
layouts, `TerminalWindow`, `CommandExplainer`, `Callout`, the color-text
components, the deck accent, and the repository's exercise contract in place of
the old deck's bare Markdown, `<br />` spacing, and custom layout.

Three categories of change are in scope:

1. **Systemd timers**, omitted from the previous deck entirely. Those slides are
   written new, from RH134 ch04s01 and cert guide ch12.
2. **Corrections**, where a ported command or output is wrong on RHEL 10.
3. **Activity slides.** The old deck's paired `Demo:` and `Exercise:` slides
   collapse into one `layout: exercise` pair per section, because this course has
   only exercises. See "Exercises" below.

Everything else waits. Once the port is complete and the deck can be measured,
the total length decides whether to pull in more from RHA or the cert guide. The
specific candidates already identified are parked in "Deferred additions" below
rather than folded into the port.

### Sequencing and framing

Red Hat Academy drives the flow. RH134 ch03 supplies the first half (`at`, then
recurring user jobs with `crontab`) and RH134 ch04 supplies the second (recurring
system jobs with cron, then systemd timer units). The RHCSA Cert Guide is
supplemental: it contributes examples, extra detail, and exam framing, never the
running order.

This order is also the source deck's own, with timers appended: `at`, user cron,
system cron, then timers. It departs from RHA ch04 in one place — ch04 presents
timer units before system cron — which matches the lesson plan's agenda (`at` and
cron, then a systemd review, then timers) and keeps the two cron topics adjacent.

Cron is the week's primary instruction and carries the most slide time and two of
the four exercises. It is presented as a current, widely used tool, not as a
predecessor to timers. Timers are taught as what RHEL uses for most of its own
recurring system work, which students must be able to read, enable, and author —
a second tool, not a replacement. Nothing in the deck labels cron legacy,
deprecated, or superseded.

### Deck-level decisions

| Item                 | Value                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry file           | `course/w04-draft.md`, renamed to `course/w04.md` only after publication review                                                                 |
| `title`              | Scheduling Tasks with `at`, cron, and systemd Timers                                                                                            |
| `courseInfo.summary` | This week we schedule work to run later: one-off jobs with `at`, recurring jobs with cron, and the systemd timers that run RHEL's own system work |
| `it230Accent`        | `green` (cool accent for a Bash-heavy deck; w01 is teal, w02 purple, w03 blue)                                                                   |
| Cover slide          | `kicker` = `Week 04`; body lists the agenda headings                                                                                            |

### Source-to-fragment map

| Source                               | Destination                                          |
| ------------------------------------ | ---------------------------------------------------- |
| `slides/slides.md` headmatter        | `course/w04-draft.md` headmatter and cover           |
| `slides/slides.md` cover             | `course/w04-draft.md` cover                          |
| `slides/slides.md` systemd refresher | opening slides of `systemd-timers.md`                |
| `slides/at.md`                       | `at.md`                                              |
| `slides/user_jobs.md`                | `user-cron-jobs.md`                                  |
| `slides/system_jobs.md`              | `system-cron-jobs.md` (including its anacron slides) |
| —                                    | `systemd-timers.md` (new)                            |

### File inventory

17 new files in 2 new chapter directories.

| Kind                     | Count | Location                              |
| ------------------------ | ----: | ------------------------------------- |
| Weekly composition entry |     1 | `course/w04-draft.md`                 |
| Topic fragments          |     4 | `course/chapters/rh134-ch0{3,4}-*/`   |
| Exercise command files   |     4 | `<chapter>/exercises/*-exercise.sh`   |
| Exercise HTML documents  |     4 | `<chapter>/exercises/*-exercise.html` |
| Exercise recording GIFs  |     4 | `<chapter>/assets/*.gif`              |

The two chapter directories are
`course/chapters/rh134-ch03-scheduling-user-tasks/` and
`course/chapters/rh134-ch04-scheduling-system-tasks/`.

The weekly entry stays a composition document: cover headmatter plus four `src:`
import blocks in teaching order. Import order supplies the meeting agenda, so no
agenda is authored.

### Topic fragments

Each fragment opens with a `layout: section` slide carrying `routeAlias` and
`topicInfo`, then its ported content slides, then the two `layout: exercise`
slides for its one exercise. Each fragment declares its RHA chapter alignment
and, as supplemental reading, RHCSA Cert Guide chapter 12, *Scheduling Tasks*.

#### `rh134-ch03-scheduling-user-tasks/`

**1. `at.md` — "Deferred Jobs with `at`"** (~9 content slides + 2 exercise slides)

The whole of `slides/at.md`. Its section slide; what `at` is for and why it does
not fit recurring work; installing `at` and starting `atd`; scheduling from a
here-string and from a script file; reading `atq` output field by field;
inspecting a job with `at -c`; removing one with `atrm`; and checking
`/var/log/cron`. Long output blocks that the old deck constrained with
`maxHeight` become `TerminalWindow` transcripts, several of them progressive so
the `atq`/`at -c`/`atrm` sequence reveals in step. The PlantUML sequence diagram
is re-authored as Mermaid with an explicit `{scale: n}`.

**2. `user-cron-jobs.md` — "Recurring User Jobs"** (~6 content slides + 2 exercise slides)

The whole of `slides/user_jobs.md`. Its section slide; what a user crontab is and
the five-field reference diagram with its two progressive examples; the four
worked schedule examples; `crontab -e` and `-l` plus `/var/spool/cron/student`;
a student crontab entry with its matching `/var/log/cron` lines; and `crontab -r`
with its delete-everything warning. The five-field reference becomes a
`CommandExplainer` so it can be introduced once here and referred back to from
the system-cron topic; the `crontab -r` warning becomes a `Callout` or
`DangerText`.

#### `rh134-ch04-scheduling-system-tasks/`

**3. `system-cron-jobs.md` — "Recurring System Jobs"** (~6 content slides + 2 exercise slides)

The whole of `slides/system_jobs.md`, anacron included, as the source has it. Its
section slide; `/etc/crontab` and `/etc/cron.d/*` and the extra user-name field;
service accounts and `/sbin/nologin` (why the `apache` user cannot run
`crontab -e`); grouping related jobs in one named drop-in file; anacron's four
script directories and its powered-off catch-up behavior; and the `/var/log/cron`
excerpt showing `run-parts` and `0anacron`.

Anacron stays inside this fragment because that is where the source deck teaches
it — one slide plus the log excerpt. Promote it to its own agenda topic only if
the post-port review expands it.

**4. `systemd-timers.md` — "Systemd Timers"** (~9 content slides + 2 exercise slides)

The one fragment written new. It opens with the systemd refresher that currently
sits loose in `slides/slides.md` — the only ported content here — covering the
init system, services, `systemctl` subcommands, and what `enabled` means. The
rest is new, from RH134 ch04s01 with cert guide ch12 detail: the `.timer` and
`.service` name pairing and enabling the timer rather than the service;
`systemctl list-units -t timer` versus `list-unit-files -t timer`; reading
`Trigger:` and `Triggers:` in `systemctl status`; the `[Timer]` options
`OnCalendar`, `OnBootSec`, `OnUnitActiveSec`, `OnActiveSec`, and `OnStartupSec`,
plus `AccuracySec` and `Persistent`; `systemctl cat sysstat-collect.timer` as a
real example; and the override workflow — copy from `/usr/lib/systemd/system` to
`/etc/systemd/system`, `daemon-reload`, `enable --now`. It closes with a brief
"which do I reach for?" slide covering all three mechanisms.

### Exercises

Four exercises, one per section, placed at the end of the section that teaches
it. Each is a `kitty-demo.sh` command file, a student-facing HTML document of the
same name, and a GIF generated from its Asciinema recording with `agg`.

The old deck's two in-class exercises were long and each spanned several topics;
its three demonstrations relied on an Ansible-staged environment and carried
extra text for humor. Neither shape survives the port. Students type along live,
so an exercise must run on the base lab environment or on what an earlier
exercise in this week already created, and it must stay short enough to type at
classroom pace. The in-class exercises are therefore split, with each piece
landing at the end of the section that teaches it, and the demonstrations
contribute their scenario rather than their staging or their jokes.

| Owning fragment       | Exercise                                | Built from                                                                   |
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| `at.md`               | Finding Recently Modified Logs Exercise | `at/in_class_exercise-find_modified_logs.sh`                                 |
| `user-cron-jobs.md`   | Backing Up Documents Nightly Exercise   | `user_jobs/backup_documents.sh`                                              |
| `system-cron-jobs.md` | Backing Up `/etc` Nightly Exercise      | `system_jobs/in_class_exercise-backup_etc_everyday_at_10pm.sh`               |
| `systemd-timers.md`   | Scheduling a Timer Unit Exercise        | New                                                                           |

They form a deliberate chain, so later exercises type less and the three
mechanisms are compared on the same job:

1. **Finding Recently Modified Logs** (`at`, on `servera`). Self-contained:
   iterate on `find /var/log -mmin -2` with its redirection, schedule it with
   `at now +2min`, inspect with `atq` and `at -c`, remove with `atrm`, and
   confirm in the log. Trimmed from the source by dropping the `man find`
   browsing. The `at` installation stays: the package is absent from the lab
   image, so the exercise cannot skip it.
2. **Backing Up Documents Nightly** (user cron, on `servera`). The
   documents-backup scenario without its staged Star Trek directory: the student
   creates a small `~/Documents` tree in two or three lines, iterates on the
   backup command, schedules it with `crontab -e` one minute out, confirms in the
   log and in the destination, then sets the real 2 a.m. schedule and reviews
   with `crontab -l`. The source copied `workstation:~/Documents` to
   `servera:/tmp`; on a single host that becomes a local timestamped backup under
   `/tmp`, keeping the `rsync` continuity from w02 without a second VM.
3. **Backing Up `/etc` Nightly** (system cron, on `servera`). The second half
   of the source in-class exercise: write a short `/usr/bin/etc_backup.sh`, make
   it executable, copy `/etc/crontab` to `/etc/cron.d/backups` as a starting
   point, test at every-minute, check the log, verify the archive, then set the
   10 p.m. schedule.
4. **Scheduling a Timer Unit** (timers, on `servera`). New, and the payoff of
   the chain: take the `etc_backup.sh` script exercise 3 already wrote, give it a
   `.service` unit and a matching `.timer` with `OnCalendar`, `daemon-reload`,
   `enable --now`, then verify with `systemctl list-timers` and the journal.
   Students schedule a job they already scheduled with cron, so the comparison is
   concrete and the typing is small. Declares exercise 3 as its prerequisite.

Only exercise 4 depends on an earlier one, and it says so in its `environment`
slot. The first three run on the base lab environment alone.

### Not ported

- The three `setup.yml` playbooks, `teardown.yml`, `inventory.ini`, and
  `ansible.cfg` files. An exercise cannot depend on a pre-staged machine, so the
  little state that is still needed is created by the student in the exercise.
- `assign_red_shirt_to_away_mission.sh` and `hull_integrity_checker.sh`. Both
  existed to give a demonstration something entertaining to run; the ported
  slides name their scenarios but never show their contents, and the exercises
  now use the shortest script that makes the point.
- `slides/public/SCC-Primary-Logo-CMYK.png` and
  `slides/public/Red_Hat_Logo_2019.png`. Text references only.
- `slides/layouts/compact-two-cols-header.vue`, `global-bottom.vue`,
  `setup/mermaid.ts`, and the deck's `package.json`, `netlify.toml`, and
  `vercel.json`. The theme and the repository build supply all of this.
- `assignments/ch03.md`. Graded labs stay in Canvas.
- RH134 chapter text, guided exercises, quizzes, and transcripts. Those inform
  the new timers slides and the alignment metadata only.

### Verification

Verified on `servera` (Red Hat Enterprise Linux release 10.0, Coughlan) on
2026-09-04. The host was returned to its snapshot state afterward.

**The two risk points resolved in the port's favor.**

- **`at` is not installed.** `rpm -q at` reports the package missing and
  `atd` does not exist as a unit, so the source deck's install slide is correct
  for this lab and stays. RH134 ch03s01's claim that `at` is installed by default
  does not hold here. Re-capture the output: the package is `at-3.2.5-12.el10`
  (source shows `3.1.23-11.el9`), the transaction table is 80 columns rather than
  the source's much wider one, and the symlink line now quotes its paths.
- **After install, `atd` is `enabled` but `inactive`**, so the source deck's
  `sudo systemctl start atd` step is genuinely required, not a leftover.
- **`/var/log/cron` exists** and `rsyslog` is installed, so every
  `sudo less /var/log/cron` step stays as written. The log line formats match the
  source excerpts exactly, including `atd[...]: Starting job`, `CROND[...]: CMD`
  and `CMDEND`, and the `run-parts`/`0anacron` hourly lines.

**Ported reference files match the source excerpts** and need no changes:
`/etc/crontab`, `/etc/cron.d/0hourly`, and `/etc/anacrontab` are byte-for-byte
what the source deck and RHA show.

**Corrections the port must make.**

- The Service Accounts slide shows `apache:x:48:48:...` from `/etc/passwd`, but
  `httpd` is not installed and no `apache` user exists. A student who greps for
  it finds nothing. Swap the excerpt for a service account the lab actually has —
  `chrony`, `sshd`, and `dbus` all carry a `nologin` shell — and keep `apache` in
  the hypothetical `/etc/cron.d` entry beside it, where it reads as an example
  rather than a claim about this host.
- The user-crontab slide says the file can be viewed at
  `/var/spool/cron/student`. The directory is not readable by `student`; the
  command needs `sudo`.
- `crontab -r` prints `/home/student/.cache/crontab: mkdir: No such file or
  directory` on this image, because `~/.cache` does not exist. It still removes
  the crontab. This is reproducible and absent from the source deck, so show it
  or the first student to run it will think something broke.
- `systemctl cat sysstat-collect.timer` is the RHA example, but `sysstat` is not
  installed. Use `logrotate.timer`, which is present and enabled, and note that
  its RHEL 10 unit uses `RandomizedDelaySec=1h` — the cert guide's Example 12-1
  shows `AccuracySec=1h`, which this build does not have.
- Rewrite every prompt from the source's `[student@servera ~]$` form to the
  theme's `student@servera:~$` form, per the `lab-verification` skill.

**The exercise chain runs end to end.** All four were executed on `servera`: the
`at` job fired and left `/tmp/modified_logs`; a user crontab entry fired and
logged `CMD`/`CMDEND`; a `/etc/cron.d/backups` drop-in ran `etc_backup.sh` as
`root`; and a hand-written `.service` plus `.timer` pair reusing that same script
fired on `OnCalendar`, logging to the journal. Exercise 4's premise — schedule
with a timer the job you just scheduled with cron — is confirmed to work.

One detail for the exercise files: `tar` prints
``tar: Removing leading `/' from member names`` to stderr, so decide whether to
show it or redirect it. Keep `date --iso-8601=minutes` as the source has it. Its
archive names contain `:` and `+00:00`, but `date` is here to demonstrate that a
scheduled job ran, not to teach output formatting, and the option name is the
friendlier one to read.

**Still to verify while authoring.** Every remaining ported command, prompt, and
output block, per the `lab-verification` skill, plus each exercise timed by
typing it at classroom pace. Run
`pnpm run check:slides -- course/w04-draft.md` as fragments land; several source
slides carry long output that the old deck scrolled with `maxHeight`, and those
are the likeliest to overflow or collide with the footer at theme type sizes.

### Deferred additions

Not part of the port. Revisit after the deck is complete and its length is known:

- `at` timespec breadth from RH134 ch03s01 (`teatime tomorrow`, `noon +4 days`,
  `5pm august 3 2025`) and the queue-priority letters `a`–`z`, `A`–`Z`.
- Cron field syntax detail from RH134 ch03s03: the `*/x` step form spelled out,
  the day-of-month versus day-of-week rule, and the invalid-range warning.
- The `SHELL` and `MAILTO` environment variables as a user-crontab topic; the
  source deck shows them only in the `/etc/crontab` excerpt.
- Anacron depth from RH134 ch04s05: `run-parts`, the `/etc/cron.d/0hourly` entry,
  the four `/etc/anacrontab` fields, `RANDOM_DELAY`, and `START_HOURS_RANGE`.
- Cron security (`/etc/cron.allow`, `/etc/cron.deny`) from cert guide ch12.
- A `systemd-tmpfiles` topic from RH134 ch04s03/s04. The RHA chapter assigns it
  and it is a natural second timer example, but the lesson-plan agenda omits it
  and the source deck has nothing to port. It would sit last, after timers.
- A slide on where cron syntax appears outside RHEL — cloud schedulers, CI
  systems, container orchestrators — supporting the week's cron emphasis.
- "User Management (Review)" appears on the lesson-plan agenda but has no source
  slides and nothing is ported for it.
