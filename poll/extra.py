query1="""
select polls.title,count(votes),rank() over(order by count(votes) desc)
from polls
left join options on polls.id = options.poll_id
left join votes on votes.options_id = options.id
group by polls.title
"""


query2="""
select polls.title,options.option_text,count(votes) as vote_count,rank() over( partition(polls,title) order by count(votes) desc)
from polls
left join options on polls.id = options.poll_id
left join votes on votes.options_id = options.id
group by polls.title,options.option_text
"""

query3="""
select distinct on (options.poll_id) ,options.id,options.option_text,count(votes) as vote_count
from
options left join votes on votes.options_id = options.id
group by options.id
order_by poll_id,vote_count DESC
"""


query4="""
create view most_voted_options as
select distinct on (options.poll_id) ,options.id,options.option_text,count(votes) as vote_count
from
options left join votes on votes.options_id = options.id
group by options.id
order_by poll_id,vote_count DESC
"""

function1="""
create function delete_inactive() return void as $$
    delete from users where last_opened > 604800
$$ language SQL;    
"""

call="""select delete_inactive();"""


function1="""
create function delete_inactive(seconds numeric) return void as $$
    delete from users where last_opened > 604800
$$ language SQL;    
"""

call="""select delete_inactive(50000);"""

function2="""
create or replace function delete_inactive(seconds numeric) returns bigint as $$
    with deleted as ( delete from users where last_opened > seconds returning *)
    select count(*) from deleted;
$$$ language sql;
"""

function3 = """
create or replace function opened_ago(email_open_row email_opens) returns integer as $$
    select cast(extract(epoch from current_timestamp) as integer) - email_open_row.opened_time as email_opened_ago;
$$$ language SQL;
"""


procedure1="""
create procedure insert_test_data() as $$
begin
    create table test_data (id integer, name text);
    insert into test_data values (1,'Bob');
    insert into test_data values (1,'Rolf');
    commit;
end;
$$ language plpgsql;
"""

call="""
call insert_test_date();
"""