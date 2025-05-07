--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: artigos; Type: TABLE DATA; Schema: public; Owner: expresscar_db_user
--



--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: expresscar_db_user
--

INSERT INTO public.clientes (id_cliente, nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes, data_criacao) VALUES (1, '123456789', 'J. Silva', 'Jo├åo Silva', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29 16:28:38.814106+00');
INSERT INTO public.clientes (id_cliente, nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes, data_criacao) VALUES (2, '999999990', 'Teste', 'Cliente Teste', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-02 10:37:58.46992+00');
INSERT INTO public.clientes (id_cliente, nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes, data_criacao) VALUES (3, 'PT517093782', 'express', 'nuno silva', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-02 17:42:35.572678+00');


--
-- Data for Name: fornecedores; Type: TABLE DATA; Schema: public; Owner: expresscar_db_user
--

INSERT INTO public.fornecedores (id_fornecedor, nome, nif, morada, codigo_postal, localidade, telefone_comercial, telefone_contabilidade, email_comercial, email_contabilidade, contacto_responsavel, observacoes, data_registo, ativo) VALUES (1, 'SILVA & COUTINHO, LDA', 'PT517093782', NULL, NULL, NULL, NULL, NULL, 'geral@expresscar.pt', NULL, NULL, NULL, '2025-05-03 09:21:43.434676', true);


--
-- Data for Name: veiculos; Type: TABLE DATA; Schema: public; Owner: expresscar_db_user
--

INSERT INTO public.veiculos (id_veiculo, id_cliente, matricula, marca, modelo, cc, cv, kw, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias, data_registo) VALUES (1, 2, 'AA-11-BB', 'VW', 'Golf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-02 10:39:42.824737');
INSERT INTO public.veiculos (id_veiculo, id_cliente, matricula, marca, modelo, cc, cv, kw, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias, data_registo) VALUES (2, 1, '88-88-88', 'RENAULT', 'Megane III ST Diesel Fase II', NULL, NULL, NULL, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-03 08:50:32.524226');


--
-- Name: artigos_id_artigo_seq; Type: SEQUENCE SET; Schema: public; Owner: expresscar_db_user
--

SELECT pg_catalog.setval('public.artigos_id_artigo_seq', 1, false);


--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: expresscar_db_user
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 3, true);


--
-- Name: fornecedores_id_fornecedor_seq; Type: SEQUENCE SET; Schema: public; Owner: expresscar_db_user
--

SELECT pg_catalog.setval('public.fornecedores_id_fornecedor_seq', 1, true);


--
-- Name: veiculos_id_veiculo_seq; Type: SEQUENCE SET; Schema: public; Owner: expresscar_db_user
--

SELECT pg_catalog.setval('public.veiculos_id_veiculo_seq', 2, true);


--
-- PostgreSQL database dump complete
--

