# Lab environments

Three RHEL 10.0 environments carry this course. Students use two of them; the
third exists so material can be verified and recorded before it ships.

Everything below was measured on 2026-09-26 by running a read-only survey on
`workstation`, `servera`, and `serverb` in each environment. The instructor lab
was rebuilt on 2026-10-17 to match the SCC lab's disk names, interface name,
and key files, and was re-checked through `pnpm lab` the same day. Where a
statement is about how an environment is built rather than what it reports, it
says so.

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
environment, reachable from this repository through `pnpm lab`. Students see
this lab constantly, because it is the one in every recorded demonstration;
they just never log in to it.

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
student's SSH session. They are VirtualBox's adapter 1, attached to NAT, and
adapter 2, attached to the Internal Network named `intnet`, which every lab VM
joins. Both sit in the `public` firewall zone, so
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

Its virtual hardware is laid out so the kernel names devices the way the SCC
lab does. The disks sit on the SATA controller, so they are `sda` through `sdd`
natively, and the lab interface sits directly on PCI bus 0 at slot 8, so it is
`enp0s8`. Nothing renames anything: `/etc/udev/rules.d/` is empty, and no
environment renames its interfaces.

Before the 2026-10-17 rebuild the disks were virtio, named `vda` through `vdd`
with a udev rule adding `sd` symlinks, and the interface was `enp1s0`.
Transcripts and recordings made before then show those names.

Each VM also has a serial port (`ttyS0`, a 16550A) that libvirt exposes as a
`pty`, so `virsh -c qemu:///system console <vm>` attaches to it from the host.
Plain `virsh` connects to the session URI and finds no VMs. Since 2026-11-03
every VM uses that port as its console, so `kitty-demo` can present and record
console steps (the GRUB2 menu, the rescue and emergency shells, and
`init=/bin/bash`) in the Presentation window:

- GRUB2 reads from and draws on both the VGA console and the serial port:
  `GRUB_TERMINAL_INPUT` and `GRUB_TERMINAL_OUTPUT` are `"console serial"`, and
  `GRUB_SERIAL_COMMAND` is `"serial --unit=0 --speed=115200"`.
- Every boot entry, and `GRUB_CMDLINE_LINUX`, ends with `console=tty0
  console=ttyS0,115200`. The last `console=` becomes `/dev/console`, so
  systemd's status lines, the rescue and emergency shells, the
  `init=/bin/bash` shell, and the relabel output go to the serial port. A
  serial login prompt (`serial-getty@ttyS0`) runs as well.
- `emergency.service` and `rescue.service` each carry a drop-in,
  `serial-size.conf`, setting `TTYColumns=120`, `TTYRows=24`, and
  `TERM=xterm-256color`. Without it those shells get 80 columns and `vt220`,
  and `vim` draws at the wrong width and without an alternate screen.

Three side effects. GRUB2's `12_menu_auto_hide` script skips itself when a
terminal setting includes `serial`, so the menu shows on every boot and
`menu_auto_hide` does nothing, although `grubenv` still holds
`menu_auto_hide=1` and `grub2-editenv` prints what it prints elsewhere. The VM
window shows only kernel messages, since systemd writes to `/dev/console`
alone; `sulogin` still prompts in both places, but the `init=/bin/bash` shell
opens on the serial port only. And the serial login gets `TERM=vt220`, so `ls`
shows no colour there.

### How it is built

