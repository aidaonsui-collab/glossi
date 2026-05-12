-- 20260512000001_outreach_phone_extract.sql
--
-- Backfills phone numbers extracted from bios for the SMS outreach path.
-- Only matches 956-area-code numbers — the RGV area code. Stored as
-- 10-digit string (no formatting), e.g. '9565551234'.
--
-- Regex catches common bio formats: (956) 123-4567, 956.123.4567,
-- 956 123 4567, 9561234567. Strips non-digits when storing.

alter table public.outreach_prospects
  add column if not exists phone_extracted text;

create index if not exists outreach_prospects_phone_idx
  on public.outreach_prospects (phone_extracted)
  where phone_extracted is not null;

update public.outreach_prospects
set phone_extracted = regexp_replace(
  (regexp_match(coalesce(bio, ''), '(\(?\s*9\s*5\s*6\s*\)?[\s.\-]?\d{3}[\s.\-]?\d{4})'))[1],
  '\D', '', 'g'
)
where phone_extracted is null
  and bio ~ '\(?\s*9\s*5\s*6\s*\)?[\s.\-]?\d{3}[\s.\-]?\d{4}';
