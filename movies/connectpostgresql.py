import psycopg2
 
conn_params = {
    'dbname': 'db1',
    'user': 'postgres',
    #'password': 'your_password',
    'host': 'localhost',
    'port': '5432'  # Default port for PostgreSQL
}
connection=psycopg2.connect(**conn_params)
 
cursor=connection.cursor()
 
cursor.execute("SELECT * FROM movies")
 
print(cursor.fetchone())
 
connection.close()