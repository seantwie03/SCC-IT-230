# W05 - Port

## Prompt

Port w05 from `~/s/IT-230/w05` to this repository. Material reviewed:

- `~/s/IT-230/w05/w05-lesson_plan.md`
- `~/s/IT-230/w05/slides/*.md` (`slides.md`, `logs.md`, `time.md`, `tuned.md`, `apache.md`)
- `~/s/IT-230/w05/demonstrations/` (nine command files)
- `~/s/IT-230/w05/rh134-ch05-analyzing_and_storing_logs/` (twelve sections)
- `~/s/IT-230/w05/rh134-ch09-tuning_system_performance/` (six sections)
- `~/s/IT-230/cert_guide_rhcsa_10/` chapters 10, 13, 21, and 25, for ideas only

Repository guidance applied: `README.md`, `docs/course-authoring.md`,
`docs/design-system.md`, `docs/publishing.md`, and the `lab-verification` skill.

## The size problem, first

This is the finding that shapes everything else. The source deck is
**63 content slides** across four topics, before any theme translation:

| Source file | Slides | Topic |
| ----------- | -----: | ----- |
| `logs.md`   |     25 | rsyslog, logrotate, journald |
| `time.md`   |     11 | clocks, time zones, NTP |
| `tuned.md`  |     14 | tuning profiles, process priority |
| `apache.md` |     13 | Apache basics |

For comparison, measured against w04 rather than estimated. w04's three
genuinely ported topics went from 25 source slides to 30, a ratio of **1.20**,
and some of that was in-fragment additions we chose along the way, such as the
anacron expansion. Pure translation sits nearer 1.0 to 1.1, because crowded
source slides get split while thin ones get merged.

w04 published at 52, but that was not translation growth. The accounting:

| | Slides |
| --- | ---: |
| Ported topics (25 source at 1.20) | 30 |
| `systemd-timers`, absent from the source deck entirely | 9 |
| `systemd-services`, added after discussing the slide budget | 12 |
| Cover | 1 |
| **Published** | **52** |

Twenty-one of those slides were **chosen**, not inherited. Applying only the
translation ratio, a faithful w05 port lands at roughly **63 to 76 slides**
plus a cover, before anyone decides to add anything. The uncertainty is real:
the low end assumes translation is close to even, the high end assumes w04's
1.20 holds.

It carries **eight** exercises against w04's five, one per section, which is
the count that survives after applying the rule below.

Even at the low end that is well beyond w04, and eight type-along exercises is
still more than a class period comfortably holds. Three options:

1. **Port as one week.** Faithful to the lesson plan, but a deck students meet
   in one session becomes a reference document rather than a presentation.
2. **Split at the RHA seam.** RH134 ch05 (logs and time) is one coherent week;
   RH134 ch09 (tuning) plus Apache is another. The chapters already divide this
   way, and the lesson plan's own agenda lists four topics that group two and
   two. Costs a schedule shift for every later week.
3. **Port whole, then trim.** Complete the port, measure it, and cut from the
   weakest material rather than guessing up front. Candidates are listed under
   "Trim candidates" below.

**Decision: option 3.** Port the whole week, measure the finished deck, then
decide whether to trim or split. This preserves the port-first discipline that
worked for w04 and keeps the decision informed by a real deck rather than an
estimate. Splitting at the RHA seam stays available afterward, and the fragment
boundaries below are drawn so that a split needs only a second entry file and a
move of three fragments, not a rewrite.

## Port fidelity

Same rule as w04. Every slide in `~/s/IT-230/w05/slides` lands with its content
intact; what changes is the expression: theme layouts, `TerminalWindow`,
`TextExplainer`, `Callout`, the color-text components, and the repository's
exercise contract in place of the old deck's bare Markdown and `<br />` spacing.

Three categories of change are in scope:

1. **Corrections**, where a command or output is wrong on RHEL 10.
2. **Activity slides**, since the source's `Exercise:` slides become the
   repository's two-slide `layout: exercise` pattern.
3. **Callbacks to w04**, noted per fragment below. These are rewordings that
   connect new material to what students just learned, not new teaching.

Everything else waits for the post-port length review.

## Sequencing and framing

Red Hat Academy drives the flow, as in w04. RH134 ch05 supplies logs and time;
RH134 ch09 supplies tuning and process priority. The RHCSA Cert Guide is
supplemental and contributes examples and framing only.

Apache is the exception: it appears in no RHA chapter for this week and comes
from cert guide ch21 plus the instructor's own material. It sits last, matching
the lesson plan's agenda order.

**Apache is here to set up w06.** The following week introduces SELinux, and a
web server is the clearest thing to demonstrate SELinux configuration against.
Students cannot learn SELinux on a service they have never run, so this section
exists to make a running web server familiar. That fixes its scope: enough for a
student to install `httpd`, start it, put a page under `DocumentRoot`, and
retrieve it. Depth beyond that belongs to a later week, and this section is
**not** available as trim material.

The source deck's order is kept: logs, time, tuning, Apache.

