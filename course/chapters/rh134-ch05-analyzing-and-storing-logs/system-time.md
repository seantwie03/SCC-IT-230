---
layout: section
routeAlias: system-time
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "05"
        title: Analyzing and Storing Logs
    rhcsaCertGuide:
      - chapter: "25"
        title: Configuring Time Services
  exercises:
    - title: Changing the Time Zone Exercise
      source: ./exercises/changing-the-time-zone-exercise.html
---

# Times and Dates

## A programmer's worst nightmare

---
layout: two-cols-header
vertical: center
---

# Two Clocks

::left::

## Hardware clock

Also called the real time clock, and it keeps running when the machine is off

Generally set to <AccentText>UTC</AccentText>, which is the same everywhere

Windows sets it to local time instead, which is why dual-boot machines argue about the time

::right::

## Software clock

The system time the kernel keeps while running

Also stored as UTC

Converted to your time zone only when something displays it

---
vertical: center
---

# Epoch Time

Linux counts time as seconds since <AccentText>1 January 1970</AccentText>, UTC

<TerminalWindow title="student@servera:~" :rows="5">

```bash-session
student@servera:~$ date +%s
1788713082
student@servera:~$ date --date @1788713082
Sun Sep  6 04:44:42 PM UTC 2026
```

</TerminalWindow>

The `@` is what tells `date` the number is epoch seconds rather than a date

---

# What the System Thinks Right Now

<TerminalWindow title="student@servera:~" :rows="9">

```bash-session {*}{lines:false}
student@servera:~$ timedatectl
               Local time: Sun 2026-09-06 16:44:42 UTC
           Universal time: Sun 2026-09-06 16:44:42 UTC
                 RTC time: Sun 2026-09-06 16:44:42
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

</TerminalWindow>

One command answers both questions: what time is it, and is that time trustworthy

---
vertical: center
---

# Choosing a Time Zone

`tzselect` walks you through continent, country, and region, then prints a name.
It changes nothing, it only tells you what to type.

<TerminalWindow title="student@servera:~" :rows="6">

```bash-session
student@servera:~$ timedatectl list-timezones | grep -i amsterdam
Europe/Amsterdam
student@servera:~$ sudo timedatectl set-timezone Europe/Amsterdam
student@servera:~$ date
Sun Sep  6 06:44:42 PM CEST 2026
```

</TerminalWindow>

The clock did not move, only the way it is displayed

---
layout: exercise
---

# Changing the Time Zone

::goal::

Move `servera` to Amsterdam's time zone and confirm only the display changed

::environment::

**Host:** `servera`

::workflow::

1. Record the current time zone and UTC offset
2. Find the time zone name Amsterdam uses
3. Set the new time zone
4. Confirm local time moved while universal time did not
5. Put the original time zone back
