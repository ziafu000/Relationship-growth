# Production migration plan

Production is a legacy Supabase project whose `supabase_migrations.schema_migrations`
table currently has no rows even though migrations 001–010 are represented in the
live schema. **Do not run `supabase db push`, reset the database, or repair migration
history automatically.** A push would treat the full migration directory as pending.

For the production-smoke repair, deploy only these ordered, additive files after a
catalog preflight confirms the named objects are absent or match the expected prior
shape:

1. `supabase/migrations/011_add_image_to_activities.sql`
   - Despite the legacy filename, the owning record is `plan_executions`.
   - Adds `plan_executions.activity_photo_path`, creates/configures the private
     `activity_images` bucket and owner-only Storage policies, and installs the
     idempotent step-state RPC.
2. `supabase/migrations/012_create_solo_relationship_rpc.sql`
   - Uses `CREATE OR REPLACE`, serializes retries per authenticated user, returns
     when membership already exists, validates bounded inputs, and grants execution
     only to `authenticated`.

Apply an exact file in a transaction; never replay unrelated migrations or insert
ledger rows as part of this repair. Verify function definitions and grants through
`pg_proc`, the column through `information_schema.columns`, the bucket through
`storage.buckets`, and policies through `pg_policies`. Then verify with disposable,
fully cleaned test data: onboarding twice creates one membership/passport, step true
and false retries converge, private image upload/sign/delete succeeds for the owner,
and an unauthenticated image read is denied.

The database synchronization does not deploy frontend code. After the repair PR is
merged and Vercel deploys that exact merged revision, repeat the production smoke
journey from the original report, including fresh-user onboarding, refresh after step
deselection and photo upload, `/check-in` network health, 390 px dashboard width,
and accessibility checks. Signup email delivery still requires a controlled inbox.
