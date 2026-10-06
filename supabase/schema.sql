-- รันใน Supabase > SQL Editor
create table items (
  id text primary key,            -- เช่น movie-603
  title text not null,
  year text,
  poster text
);

create table watchlist (
  user_id uuid references auth.users not null,
  item_id text references items(id) not null,
  status text not null default 'want',   -- want | watched
  rating int check (rating between 1 and 5),
  primary key (user_id, item_id)         -- 1 คน ให้คะแนน 1 เรื่องได้ครั้งเดียว
);

alter table items enable row level security;
alter table watchlist enable row level security;

create policy "items read"   on items for select using (true);
create policy "items insert" on items for insert to authenticated with check (true);
create policy "items update" on items for update to authenticated using (true) with check (true);
create policy "wl read all"  on watchlist for select using (true);  -- ใช้คำนวณอันดับรวม
create policy "wl insert own" on watchlist for insert to authenticated with check (auth.uid() = user_id);
create policy "wl update own" on watchlist for update to authenticated using (auth.uid() = user_id);
create policy "wl delete own" on watchlist for delete to authenticated using (auth.uid() = user_id);