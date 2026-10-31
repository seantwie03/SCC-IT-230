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
#@ pause 35
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
#! Bring the workstation console window forward before rebooting
#! At the menu, press any key except Enter to stop the countdown, then press e
#! Move down to the line that starts with linux and press End
#! Type a space and systemd.unit=rescue.target, then press Ctrl+X to boot
#! At the rescue prompt, type the root password
#! When recording, make this edit in the console during the pause
#@ pause 45
systemctl reboot

#@ pause 45
#^ 7. Confirm the root file system is read/write, then continue the boot
#! In the rescue shell on the console, run: mount | grep ' / '
#! rw among the options: rescue.target mounted the root file system read/write
#! Then run exit, and the boot continues to graphical.target
#! When recording, do both in the console during the pause
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
