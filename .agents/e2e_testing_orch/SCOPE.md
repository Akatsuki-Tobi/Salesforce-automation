# Scope: E2E Testing Track

## Architecture
- **E2E Test Runner**: Jest running TypeScript/Playwright test cases.
- **Verification Strategy**: Checks if Trailhead is loginable, Salesforce Orgs are created/accessible, service agents are correctly configured in the DOM, flows are updated, sites are published, and real-world bookings are simulated.
- **Directory Layout**:
  - `tests/e2e/`: E2E test cases (Tiers 1-4).
  - `TEST_INFRA.md`: Description of features, coverage, and testing layout.
  - `TEST_READY.md`: Signal that the E2E test suite is complete with coverage summary.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Test Infra Setup | Design and document E2E test infra in `TEST_INFRA.md` | None | IN_PROGRESS |
| 2 | Tier 1 Tests | Implement 25 test cases for Feature Coverage | 1 | PLANNED |
| 3 | Tier 2 Tests | Implement 25 test cases for Boundary & Corner Cases | 2 | PLANNED |
| 4 | Tier 3 Tests | Implement 5 test cases for Cross-Feature Combinations | 3 | PLANNED |
| 5 | Tier 4 Tests | Implement 5 test cases for Real-World Application Scenarios | 4 | PLANNED |
| 6 | Verification & Sign-off | Run E2E test suite, ensure all tests compile and pass, and publish `TEST_READY.md` | 5 | PLANNED |

## Interface Contracts
- The E2E tests interact with the automation scripts under `src/` or `tests/missions/` or directly test Salesforce/Trailhead mock page classes.
