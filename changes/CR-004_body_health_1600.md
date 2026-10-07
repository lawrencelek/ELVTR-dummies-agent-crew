# CR-004 — Body health 1,600

**From:** Lawrence, 8 October 2026: "LET'S DROP BODY HEALTH TO 1600".

**Why.** CR-003 made the base of a hit a literal 100 points against a body of
2,300, which put the quotas out of reach: level 1's two bodies needed about
nine near-perfect head-on lunges from 14 cars.

**The change. One number, plus the one that must follow it.**

1. `dummy.maxHealth` becomes **1600** (was 2300).
2. `impact.maxPay` becomes **1600** as well. *The assistant's addition:* the
   cap on a single hit has always been one body's health, and severity
   (damage / maxPay, used for shake and report signatures) should stay "share
   of a body".

**Nothing else changes.** The damage table (base 100, zone shares, x5 lunge,
momentum factor), class masses, write-off bonus (2,500), service delay and
full-repair time (30 s, so repair is proportionally slower in points per
second), quotas, allocations, certification target, the write-off animation
and all code structure stay exactly as released. Every other parameter,
rule and acceptance criterion is kept word for word, except where it quotes
2,300 or a figure derived from it.

Worked values after the change: a head-on lunge into a cruising sedan (500)
takes 31% of a body; level 1's quota of two bodies needs 3,200 points, about
six and a half such lunges from 14 cars.
