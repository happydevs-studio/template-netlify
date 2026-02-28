# Contributing

This document defines the default way to contribute to this project.

## Prerequisites

- Install Task (Taskfile runner): [taskfile.dev/installation](https://taskfile.dev/installation/)
- Verify installation: `task --version`

## Taskfile-Driven Basics

Use `Taskfile.yml` as the default interface for contributor workflows:

- `task contributing:setup` — Install dependencies
- `task contributing:build` — Build the project
- `task contributing:lint` — Run lint checks
- `task contributing:run` — Run local development server
- `task contributing:test` — Run Playwright tests
- `task contributing:test:complexity` — Run code complexity checks
- `task contributing:test:security` — Run all security test suites
- `task contributing:test:sast` — Run SAST tests
- `task contributing:test:vulnerability` — Run vulnerability scanning tests
- `task contributing:test:dast` — Run DAST tests
- `task contributing:test:secrets` — Run secrets detection tests

Use namespaced documentation tasks via root Taskfile. Check available tasks with `task --list`:

- `task hygiene:test`
- `task hygiene:lint`
- `task security:scan`
- `task security:sast`
- `task security:vulnerability:all`
- `task decisions:validate`
- `task decisions:new SLUG=<name>`

## Workflow

- Create a focused branch for each change.
- Keep pull requests small and reviewable.
- Link changes to relevant decisions or issues when applicable.

## Pre-Merge Checks

- Verify tests and checks pass.
- Confirm documentation is updated when behavior or structure changes.
- Ensure no accidental scope creep is included.

## Coding Conventions

- Prefer clarity over cleverness.
- Keep changes minimal and localized.
- Follow existing project style and naming patterns.

## When to Split into Additional Files

If this document becomes too long or team/process complexity increases, split details into:

- `DEVELOPMENT_WORKFLOW.md`
- `PR_CHECKLIST.md`
- `CODING_STANDARDS.md`
