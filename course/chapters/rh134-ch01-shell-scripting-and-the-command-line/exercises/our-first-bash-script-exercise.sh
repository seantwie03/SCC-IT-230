kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Our First Bash Script
# Requirements
#   Host: servera
#   Prerequisite exercise: Putting Scripts on the PATH
#   Script location: /home/student/scripts/take_inventory.sh
#   The script records what is in a directory
# Steps
#   1. Write the script in your home directory with a hashbang
#   2. Try to run it, then add the execute permission
#   3. Run it with ./
#   4. Find out why the bare name does not work
#   5. Move it onto your PATH and run it by name
clear

#^ 1. Write the script in your home directory with a hashbang
cd ~
vim take_inventory.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
echo "Taking inventory"
#@ pause 5
#@ noenter
ls > inventory
#@ key escape
:wq
#@ pause 5
cat take_inventory.sh
#! Line 1 is the hashbang: it names the interpreter that runs the file
clear

#^ 2. Try to run it, then add the execute permission
#! A new file is not executable, so the kernel will not run it
ls -l take_inventory.sh
./take_inventory.sh
chmod a+x take_inventory.sh
ls -l take_inventory.sh
clear

#^ 3. Run it with ./
#! ./ means run the file at this path
./take_inventory.sh
#@ pause 5
cat inventory
clear

#^ 4. Find out why the bare name does not work
take_inventory.sh
#! Bash searches PATH, and your home directory is not on it
echo $PATH
#! ~/scripts is on the list, from the PATH exercise
clear

#^ 5. Move it onto your PATH and run it by name
mv take_inventory.sh ~/scripts/
take_inventory.sh
#! No ./ needed: Bash found it on PATH
clear

#^ Clean up
#! Nothing later uses the inventory file
rm -f ~/inventory

# Complete
