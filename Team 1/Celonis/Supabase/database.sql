-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  text text,
  metadata jsonb,
  embedding USER-DEFINED,
  CONSTRAINT content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.document_metadata (
  id text NOT NULL,
  title text,
  url text,
  created_at timestamp without time zone DEFAULT now(),
  schema text,
  CONSTRAINT document_metadata_pkey PRIMARY KEY (id)
);
CREATE TABLE public.document_rows (
  id integer NOT NULL DEFAULT nextval('document_rows_id_seq'::regclass),
  dataset_id text,
  row_data jsonb,
  CONSTRAINT document_rows_pkey PRIMARY KEY (id),
  CONSTRAINT document_rows_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.document_metadata(id)
);
CREATE TABLE public.documents_pg (
  id bigint NOT NULL DEFAULT nextval('documents_pg_id_seq'::regclass),
  content text NOT NULL,
  embedding USER-DEFINED NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT documents_pg_pkey PRIMARY KEY (id)
);
CREATE TABLE public.n8n_chat_histories (
  id integer NOT NULL DEFAULT nextval('n8n_chat_histories_id_seq'::regclass),
  session_id character varying NOT NULL,
  message jsonb NOT NULL,
  CONSTRAINT n8n_chat_histories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.text (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  text text,
  metadata jsonb,
  embedding USER-DEFINED,
  CONSTRAINT text_pkey PRIMARY KEY (id)
);