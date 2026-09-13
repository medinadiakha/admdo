# Security Specification & Threat Model for ADMDO

## 1. Data Invariants & Authorization Architecture

- **Superadmin Authority**: The verified primary account `admdo.association@gmail.com` is the ultimate administrator. Admin documents located in `/admins/{adminId}` can grant secondary admin roles.
- **Strict Role-Based Mutation**: Only authenticated, verified administrators can create, update, or delete:
  - News articles (`/news`)
  - Village assemblies and meetings (`/meetings`)
  - Homepage videos (`/videos`)
  - Thematic custom sections (`/customSections`)
  - Donation links & mobile money buttons (`/donationButtons`)
  - Gallery photos (`/photos`)
  - Downloadable partner documents (`/documents`)
  - Site & Footer configuration (`/siteConfig`)
- **Public Read Access**: Visitors and partners have read access to public informational content:
  - News, Meetings, Videos, Photos, Documents, Custom Sections, Donation Buttons, and Site Config.
- **Controlled Public Ingestion**:
  - Unauthenticated or authenticated visitors can submit inquiries to `/contactMessages` and subscribe to `/subscribers`.
  - Inquiries must pass strict validation (name <= 100 chars, contact <= 150 chars, message <= 5000 chars).
  - Only administrators can read, list, update (e.g. status), or delete contact messages.
- **Zero Update-Gaps & Anti-Poisoning**:
  - ID parameter validation (`isValidId`) prevents junk characters or denial-of-wallet traversal attacks.
  - Length and type validation on all incoming fields ensures no payload injection.

---

## 2. The "Dirty Dozen" Threat Payloads (Must be REJECTED)

1. **Unauthenticated Admin Write (Identity Spoofing)**
   - Target: `POST /news/news-999`
   - Payload: `{ title: "Hacked", summary: "Fake news", content: "Unverified" }`
   - Expectation: `PERMISSION_DENIED` (auth required).

2. **Unverified Email Admin Spoofing**
   - Target: `POST /news/news-999`
   - Auth: Token with `email: "admdo.association@gmail.com"`, but `email_verified: false`
   - Expectation: `PERMISSION_DENIED` (email must be verified).

3. **Non-Admin User Modification of Donation Links**
   - Target: `PATCH /donationButtons/wave`
   - Auth: Authenticated normal user `random@user.com`
   - Payload: `{ url: "https://attacker-phishing.com/steal" }`
   - Expectation: `PERMISSION_DENIED` (only verified admin).

4. **Shadow Field Injection on Custom Section**
   - Target: `POST /customSections/sec-1`
   - Payload: `{ slug: "forage", title: "Forage", content: "Texte", isAdminOverride: true, backdoor: "exploit" }`
   - Expectation: `PERMISSION_DENIED` (unexpected shadow keys).

5. **Contact Message Reading by Public or Non-Admin**
   - Target: `GET /contactMessages/msg-123`
   - Auth: Unauthenticated or non-admin visitor
   - Expectation: `PERMISSION_DENIED` (only admins can read inbox messages).

6. **Mass Contact Message Scraping (Blanket List Attack)**
   - Target: `GET /contactMessages`
   - Auth: Any non-admin user
   - Expectation: `PERMISSION_DENIED`.

7. **Contact Message Buffer Overflow Attack (Denial of Wallet)**
   - Target: `POST /contactMessages/msg-overflow`
   - Payload: `{ name: "Spammer", contact: "spam", message: "A".repeat(100000) }`
   - Expectation: `PERMISSION_DENIED` (message length exceeds 5000 chars).

8. **Admin Self-Elevation by Regular User**
   - Target: `POST /admins/attackerUid`
   - Auth: User `attackerUid`
   - Payload: `{ id: "attackerUid", email: "attacker@gmail.com", role: "superadmin" }`
   - Expectation: `PERMISSION_DENIED` (only existing superadmin can grant admin access).

9. **Invalid Document ID Injection Attack**
   - Target: `POST /news/../../etc/passwd`
   - Expectation: `PERMISSION_DENIED` (isValidId regex guard `^[a-zA-Z0-9_\\-]+$` fails).

10. **Modification of System / Immutable Timestamps**
    - Target: `PATCH /news/news-1`
    - Payload: `{ createdAt: "1970-01-01" }`
    - Expectation: `PERMISSION_DENIED` (createdAt is immutable).

11. **Footer Configuration Takeover by Non-Admin**
    - Target: `PATCH /siteConfig/footer`
    - Auth: Anonymous or standard visitor
    - Payload: `{ email: "phishing@scam.org", phone: "00000000" }`
    - Expectation: `PERMISSION_DENIED`.

12. **Malformed Newsletter Subscription Injection**
    - Target: `POST /subscribers/sub-bad`
    - Payload: `{ email: "not-an-email-".repeat(100) }`
    - Expectation: `PERMISSION_DENIED` (email string size and structure check).
