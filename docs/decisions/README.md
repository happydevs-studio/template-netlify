# Decisions

This directory records significant decisions and their rationale for the project.

## Contents

- [DECISIONS.md](DECISIONS.md) — Running log of all significant decisions
- [DECISION_TEMPLATE.md](DECISION_TEMPLATE.md) — Template for detailed decision notes

## How to Use

1. Add a row to [DECISIONS.md](DECISIONS.md) for each significant decision.
2. If extra context is needed, create a supporting note using [DECISION_TEMPLATE.md](DECISION_TEMPLATE.md).
3. Name supporting notes as `<date>-<slug>.md`.

## Tasks

```bash
task decisions:validate   # Validate the decisions log
task decisions:new SLUG=<name>  # Create a new decision note from template
```
