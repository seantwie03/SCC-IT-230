# Lab environments

Three RHEL 10.0 environments carry this course. Students use two of them; the
third exists so material can be verified and recorded before it ships.

Everything below was measured on 2026-09-26 by running a read-only survey on
`workstation`, `servera`, and `serverb` in each environment. Where a statement
is about how an environment is built rather than what it reports, it says so.

## Why there are three

The Red Hat Academy lab came first, and it is still where the guided exercises
and RHA labs live. Those exercises are good, and their real advantage is
pre-staging: Red Hat can hand a student a machine that already has Apache
running on a non-standard port, so the exercise is purely "troubleshoot SELinux
and fix the server" instead of an hour of setup first. The catch is the clock.
Each student gets 60 hours per semester, and when the RHA lab was the only
environment, students regularly ran past it.

The SCC lab was added so practice is unlimited. It runs in VirtualBox, on the
SCC VDI. The VDI is a decent environment but a slow one: signing in and getting
`workstation` and `servera` booted can take five minutes. That is why every
week opens with a slide reminding students to start their VMs before class.

The instructor lab exists for delivery. Demonstrations are recorded with
`kitty-demo` at presentation font sizes, and that needs a machine under the
instructor's control to look the way it should. It doubles as the verification
environment, reachable from this repository through `pnpm lab`. Students never
see it, and no material should describe it as though they will.

## What is the same everywhere

All three run RHEL 10.0 on the 172.25.250.0/24 network, with the same host
names and addresses:

| Host                          | Address       |
|-------------------------------|---------------|
| `workstation.lab.example.com` | 172.25.250.9  |
| `servera.lab.example.com`     | 172.25.250.10 |
| `serverb.lab.example.com`     | 172.25.250.11 |
| `serverc.lab.example.com`     | 172.25.250.12 |

`serverc` is not currently working in the RHA lab. Design content for
`workstation` plus `servera` unless the topic genuinely needs more.

Every host boots BIOS. SELinux is `Enforcing` on all of them. `firewalld` is
enabled and active on all of them, with `public` as the default zone allowing
`cockpit`, `dhcpv6-client`, and `ssh`; RHA's `workstation` also allows
`pulseaudio`. Both `servera` and `serverb` carry three blank 5 GB disks for
storage work, whatever the environment calls them.

Credentials match everywhere:

| Username  | Password  |
|-----------|-----------|
| `root`    | `redhat`  |
| `student` | `student` |

Both passwords are set and neither account is locked, so `su -` works. SSH
between hosts is key-based and passwordless for both `student` and `root` in
every environment. Package installation works everywhere, from the RHEL 10.0
BaseOS and AppStream repositories.

## The Red Hat Academy lab

Hosted, operated, and controlled by Red Hat, and reached through a web browser.
Students use it for the RHA guided exercises and labs, within their 60-hour
allowance.

`servera` and `serverb` each carry a second interface, `ens4`, which is
connected to nothing and holds no IPv4 address. It exists so Red Hat's network
configuration exercises have something to configure. `workstation` instead
carries `tun0`, the VPN link that reaches the hosted classroom.

The browser terminal starts the shell from a service, so a student's shell runs
in the `system_u:system_r:unconfined_service_t` SELinux context rather than the
`unconfined_u:unconfined_r:unconfined_t` seen elsewhere. Any slide that prints
`id -Z` will not match there.

### How it is built

Unknown, and not our business. Red Hat produces the images and resets them when
a student restarts a lab. Nothing in this repository should assume anything
about that process beyond what the survey measured.

## The SCC lab

Up to four RHEL 10 virtual machines in VirtualBox, on the SCC VDI. This is the
target for all custom content in this repository: demonstrations, slide examples,
and exercises.

Each machine has two interfaces. `enp0s3` is a NAT link at 10.0.2.15, the same
address on every machine, which is how the VM reaches the internet.  `enp0s8`
is the lab interface on 172.25.250.0/24, and it is the one that carries a
student's SSH session. Both sit in the `public` firewall zone, so
`firewall-cmd --get-active-zones` there lists two interfaces where the other
environments list one.

The nominal VM sizes are 2 CPUs and 4096 MB for `workstation` and 1 CPU and
2048 MB for each server. What a running machine reports through `free -h` is
lower, because that is memory the hypervisor has actually made usable.

### How it is built

