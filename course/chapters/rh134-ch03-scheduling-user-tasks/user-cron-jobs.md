---
layout: section
routeAlias: user-cron-jobs
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "03"
        title: Scheduling User Tasks
    rhcsaCertGuide:
      - chapter: "12"
        title: Scheduling Tasks
  exercises:
    - title: Backing Up Documents Nightly Exercise
      source: ./exercises/backing-up-documents-nightly-exercise.html
---

# Recurring User Jobs

## Do *this*, later, and on repeat, as a specific user

---
vertical: center
listSpacing: padded
---

# Crontab

- Available on <SuccessText>every</SuccessText> Linux system
- Every user has one
- Finicky syntax, but you will meet it everywhere

<Callout>

`at` runs a job once. `cron` runs it again, and again, on a schedule you define.

</Callout>

---
layout: center
---

# Five Fields, Then a Command

<TextExplainer
  :lines="['*  *  *  *  * command to be executed']"
  :steps="[
    { text: '*', occurrence: 1, explanation: 'Minute, 0 through 59' },
    { text: '*', occurrence: 2, explanation: 'Hour, 0 through 23' },
    { text: '*', occurrence: 3, explanation: 'Day of month, 1 through 31' },
    { text: '*', occurrence: 4, explanation: 'Month, 1 through 12, or jan, feb, mar' },
    { text: '*', occurrence: 5, explanation: 'Day of week, 0 through 6, Sunday is 0 or 7, or sun, mon, tue' },
    { text: 'command to be executed', explanation: 'What runs when all five fields match' },
  ]"
/>

---

# Reading a Schedule

A `*` means *every* value of that field

```bash [Every minute]
* *  *  *  * echo "This runs every minute of every hour of every day in every month" >> stating_the_obvious.log
```

<v-click>

```bash [Every hour at 10 minute-mark]
10 *  *  *  * echo "This runs on the 10th minute in every hour" >> stating_the_obvious.log
```

</v-click>

<v-click>

```bash [Every 30-minutes]
0,30 * * * *  echo "This runs every 30 minutes" >> stating_the_obvious.log
```

</v-click>

---

# Reading a Schedule

```bash [3a.m. and 3p.m.]
0 3,15 * * * echo "This runs at 3a.m. and 3p.m." >> stating_the_obvious.log
```

```bash [8pm on the 15th of every month]
0 20 15 * * echo "This runs at 8p.m. on the 15th day of every month" >> stating_the_obvious.log
```

```bash [Every 10 minutes on May 4th]
0/10 * 4 may * echo "May the 4th be with you (every 10mins on May 4th)" >> stating_the_obvious.log
```

```bash [2:15a.m. on Sunday, Monday and Tuesday]
15 2 * * sun,mon,tue echo "This runs every Sunday, Monday and Tuesday at 2:15a.m." >> stating_the_obvious.log
```

---
layout: two-cols-header
vertical: center
---

# Editing and Reading Your Crontab

::left::

## Edit

<TerminalWindow title="student@servera:~" :rows="2">

```bash-session
student@servera:~$ crontab -e
```

</TerminalWindow>

Opens in `$EDITOR`, which is `vi` unless you changed it

::right::

## Read

<TerminalWindow title="student@servera:~" :rows="3">

```bash-session
student@servera:~$ crontab -l
* * * * * date --iso-8601=seconds > /tmp/cron_ran
```

</TerminalWindow>

The file itself lives in `/var/spool/cron/`

---

# Did It Run?

`crond` records every job it starts and finishes

<TerminalWindow title="student@servera:~" :rows="6">

```bash-session {*}{lines:false}
student@servera:~$ sudo grep "(student)" /var/log/cron
Sep  5 14:16:01 servera CROND[11393]: (student) CMD (date --iso-8601=seconds > /tmp/cron_ran)
Sep  5 14:16:01 servera CROND[11391]: (student) CMDEND (date --iso-8601=seconds > /tmp/cron_ran)
student@servera:~$ cat /tmp/cron_ran
2026-09-05T14:17:01+00:00
```

</TerminalWindow>

**<AccentText>CMD</AccentText>** is the job starting

**<AccentText>CMDEND</AccentText>** is it finishing

---

# Removing Your Crontab

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session
student@servera:~$ crontab -r
student@servera:~$ crontab -l
no crontab for student
```

</TerminalWindow>

<Callout type="danger" title="No confirmation">

`crontab -r` deletes <DangerText>every</DangerText> entry you have, immediately. There is no undo and no prompt.

</Callout>

---
layout: exercise
---

# Backing Up Documents Nightly

::goal::

Schedule a nightly backup of your documents and prove that it ran

::environment::

**Host:** `servera`

::workflow::

1. Create a small `~/Documents` tree worth backing up
2. Build and test the backup command by hand
3. Schedule it one minute out with `crontab -e`
4. Confirm in `/var/log/cron` that it ran, and check the backup
5. Reset the schedule to 2 a.m. and review it with `crontab -l`
