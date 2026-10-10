# Security Specification: Service4Websites Security Architecture

## 1. Data Invariants

1. **User Identity Invariant**: A user document in `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Project Ownership Invariant**: A project in `/projects/{projectId}` has an immutable `ownerId` that must match `request.auth.uid` upon creation.
3. **Role Escalation Protection**: Regular users cannot self-escalate their `role` to `admin` arbitrarily.
4. **ID Hardening Invariant**: All document IDs (`userId`, `projectId`, `metricId`) must be valid alphanumeric strings adhering to `^[a-zA-Z0-9_-]+$` with length <= 128 characters.
5. **Content Sizing Invariant**: Input fields (strings, bio, names) must strictly respect volumetric boundaries (e.g. title <= 150 chars, bio <= 500 chars).
6. **Analytics Security**: Real-time traffic metrics can be read by authenticated users, and updated within validated numeric boundaries.
7. **Default Deny Invariant**: Any path not explicitly matched is denied by default.

---

## 2. The Dirty Dozen Payloads

1. **Ghost Field User Update**: Injecting `{ uid: "u1", isAdmin: true, shadowToken: "xyz" }` into `/users/u1`.
   - *Expected*: REJECTED (keys out of allowed schema).
2. **Impersonated User Creation**: User `attacker` creates `/users/victim_123` with `{ uid: "victim_123", email: "victim@example.com" }`.
   - *Expected*: REJECTED (`userId != request.auth.uid`).
3. **Unauthenticated Read on Private User Profile**: Guest requests `/users/u1`.
   - *Expected*: REJECTED (`request.auth == null`).
4. **Project Hijack Attack**: Attacker updates project owned by victim changing `ownerId: "attacker"`.
   - *Expected*: REJECTED (`ownerId` immutable and must belong to owner).
5. **ID Poisoning Attack**: Writing to path `/projects/..%2F..%2Fsys%2Fexploit` or with 2KB string ID.
   - *Expected*: REJECTED (`isValidId()` constraint).
6. **Massive Bio Payload Attack**: Attacker attempts to store a 5MB base64 string in `bio`.
   - *Expected*: REJECTED (`bio.size() <= 500`).
7. **Negative Budget Attack**: Creating project with `{ budget: -50000 }` or string budget.
   - *Expected*: REJECTED (type safety and budget >= 0).
8. **Invalid Status Transition**: Setting project status to `"hacked_state"`.
   - *Expected*: REJECTED (enum validation `['planning', 'in_progress', 'review', 'completed']`).
9. **Unauthenticated Project Deletion**: Guest or different user attempts to delete project `/projects/p1`.
   - *Expected*: REJECTED (`request.auth != null && resource.data.ownerId == request.auth.uid`).
10. **Orphaned Write Attack**: User tries to update `createdAt` timestamp on an existing project.
    - *Expected*: REJECTED (`createdAt` is immutable).
11. **Negative Metric Value**: Setting `activeVisitors: -100` in `/traffic_metrics/current`.
    - *Expected*: REJECTED (`activeVisitors >= 0`).
12. **Blanket Query Scraping**: Malicious client issues unbounded query for all projects without owner filter.
    - *Expected*: REJECTED (`resource.data.ownerId == request.auth.uid` required on project listing).
