Entities:
Books(ISBN integer, Img_path text, Name text, Theme text, Literary_gen text, Year smallint, Edition smallint, Page_num smallint, Price integer, Abstract text, Interview text)
Authors(Author_id integer, Name text, Surname text, Short_bio text, Img_path text)
Events	(Event_id integer, Name text, Date_start date, Time_start time, Date_end date, Time_end time)
Clients(Client_id integer, Name text, Surname text, Email text, Password text, Address text)

Relations:
Written_by(ISBN, Author_id) → 1 Book 4 Authors
Similars(ISBN1, ISBN2) → 1 Book N Books
Presented_in(ISBN, Event_id)
Stock(ISBN, Units smallint)
Sales(ISBN, Client_id, Date timestamp)
Reservations(ISBN, Client_id)
Reviews(ISBN, Client_id, review text)

*Integer = 4 bytes
*smallint = 2 bytes
*text = str of variable lenght

