-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Materials Table
create table if not exists materials (
  id text primary key,
  name text not null,
  category text,
  unit text,
  cost numeric,
  stock numeric,
  conversion_factor numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Products Table
create table if not exists products (
  id text primary key,
  name text not null,
  category text,
  image_url text,
  margin numeric,
  price numeric,
  recipe jsonb, -- Storing recipe as JSON for simplicity in this NoSQL-like migration
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- History Table
create table if not exists history (
  id uuid default uuid_generate_v4() primary key,
  type text, -- 'production' or 'sale'
  product_name text,
  quantity numeric,
  total_cost numeric,
  sale_price numeric,
  profit numeric,
  date timestamp with time zone default timezone('utc'::text, now())
);

-- Price History Table
create table if not exists price_history (
  id uuid default uuid_generate_v4() primary key,
  material_id text references materials(id),
  material_name text,
  old_price numeric,
  new_price numeric,
  change_percent numeric,
  date timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table materials enable row level security;
alter table products enable row level security;
alter table history enable row level security;
alter table price_history enable row level security;

-- Create policies to allow public access (since we are not doing Auth yet)
-- WARNING: This allows anyone with your Anon Key to read/write. 
-- For a real production app, you should implement Authentication.

create policy "Public Access Materials" on materials for all using (true);
create policy "Public Access Products" on products for all using (true);
create policy "Public Access History" on history for all using (true);
create policy "Public Access Price History" on price_history for all using (true);
