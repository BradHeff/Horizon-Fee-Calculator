# Fee administration

The local admin panel is at `/admin`. It uses a server-authenticated account; it is not a client-side password check. The existing calculator layout is retained.

## Using the panel

1. Sign in with the configured username and password. Use **Choose draft** at the top to switch between saved fee schedules. The previous single draft is preserved as **Existing draft**.
   To start another schedule, enter a **New draft name** and click **Create draft from these figures**. This saves a separate copy of the displayed values, including unsaved pricing edits. Rename the selected draft using **Draft name**, then **Save draft**. Switching warns before discarding unsaved edits. **Delete selected draft** permanently removes that saved draft after confirmation, without changing published fees. At least one draft must remain; create another first if needed. Publishing and resetting apply only to the selected draft.
2. Set the academic year and an optional schedule label (for example `2027 · Term 1`). The label does not schedule activation or prorate annual fees.
3. Choose Balaklava or Clare, then Standard or School Card tuition. Enter the exact schedule values for each child column. A grouped row updates every year in that group. If individual year amounts differ, those years appear separately so nothing is silently overwritten.
4. Update resource levies and bus fees; these are shared by the two campuses. The fourth-child value applies to fourth and subsequent children. Zero remains a valid amount.
5. Alternatively enter an increase percentage, choose its scope and rounding, and click **Apply increase**. Tuition scope covers both standard and concession tables for the selected campus. **All fees** covers both campuses, resource levies and buses. Percentages do not change discount policies. You can undo the latest increase before making further edits.
6. **Save draft** persists the editor without changing public rates. Save before leaving. Other administrators editing an older revision cannot overwrite a newer draft.
**Undo unsaved edits** returns the editor to its last saved draft. **Reset draft to published fees** replaces the saved draft (including its year and label) with the currently published schedule after confirmation; it saves immediately without changing public fees. This restores 2026 only while 2026 is the published schedule.

7. **Publish fees…**, then **Publish now**, replaces public rates immediately. Keep 2027 fees as a draft until the school authorises the Term 4 release.

No 2027 schedule has been imported or published by this implementation. The existing annual display and 2026 amounts remain unchanged; confirm annual/term policy before changing billing semantics.

## Where figures live

- `src/data/fee-config.json`: checked-in initial 2026 schedule; used only to initialise a new database.
- MongoDB database `horizon_fee_calculator`, collection `fee_schedules`, document `current`: published schedule, draft, revision and the last 30 published backups.
- MongoDB collection `administrators`: the `ict` admin account and salted scrypt password hash. Passwords are never stored as plaintext.
- The public calculator fetches **only the published schedule** from `/api/fees?action=live`, on entry, on window focus and every 15 seconds. Updates need no frontend rebuild. If loading fails, the calculator shows an error instead of silently quoting stale bundled rates.
- Admin changes are validated server-side. Account and discount policies are not editable through the fee API. Saving uses an atomic MongoDB revision check to prevent overwriting another administrator's changes.

## Current setup status

The dedicated MongoDB database `horizon_fee_calculator` and application user `horizon_fee_app` have been created on MDB01. The application user has only `readWrite` on this database. The `ict` panel account is stored there with a salted password hash. The other project's `trinitytickets` database was not modified.

The local admin panel now runs against MongoDB over a verified TLS connection through an SSH tunnel. Login and the database integration tests passed. Both published and draft fees initially match the existing 2026 schedule. The generated application connection is stored only in the ignored `server/private/connection.json`; the MongoDB administrator credentials were not saved.

`server/provision-database.cjs` accepts an authorised MongoDB administrator URI on stdin and creates only the separate `horizon_fee_calculator` database and its restricted user. It refuses to alter an existing fee database or user. It writes the generated application connection privately, then seeds the existing 2026 schedule. Administrator connection credentials are not saved. Run `npm run admin:setup` afterwards to initialise the panel login in MongoDB.

## Local development

Use two terminals:

```sh
npm run server
```

```sh
npm start
```

The API runs on `127.0.0.1:3001`; the React development server on port 3000 proxies `/api`. Visit `http://127.0.0.1:3000/admin`.

The API reads `MONGODB_URI`, `MONGODB_DATABASE` and `MONGODB_TLS_CA_FILE` from its server environment, or reads a private `server/private/connection.json` with `uri`, `database` and `caFile` fields. Set `FEE_CONNECTION_FILE` for a different location. All connections require TLS and certificate validation. Never use `REACT_APP_` variables for database credentials: those are bundled into browser JavaScript.

