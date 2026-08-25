kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Copy a File to servera and Back Again
# Requirements
#   Student hosts: Windows VDI session and servera
#   Demonstration hosts: workstation and servera
# Tasks
#   1. Create a small file to send
#   2. Upload it to servera
#   3. Confirm it arrived
#   4. Edit the file on servera
#   5. Download the edited file back
#   6. Send several files with one pattern
#   7. Match the pattern on the far end instead
#   8. Clean up
clear

#! Students run the scp half of this from Windows Terminal on the VDI. The steps are
#! identical on the Linux workstation, so demonstrate them here and read the list aloud.
echo '  1. Open Windows Terminal on the VDI'
echo '  2. notepad {YOUR_NAME}.txt - write your favorite text editor into it'
echo '  3. scp {YOUR_NAME}.txt student@servera:~'
echo '  4. ssh student@servera'
echo '  5. ls -l'
echo '  6. vim {YOUR_NAME}.txt - add the last game, book, or movie you finished'
echo '  7. exit'
echo '  8. scp student@servera:~/{YOUR_NAME}.txt .'
clear

#^ 1. Create a small file to send
vim demo_name.txt
#! Press i to enter insert mode.
i
My favorite text editor is Vim.
#! jj leaves insert mode, then :wq writes and quits.
jj:wq
cat demo_name.txt
clear

#^ 2. Upload it to servera
#! Source first, destination second. The colon is what makes the second path remote.
scp demo_name.txt student@servera:~
clear

#^ 3. Confirm it arrived
ssh student@servera
ls -l demo_name.txt
cat demo_name.txt
clear

#^ 4. Edit the file on servera
vim demo_name.txt
#! A appends at the end of the current line.
A
 The last movie I watched was Hackers.
jj:wq
cat demo_name.txt
exit
clear

#^ 5. Download the edited file back
#! Now the colon is on the source, so this is a download. The dot is the current directory.
scp student@servera:~/demo_name.txt .
cat demo_name.txt
clear

#^ 6. Send several files with one pattern
#! Make a few files so the pattern has something to choose between.
touch notes.txt report.txt photo.png
ls
#! echo first, to show what scp is actually going to receive.
echo scp *.txt student@servera:~
#! Bash expanded the pattern HERE. scp gets two file names, never a pattern.
scp *.txt student@servera:~
ssh student@servera ls
#! photo.png never left workstation. The pattern chose the files, not scp.
clear

#^ 7. Match the pattern on the far end instead
mkdir -p ~/from-servera
cd ~/from-servera
#! Single quotes keep the pattern intact, so it travels to servera and is matched
#! against servera's files. The quotes are how you say which machine does the matching.
scp 'student@servera:*.txt' .
ls -l
cd ~
clear

#^ 8. Clean up
rm demo_name.txt notes.txt report.txt photo.png
rm -rf ~/from-servera
ssh student@servera rm demo_name.txt notes.txt report.txt
clear
