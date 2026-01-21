## Supabase Table Setup

### documents

```
create table public.documents (
  id bigserial not null,
  content text null,
  metadata jsonb null,
  embedding public.vector null,
  constraint documents_pkey primary key (id)
) TABLESPACE pg_default;
```

### n8n_chat_histories

```
create table public.n8n_chat_histories (
  id serial not null,
  session_id character varying(255) not null,
  message jsonb not null,
  constraint n8n_chat_histories_pkey primary key (id)
) TABLESPACE pg_default;
```

### pdf_tracking

```
create table public.pdf_tracking (
  filename text not null,
  file_hash text not null,
  updated_at timestamp without time zone null default now(),
  constraint pdf_tracking_pkey primary key (filename)
) TABLESPACE pg_default;

create index IF not exists idx_pdf_tracking_hash on public.pdf_tracking using btree (file_hash) TABLESPACE pg_default;
```