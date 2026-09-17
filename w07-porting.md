# W07 - Port

## Status

Started, not planned. This file holds the w07 material that was planned while
porting w06, before the instructor decided (2026-09-17) that the SELinux port
labeling material stays in w07. The rest of the week, the firewalld material,
is planned next week.

## Material reviewed so far

Reviewed during the w06 port, for the SELinux port material only:

- `~/s/IT-230/w07/w07-lesson_plan.md`
- `~/s/IT-230/w07/slides/network_security.md` (the whole deck was read)
- `~/s/IT-230/w07/demonstrations/network_security/` (all five command files)
- `~/s/IT-230/w07/rh134-ch14-managing_network_security/` sections 03 and 04
  (SELinux port labeling and its guided exercise)
- `~/s/IT-230/cert_guide_rhcsa_10/ch22-managing-selinux.md`, "Managing Port
  Access"

Not yet reviewed: RH134 ch14 sections 01, 02, 05, and 06 (firewalld and the
lab), and cert guide chapter 23.

## Notes carried over from w06

- **The w06 lesson plan asked to move this material into w06.** The instructor
  declined; w06 fills its extra time with RH134 ch07 archiving instead. See
  `w06-porting.md`.
- **w06 already teaches booleans.** w07's lesson plan agenda lists "Managing
  Network Security - SELinux Booleans", but `selinux-booleans.md` covers them
  in w06, so w07 can treat them as review.
- **`httpd` state.** w06's plan removes `httpd` at the end of its last
  exercise on each host (decided 2026-09-17), so w07 starts with it absent on
  both `workstation` and `servera`. w07's "Allow HTTP Traffic" exercise
  installs it on `servera`, as the source already does.
- **The fragment directory.** The port fragment was planned for
  `course/chapters/rh134-ch14-managing-network-security/`, where the firewalld
  fragments would also live.
- **Alignment.** In w06 the plan aligned this fragment to the cert guide only,
  to keep RH134 ch14 out of w06's reading list. That reason is gone in w07, so
  align it to RH134 chapter `"14"` (*Managing Network Security*) and to RHCSA
  Cert Guide chapter `"22"` (*Managing SELinux*), which covers port labeling.

## Planned so far: `selinux-port-labels.md` (8 slides)

`routeAlias: selinux-port-labels`. Covers the RHCSA objective "Manage SELinux
port labels". It keeps the w07 source's order: the URL slide, the exercise
that fails, the SELinux port slide, and the exercise that fixes it.

This was planned as a standalone w06 section, so it removed the firewall steps
and tested everything with `localhost`. In w07 it follows the firewalld
material, so the firewall steps can stay as the source has them. Items that
only made sense in w06 are marked below. Whether the URL slide belongs here or
with the firewall "Open Ports" section is still open.

In the component lists, a "fixed" `TerminalWindow` shows a transcript that
never changes and takes no `rows`. A "Magic Move" terminal grows across clicks
and takes `rows` equal to its final line count.

##### P.1 SELinux Port Labels

New section slide. Subtitle "Ports are targets too".

Components: `section`.

##### P.2 Specifying a Port in a URL

w07 slide. The pattern `http://hostname:port/path`, a table of the default,
with-port, and with-path forms for `servera`, and "if no port is given, the
browser uses the scheme's default: 80 for `http`, 443 for `https`".

Components: default layout, blockquote, table.

##### P.3 Exercise: Configure Apache to Listen on 8888

w07 exercise slide. Hosts `workstation` to `servera`. Goal: configure `httpd`
on `servera` to listen on port 8888. Steps: configure `firewalld` to allow
8888/tcp, modify `httpd` to listen on 8888, attempt to access the web service
on 8888, and troubleshoot the failed service startup.

Components: `exercise`. (The w06 plan dropped the `firewalld` step and tested
from `servera`; w07 keeps the source.)

##### P.4 Exercise: Configure Apache to Listen on 8888 (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `configure_apache_to_listen_on_8888.sh`. Like the source, it ends at
the `sealert` diagnosis. Correction: the script's comments say
"workstation ---> servera", but it never connects to `servera` before its
`firewall-cmd` and `httpd.conf` steps. It needs an `ssh student@servera` at
the start.

##### P.5 Guess Who's Back, Back Again. SELinux

w07 slide. SELinux controls what processes can access. Like files, ports are
a target domain, and they need labels so source domains can reach them. "View
port labels", then `semanage port -l | grep http` with its abridged output.

Components: `two-cols-header` with the text and `TerminalWindow` (fixed) on
the left and the dial photograph on the right, standing in for the source's
`image-right` layout. Correction: "whose" becomes "Who's". The output was
confirmed on the lab.

##### P.6 Labeling a Port

**Addition** (cert guide, RHA ch14 s03). The next exercise runs
`semanage port -a` without a slide introducing it. Steps through
`semanage port -a -t http_port_t -p tcp 82`: add, type, protocol, and port. It
takes effect at once with no `restorecon`, `-l -C` shows it, and `-d` removes
it. Port 82 is used because the cert guide's 8008 is already labeled.

Components: `TextExplainer` (`lg`), `Callout type="warning"`.

##### P.7 Exercise: Configure SELinux to Allow HTTP on 8888

w07 exercise slide. Hosts `workstation` to `servera`. Goal: configure SELinux
on `servera` to allow HTTP on port 8888. Steps: inspect the SELinux
configuration, allow `http` on 8888, and verify.

Components: `exercise`.

##### P.8 Exercise: Configure SELinux to Allow HTTP on 8888 (recording)

Components: `exercise` with `variant: recording`, `AsciinemaPlayer`. Command
file from `configure_selinux_for_http_on_8888.sh`, with its remote `curl` from
`workstation` kept. (The w06 plan replaced it with `localhost`.)

## Third-party image: dial photograph

w07's `selinux_hero.jpg` (2048 x 1457, three dials on a grey background) looks
like a stock photo, and its source is not recorded. `AGENTS.md` bars assets
with unclear publication rights, and `docs/course-authoring.md` requires a
publication basis and attribution near the asset. Before it lands as
`rh134-ch14-managing-network-security/assets/selinux-hero.jpg`, record where it
came from and its license, and caption it the way
`rh134-ch07-archiving-files/archives.md` captions its tape photograph. If that
is not possible, P.5 becomes a text-and-terminal slide.

## Verification so far

Already checked on the lab (RHEL 10.0, 2026-09-17):

- `semanage port -l | grep http` on `servera` matches the source slide exactly:

  ```text
  http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
  http_cache_port_t              udp      3130
  http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443, 9000
  ```

- Ports 82, 8888, and 3456 are unlabeled on `servera`. Port 8008 is already
  `http_port_t`.
- `httpd` and `setroubleshoot-server` are not installed on `servera`.
  `setroubleshoot-server` is installed on `workstation`.
- `firewalld` is active on `workstation`.

Still to verify:

- The `systemctl status httpd` lines for a bind failure on 8888.
- The `sealert` `bind_ports` plugin text on RHEL 10.
- Whether `semanage port -m` can relabel a port the base policy already
  labels. The cert guide says use `-m`, and RHA says default port labels
  cannot be changed. P.6's `Callout` waits on this.
- The `Listen 80` line in `httpd.conf` on `httpd` 2.4.63.
