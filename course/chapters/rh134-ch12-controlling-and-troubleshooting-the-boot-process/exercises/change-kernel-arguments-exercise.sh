kitten @ action --self change_font_size current 30 && ssh servera
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
#! Students do this step in the servera VM window
#! Attach to the serial console straight after the reboot: GRUB2 draws its menu once, under 2 seconds in
#@ pause 0.5
systemctl reboot
#@ noenter
#@ pause 0
virsh -c qemu:///system console servera
#! Press F2 promptly after this: the countdown runs 5 seconds
#@ pause 2
#@ key enter
#! Any key except Enter stops the countdown; up keeps the default entry highlighted
#@ key up
#! e opens the highlighted entry in the editor
#@ key e
#! Three lines down is the line that starts with linux, which wraps onto the next screen lines
#@ key down
#@ key down
#@ key down
#! End jumps to the end of the linux line
#@ key end
#! The leading space separates ipv6.disable=1 from the last argument
#@ noenter
#@ pause 5
 ipv6.disable=1
#! Ctrl+X boots with the edit; it lasts this one boot
#@ pause 20
#@ key ctrl+x
#! Detach from the serial console once the login prompt appears
#@ key ctrl+]
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
#! ipv6.disable=1 is gone from args
#! The running kernel keeps IPv6 off until the next boot
#@ pause 5
grubby --info $(grubby --default-index)

# Complete