**w04 set Apache up deliberately.** The systemd services fragment taught
`status`, `start`, `restart`, `enable --now`, masking, and the
`WantedBy=multi-user.target` line, using `httpd.service` as the masking example.
The Apache section can assume all of it rather than re-teaching `systemctl`.

**Two more w04 callbacks are available.** `logrotate.timer` is the worked
example on the w04 timers slide, so the logrotate fragment can point at a timer
students have already read. And `/var/log/cron` and `journalctl -u` were used
throughout w04's cron and timer verification steps, so the logging fragments
deepen commands students have already typed rather than introducing them.

## Deck-level decisions

| Item                 | Value |
| -------------------- | ----- |
| Entry file           | `course/w05-draft.md`, renamed to `course/w05.md` only after publication review |
| `title`              | Analyzing Logs, Synchronizing Time, Tuning Performance, and Serving Web Pages |
| `courseInfo.summary` | One or two sentences covering the four topics |
| `it230Accent`        | `slate`, the last unused cool accent (w01 teal, w02 purple, w03 blue, w04 green) |
| Cover slide          | `kicker` = `Week 05`; body lists the agenda headings |

## Source-to-fragment map

| Source | Destination |
| ------ | ----------- |
| `slides.md` headmatter and cover | `course/w05-draft.md` headmatter and cover |
| `slides.md` "Start your VDI" | dropped; it is a classroom instruction, not course content |
| `logs.md` slides 1 to 5 | `log-architecture.md` |
| `logs.md` slides 6 to 11 | `rsyslog.md` |
| `logs.md` slides 12 to 15 | `logrotate.md` |
| `logs.md` slides 16 to 25 | `journald.md` |
| `time.md` slides 1 to 8 | `system-time.md` |
| `time.md` slides 9 to 11 | `ntp.md` |
| `tuned.md` slides 1 to 5 | `tuning-profiles.md` |
| `tuned.md` slides 6 to 14 | `process-priority.md` |
| `apache.md` all | `apache-basics.md` |

## File inventory

Three new chapter directories, nine fragments, and eight exercise pairs.

| Kind | Count | Location |
| ---- | ----: | -------- |
| Weekly composition entry | 1 | `course/w05-draft.md` |
| Topic fragments | 9 | see below |
| Exercise command files | 8 | `<chapter>/exercises/*-exercise.sh` |
| Exercise HTML documents | 8 | `<chapter>/exercises/*-exercise.html` |
| Exercise recording GIFs | 8 | `<chapter>/assets/*.gif` |

Chapter directories:

- `course/chapters/rh134-ch05-analyzing-and-storing-logs/`
- `course/chapters/rh134-ch09-tuning-system-performance/`
- `course/chapters/it230-apache-web-server/`

Apache gets the `it230-` prefix because no Red Hat Academy chapter for this
week covers it. Its only curriculum alignment is RHCSA Cert Guide chapter 21.

## Topic fragments

### `rh134-ch05-analyzing-and-storing-logs/`

**1. `log-architecture.md`** (~5 slides)
Why logs matter, framed as the audit question and the troubleshooting question.
Journald against rsyslog as two mechanisms that mostly carry the same messages,
plus the common log files table. Aligns RH134 ch05s01.

**2. `rsyslog.md`** (~6 slides + exercise)
Facilities and priorities as the two axes rsyslog routes on, the fixed tables
for each, the `/etc/rsyslog.conf` rules block, `logger` for sending a message,
and `tail` against `less` for reading one. Aligns RH134 ch05s03.

**3. `logrotate.md`** (~4 slides + exercise)
Why rotation exists, the dated files it leaves behind, `/etc/logrotate.d/`,
and the common configuration and schedule options. Callback: `logrotate.timer`
is the example students already read in w04.

**4. `journald.md`** (~10 slides + exercise)
`journalctl` and its filters: by unit, by time, by field, and by boot; then the
persistent journal. The largest fragment, and the strongest candidate for
splitting into `journald.md` and `persistent-journal.md` if it reads long.
Aligns RH134 ch05s05 and ch05s07.

**5. `system-time.md`** (~8 slides + exercise)
Hardware against software clock, epoch seconds, and time zones with
`timedatectl` and `tzselect`. Aligns RH134 ch05s09.

**6. `ntp.md`** (~3 slides + exercise)
NTP and stratum, then `chronyd`, `/etc/chrony.conf`, and `chronyc`. Callback:
`chronyd` is the service account students met on the w04 system-cron slide.

### `rh134-ch09-tuning-system-performance/`

**7. `tuning-profiles.md`** (~5 slides + exercise)
What "better performance" means and why it depends, the profile table, and the
`tuned` components with `tuned-adm`. Aligns RH134 ch09s01.

**8. `process-priority.md`** (~9 slides + exercise)
A processes and `top` refresher, then priority against nice values, reading
them in `top` and `ps`, and setting them with `nice` and `renice`. Aligns
RH134 ch09s03.

### `it230-apache-web-server/`

