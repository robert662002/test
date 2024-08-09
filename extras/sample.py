import datetime

today = datetime.datetime.now()
todayutc = datetime.datetime.now(datetime.timezone.utc)
print(todayutc)
print(today)