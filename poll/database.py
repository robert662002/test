from psycopg2.extras import execute_values

CREATE_POLLS = """CREATE TABLE IF NOT EXISTS polls
(id SERIAL PRIMARY KEY, title TEXT, owner_username TEXT);"""
CREATE_OPTIONS = """CREATE TABLE IF NOT EXISTS options
(id SERIAL PRIMARY KEY, option_text TEXT, poll_id INTEGER, FOREIGN KEY(poll_id) REFERENCES polls (id));"""
CREATE_VOTES = """CREATE TABLE IF NOT EXISTS votes
(username TEXT, option_id INTEGER, FOREIGN KEY(option_id) REFERENCES options (id));"""


SELECT_ALL_POLLS = "SELECT * FROM polls;"
SELECT_POLL_WITH_OPTIONS = """SELECT * FROM polls
JOIN options ON polls.id = options.poll_id
WHERE polls.id = %s;"""


select_latest_poll ="""select  * from 
polls join options on polls.id = options.poll_id
where polls.id = (
    select id from polls order by id desc limit 1
);"""

select_poll_vote_details="""select options.id,options.name,
count(votes.option_id) as vote_count ,
count(votes.option_id)/sum(count(votes.option_id)) over() * 100.0 as vote_percentage
from options left join votes on options.id = votes.option_id 
where options.poll_id = %s
group by options.id;
"""

select_random_vote = "select * from votes where option_id = %s order by random() limit 1;"

INSERT_POLL_RETURN_ID="INSERT INTO polls (title,owner_username) VALUES (%s,%s) RETURNING id;"

INSERT_OPTION = "INSERT INTO options (option_text, poll_id) VALUES %s;"
INSERT_VOTE = "INSERT INTO votes (username, option_id) VALUES (%s, %s);"



def create_tables(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_POLLS)
            cursor.execute(CREATE_OPTIONS)
            cursor.execute(CREATE_VOTES)


def get_polls(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_ALL_POLLS)
            return cursor.fetchall()


def get_latest_poll(connection):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(select_latest_poll)
            return cursor.fetchall()


def get_poll_details(connection, poll_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_POLL_WITH_OPTIONS, (poll_id,))
            return cursor.fetchall()


def get_poll_and_vote_results(connection, poll_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(select_poll_vote_details,(poll_id,))
            return cursor.fetchall()


def get_random_poll_vote(connection, option_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(select_random_vote,(option_id,))
            return cursor.fetchone()


def create_poll(connection, title, owner, options):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_POLL_RETURN_ID,(title,owner))
            poll_id = cursor.fetchone()[0]
            option_values = [ (option_text,poll_id) for option_text in options]
            execute_values(cursor,INSERT_OPTION,option_values)

def add_poll_vote(connection, username, option_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_VOTE, (username, option_id))