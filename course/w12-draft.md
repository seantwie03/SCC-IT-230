---
theme: it230
themeConfig:
  it230Accent: green
routerMode: hash
title: Controlling the Boot Process and Root Password Reset
layout: cover
courseInfo:
  summary: >-
    This week we will follow a RHEL system from power-on to the login prompt,
    change how GRUB2 starts the kernel, choose which systemd target the system
    boots into, repair a broken /etc/fstab from an emergency shell, and reset a
    lost root password.
---

::kicker::

Week 12

::default::

# IT-230

- GRUB2 Boot Loader
- systemd Targets
- Repairing File Systems at Boot
- Recovering Superuser Access

---
layout: section
---

Start `workstation` and `servera` on your VDI

---
src: ./chapters/rh134-ch12-controlling-and-troubleshooting-the-boot-process/grub2-boot-loader.md
---
