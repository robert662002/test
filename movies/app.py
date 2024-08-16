import database
import datetime


def prompt_add_user():
    username=input("username: ")
    database.add_user(username)

def prompt_add_movie():
    title = input("movie title: ")
    release_date = input("release date (dd-mm-yyyy): ")
    parsed_date = datetime.datetime.strptime(release_date,"%d-%m-%Y")
    timestamp = parsed_date.timestamp()
    
    database.add_movie(title,timestamp)

def print_movie_list(heading,movies):
    print(f"--- {heading} movies ---")
    for _id,title,release_date in movies:
        movie_date = datetime.datetime.fromtimestamp(release_date)
        human_date = movie_date.strftime("%b %d %Y")
        print(f"{_id}: {title} released on {human_date}")
    print("--------------------\n")
def prompt_watch_movie():
    username=input("username: ")
    movie_id=input("enter movie id ")
    database.watch_movie(username,movie_id)

def prompt_watch_movie():
    username=input("username: ")
    movie_id=input("enter movie id ")
    database.watch_movie(username,movie_id)

def prompt_show_watched_movies():
    username=input("username : ")
    movies=database.get_watched_movies(username)
    if movies:
        print_movie_list(f"{username}'s ",movies)
    else:
        print("no watched movies")

menu = """Please select one of the following options:
1) Add new movie.
2) View upcoming movies.
3) View all movies
4) Watch a movie
5) View watched movies.
6) Add User
7) Exit

Your selection: """
welcome = "Welcome to the watchlist app!"

print(welcome)
database.create_tables()

while (user_input := input(menu)) != "7":
    if user_input == "1":
        prompt_add_movie()
    elif user_input == "2":
        movies=database.get_movies(True)
        print_movie_list("Upcoming",movies)
    elif user_input == "3":
        movies=database.get_movies()
        print_movie_list("All" ,movies)
    elif user_input == "4":
        prompt_watch_movie()
    elif user_input == "5":
        prompt_show_watched_movies()
    elif user_input == "6":
        prompt_add_user()
    else:
        print("Invalid input, please try again!")