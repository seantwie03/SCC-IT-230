kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Task: Copy a File to servera and Back Again
# Requirements
#   Student hosts: Windows VDI session and servera
#   Demonstration hosts: workstation and servera
# Tasks
#   1. Send/Receive a File from VDI to servera
#   2. Upload several files using globbing
#   3. Download several files using globbing
clear

#^ 1. Send/Receive a file between VDI and servera
# 1. Open Windows Terminal on the VDI (PowerShell)
# 2. notepad {YOUR_NAME}.txt
#    - Write your favorite text editor into {YOUR_NAME}.txt and save it
# 3. scp {YOUR_NAME}.txt student@servera:~
# 4. ssh student@servera
# 5. ls -l
# 6. vim {YOUR_NAME}.txt - add the last game, book, or movie you finished
# 7. exit
# 8. scp student@servera:~/{YOUR_NAME}.txt .
# 9. Get-ChildItem
clear

#^ 2. Upload several files using globbing
ssh student@workstation
touch notes.txt report.txt photo.png
ls
#! echo first, to show what scp is actually going to receive. Bash expanded the pattern. scp gets two file names, never a pattern.
echo scp *.txt student@servera:~
scp *.txt student@servera:~
ssh student@servera ls
clear

#^ 3. Download several files using globbing
mkdir -p ~/from-servera
cd ~/from-servera
#! Single quotes keep the pattern intact, so it travels to servera and is matched against servera's files. The quotes are how you say which machine does the matching.
scp 'student@servera:*.txt' .
ls -l
clear

#^ Clean up
cd ~
rm notes.txt report.txt photo.png
rm -rf ~/from-servera
ssh student@servera rm notes.txt report.txt
