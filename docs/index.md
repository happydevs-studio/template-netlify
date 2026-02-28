# Documentation Index

This file defines documentation expectations and navigation.

## Governance Model

**This index is the sole source of truth for documentation structure.**

The directory structure must conform to this index—not the reverse. This file is the specification that drives organized documentation.

### Key Principles

- **Index-first**: Any new document must have a corresponding entry in this index before being added
- **Accepted deviations**: Files that exist but aren't planned are listed in the [Accepted Deviations](#accepted-deviations) section with rationale
- **Structure validation**: Documentation structure is validated in CI/CD via [DOCUMENTATION_HYGIENE.md](hygiene/DOCUMENTATION_HYGIENE.md) to prevent unintended drift

## Core Files

| File | Purpose |
| ---- | ------- |
| [README.md](README.md) | Project overview and getting started |
| [AGENTS.md](AGENTS.md) | AI/automation instructions and conventions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | GitHub-facing contribution entry point linking to contributing guide |

## Architecture

Architecture documentation is method-agnostic in intent and C4-by-default in implementation.

Default notation is C4 (Context + Container). If another method fits the codebase better, document the chosen method and rationale in the architecture README.

| File | Purpose |
| ---- | ------- |
| [README.md](architecture/README.md) | Architecture structure and boundaries overview (C4 Context + Container by default) |

## Decisions

| File | Purpose |
| ---- | ------- |
| DECISION_TEMPLATE.md (expected) | Lightweight template for recording significant decisions |
| [DECISIONS.md](decisions/DECISIONS.md) (expected) | Running log of significant decisions with date, status, and rationale |
| <date>-<slug>.md (optional pattern) | Optional supporting notes for complex decisions using the decision template |

## Contributing

| File | Purpose |
| ---- | ------- |
| [README.md](contributing/README.md) (expected) | Contributor workflow, quality gates, and coding conventions |
| DEVELOPMENT_WORKFLOW.md (optional split) | Branch strategies and PR process for larger teams/codebases |
| PR_CHECKLIST.md (optional split) | Pre-merge checks when a standalone checklist is needed |
| CODING_STANDARDS.md (optional split) | Detailed standards when conventions outgrow the README |

## Deployment

| File | Purpose |
| ---- | ------- |
| ENVIRONMENTS.md (expected) | Environment model and configuration |
| RELEASE_PROCESS.md (expected) | Versioning, build, and release workflow |
| ROLLBACK.md (expected) | Rollback scenarios and procedures |

## Hygiene

| File | Purpose |
| ---- | ------- |
| [README.md](hygiene/README.md) | Quality gates and maintenance overview |
| [COMPLEXITY_CONFIG.md](hygiene/COMPLEXITY_CONFIG.md) | Code complexity thresholds and configuration |
| DOCUMENTATION_HYGIENE.md (expected) | Documentation structure validation and token optimization |
| QUALITY_GATES.md (expected) | Static analysis and test coverage thresholds |
| LINTING_AND_FORMATTING.md (expected) | Tool setup and enforcement |

## Reliability

| File | Purpose |
| ---- | ------- |
| SLOS_AND_SLIS.md (expected) | Service level objectives and error budgets |
| ALERTING.md (expected) | Monitoring, alerts, and escalation paths |
| INCIDENT_MANAGEMENT.md (expected) | Incident response and continuity plans |

## Runbooks

| File | Purpose |
| ---- | ------- |
| INCIDENT_TRIAGE.md (expected) | Troubleshooting and diagnostic procedures |
| SERVICE_RECOVERY.md (expected) | Recovery and failover workflows |
| DEPLOYMENT_VERIFICATION.md (expected) | Post-deployment health checks |

## Security

| File | Purpose |
| ---- | ------- |
| [README.md](security/README.md) | Security scanning and controls overview |
| [DAST.md](security/DAST.md) | Dynamic application security testing |
| [DEPENDENCIES.md](security/DEPENDENCIES.md) | Dependency scanning and updates |
| [SAST.md](security/SAST.md) | Static application security testing |
| [SECRETS.md](security/SECRETS.md) | Secret detection and management |
| THREAT_MODEL.md (expected) | Threat scenarios and assessment |
| VULNERABILITY_MANAGEMENT.md (expected) | Vulnerability triage and response |

## Accepted Deviations

Files that exist outside this index structure with documented rationale:

| File | Location | Rationale |
| ---- | -------- | --------- |
| (none currently) | — | — |

When adding an unexpected file, add it here with clear reasoning instead of elsewhere.
