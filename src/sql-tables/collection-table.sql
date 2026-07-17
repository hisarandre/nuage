-- Table des collections
create table collections (
                           id uuid primary key default gen_random_uuid(),
                           user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
                           name text not null,
                           emoji text not null,
                           color text not null,
                           created_at timestamptz not null default now()
);

alter table collections enable row level security;

create policy "Users can view their own collections"
  on collections for select
                              using (auth.uid() = user_id);

create policy "Users can create their own collections"
  on collections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own collections"
  on collections for update
                                     using (auth.uid() = user_id);

create policy "Users can delete their own collections"
  on collections for delete
using (auth.uid() = user_id);
