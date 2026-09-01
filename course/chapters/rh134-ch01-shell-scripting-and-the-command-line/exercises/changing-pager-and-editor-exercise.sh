kitten @ set-font-size 30.0 && ssh workstation
ssh servera
clear

#^ Exercise: Changing the Pager and Editor
# Requirements
#   Hosts: workstation, then servera
# Tasks
#   1. Confirm neither PAGER nor EDITOR is set
#   2. Export PAGER so man prints straight to the terminal
#   3. Install nano and export EDITOR so it opens instead of vi
#   4. Confirm both are gone in a new session
clear

#^ 1. Confirm neither PAGER nor EDITOR is set
echo "PAGER=[$PAGER]"
echo "EDITOR=[$EDITOR]"
#! Both are empty. man falls back to less, and editors fall back to vi, on their own.
clear

#^ 2. Export PAGER so man prints straight to the terminal
#! Press q to leave less.
man ls
q
export PAGER=cat
#! Now the whole page prints instead of paging.
man ls
clear

#^ 3. Install nano and export EDITOR so it opens instead of vi
#! vi is not installed by default on every system, and not everyone wants it.
sudo dnf install -y nano
#! crontab -e asks EDITOR which program to open. Without EDITOR you get vi.
crontab -e
:q!
export EDITOR=nano
#! Same command, different editor. Press Ctrl+X to leave nano.
crontab -e
clear

#^ 4. Confirm both are gone in a new session
#! export copies a variable into the programs you launch. It does not write it
#! to a file, so the new session starts without it.
exit
ssh servera
echo "PAGER=[$PAGER]"
echo "EDITOR=[$EDITOR]"
clear
