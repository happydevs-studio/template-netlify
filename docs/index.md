# Documentation Index

This file defines documentation categories and governance.

## Governance Model

**This index is the sole source of truth for documentation structure.**

The directory structure must conform to this index—not the reverse. This file is the specification that drives organized documentation.

### Key Principles

- **Index-first**: Any new document must have a corresponding entry in this index before being added

## Documentation Categories

Each category has a README that defines its purpose. Content within categories is flexible and evolves with project needs.

| Category | Purpose | README | Tasks |
| -------- | ------- | ------ | ----- |
| [architecture/](architecture/) | System structure and boundaries | [README](architecture/README.md) | — |
| [decisions/](decisions/) | Significant decisions and rationale | [README](decisions/README.md) | `task decisions:*` |
| [deployment/](deployment/) | Release and environment workflows | [README](deployment/README.md) | — |
| [contributing/](contributing/) | Contributor workflow and expectations | [README](contributing/README.md) | `task contributing:*` |
| [hygiene/](hygiene/) | Quality gates and maintenance | [README](hygiene/README.md) | `task hygiene:*` |
| [reliability/](reliability/) | Service level and incident response | [README](reliability/README.md) | — |
| [runbooks/](runbooks/) | Operational procedures | [README](runbooks/README.md) | — |
| [security/](security/) | Security scanning and controls | [README](security/README.md) | `task security:*` |
