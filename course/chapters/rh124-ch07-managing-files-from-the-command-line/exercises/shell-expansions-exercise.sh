kitten @ set-font-size 30.0 && ssh servera
clear

#^ Task: Control What Bash Expands
touch filea.txt fileb.md filec.sh
ls
clear

#^ Match file names with a glob
#! * matches any run of characters, including none.
ls *.txt
#! ? matches exactly one character.
ls file?.md
#! Square brackets match one character from the set.
ls file[ac].*
clear

#^ Watch Bash expand an unquoted asterisk
#! echo never receives a *. Bash replaces it with the file names before echo runs.
echo *
clear