From the same repository as the SCC lab, automated through
[`create_vms.yml`](https://github.com/seantwie03/rhel-lab/blob/ansible_kickstart/create_vms.yml),
which also sets the disk bus and the interface's PCI slot. Because it is
rebuilt from source rather than exported once, it is the environment that most
closely matches what the kickstart currently describes.
[`configure_vms.yml`](https://github.com/seantwie03/rhel-lab/blob/ansible_kickstart/configure_vms.yml)
then applies the `base` and `serial_console` roles, and the instructor takes
the snapshot that `start-latest-snapshot` reverts to. The serial settings are
in that snapshot, so a revert keeps them.

## Differences that reach the screen

These differences change what a student types or sees. A transcript that
ignores them sends someone to a machine that does not match.

### Network interfaces

Nothing renames interfaces anywhere. The names differ because the virtual
hardware differs.

| Environment | Interface carrying the session | Also present                                                  |
|-------------|--------------------------------|---------------------------------------------------------------|
| RHA         | `ens3`                         | `ens4`, disconnected, on the servers; `tun0` on `workstation` |
| SCC         | `enp0s8`                       | `enp0s3`, the NAT link at 10.0.2.15                           |
| Instructor  | `enp0s8`                       | none                                                          |

The instructor lab's interface sits where VirtualBox puts the SCC lab's, so the
two share `enp0s8`. Only SCC also carries the NAT link.

On RHA every interface also answers to altnames, so `ens3` is also `enp0s3`.
That makes a bare `enp0s3` ambiguous: on RHA it is an altname for the lab
interface, and on SCC it is the NAT link.

Material should teach the name as something you look up, with
`nmcli device status` or `ip -br a`, and then use what it reports. Anything
that moves an interface between firewall zones must act on the interface
carrying the student's own session; the others are a NAT link, a VPN, or an
unconfigured spare, and moving them teaches nothing.

### Disks and partitioning

All three environments present SATA-style names.

| Environment | OS disk | Blank disks | OS layout |
| --- | --- | --- | --- |
| RHA | `sda` | `sdb`, `sdc`, `sdd` | 1 MB, a 200 MB EFI partition at `/boot/efi`, then root. No LVM, no swap partition, no separate `/boot` |
| SCC | `sda` | `sdb`, `sdc`, `sdd` | 1 MB, 1 GB `/boot`, then LVM holding root and swap |
| Instructor | `sda` | `sdb`, `sdc`, `sdd` | Same as SCC |

The table shows the usual order, not a guaranteed one. The kernel names `sd`
disks in the order their asynchronous probes finish, so a fresh boot can name
them differently, as RH134's storage chapter warns. Measured on the instructor
lab's `servera` on 2026-11-01, 6 of 51 boots named the OS disk `sdd`: 1 of 30
with nothing reading its serial console, and 5 of 21 while `virsh console` was
attached. Each time, the blank disks moved up to `sda`, `sdb`, and `sdc` in
port order. A snapshot revert does not boot, so it keeps the names the
snapshot was taken with; only a reboot can reorder them. If `lsblk` shows the
10 GB OS disk under any name but `sda`, reboot before a storage demonstration
or recording. Whether the SCC lab's VirtualBox disks reorder the same way has
not been measured.

The one part of `parted print` that still differs from SCC is the `Model:`
line, which reads `ATA QEMU HARDDISK` on the instructor lab; VirtualBox reports
its own model name.

The volume group holding root and swap is named differently: `rhel` on SCC's
`servera` and `workstation`, and `rhel_` plus the host name on the instructor
lab (`rhel_servera`, `rhel_workstation`). Root is therefore
`/dev/mapper/rhel-root` on SCC and `/dev/mapper/rhel_servera-root` on the
instructor lab's `servera`, and the name shows in `mount`, `df`, `lsblk`,
`lvs`, `/proc/cmdline`, and `grubby --info`.

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
| Instructor | `~/.ssh/id_rsa` and `~/.ssh/lab_rsa`, one key under both names | `yes` | `.ssh/authorized_keys` |

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

The gap is deliberate. The install step shows students the package name, and
the machines in the RHCSA exam may not have these packages installed either.

`plymouth`, the boot splash, is a difference of another kind: SCC's `servera`
shows it, while the instructor lab has it on `workstation` only. See "Booting
and the console".

### Booting and the console

Found on 2026-11-01 while checking week 12's console steps on the SCC lab's
VDI and on the instructor lab.

SCC's `servera` and `serverb` boot with `rhgb quiet` on the kernel line, and
`servera`'s VM window showed a Plymouth splash while it booted; <kbd>Esc</kbd>
switches it to the boot messages. That matters whenever an exercise has
students watch a boot: on SCC, the 90-second wait for a missing device sat
behind the splash until <kbd>Esc</kbd>. The instructor lab's `workstation`
behaves the same way, but its `servera` has neither `rhgb quiet` nor the
`plymouth` package, so it prints every kernel and systemd message as text. The
kernel line therefore differs in `/proc/cmdline`, in `grubby --info`, and in
the GRUB2 editor.

The `console=` arguments differ too. SCC's kernel line has none. The
instructor lab's ends with `console=tty0 console=ttyS0,115200` on every VM
(see "The instructor lab"), so its recordings show them in `/proc/cmdline`,
`grubby --info`, and the GRUB2 editor. RH134's own `grubby --info` example
shows `console=tty0 console=ttyS0,115200n8 no_timer_check`, which suggests the
RHA lab's VMs carry a serial console as well; that has not been checked on the
RHA lab itself. Material that edits the kernel line in GRUB2 should not ask
students to remove `console=` options, since SCC has none and the instructor
lab keeps its own.

`quiet` also lowers the console log level. The instructor lab's `servera`
(`kernel.printk` `7 4 1 7`) prints kernel notices on its console, such as
`XFS (sda2): Mounting V5 Filesystem ...` after a `mount`; SCC's servers do
not. Warnings still reach the SCC console: `Warning: Unmaintained driver is
detected: e1000` during `servera`'s boot, three `vmwgfx ... [drm]
*ERROR*` lines about an unsupported hypervisor on `workstation`'s rescue
screen, and, in emergency mode, `[FAILED] Failed to start kdump.service` just
above the emergency banner.

Both target labs start with `menu_auto_hide=1` in `/boot/grub2/grubenv`
(checked on SCC's `serverb` and the instructor lab's `servera` and
`workstation`). On SCC the menu therefore stays hidden after a successful
boot until an exercise unsets it. On the instructor lab the serial terminal
setting disables that behaviour, so the menu shows on every boot either way.
SCC's boot entries end their `initrd` line with `$tuned_initrd`, which the
instructor lab's lack; it shows in the GRUB2 editor. Over the serial console,
GRUB2 draws its frame with `+`, `-`, and `|` and its help line with `^` and
`v`, where the VM window uses line-drawing characters and arrows; the text and
the 78-column wrap of the `linux` line are the same.

The SCC lab is much slower at boot-time work. On the VDI, `servera` took about
40 seconds from `systemctl reboot` to the wait for a missing device, against
about 18 on the instructor lab, whose menu appears under 2 seconds after the
reboot. A full SELinux relabel took 2 minutes 3 seconds on the VDI and about 6
seconds on the instructor lab. A class following a live demonstration falls
behind at those points.

### Prompt and editor

SCC's prompt already has the slides' form, `student@servera:~$`, in colour.
The instructor lab keeps RHEL's default, `[student@servera ~]$`, which is what
every recording shows.

`root` and `student` on the instructor lab have the same `~/.vimrc`. It turns on line numbers and draws each space as a faint dot (`set list`); SCC's `root` has none, so `vim` there shows plain text. Those dots are what `pnpm run casts` replaces with spaces in recordings.

The same file stops `vim` from continuing a comment onto a new line (`formatoptions-=r` and `formatoptions-=o`). RHEL's stock `vim` does continue one, so after `#!/bin/bash`, pressing <kbd>Enter</kbd> or `o` starts the next line with `#`. Recordings never show that `#`, but a student without the file sees it, so material that has students type a hashbang in `vim` says how to remove it.

## Writing material

Material in this repository targets the SCC lab, and has to run on the
instructor lab as well, because that is where it is verified and recorded. It
does not have to run on the RHA lab: students go there for Red Hat's own
exercises, which come with their own instructions. `sudo` and SSH are
passwordless in both environments this repository targets, so material can rely
on that.

RHA still matters for what students carry between environments. A student who
learns an interface name rather than how to look one up will be stuck the first
time they open a Red Hat exercise, which is why the interface table appears in
the week 7 material.

- Look the interface up with `nmcli device status` rather than hard-coding it,
  and say which environment a transcript came from when it shows one. The SCC
  and instructor labs agree on `enp0s8`, but RHA does not, and SCC also carries
  a NAT link.
- Use the blank `sdb` through `sdd` disks for storage work; leave the OS disk
  alone. Both target environments name them the same way on a normal boot, but
  a reboot can reorder them (see "Disks and partitioning"), so start storage
  exercises with `lsblk`.
- Expect a splash screen when an SCC server boots. A written exercise that has
  students watch the console during a boot should tell them to press
  <kbd>Esc</kbd>, and should not promise kernel messages that `quiet` hides
  there.
- Keep the volume group name out of instructions, or have students look it
  up: it is `rhel` on SCC and `rhel_` plus the host name on the instructor lab.
- Allow for SCC's speed: a reboot or relabel that takes seconds on the
  instructor lab takes minutes on the VDI.
- Never name a key file. SCC and the instructor lab carry both `id_rsa` and
  `lab_rsa`, while RHA carries only `lab_rsa`, so `ssh` finds its key
  differently in each.
- Check a package is present before using it, or install it as a step. The
  instructor lab starts leaner than the SCC lab, on purpose.
- Verify commands and output against a real host, per the `lab-verification`
  skill, and remember that `pnpm lab` reaches the instructor lab, which is the
  one students watch but never log in to.
- Write `kitty-demo` command files for the instructor lab, because that is
  where they are recorded and replayed. Its disk and interface names now match
  the SCC lab, so a student following along types what the recording shows.
  The names still differ the moment they open a Red Hat exercise, so the habit
  of looking names up is still worth building.

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

They are meant to live in the `rhel-lab` repository beside the build
automation, but as of 2026-10-17 neither is committed there, in any branch. Two
cautions when running them. Run `sudo -k` before the `sudo` probe, or a cached
timestamp from an earlier command reports passwordless when it is not. And
paste them into a browser terminal in one piece: a dropped character during a
long paste produces a syntax error partway through, so check the output ends
with its `END` marker.

## Making them more alike

The SCC and instructor labs are under the instructor's control, so the
differences between them, and between them and RHA, are choices rather than
facts.

**Done on 2026-10-17.** The instructor lab was rebuilt with its disks on the
SATA bus, which retired the `sd` symlink rule; with its lab interface on PCI
bus 0 at slot 8, so it is `enp0s8` like SCC's; and with `lab_rsa` beside
`id_rsa` for both users. SCC's NAT link was not copied, because libvirt cannot
give every VM the same 10.0.2.15 address the way VirtualBox does. The packages
the student labs carry and the instructor lab does not stay uninstalled on
purpose (see "Installed packages").

What remains, in rough order of payoff:

**Cheap, no rebuild.** Matching RHA's `ens3` in both labs would let one
transcript serve every environment, which is the single biggest source of
friction in this course. Set `PermitRootLogin prohibit-password` on SCC and the
instructor lab to match RHA. Keep patch levels in step: RHA currently runs a
newer kernel than the other two.

**Needs a rebuild or a VM setting.** Add a second, disconnected interface to
`servera` and `serverb` in both labs, matching RHA's `ens4`, so network
configuration exercises have something safe to configure. Consider switching to
UEFI, which would match the RHA image's ESP and modern hardware, though every
SCC host boots BIOS, so it would move the instructor lab away from SCC.

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
