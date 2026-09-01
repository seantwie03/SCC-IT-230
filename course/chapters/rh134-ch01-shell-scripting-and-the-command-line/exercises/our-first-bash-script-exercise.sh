kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Our First Bash Script
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/take_inventory.sh
#   The script records what is in a directory
# Tasks
#   1. Write the script in your home directory
#   2. Try to run it and fix the permission
#   3. Run it with ./
#   4. Find out why the bare name does not work
#   5. Move it onto your PATH and run it by name
clear

#^ 1. Write the script in your home directory
cd ~
vim take_inventory.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
echo "Taking inventory"
ls > inventory
jj:wq
cat take_inventory.sh
#! Line 1 is the hashbang. It names the interpreter that will run the file.
clear

#^ 2. Try to run it and fix the permission
#! A new file is not executable, so the kernel will not run it.
ls -l take_inventory.sh
./take_inventory.sh
chmod a+x take_inventory.sh
ls -l take_inventory.sh
clear

#^ 3. Run it with ./
#! ./ means run the file at this path.
./take_inventory.sh
cat inventory
clear

#^ 4. Find out why the bare name does not work
take_inventory.sh
#! Bash searches PATH, and your home directory is not on it.
echo $PATH
#! ~/scripts is on the list, because you put it there earlier today.
clear

#^ 5. Move it onto your PATH and run it by name
mv take_inventory.sh ~/scripts/
take_inventory.sh
#! No ./ needed. Bash found it on PATH.
clear

#^ Clean up
rm -f ~/inventory