From <https://github.com/seantwie03/rhel-lab/tree/ansible_kickstart>, but by
hand rather than automatically. After a manual RHEL install, the commands in
the
[kickstart file](https://github.com/seantwie03/rhel-lab/blob/ansible_kickstart/files/ks-server.cfg.j2)
are run manually. The resulting VirtualBox VMs were then exported by the
instructor and imported by the VDI administrator.

Two consequences follow. The images on the VDI are a snapshot of one moment
rather than a rebuild from source, so when the kickstart changes, the VDI does
not change with it until someone exports and re-imports. And a student running
the lab locally may be on a different generation of the same image than the one
on the VDI.

## The instructor lab

KVM virtual machines on the instructor's own hardware, reached from this
repository through `pnpm lab`. It exists so commands and their output can be
checked against a real RHEL 10 host before they reach a slide, and so
demonstrations can be recorded at presentation font sizes.

Its disks are virtio, so the kernel names them `vda` through `vdd`. A udev rule
adds an `sd` symlink for every device and partition:

```text
# KVM uses /dev/vd[a-z]. Demos and students use /dev/sd[a-z].
# Create symlinks so drives are accessible via either vd[a-z] or sd[a-z].
KERNEL=="vda", SYMLINK+="sda"
...
```

That rule is the only file in `/etc/udev/rules.d/`. Nothing renames interfaces
in any environment.

### How it is built

From the same repository as the SCC lab, automated through
[`create_vms.yml`](https://github.com/seantwie03/rhel-lab/blob/ansible_kickstart/create_vms.yml).
Because it is rebuilt from source rather than exported once, it is the
environment that most closely matches what the kickstart currently describes.

## Differences that reach the screen

Four differences change what a student types or sees. A transcript that ignores
them sends someone to a machine that does not match.

### Network interfaces

Nothing renames interfaces anywhere. The names differ because the virtual
hardware differs.

| Environment | Interface carrying the session | Also present                                                  |
|-------------|--------------------------------|---------------------------------------------------------------|
| RHA         | `ens3`                         | `ens4`, disconnected, on the servers; `tun0` on `workstation` |
| SCC         | `enp0s8`                       | `enp0s3`, the NAT link at 10.0.2.15                           |
| Instructor  | `enp1s0`                       | none                                                          |

On RHA every interface also answers to altnames, so `ens3` is also `enp0s3`.
That makes a bare `enp0s3` ambiguous: on RHA it is an altname for the lab
interface, and on SCC it is the NAT link.

Material should teach the name as something you look up, with
`nmcli device status` or `ip -br a`, and then use what it reports. Anything
that moves an interface between firewall zones must act on the interface
carrying the student's own session; the others are a NAT link, a VPN, or an
unconfigured spare, and moving them teaches nothing.

### Disks and partitioning

Both student environments present SATA-style names. Only the instructor lab is
virtio.

| Environment | OS disk | Blank disks | OS layout |
| --- | --- | --- | --- |
| RHA | `sda` | `sdb`, `sdc`, `sdd` | 1 MB, a 200 MB EFI partition at `/boot/efi`, then root. No LVM, no swap partition, no separate `/boot` |
| SCC | `sda` | `sdb`, `sdc`, `sdd` | 1 MB, 1 GB `/boot`, then LVM holding root and swap |
| Instructor | `vda`, symlinked `sda` | `vdb`, `vdc`, `vdd`, symlinked `sdb`-`sdd` | Same as SCC |

Every environment boots BIOS, yet the RHA image carries an EFI partition
mounted at `/boot/efi`. A student running `lsblk` there sees an ESP that is not
being used to boot.

The blank disks are the portable part: three 5 GB disks on `servera` and
`serverb` everywhere. Partitioning and LVM exercises should use those and leave
the OS disk alone. Anything that prints `lsblk`, `df`, or the layout of `/boot`
matches only the environment it came from.

Red Hat's own storage text says `/dev/vdb`, which comes from the RHEL 9.3 era
material in the instructor's source repository. The RHEL 10 RHA lab presents
`sdb`. Verify before quoting a device name from curriculum text.

### `sudo`

This is the difference most likely to stall a demonstration.

On the RHA lab, `student` is prompted for a password on every host. `/etc/sudoers`
grants `%wheel ALL=(ALL) ALL`, and the `NOPASSWD` line is commented out. Red
Hat's own lab plumbing is exempt, through a rule granting `NOPASSWD` to
`/usr/local/lib/lab-*`, `/usr/local/lib/demo-*`, `/bin/curl`, and `/bin/chmod`,
but nothing a student types is.

On the SCC and instructor labs, `/etc/sudoers.d/student` grants
`student ALL=(ALL) NOPASSWD: ALL`, so `sudo` never prompts.

Write material that tolerates a prompt. A command file that assumes silent
`sudo` works in two environments and stops in the third.

### SSH and keys

All three permit root login over SSH and accept passwords, and in all three
both users reach every other host without one, so the difference is in how.

| Environment | Key | `PermitRootLogin` | `AuthorizedKeysFile` |
| --- | --- | --- | --- |
| RHA | `~/.ssh/lab_rsa`, named in `~/.ssh/config` | `without-password` | `/etc/.rht_authorized_keys` then `.ssh/authorized_keys` |
| SCC | `~/.ssh/id_rsa` and `~/.ssh/lab_rsa` | `yes` | `.ssh/authorized_keys` |
| Instructor | `~/.ssh/id_rsa` | `yes` | `.ssh/authorized_keys` |

On RHA, `/root/.ssh/authorized_keys` is empty; root logins work because
`/etc/.rht_authorized_keys` supplies the key. No environment runs an SSH agent,
so passwordless access comes from the key file, not from a cached identity.

Material should never name a key file.

### Installed packages

`servera` starts without `httpd`, `mod_ssl`, and `setools-console` in all three
environments, so any exercise using Apache or `sesearch` installs them first.

The instructor lab starts leaner still: `setroubleshoot-server`, `bzip2`,
`acl`, and `nmap-ncat` are present on the student labs and absent there. A
demonstration recorded on the instructor lab may therefore need an install step
that students do not, which is worth checking before assuming a missing package
is a student problem.

## Writing material that works in all three

- Look the interface up with `nmcli device status` rather than hard-coding it,
  and say which environment a transcript came from when it shows one.
- Use the blank `sdb` through `sdd` disks for storage work; leave the OS disk
  alone.
- Assume `sudo` may prompt.
- Never name a key file.
- Check a package is present before using it, or install it as a step.
- Verify commands and output against a real host, per the `lab-verification`
  skill, and remember that `pnpm lab` reaches the environment least like the
  students'.

## Re-surveying the labs

Two read-only scripts produced everything above. Keeping them means the next
person answering this question transcribes rather than investigates.

The first collects the environment: OS and kernel, CPU and memory, boot mode,
interfaces, disks and LVM, firewall state, SELinux mode, a fixed list of
packages, repositories, and time settings.

The second collects authentication: group membership, passwordless SSH tests to
the other hosts, key files present, whether `sudo` prompts, the sudoers rules
that decide it, password status for `root` and `student`, and the effective
`sshd` settings.

Both live in the `rhel-lab` repository alongside the build automation. Two
cautions when running them. Run `sudo -k` before the `sudo` probe, or a cached
timestamp from an earlier command reports passwordless when it is not. And
paste them into a browser terminal in one piece: a dropped character during a
long paste produces a syntax error partway through, so check the output ends
with its `END` marker.

## Making them more alike

The SCC and instructor labs are under the instructor's control, so the
differences between them, and between them and RHA, are choices rather than
facts. In rough order of payoff:

**Cheap, no rebuild.** Rename the lab interface with a systemd `.link` file so
the instructor lab stops being the only place called `enp1s0`; matching `ens3`
in both student-facing directions would let one transcript serve every
environment, which is the single biggest source of friction in this course.
Standardise on one key name, `lab_rsa`, so material can name it. Set
`PermitRootLogin prohibit-password` on SCC and the instructor lab to match RHA.
Keep patch levels in step: RHA currently runs a newer kernel than the other
two.

**Needs a rebuild or a VM setting.** Attach the instructor lab's disks on a
SATA or SCSI bus so they appear as `sda` through `sdd` natively, which would
retire the `sd` symlink rule, a difference that exists only to paper over
another difference. Add a second, disconnected interface to `servera` and
`serverb` in both labs, matching RHA's `ens4`, so network configuration
exercises have something safe to configure. Consider switching to UEFI, which
would match both the RHA image's ESP and modern hardware.

**Judgement calls.** Making `sudo` prompt on SCC and the instructor lab would
match RHA and catch assumptions early, at the cost of slowing every recording.
Dropping LVM from the OS disk would make storage transcripts portable, but
having a real volume group on a machine students already own is useful when
teaching LVM, so this one probably resolves the other way.

**Process.** Build the SCC images from the same automation as the instructor
lab rather than running kickstart commands by hand, so both derive from one
source, and run both survey scripts after every build, keeping the output in
the `rhel-lab` repository. Then this document becomes a transcription rather
than an investigation.
