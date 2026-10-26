kitten @ set-font-size 30.0 && ssh servera
clear

#@ pause 8
#^ Exercise: Create a Volume Group
# Requirements
#   Host: servera
#   Prerequisite: Initialize a Physical Volume
#   Pool the new physical volume into a volume group
# Steps
#   1. Create a volume group named vg_data using /dev/sdb1
#   2. Verify with vgs and vgdisplay
clear

#^ 1. Create a volume group named vg_data using /dev/sdb1
sudo -i
#! The VG name comes first, then one or more PVs to pool into it
vgcreate vg_data /dev/sdb1
clear

#^ 2. Verify with vgs and vgdisplay
#! vg_data: one PV, no LVs yet, and all of it free
#@ pause 5
vgs
clear
#! 508 MiB, not 512: the PV is used in whole 4 MiB extents, 127 of them,
#! and pvdisplay reports the other 4 MiB as not usable
#@ pause 5
vgdisplay vg_data

# Complete
