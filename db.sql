--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: timetables; Type: TABLE; Schema: public; Owner: AlexanderSelzer1; Tablespace: 
--

CREATE TABLE timetables (
    id integer NOT NULL,
    user_id integer,
    name character varying(64),
    data text
);


ALTER TABLE public.timetables OWNER TO "AlexanderSelzer1";

--
-- Name: users; Type: TABLE; Schema: public; Owner: AlexanderSelzer1; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(32),
    email character varying(512),
    password character varying(512)
);


ALTER TABLE public.users OWNER TO "AlexanderSelzer1";

--
-- Name: timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: AlexanderSelzer1; Tablespace: 
--

ALTER TABLE ONLY timetables
    ADD CONSTRAINT timetables_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: AlexanderSelzer1; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: AlexanderSelzer1
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM "AlexanderSelzer1";
GRANT ALL ON SCHEMA public TO "AlexanderSelzer1";
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: timetables; Type: ACL; Schema: public; Owner: AlexanderSelzer1
--

REVOKE ALL ON TABLE timetables FROM PUBLIC;
REVOKE ALL ON TABLE timetables FROM "AlexanderSelzer1";
GRANT ALL ON TABLE timetables TO "AlexanderSelzer1";
GRANT ALL ON TABLE timetables TO timetable;


--
-- Name: users; Type: ACL; Schema: public; Owner: AlexanderSelzer1
--

REVOKE ALL ON TABLE users FROM PUBLIC;
REVOKE ALL ON TABLE users FROM "AlexanderSelzer1";
GRANT ALL ON TABLE users TO "AlexanderSelzer1";
GRANT ALL ON TABLE users TO timetable;


--
-- PostgreSQL database dump complete
--

