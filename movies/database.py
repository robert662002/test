#title, release_date,watched

import datetime
import sqlite3

//this is another comment by me
create_movies_table = """create table if not exists movies (
    id integer primary key,
    title text,
    release_timestamp real
);"""

create_users_table = """create table if not exists users (
    username text primary key
);"""

create_watched_table="""create table if not exists watched (
    user_username text,
    movie_id integer,
    foreign key(user_username) references users(username),
    foreign key(movie_id) references movies(id)
);"""



insert_movies = "insert into movies (title,release_timestamp) values (?,?);"

insert_user = "insert into users (username) values(?);"

delete_movies="delete from movies where title=?;"

select_all_movies ="select * from movies;"

select_upcoming_movies="select * from moves where release_timestamp > ?;"

select_watched_movies="""select movies.id,movies.title,movies.release_timestamp from 
movies join watched on movies.id = watched.movie_id
join users on users.username = watched.user_username 
where users.username=?;"""

insert_watched_movie="insert into watched (user_username,movie_id) values (?,?);"

set_movie_watched = "update movies set watched=1 where title = ?;"


connection = sqlite3.connect("data.db")

def create_tables():
    with connection:
        connection.execute(create_movies_table)
        connection.execute(create_users_table)
        connection.execute(create_watched_table)

def add_user(username):
    with connection:
        connection.execute(insert_user,(username,))

def add_movie(title,release_timestamp):
    with connection:
        connection.execute(insert_movies,(title,release_timestamp))

def get_movies(upcoming=False):
    with connection:
        cursor=connection.cursor()
        if upcoming:
            today_timestamp = datetime.datetime.today().timestamp()
            cursor.execute(select_upcoming_movies,(today_timestamp,))
        else:
            cursor.execute(select_all_movies)
        return cursor.fetchall()

def watch_movie(username,movie_id):
    with connection:
        connection.execute(insert_watched_movie,(username,movie_id))

def get_watched_movies(username):
    with connection:
        cursor=connection.cursor()
        cursor.execute(select_watched_movies,(username,))
        return cursor.fetchall()
