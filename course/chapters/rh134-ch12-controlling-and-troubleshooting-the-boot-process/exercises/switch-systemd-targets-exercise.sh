kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Switch systemd Targets
# Requirements
#   Host: workstation, with its VM console open
#   Switch workstation between targets now, by default, and for a single boot
# Steps
#   1. Make the GRUB2 menu appear on every boot
#   2. Inspect the default target and its dependencies
#   3. Switch to multi-user.target without rebooting
#   4. Make multi-user.target the default and reboot to confirm
#   5. Restore graphical.target as the default
#   6. Boot once into rescue.target from the GRUB2 menu
#   7. Confirm the root file system is read/write, then continue the boot
clear

#^ 1. Make the GRUB2 menu appear on every boot
sudo -i
grub2-editenv - unset menu_auto_hide
#! menu_auto_hide is gone, so the menu and its countdown appear at every boot
#@ pause 5
grub2-editenv - list
clear

#^ 2. Inspect the default target and its dependencies
#! workstation boots to a graphical login
systemctl get-default
#! gdm.service is the display manager; multi-user.target sits beside it
#@ pause 6
systemctl list-dependencies graphical.target
#@ noenter
q
clear

#^ 3. Switch to multi-user.target without rebooting
#! Watch the workstation console: the graphical login gives way to a text login
systemctl isolate multi-user.target
#! inactive, then active: graphical.target stopped and multi-user.target still runs
#@ pause 5
systemctl is-active graphical.target multi-user.target
#! The default has not changed, so the next boot would be graphical again
systemctl get-default
clear

#^ 4. Make multi-user.target the default and reboot to confirm
systemctl set-default multi-user.target
systemctl get-default
#! Let the countdown run out; workstation boots to a text login
#@ pause 25
systemctl reboot
ssh workstation
systemctl get-default
systemctl is-active graphical.target
clear

#^ 5. Restore graphical.target as the default
sudo -i
systemctl set-default graphical.target
systemctl get-default
clear

#^ 6. Boot once into rescue.target from the GRUB2 menu
#! Students do this step and the next in the workstation VM window
#! Attach to the serial console straight after the reboot: GRUB2 draws its menu once, under 2 seconds in
#@ pause 0.5
systemctl reboot
#@ noenter
#@ pause 0
virsh -c qemu:///system console workstation
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
#! The leading space separates systemd.unit=rescue.target from the last argument
#@ noenter
#@ pause 5
 systemd.unit=rescue.target
#! The boot stops at the rescue shell, which asks for the root password
#@ pause 20
#@ key ctrl+x
#! The root password; it does not echo
#@ pause 3
redhat
clear

#^ 7. Confirm the root file system is read/write, then continue the boot
#! rw among the options: rescue.target mounted the root file system read/write
#@ pause 5
mount | grep ' / '
#! exit leaves the rescue shell, and the boot continues to graphical.target
#@ pause 20
exit
#! Detach from the serial console once the login prompt appears
#@ key ctrl+]
ssh workstation
#! active: the boot continued to the default target
systemctl is-active graphical.target
clear

#^ Clean up
#! Hide the GRUB2 menu again; the default target is already graphical.target
sudo -i
grub2-editenv - set menu_auto_hide=1
#@ pause 5
grub2-editenv - list

# Complete
