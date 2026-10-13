# Backend & Database Architecture — OPENCODE (NullSec Collective)

A concise, comprehensive guide covering the backend architecture, PostgreSQL database schema, security policies, data flows, and environment configuration for the **OPENCODE / NullSec Collective** web application.

---

## 1. High-Level Architecture

* **Backend Paradigm:** Serverless Backend-as-a-Service (BaaS) powered by **Supabase**.
* **Database Engine:** Managed **PostgreSQL** with Row-Level Security (RLS) and native extensions (`uuid-ossp`, `pgcrypto`).
* **Client SDK:** `@supabase/supabase-js` (v2.117.2).
* **API Paradigm:** Auto-generated RESTful API via PostgREST, direct client-to-database communication secured through cryptographic JWTs and PostgreSQL RLS.
* **Resilience & Offline Strategy:** Built-in **dual-mode driver** (`src/lib/supabase.ts`):
  * **Cloud Mode (Live):** Executes queries directly against Supabase when environment keys are detected.
  * **Local Sandbox Mode (Fallback):** Automatically activates when keys are absent or invalid, seamlessly routing reads and writes to browser `localStorage` and bundled baseline records without throwing runtime exceptions.

---

## 2. Database Schema (`supabase_schema.sql`)

The database consists of two core tables inside the `public` schema:

### A. `public.projects` Table (Tool & Repository Showcase)

Stores open-source cybersecurity tools, research repositories, and utilities contributed by members.

| Column Name | Data Type | Constraints & Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique project identifier |
| `name` | `text` | `NOT NULL` | Project name (e.g., *VulnScan*, *BruteForge*) |
| `"desc"` | `text` | `NOT NULL` | Description of the tool's purpose and capabilities |
| `tags` | `text[]` | `DEFAULT array[]::text[]` | Category tags (e.g., `['Scanner', 'Automation']`) |
| `stars` | `integer` | `DEFAULT 0` | GitHub star count / community rating |
| `lang` | `text` | `NOT NULL DEFAULT 'Rust'` | Primary development language |
| `"langColor"`| `text` | `DEFAULT '#dea584'` | Hex code color associated with the language |
| `url` | `text` | `NOT NULL` | GitHub / Git repository URL |
| `live_url` | `text` | `NULLABLE` | Optional live deployment or docs URL |
| `author` | `text` | `DEFAULT 'NullSec Member'` | Creator handle or team identifier |
| `created_at` | `timestamptz`| `DEFAULT timezone('utc'::text, now()) NOT NULL` | Creation timestamp in UTC |

#### Default Seed Data:
Pre-populated with 6 open-source cybersecurity repositories:
* `VulnScan` (Python / CVE correlation)
* `BruteForge` (Rust / GPU hash audit)
* `MemVault` (C++ / Memory forensics)
* `NullTrace` (Go / Network packet anonymizer)
* `CryptoMesh` (Rust / P2P encrypted messaging)
* `PhishKit` (TypeScript / Phishing simulation)

---

### B. `public.applications` Table (Membership & Recruitment)

Collects recruit applications for prospective hackers, developers, and researchers joining the collective.

| Column Name | Data Type | Constraints & Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Application tracking ID |
| `full_name` | `text` | `NOT NULL` | Applicant's full name |
| `email` | `text` | `NOT NULL` | Applicant's contact email |
| `handle` | `text` | `NULLABLE` | Discord, Telegram, or Matrix handle |
| `github_url` | `text` | `NULLABLE` | GitHub / Portfolio profile URL |
| `role_interest` | `text` | `NOT NULL` | Chosen track (e.g., *Offensive Security*, *Reverse Eng*) |
| `experience_level` | `text` | `NOT NULL` | *Initiate*, *Apprentice*, *Practitioner*, or *Veteran* |
| `skills` | `text[]` | `DEFAULT array[]::text[]` | Array of technical skills |
| `statement` | `text` | `NOT NULL` | Motivation and background statement |
| `status` | `text` | `NOT NULL DEFAULT 'pending'`<br>`CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected'))` | Application review workflow state |
| `created_at` | `timestamptz`| `DEFAULT timezone('utc'::text, now()) NOT NULL` | Submission timestamp in UTC |

---

## 3. Row-Level Security (RLS) & Access Control

Row-Level Security is strictly enforced on all tables to safeguard data integrity and applicant Personally Identifiable Information (PII):

### `projects` Policies:
1. **Public Read (`SELECT`):**
   ```sql
   CREATE POLICY "Allow public read access to projects"
     ON public.projects FOR SELECT
     USING (true);
   ```
   *Grants anonymous and authenticated visitors read access to the project list.*
2. **Public Submit (`INSERT`):**
   ```sql
   CREATE POLICY "Allow public insert to projects"
     ON public.projects FOR INSERT
     WITH CHECK (true);
   ```
   *Allows community members to submit new tool repositories.*

### `applications` Policies (PII Protection):
1. **Public Submit (`INSERT`):**
   ```sql
   CREATE POLICY "Allow public insert to applications"
     ON public.applications FOR INSERT
     WITH CHECK (true);
   ```
   *Allows prospective members to submit applications without an existing account.*
2. **Restricted Read (`SELECT`):**
   ```sql
   CREATE POLICY "Allow authenticated read to applications"
     ON public.applications FOR SELECT
     TO authenticated
     USING (true);
   ```
   *CRITICAL: Public/anonymous users CANNOT read application data. Only authenticated administrators and club leads can inspect submitted applications and PII.*

---

## 4. Client-Side Data Layer (`src/lib/supabase.ts`)

The application consumes the backend via dedicated service functions:

* **Configuration Guard:**
  ```typescript
  isSupabaseConfigured(): boolean
  ```
  Validates that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present and differ from placeholder boilerplate.
* **`getProjects()`**:
  * Attempts to fetch records from `public.projects` ordered by `stars DESC`.
  * Fallback: Reads custom additions from `localStorage['opencode_custom_projects']` combined with `DEFAULT_PROJECTS`.
* **`createProject(projectInput)`**:
  * Inserts the record into Supabase `projects` with single-row return (`.select().single()`).
  * Fallback: Saves to `localStorage['opencode_custom_projects']` with a generated ID (`local-<timestamp>`).
* **`submitApplication(appInput)`**:
  * Inserts applicant payload with default `status: 'pending'`.
  * Fallback: Saves to `localStorage['opencode_applications']` and returns a formatted mock ID (`APP-LOC-XXXXXX`).

---

## 5. Environment Configuration

To link your live Supabase cloud project, create a `.env` file in the root directory:

```env
# .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key-here
```

### Setup Steps:
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste and run the entire contents of `supabase_schema.sql`.
4. Copy the **Project URL** and **Anon Public Key** from `Project Settings -> API` into `.env`.
5. Restart the development server (`npm run dev`). The UI will switch from `📦 Local Store` to `⚡ Supabase DB`.
