# Horizon fee calculator — CloudPanel deployment

There are two flattened ZIPs: the frontend has `index.html` at its root; the backend has `package.json` at its root. Preserve their internal subdirectories when extracting. There is no extra enclosing folder.

## Backend: fees-api.horizon.sa.edu.au

1. Point the domain to your Node.js host and create a CloudPanel Node.js site with Node 22 and application port 5302. Install a valid HTTPS certificate.
2. Extract `horizon-fees-backend.zip` into the Node application directory. Do not upload backend files to the frontend static site. Run `npm ci --omit=dev` there.
3. Upload the separately supplied private `cloudpanel-connection.json` to `server/private/connection.json` in the backend directory. Create that private directory first and restrict the file to the site user (`chmod 600`). This contains only the restricted fee database account, not MongoDB administrator credentials. It is deliberately excluded from both ZIPs.
4. The included `ecosystem.config.js` sets production mode, loopback binding, port **5302**, one forked process and automatic restarts. Run these commands as the CloudPanel site user from the extracted backend directory, using Node 22 and an installed PM2 (the ecosystem pins the application interpreter to the Node executable used to run PM2):

   ```sh
   export FEE_ORIGIN=https://fees.horizon.sa.edu.au
   pm2 start ecosystem.config.js --only horizon-fees-api
   pm2 save
   pm2 status horizon-fees-api
   pm2 logs horizon-fees-api --lines 50
   ```

   Replace the origin with the exact HTTPS frontend origin, without a trailing slash or path. It is not the API domain. The ecosystem defaults to the confirmed frontend origin, https://fees.horizon.sa.edu.au. Database credentials stay in the private connection file, not in the ecosystem file.
5. For subsequent releases, set `FEE_ORIGIN` again and run `pm2 restart ecosystem.config.js --only horizon-fees-api --update-env`, then `pm2 save`. If PM2 boot startup is not already configured for this site user, run `pm2 startup` and follow the generated system command, then `pm2 save`. Do not restart other apps or create a second process for this backend. Sessions are in memory; restarting signs administrators out. CloudPanel must have app port **5302**. The ecosystem file sets the working directory automatically.
6. The host must reach `192.168.4.38:27017` over the private network. The included CA verifies MongoDB TLS. This deployment connects directly to MDB01, not the workstation SSH tunnel. No MongoDB firewall or server settings have been changed.
7. Check `https://fees-api.horizon.sa.edu.au/api/fees?action=live` returns the published fee JSON. The API domain's `/` returning 404 is expected: the backend archive does not contain the frontend.

The existing MongoDB database and `ict` panel account are already provisioned. Do not run database provisioning again. Deployment preserves both the published schedule and any saved draft; it does not automatically publish 2027.

## Frontend

1. Extract `horizon-fees-frontend.zip` directly into the frontend site's document root. `index.html`, `static/` and the icon files must sit directly inside it.
2. Merge `frontend-nginx.conf` into that site's HTTPS vhost using CloudPanel's Vhost Editor. Replace its existing `location /` block rather than adding a duplicate. The SPA fallback enables direct visits to `/admin`.
3. The `/api/` location forwards to `https://fees-api.horizon.sa.edu.au`, retaining the browser's Origin header and session cookies. This configuration is required: the frontend intentionally calls `/api/fees` on its own origin, so no cross-origin cookie or CORS configuration is needed. Ensure no existing cache rules cache API responses.
4. Test the frontend's `/api/fees?action=live`, the calculator and `/admin`. Sign in, save a draft, reload and confirm persistence. Public pricing changes only through the explicit Publish action. Do not publish test values.

The ZIPs contain no database passwords, admin passwords, saved drafts, node_modules, source maps or local tunnel configuration. Keep the private connection file outside publicly served files. The public CA certificate is included in the backend ZIP.

## References

- [PM2 ecosystem configuration](https://pm2.keymetrics.io/docs/usage/application-declaration/)

- [CloudPanel app port and site settings](https://www.cloudpanel.io/docs/v2/frontend-area/settings/)
- [CloudPanel Vhost Editor](https://www.cloudpanel.io/docs/v2/frontend-area/vhost/)

These packages are prepared locally. DNS, certificates, network reachability and the live deployment still need to be configured and checked on the hosting servers.

## Backend deployment verification

The backend was deployed on 192.168.3.66 under the horizon-fees-api site user. PM2 is running Node 22.23.2 on port 5302 and its process list has been saved. HTTPS fee reads, admin login, authenticated reads and logout passed. The frontend /api/ proxy still needs installation: it currently returns HTML. A PM2 system startup unit for this site user was not found, so automatic recovery after a host reboot remains to be configured with privileged access.