**9. `apache-basics.md`** (~13 slides + exercise)
What a web server is and the `httpd` components, installation, the `Listen` and
`DocumentRoot` directives, `index.html`, the URL-to-filesystem mapping table,
the systemd service, and `curl` for testing. Assumes w04's systemd fragment for
everything `systemctl`.

## Exercises

**One exercise at the end of each section, and none for `log-architecture`**,
which is orientation rather than a skill. That gives **eight**.

The old course distinguished demonstrations from exercises, and w04 had to drop
three demonstrations that duplicated its exercises. **w05 has none.** Every
activity in both the slide deck and `demonstrations/` is already written as an
exercise, so nothing is dropped on that account. The reduction from the source's
eleven comes entirely from the one-per-section rule.

| Owning fragment | Exercise | Source |
| --------------- | -------- | ------ |
| `rsyslog.md` | Logging authpriv.info Messages | `logs/log_authpriv_info_messages.sh` |
| `logrotate.md` | Rotating a Log File by Size | `logs/rotate_log_file_size.sh` |
| `journald.md` | Reading the Journal | `logs/view_journal.sh`, all three consolidated |
| `system-time.md` | Changing the Time Zone | `time/change_timezone.sh` |
| `ntp.md` | Using a New NTP Source | `time/new_ntp_source.sh` |
| `tuning-profiles.md` | Activating a Tuning Profile | `tuned/activate_network_latency_profile.sh` |
| `process-priority.md` | Managing Nice Values | `tuned/manage_nice_values.sh` |
| `apache-basics.md` | Serving a Web Page | `apache/setup_basic_web_server.sh` and `apache/add_contact_us_page.sh` |

Two consolidations, both natural:

- **Reading the Journal** merges the source's three journal exercises. They are
  short, sequential, and share a setup: read one service's logs, narrow by time,
  then make the journal survive a reboot.
- **Serving a Web Page** merges the two Apache exercises. Installing the server
  and then adding a page under `DocumentRoot` is one workflow, and the second
  source exercise cannot run without the first anyway.

Each becomes a `kitty-demo.sh` command file, a student-facing HTML document, and
a GIF generated from its Asciinema recording.

## Not ported

- `slides/global-bottom.vue`, `layouts/`, `setup/`, `package.json`,
  `netlify.toml`, `vercel.json`, and `public/`. The theme and repository build
  supply all of this.
- Any SCC or Red Hat logo in `slides/public/`. Text references only.
- The "Start your VDI" slide, which is a classroom instruction.
- RH134 chapter text, guided exercises, quizzes, and transcripts. Those inform
  scope and sequencing only; alignment metadata is the reference.

## Verification

Everything gets checked on the lab with `pnpm lab` before it lands, per the
`lab-verification` skill. Known risks, from w04's experience:

- **The source deck is RHEL 9 in places.** The journal sample shows a
  `5.14.0` kernel and 2025 dates; `tuned` output and profile lists may differ on
  RHEL 10. Re-capture everything.
- **Package availability.** w04 found `at`, `rsync`, and `sysstat` all absent
  from the lab image. Check `httpd`, `tuned`, and `chrony` before writing any
  installation step.
- **`tzselect` is an interactive TUI** spanning five `v-switch` templates in the
  source. Verify each screen, since its menus are locale and version dependent.
- **Apache and SELinux.** Serving files from a non-default `DocumentRoot`, or
  content created outside it, can fail on file context. Verify the exercise's
  file creation path end to end.
- **`curl http://servera/` from workstation** depends on the firewall. Check
  whether `firewalld` blocks port 80 on the lab image, since the source deck
  shows no firewall step.
- Prompts get rewritten from `[user@host ~]$` to the theme's
  `user@host:directory$` form.

## Trim candidates

If the post-port review needs slides back, these are the weakest per slide.
The Apache section is excluded: w06's SELinux material depends on it.

- The `tzselect` walkthrough, five slides for one command whose output the
  student can read on screen. Two slides would carry it.
- The `top` and `ps` refresher in `process-priority.md`, which repeats material
  from earlier weeks and duplicates its own later slides on reading nice values.
- The two full-screen journal dumps in `journald.md`, which show a wall of
  kernel output to make a point about truncation and horizontal scrolling.

## Decisions

1. **One week.** Port everything, then decide whether to split or trim with a
   real deck in hand rather than an estimate.
2. **The week title stays a list.** Four unrelated topics do not resist a list,
   and there is precedent: w02 publishes as "Shell Expansions, Quoting,
   Transferring Files, and Regular Expressions".
3. **`it230-apache-web-server` is correct.** Apache is instructor-authored here
   and aligns only to RHCSA Cert Guide chapter 21. Its reason for being in this
   week is recorded under "Sequencing and framing": it exists so w06 can teach
   SELinux against a service students have actually run.
4. **The VDI note in the lesson plan is stale.** It warns that the VDI is not
   configured for interactive SSH. That was fixed over the break, so the VDI now
   accepts SSH the same way the lab VMs do and exercises may use it freely. w02
   already names the VDI as a host in its `scp` exercise. Note that `pnpm lab`
   cannot reach it, so any VDI step needs the instructor to verify it.
