-- Table des éléments (les objets avec photo dans une collection)
create table items (
                     id uuid primary key default gen_random_uuid(),
                     collection_id uuid not null references collections(id) on delete cascade,
                     user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
                     title text not null,
                     description text,
                     image_url text,
                     tags text[] not null default '{}',
                     created_at timestamptz not null default now()
);

alter table items enable row level security;

create policy "Users can view their own items"
  on items for select
                        using (auth.uid() = user_id);

create policy "Users can create their own items"
  on items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own items"
  on items for update
                               using (auth.uid() = user_id);

create policy "Users can delete their own items"
  on items for delete
using (auth.uid() = user_id);

-- index pour accélérer "tous les items d'une collection"
create index items_collection_id_idx on items (collection_id);
