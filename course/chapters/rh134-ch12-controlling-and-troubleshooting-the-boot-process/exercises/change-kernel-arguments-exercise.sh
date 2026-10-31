kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 10
#^ Exercise: Change Kernel Arguments
# Requirements
#   Host: servera, with its VM console open for the GRUB2 menu
#   Boot servera once with an extra kernel argument, then make it persistent
# Steps
#   1. Make the GRUB2 menu appear on every boot
#   2. Boot once with ipv6.disable=1 added at the GRUB2 menu
#   3. Confirm the argument with /proc/cmdline and ip -br addr
#   4. Reboot without editing and confirm the argument is gone
#   5. Add ipv6.disable=1 persistently with grubby
#   6. Reboot and confirm the argument is still there
#   7. Remove the argument with grubby
clear

#^ 1. Make the GRUB2 menu appear on every boot
sudo -i
#@ pause 5
grub2-editenv - list
grub2-editenv - unset menu_auto_hide
#! menu_auto_hide is gone, so GRUB2 shows the menu and its countdown on every boot
#@ pause 5
grub2-editenv - list
clear

#^ 2. Boot once with ipv6.disable=1 added at the GRUB2 menu
#! Bring the servera console window forward before rebooting
#! At the menu, press any key except Enter to stop the countdown, then press e
#! Move down to the line that starts with linux and press End
#! Type a space and ipv6.disable=1, then press Ctrl+X to boot
#! When recording, make this edit in the console during the pause
#@ pause 45
systemctl reboot
ssh servera
clear

#^ 3. Confirm the argument with /proc/cmdline and ip -br addr
#! /proc/cmdline holds the arguments the running kernel booted with; ipv6.disable=1 is last
#@ pause 5
cat /proc/cmdline
#! No inet6 addresses: IPv6 is off for this boot
#@ pause 5
ip -br addr
clear

#^ 4. Reboot without editing and confirm the argument is gone
#! Let the countdown run out this time
#@ pause 25
sudo systemctl reboot
ssh servera
#! ipv6.disable=1 is gone, and the fe80:: addresses are back: the edit lasted one boot
#@ pause 5
cat /proc/cmdline
#@ pause 5
ip -br addr
clear

#^ 5. Add ipv6.disable=1 persistently with grubby
sudo -i
grubby --default-kernel
#! grubby prints nothing when it succeeds
grubby --update-kernel $(grubby --default-kernel) --args="ipv6.disable=1"
#! args now ends with ipv6.disable=1
#@ pause 5
grubby --info $(grubby --default-index)
clear

#^ 6. Reboot and confirm the argument is still there
#! Let the countdown run out: no edit at the menu this time
#@ pause 25
systemctl reboot
ssh servera
#@ pause 5
cat /proc/cmdline
#@ pause 5
ip -br addr
clear

#^ 7. Remove the argument with grubby
sudo -i
grubby --update-kernel $(grubby --default-kernel) --remove-args="ipv6.disable=1"
#! args ends with rd.lvm.lv=rhel_servera/swap again
#! The running kernel keeps IPv6 off until the next boot
#@ pause 5
grubby --info $(grubby --default-index)

# Complete