The database server is MDB01 at `192.168.4.38:27017`. Its CA certificate was retrieved over authenticated SSH into the ignored `server/private/mongodb-ca.crt`. The current local connection requires an SSH tunnel forwarding `127.0.0.1:27018` to MongoDB's loopback port; its certificate includes `127.0.0.1`, so normal hostname validation works through the tunnel. Direct database access from this workstation currently times out; no firewall or MongoDB security settings have been changed.

To reopen the local tunnel after restarting the workstation, run this in a separate terminal and enter the SSH password when prompted:

```sh
ssh -N -L 127.0.0.1:27018:127.0.0.1:27017 -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 support@192.168.4.38
```

For a fresh installation, create the application database user first, configure the connection, then run `npm run admin:setup` and supply the panel password on stdin (end with EOF). On Bash, use a silent prompt to avoid showing the password or recording it in history:

```sh
read -rs -p 'Admin password: ' fee_admin_password
printf '%s' "$fee_admin_password" | npm run admin:setup
unset fee_admin_password
```

The setup command refuses to replace an existing administrator. Database credentials are distinct from the panel's `ict` login. Use a MongoDB application user restricted to `readWrite` on this database; do not give the runtime MongoDB administrator credentials.

## CloudPanel deployment (pending)

The SPA and Node.js backend should share the same public origin. Run the backend as a Node.js app under CloudPanel, using Node 22 or another supported version compatible with the installed MongoDB driver. The Node server can serve the eventual `build/` directory as well as `/api/fees` and `/admin`.

Configure these backend-only environment variables:

- `NODE_ENV=production`
- `FEE_ORIGIN=https://fees.horizon.sa.edu.au` (or the exact preview origin, without a trailing slash)
- `MONGODB_URI`: restricted database user connection string targeting `192.168.4.38:27017` (replace the local development tunnel address), with `authSource=horizon_fee_calculator` and `directConnection=true`
- `MONGODB_DATABASE=horizon_fee_calculator`
- `MONGODB_TLS_CA_FILE`: absolute path to the trusted CA certificate outside the public web root
- `FEE_PORT=5302`: the internal Node application port configured in CloudPanel (production default 5302; local development default 3001)

Start command: `node server/index.cjs`. Keep it under the CloudPanel process supervisor and proxy the public HTTPS origin to the loopback application port. The CloudPanel server needs network access to MDB01 on TCP 27017 and a trusted copy of the CA certificate. No database port should be exposed publicly.

Production session cookies are Secure, HttpOnly and SameSite=Strict; state-changing requests also require the matching origin and a session CSRF token. Sessions last eight hours and currently reside in process memory, so run one Node instance (or use sticky sessions); restarting signs everyone out. Sign-in attempts are limited by socket address, which is shared when behind a reverse proxy. Use proxy-level rate limiting if finer client control is needed.

Back up MongoDB, preserve its collections across releases, and keep server credentials outside the static web root and Git. Editing the checked-in seed does not replace an existing database schedule. The JSON file store in `server/fees.cjs` is used by isolated unit tests and the explicit local preview, not by the production entry point `server/index.cjs`.

No production build, packaging or frontend deployment has been performed for this change.

## Verification

```sh
npm run test:server
CI=true npm test -- --watchAll=false --runInBand
```

Server tests use an isolated temporary directory and random test credentials. They cover authentication, CSRF/origin checks, validation, draft isolation, persistence, explicit publishing, conflict detection, logout and login throttling. Frontend tests cover manual/percentage edits, rounding, campus scope and calculator totals including fourth/subsequent-child rates.

The MongoDB integration test uses a uniquely named temporary collection in the configured fee database and removes it afterwards. It verifies persistence, publishing and concurrent revision checks without changing the actual fee schedule.

## Maintenance mode

The **Maintenance mode** switch at the top of Admin takes effect immediately and is stored in MongoDB independently of fee drafts. When on, unauthenticated visitors see **Calculator under Maintenance. Check back in a few minutes.** and the live-fee endpoint returns 503 without fee data. Administrators signed in through the frontend origin can continue using the published calculator. The admin sign-in page remains accessible. Existing pages refresh access every 15 seconds and on focus. Turning maintenance off restores public access without changing fees. Switching preserves unsaved draft edits.

## Testing draft fees in the calculator

During maintenance, signed-in administrators see **Fees to test** above the calculator. Choose a saved draft to calculate using its prices, or choose **Published fees** to compare. Family selections are retained. Previewing is read-only and does not publish. When maintenance is off the selector is hidden and the backend refuses preview requests, even for administrators. Existing preview pages return to published fees on the next access refresh (within 15 seconds or on focus). If the session expires while maintenance remains on, the maintenance message replaces the calculator.
