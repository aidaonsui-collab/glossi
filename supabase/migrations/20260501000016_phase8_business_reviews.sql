-- 20260501000016_phase8_business_reviews.sql
--
-- Phase 8: salon-side Reviews tab + nav badge + public review wall.
--
-- Schema: per-business reviews_seen_at timestamp drives a "X new"
-- badge in the salon nav. Set whenever the salon visits /salon/reviews.
--
-- RPCs:
--   business_reviews        — owner list with customer name, booking
--                             context (date / service / price), and
--                             whether they've already replied.
--   unseen_reviews_count    — small int read for the nav badge.
--   mark_reviews_seen       — clears the badge (called on page mount).
--   public_business_reviews — anon-callable list for the marketplace
--                             salon profile, reviewer name reduced to
--                             "Hector H." so we don't doxx customers.
--
-- reply_to_review already exists from Phase 7.

alter table public.businesses
  add column if not exists reviews_seen_at timestamptz;

create or replace function public.business_reviews(p_business_id uuid)
returns table (
  review_id        uuid,
  rating           int,
  body             text,
  salon_reply      text,
  salon_replied_at timestamptz,
  created_at       timestamptz,
  customer_id      uuid,
  customer_name    text,
  booking_id       uuid,
  booking_at       timestamptz,
  service_slugs    text[],
  price_cents      int
)
language plpgsql
stable
security definer
set search_path = public, extensions, auth
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  if not exists (
    select 1 from public.businesses
    where id = p_business_id and owner_id = v_user_id
  ) then
    return;
  end if;

  return query
    select
      r.id,
      r.rating,
      r.body,
      r.salon_reply,
      r.salon_replied_at,
      r.created_at,
      r.customer_id,
      coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name') as customer_name,
      r.booking_id,
      bk.scheduled_at,
      qr.service_slugs,
      bk.price_cents
    from public.reviews r
    join public.bookings bk       on bk.id = r.booking_id
    join public.quote_bids qb     on qb.id = bk.bid_id
    join public.quote_requests qr on qr.id = qb.request_id
    join auth.users u             on u.id  = r.customer_id
    left join public.profiles p   on p.id  = r.customer_id
    where r.business_id = p_business_id
    order by r.created_at desc;
end;
$$;

revoke all on function public.business_reviews(uuid) from public;
grant execute on function public.business_reviews(uuid) to authenticated;

create or replace function public.unseen_reviews_count(p_business_id uuid)
returns int
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id  uuid := auth.uid();
  v_seen_at  timestamptz;
  v_count    int;
begin
  if v_user_id is null then
    return 0;
  end if;

  select reviews_seen_at into v_seen_at
  from public.businesses
  where id = p_business_id and owner_id = v_user_id;

  if not found then
    return 0;
  end if;

  select count(*) into v_count
  from public.reviews
  where business_id = p_business_id
    and (v_seen_at is null or created_at > v_seen_at);

  return coalesce(v_count, 0);
end;
$$;

revoke all on function public.unseen_reviews_count(uuid) from public;
grant execute on function public.unseen_reviews_count(uuid) to authenticated;

create or replace function public.mark_reviews_seen(p_business_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  update public.businesses
     set reviews_seen_at = now()
   where id = p_business_id
     and owner_id = v_user_id;
end;
$$;

revoke all on function public.mark_reviews_seen(uuid) from public;
grant execute on function public.mark_reviews_seen(uuid) to authenticated;

create or replace function public.public_business_reviews(p_business_id uuid)
returns table (
  review_id        uuid,
  rating           int,
  body             text,
  salon_reply      text,
  salon_replied_at timestamptz,
  created_at       timestamptz,
  reviewer_label   text
)
language plpgsql
stable
security definer
set search_path = public, extensions, auth
as $$
begin
  return query
    select
      r.id,
      r.rating,
      r.body,
      r.salon_reply,
      r.salon_replied_at,
      r.created_at,
      case
        when coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name') is null
          then 'Anonymous'
        else (
          regexp_replace(
            coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
            '^(\S+)(?:\s+(\S)\S*)?.*$', '\1 \2.'
          )
        )
      end as reviewer_label
    from public.reviews r
    left join auth.users u    on u.id = r.customer_id
    left join public.profiles p on p.id = r.customer_id
    where r.business_id = p_business_id
    order by r.created_at desc;
end;
$$;

revoke all on function public.public_business_reviews(uuid) from public;
grant execute on function public.public_business_reviews(uuid) to anon, authenticated;
